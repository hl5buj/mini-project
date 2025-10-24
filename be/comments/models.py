from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError


class Comment(models.Model):
    """댓글 모델 (Q&A)"""

    lecture = models.ForeignKey(
        'lectures.Lecture',
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name='레슨'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name='작성자'
    )
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies',
        verbose_name='부모 댓글'
    )

    content = models.TextField('내용')

    # 타임스탬프
    created_at = models.DateTimeField('작성일', auto_now_add=True)
    updated_at = models.DateTimeField('수정일', auto_now=True)

    class Meta:
        db_table = 'comments'
        verbose_name = '댓글'
        verbose_name_plural = '댓글 목록'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['lecture', 'created_at']),
            models.Index(fields=['author', '-created_at']),
        ]

    def __str__(self):
        return f'{self.author.username} - {self.content[:50]}'

    def clean(self):
        """모델 레벨 검증"""
        super().clean()

        # 내용 최소 길이
        if self.content and len(self.content) < 1:
            raise ValidationError({'content': '내용을 입력해주세요.'})

        # 대댓글의 대댓글 방지 (1단계만 허용)
        if self.parent and self.parent.parent:
            raise ValidationError({'parent': '대댓글에는 답글을 달 수 없습니다.'})
