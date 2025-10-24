from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from drf_spectacular.utils import extend_schema, OpenApiParameter
from .models import Comment
from .serializers import (
    CommentSerializer,
    CommentCreateSerializer,
    CommentUpdateSerializer
)


class IsAuthorOrReadOnly(IsAuthenticatedOrReadOnly):
    """작성자만 수정/삭제 가능"""

    def has_object_permission(self, request, view, obj):
        # 읽기 권한은 모두에게
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        # 쓰기 권한은 작성자에게만
        return obj.author == request.user


@extend_schema(tags=['댓글'])
class CommentViewSet(viewsets.ModelViewSet):
    """댓글 CRUD API"""

    queryset = Comment.objects.select_related('author', 'lecture', 'parent').prefetch_related('replies')
    permission_classes = [IsAuthorOrReadOnly]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['lecture', 'author']
    ordering_fields = ['created_at']
    ordering = ['created_at']

    def get_serializer_class(self):
        """액션별 Serializer 선택"""
        if self.action == 'create':
            return CommentCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return CommentUpdateSerializer
        return CommentSerializer

    def get_queryset(self):
        """최상위 댓글만 조회 (대댓글은 replies로 포함)"""
        queryset = super().get_queryset()

        # parent가 None인 댓글만 (최상위 댓글)
        return queryset.filter(parent=None)

    @extend_schema(
        summary='댓글 목록 조회',
        description='레슨별 댓글 목록을 조회합니다. 대댓글도 포함됩니다.',
        parameters=[
            OpenApiParameter(name='lecture', description='레슨 ID', type=int, required=True),
            OpenApiParameter(name='author', description='작성자 ID', type=int),
            OpenApiParameter(name='ordering', description='정렬 (created_at, -created_at)', type=str),
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary='댓글 상세 조회',
        description='댓글의 상세 정보를 조회합니다.'
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary='댓글 작성',
        description='새로운 댓글을 작성합니다. parent를 지정하면 대댓글이 됩니다. (인증 필요)'
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @extend_schema(
        summary='댓글 수정',
        description='댓글을 수정합니다. (작성자만 가능)'
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(
        summary='댓글 부분 수정',
        description='댓글을 부분 수정합니다. (작성자만 가능)'
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        summary='댓글 삭제',
        description='댓글을 삭제합니다. 최상위 댓글 삭제 시 대댓글도 함께 삭제됩니다. (작성자만 가능)'
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

