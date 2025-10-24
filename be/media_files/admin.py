from django.contrib import admin
from django.utils.html import format_html
from .models import MediaFile


@admin.register(MediaFile)
class MediaFileAdmin(admin.ModelAdmin):
    """미디어 파일 관리자 페이지"""

    list_display = [
        'original_filename', 'file_type', 'file_size_display',
        'uploaded_by', 'uploaded_at'
    ]
    list_filter = ['file_type', 'uploaded_at']
    search_fields = ['original_filename', 'uploaded_by__username']
    ordering = ['-uploaded_at']

    fieldsets = (
        ('파일 정보', {'fields': ('file', 'file_type', 'original_filename')}),
        ('업로더', {'fields': ('uploaded_by',)}),
        ('메타데이터', {'fields': ('file_size', 'mime_type')}),
        ('일시', {'fields': ('uploaded_at',)}),
    )

    readonly_fields = ['file_size', 'mime_type', 'original_filename', 'uploaded_at']

    def file_size_display(self, obj):
        """파일 크기 표시 (MB)"""
        size_mb = obj.file_size / (1024 * 1024)
        return f'{size_mb:.2f} MB'
    file_size_display.short_description = '파일 크기'
