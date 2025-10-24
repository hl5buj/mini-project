from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """사용자 관리자 페이지"""

    list_display = [
        'username', 'email', 'profile_image_preview',
        'courses_count', 'is_staff', 'created_at'
    ]
    list_filter = ['is_staff', 'is_active', 'created_at']
    search_fields = ['username', 'email', 'bio']
    ordering = ['-created_at']

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('개인정보', {'fields': ('email', 'profile_image', 'bio')}),
        ('권한', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('통계', {'fields': ('courses_count',)}),
        ('일시', {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
        ('개인정보 (선택)', {
            'classes': ('wide',),
            'fields': ('profile_image', 'bio'),
        }),
        ('권한', {
            'classes': ('wide',),
            'fields': ('is_active', 'is_staff', 'is_superuser'),
        }),
    )

    readonly_fields = ['created_at', 'updated_at', 'last_login', 'date_joined', 'courses_count']

    def profile_image_preview(self, obj):
        """프로필 이미지 미리보기"""
        if obj.profile_image:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius: 50%;" />',
                obj.profile_image.url
            )
        return '-'
    profile_image_preview.short_description = '프로필 이미지'
