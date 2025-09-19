from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from django.db.models import Q

from drf_spectacular.utils import extend_schema

from rest_framework.throttling import ScopedRateThrottle
from .models import Article, Comment
from .serializers import ArticleSerializer, CommentSerializer

class ArticleListCreateAPIView(APIView):
    permission_classes = [AllowAny]  # Faqat anonymous userlar ham ko‘ra oladi
    serializer_class = ArticleSerializer

    @extend_schema(operation_id="article_list")
    def get(self, request):
        queryset = Article.objects.all()
        q = request.GET.get('q')
        status_param = request.GET.get('status')
        category_slug = request.GET.get('category')
        tag_slug = request.GET.get('tag')
        tags_csv = request.GET.get('tags')  # comma-separated slugs
        ordering_param = request.GET.get('ordering')
        page_param = request.GET.get('page')
        page_size_param = request.GET.get('page_size')

        if q:
            queryset = queryset.filter(
                Q(title__icontains=q) | Q(excerpt__icontains=q) | Q(content__icontains=q)
            )
        if status_param:
            queryset = queryset.filter(status=status_param)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        if tag_slug:
            queryset = queryset.filter(tags__slug=tag_slug)
        if tags_csv:
            slugs = [s.strip() for s in tags_csv.split(',') if s.strip()]
            if slugs:
                queryset = queryset.filter(tags__slug__in=slugs).distinct()

        # Ordering with safelist
        allowed_order_fields = {"title", "published_at", "created_at", "views"}
        if ordering_param:
            order_fields = []
            for field in ordering_param.split(','):
                field = field.strip()
                if not field:
                    continue
                base = field[1:] if field.startswith('-') else field
                if base in allowed_order_fields:
                    order_fields.append(field)
            if order_fields:
                queryset = queryset.order_by(*order_fields)

        # Pagination
        try:
            page = max(int(page_param), 1) if page_param else 1
        except ValueError:
            page = 1
        try:
            page_size = int(page_size_param) if page_size_param else 10
        except ValueError:
            page_size = 10
        page_size = max(1, min(page_size, 100))

        total_count = queryset.count()
        start = (page - 1) * page_size
        end = start + page_size
        items = list(queryset[start:end])

        serializer = ArticleSerializer(items, many=True, context={'request': request})
        return Response({
            'count': total_count,
            'page': page,
            'page_size': page_size,
            'results': serializer.data,
        })
    @extend_schema(operation_id="article_create")
    def post(self, request):
        self.permission_classes = [IsAuthenticatedOrReadOnly]
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)  # author ni userdan oling!
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_permissions(self):
        return super().get_permissions()


class ArticleDetailAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = ArticleSerializer

    @extend_schema(operation_id="article_detail")
    def get(self, request, slug):
        article = get_object_or_404(Article, slug=slug)
        serializer = self.serializer_class(article, context={'request': request})
        return Response(serializer.data)
    @extend_schema(operation_id="article_update")
    def patch(self, request, slug):
        article = get_object_or_404(Article, slug=slug)
        serializer = self.serializer_class(article, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    @extend_schema(operation_id="article_delete")
    def delete(self, request, slug):
        article = get_object_or_404(Article, slug=slug)
        article.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CommentListCreateAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CommentSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'comments'

    def get(self, request, slug):
        article = get_object_or_404(Article, slug=slug)
        comments = Comment.objects.filter(article=article, is_approved=True)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, slug):
        article = get_object_or_404(Article, slug=slug)
        payload = {**request.data}
        payload['article'] = article.id
        serializer = CommentSerializer(data=payload, context={'request': request})  # context qo'shildi
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
