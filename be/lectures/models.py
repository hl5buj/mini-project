from django.db import models
from django.core.exceptions import ValidationError


class Lecture(models.Model):
    """강의 내 레슨 모델"""

    CONTENT_TYPE_CHOICES = [
        ('text', '텍스트'),
        ('video', '비디오 업로드'),
        ('link', '외부 링크'),
        ('file', '첨부파일'),
    ]

    course = models.ForeignKey(
        'courses.Course',
        on_delete=models.CASCADE,
        related_name='lectures',
        verbose_name='강의'
    )
    title = models.CharField('레슨 제목', max_length=200)
    content_type = models.CharField(
        '콘텐츠 타입',
        max_length=10,
        choices=CONTENT_TYPE_CHOICES
    )

    # 콘텐츠 필드 (타입에 따라 선택적으로 사용)
    content_text = models.TextField('텍스트 내용', blank=True)
    video_url = models.URLField('외부 비디오 URL', blank=True)
    media_file = models.ForeignKey(
        'media_files.MediaFile',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='lectures',
        verbose_name='미디어 파일'
    )

    # 메타데이터
    order = models.PositiveIntegerField('순서', default=0)
    duration = models.PositiveIntegerField('재생시간(초)', default=0)

    # 타임스탬프
    created_at = models.DateTimeField('생성일', auto_now_add=True)
    updated_at = models.DateTimeField('수정일', auto_now=True)

    class Meta:
        db_table = 'lectures'
        verbose_name = '레슨'
        verbose_name_plural = '레슨 목록'
        ordering = ['course', 'order']
        indexes = [
            models.Index(fields=['course', 'order']),
        ]
        unique_together = [['course', 'order']]

    def __str__(self):
        return f'{self.course.title} - {self.title}'

    def clean(self):
        """모델 레벨 검증"""
        super().clean()

        # 제목 최소 길이
        if self.title and len(self.title) < 2:
            raise ValidationError({'title': '제목은 2자 이상이어야 합니다.'})

        # 콘텐츠 타입별 필수 필드 검증
        if self.content_type == 'text' and not self.content_text:
            raise ValidationError({'content_text': '텍스트 콘텐츠는 필수입니다.'})

        if self.content_type == 'link' and not self.video_url:
            raise ValidationError({'video_url': '비디오 URL은 필수입니다.'})

        if self.content_type in ['video', 'file'] and not self.media_file:
            raise ValidationError({'media_file': '미디어 파일은 필수입니다.'})
