from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from .models import Article, Category, Tag, Comment


class ArticleSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    category_slug = serializers.SlugRelatedField(source='category', slug_field='slug', queryset=Category.objects.all(), allow_null=True, required=False)
    tag_slugs = serializers.SlugRelatedField(source='tags', slug_field='slug', queryset=Tag.objects.all(), many=True, required=False)
    cover_image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'status',
            'author', 'author_username', 'category', 'category_slug', 'tags', 'tag_slugs', 'cover_image', 'cover_image_url',
            'published_at', 'is_featured', 'views', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'published_at', 'views', 'created_at', 'updated_at']

    @extend_schema_field(serializers.CharField(allow_null=True))
    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image and hasattr(obj.cover_image, 'url'):
            url = obj.cover_image.url
            if request is not None:
                return request.build_absolute_uri(url)
            return url
        return None


class CommentSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'article', 'user', 'user_username', 'name', 'email', 'content', 'is_approved', 'created_at']
        read_only_fields = ['user', 'is_approved', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user

        if not user or not user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated to post a comment.")

        # Avtorizatsiyadan o'tgan user commenti uchun is_approved ni True qilamiz
        validated_data['user'] = user
        validated_data['is_approved'] = True

        return super().create(validated_data)

