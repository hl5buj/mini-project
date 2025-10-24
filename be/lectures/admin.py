from django.contrib import admin
from .models import Lecture


@admin.register(Lecture)
class LectureAdmin(admin.ModelAdmin):
    """레슨 관리자 페이지"""

    list_display = [
        'title', 'course', 'content_type',
        'order', 'duration_display', 'created_at'
    ]
    list_filter = ['content_type', 'course', 'created_at']
    search_fields = ['title', 'content_text', 'course__title']
    ordering = ['course', 'order']

    fieldsets = (
        ('기본 정보', {'fields': ('course', 'title', 'content_type', 'order')}),
        ('콘텐츠', {'fields': ('content_text', 'video_url', 'media_file')}),
        ('메타데이터', {'fields': ('duration',)}),
        ('일시', {'fields': ('created_at', 'updated_at')}),
    )

    readonly_fields = ['created_at', 'updated_at']

    def duration_display(self, obj):
        """재생시간 표시 (분:초)"""
        if obj.duration:
            minutes = obj.duration // 60
            seconds = obj.duration % 60
            return f'{minutes}분 {seconds}초'
        return '-'
    duration_display.short_description = '재생시간'
