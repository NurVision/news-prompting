from django.urls import path
from .views import ArticleListCreateAPIView, ArticleDetailAPIView, CommentListCreateAPIView


urlpatterns = [
    path('articles/', ArticleListCreateAPIView.as_view(), name='article-list-create'),
    path('articles/<slug:slug>/', ArticleDetailAPIView.as_view(), name='article-detail'),
    path('articles/<slug:slug>/comments/', CommentListCreateAPIView.as_view(), name='article-comments'),
]

