from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError
from django.conf import settings
import os


def validate_image_size(file):
    """이미지 파일 크기 검증"""
    if file.size > settings.MAX_IMAGE_SIZE:
        raise ValidationError(
            f'이미지 파일 크기는 {settings.MAX_IMAGE_SIZE // (1024*1024)}MB를 초과할 수 없습니다.'
        )


def user_profile_image_path(instance, filename):
    """프로필 이미지 저장 경로"""
    ext = os.path.splitext(filename)[1]
    return f'profiles/{instance.username}{ext}'


class User(AbstractUser):
    """커스텀 사용자 모델"""

    email = models.EmailField('이메일', unique=True)
    profile_image = models.ImageField(
        '프로필 이미지',
        upload_to=user_profile_image_path,
        blank=True,
        null=True,
        validators=[validate_image_size]
    )
    bio = models.TextField('자기소개', max_length=500, blank=True)

    # 통계 필드
    courses_count = models.PositiveIntegerField('강의 수', default=0)

    # 타임스탬프
    created_at = models.DateTimeField('가입일', auto_now_add=True)
    updated_at = models.DateTimeField('수정일', auto_now=True)

    class Meta:
        db_table = 'users'
        verbose_name = '사용자'
        verbose_name_plural = '사용자 목록'
        ordering = ['-created_at']

    def __str__(self):
        return self.username

    def clean(self):
        """모델 레벨 검증"""
        super().clean()

        # 이메일 필수
        if not self.email:
            raise ValidationError({'email': '이메일은 필수입니다.'})

        # bio 길이 제한
        if self.bio and len(self.bio) > 500:
            raise ValidationError({'bio': '자기소개는 500자를 초과할 수 없습니다.'})
