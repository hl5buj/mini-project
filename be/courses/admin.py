from django.contrib import admin
from django.utils.html import format_html
from .models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    """강의 관리자 페이지"""

    list_display = [
        'title', 'instructor', 'thumbnail_preview',
        'lectures_count', 'total_duration_display',
        'is_published', 'created_at'
    ]
    list_filter = ['is_published', 'created_at', 'instructor']
    search_fields = ['title', 'description', 'instructor__username']
    ordering = ['-created_at']

    fieldsets = (
        ('기본 정보', {'fields': ('instructor', 'title', 'description', 'thumbnail')}),
        ('상태', {'fields': ('is_published',)}),
        ('통계', {'fields': ('lectures_count', 'total_duration')}),
        ('일시', {'fields': ('created_at', 'updated_at')}),
    )

    readonly_fields = ['lectures_count', 'total_duration', 'created_at', 'updated_at']

    def thumbnail_preview(self, obj):
        """썸네일 미리보기"""
        if obj.thumbnail:
            return format_html(
                '<img src="{}" width="100" height="60" style="object-fit: cover;" />',
                obj.thumbnail.url
            )
        return '-'
    thumbnail_preview.short_description = '썸네일'

    def total_duration_display(self, obj):
        """총 재생시간 표시 (분:초)"""
        minutes = obj.total_duration // 60
        seconds = obj.total_duration % 60
        return f'{minutes}분 {seconds}초'
    total_duration_display.short_description = '총 재생시간'
