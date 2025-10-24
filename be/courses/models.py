from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
import os


def course_thumbnail_path(instance, filename):
    """강의 썸네일 저장 경로"""
    ext = os.path.splitext(filename)[1]
    return f'courses/{instance.id}/thumbnail{ext}'


class Course(models.Model):
    """강의 코스 모델"""

    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='courses',
        verbose_name='강사'
    )
    title = models.CharField('강의 제목', max_length=200)
    description = models.TextField('강의 설명')
    thumbnail = models.ImageField(
        '썸네일',
        upload_to=course_thumbnail_path,
        blank=True,
        null=True
    )

    # 상태
    is_published = models.BooleanField('공개 여부', default=False)

    # 통계
    lectures_count = models.PositiveIntegerField('레슨 수', default=0)
    total_duration = models.PositiveIntegerField('총 재생시간(초)', default=0)

    # 타임스탬프
    created_at = models.DateTimeField('생성일', auto_now_add=True)
    updated_at = models.DateTimeField('수정일', auto_now=True)

    class Meta:
        db_table = 'courses'
        verbose_name = '강의'
        verbose_name_plural = '강의 목록'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['instructor', '-created_at']),
            models.Index(fields=['is_published', '-created_at']),
        ]

    def __str__(self):
        return self.title

    def clean(self):
        """모델 레벨 검증"""
        super().clean()

        # 제목 최소 길이
        if self.title and len(self.title) < 2:
            raise ValidationError({'title': '제목은 2자 이상이어야 합니다.'})

        # 설명 최소 길이
        if self.description and len(self.description) < 10:
            raise ValidationError({'description': '설명은 10자 이상이어야 합니다.'})
