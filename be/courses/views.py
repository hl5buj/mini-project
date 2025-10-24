from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from .models import Course
from .serializers import (
    CourseListSerializer,
    CourseDetailSerializer,
    CourseCreateSerializer,
    CourseUpdateSerializer
)


class IsInstructorOrReadOnly(IsAuthenticatedOrReadOnly):
    """강사만 수정/삭제 가능"""

    def has_object_permission(self, request, view, obj):
        # 읽기 권한은 모두에게
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        # 쓰기 권한은 강사에게만
        return obj.instructor == request.user


@extend_schema(tags=['강의'])
class CourseViewSet(viewsets.ModelViewSet):
    """강의 CRUD API"""

    queryset = Course.objects.select_related('instructor').prefetch_related('lectures')
    permission_classes = [IsInstructorOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['instructor', 'is_published']
    search_fields = ['title', 'description', 'instructor__username']
    ordering_fields = ['created_at', 'lectures_count', 'total_duration']
    ordering = ['-created_at']

    def get_serializer_class(self):
        """액션별 Serializer 선택"""
        if self.action == 'list':
            return CourseListSerializer
        elif self.action == 'retrieve':
            return CourseDetailSerializer
        elif self.action == 'create':
            return CourseCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return CourseUpdateSerializer
        return CourseListSerializer

    def get_queryset(self):
        """쿼리셋 최적화"""
        queryset = super().get_queryset()

        # 공개 강의만 (강사 본인은 자신의 비공개 강의도 볼 수 있음)
        if self.request.user.is_authenticated:
            queryset = queryset.filter(
                is_published=True
            ) | queryset.filter(
                instructor=self.request.user
            )
        else:
            queryset = queryset.filter(is_published=True)

        return queryset.distinct()

    @extend_schema(
        summary='강의 목록 조회',
        description='공개된 강의 목록을 조회합니다. 검색, 필터링, 정렬이 가능합니다.',
        parameters=[
            OpenApiParameter(name='search', description='검색어 (제목, 설명, 강사명)', type=str),
            OpenApiParameter(name='instructor', description='강사 ID', type=int),
            OpenApiParameter(name='is_published', description='공개 여부', type=bool),
            OpenApiParameter(name='ordering', description='정렬 (-created_at, lectures_count 등)', type=str),
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary='강의 상세 조회',
        description='강의의 상세 정보와 레슨 목록을 조회합니다.'
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary='강의 생성',
        description='새로운 강의를 생성합니다. (인증 필요)'
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @extend_schema(
        summary='강의 수정',
        description='강의를 수정합니다. (강사만 가능)'
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(
        summary='강의 부분 수정',
        description='강의를 부분 수정합니다. (강사만 가능)'
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        summary='강의 삭제',
        description='강의를 삭제합니다. (강사만 가능)'
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
