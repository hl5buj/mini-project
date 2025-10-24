from django.contrib import admin
from .models import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """댓글 관리자 페이지"""

    list_display = [
        'author', 'lecture', 'content_preview',
        'parent', 'created_at'
    ]
    list_filter = ['created_at', 'lecture__course']
    search_fields = ['content', 'author__username', 'lecture__title']
    ordering = ['-created_at']

    fieldsets = (
        ('댓글 정보', {'fields': ('lecture', 'author', 'parent')}),
        ('내용', {'fields': ('content',)}),
        ('일시', {'fields': ('created_at', 'updated_at')}),
    )

    readonly_fields = ['created_at', 'updated_at']

    def content_preview(self, obj):
        """내용 미리보기"""
        return obj.content[:100] + '...' if len(obj.content) > 100 else obj.content
    content_preview.short_description = '내용'
