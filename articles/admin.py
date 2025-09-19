from django.contrib import admin
from .models import Article, Category, Tag, Comment


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'status', 'is_featured', 'published_at', 'author', 'category')
    list_filter = ('status', 'is_featured', 'published_at', 'created_at', 'category', 'tags')
    search_fields = ('title', 'slug', 'excerpt', 'content')
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ('author', 'category',)
    date_hierarchy = 'published_at'
    ordering = ('-published_at', '-created_at')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name', 'slug')
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name', 'slug')
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'article', 'user', 'name', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('content', 'name', 'email')

# Register your models here.
