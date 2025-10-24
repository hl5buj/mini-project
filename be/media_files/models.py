from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
import os
from datetime import datetime


def media_file_path(instance, filename):
    """미디어 파일 저장 경로"""
    today = datetime.now()
    ext = os.path.splitext(filename)[1]
    unique_filename = f'{instance.id}_{today.strftime("%Y%m%d%H%M%S")}{ext}'
    return f'media/{instance.file_type}/{today.year}/{today.month:02d}/{unique_filename}'


def validate_file_size(file):
    """파일 크기 검증"""
    ext = os.path.splitext(file.name)[1].lower()

    if ext in settings.ALLOWED_VIDEO_EXTENSIONS:
        max_size = settings.MAX_VIDEO_SIZE
        file_type = '비디오'
    elif ext in settings.ALLOWED_DOCUMENT_EXTENSIONS:
        max_size = settings.MAX_DOCUMENT_SIZE
        file_type = '문서'
    elif ext in settings.ALLOWED_IMAGE_EXTENSIONS:
        max_size = settings.MAX_IMAGE_SIZE
        file_type = '이미지'
    else:
        raise ValidationError('지원하지 않는 파일 형식입니다.')

    if file.size > max_size:
        raise ValidationError(
            f'{file_type} 파일 크기는 {max_size // (1024*1024)}MB를 초과할 수 없습니다.'
        )


def validate_file_extension(file):
    """파일 확장자 검증"""
    ext = os.path.splitext(file.name)[1].lower()
    allowed_extensions = (
        settings.ALLOWED_VIDEO_EXTENSIONS +
        settings.ALLOWED_DOCUMENT_EXTENSIONS +
        settings.ALLOWED_IMAGE_EXTENSIONS
    )

    if ext not in allowed_extensions:
        raise ValidationError(
            f'지원하지 않는 파일 형식입니다. 허용된 형식: {", ".join(allowed_extensions)}'
        )


class MediaFile(models.Model):
    """미디어 파일 모델 (비디오, 문서 등)"""

    FILE_TYPE_CHOICES = [
        ('video', '비디오'),
        ('document', '문서'),
        ('image', '이미지'),
    ]

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='media_files',
        verbose_name='업로더'
    )
    file = models.FileField(
        '파일',
        upload_to=media_file_path,
        validators=[validate_file_size, validate_file_extension]
    )
    file_type = models.CharField('파일 타입', max_length=10, choices=FILE_TYPE_CHOICES)

    # 메타데이터
    file_size = models.PositiveBigIntegerField('파일 크기(bytes)', default=0)
    mime_type = models.CharField('MIME 타입', max_length=100, blank=True)
    original_filename = models.CharField('원본 파일명', max_length=255)

    # 타임스탬프
    uploaded_at = models.DateTimeField('업로드일', auto_now_add=True)

    class Meta:
        db_table = 'media_files'
        verbose_name = '미디어 파일'
        verbose_name_plural = '미디어 파일 목록'
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['uploaded_by', '-uploaded_at']),
            models.Index(fields=['file_type']),
        ]

    def __str__(self):
        return self.original_filename

    def save(self, *args, **kwargs):
        """저장 시 메타데이터 자동 설정"""
        if self.file:
            self.file_size = self.file.size
            self.original_filename = self.file.name

            # 파일 타입 자동 감지
            ext = os.path.splitext(self.file.name)[1].lower()
            if ext in settings.ALLOWED_VIDEO_EXTENSIONS:
                self.file_type = 'video'
            elif ext in settings.ALLOWED_DOCUMENT_EXTENSIONS:
                self.file_type = 'document'
            elif ext in settings.ALLOWED_IMAGE_EXTENSIONS:
                self.file_type = 'image'

        super().save(*args, **kwargs)
