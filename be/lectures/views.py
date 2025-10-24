from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from drf_spectacular.utils import extend_schema, OpenApiParameter
from .models import Lecture
from .serializers import (
    LectureListSerializer,
    LectureDetailSerializer,
    LectureCreateSerializer,
    LectureUpdateSerializer
)


class IsCourseInstructorOrReadOnly(IsAuthenticatedOrReadOnly):
    """강의 강사만 레슨 수정/삭제 가능"""

    def has_object_permission(self, request, view, obj):
        # 읽기 권한은 모두에게
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        # 쓰기 권한은 강의 강사에게만
        return obj.course.instructor == request.user


@extend_schema(tags=['레슨'])
class LectureViewSet(viewsets.ModelViewSet):
    """레슨 CRUD API"""

    queryset = Lecture.objects.select_related('course', 'media_file')
    permission_classes = [IsCourseInstructorOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['course', 'content_type']
    search_fields = ['title', 'content_text']
    ordering_fields = ['order', 'created_at', 'duration']
    ordering = ['course', 'order']

    def get_serializer_class(self):
        """액션별 Serializer 선택"""
        if self.action == 'list':
            return LectureListSerializer
        elif self.action == 'retrieve':
            return LectureDetailSerializer
        elif self.action == 'create':
            return LectureCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return LectureUpdateSerializer
        return LectureListSerializer

    @extend_schema(
        summary='레슨 목록 조회',
        description='레슨 목록을 조회합니다. 강의별 필터링이 가능합니다.',
        parameters=[
            OpenApiParameter(name='course', description='강의 ID', type=int),
            OpenApiParameter(name='content_type', description='콘텐츠 타입 (text/video/link/file)', type=str),
            OpenApiParameter(name='search', description='검색어 (제목, 내용)', type=str),
            OpenApiParameter(name='ordering', description='정렬 (order, created_at, duration)', type=str),
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary='레슨 상세 조회',
        description='레슨의 상세 정보를 조회합니다.'
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary='레슨 생성',
        description='새로운 레슨을 생성합니다. (강의 강사만 가능)'
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @extend_schema(
        summary='레슨 수정',
        description='레슨을 수정합니다. (강의 강사만 가능)'
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(
        summary='레슨 부분 수정',
        description='레슨을 부분 수정합니다. (강의 강사만 가능)'
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        summary='레슨 삭제',
        description='레슨을 삭제합니다. (강의 강사만 가능)'
    )
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        course = instance.course

        # 레슨 삭제
        self.perform_destroy(instance)

        # 강의의 통계 업데이트
        course.lectures_count = course.lectures.count()
        course.total_duration = sum(
            lec.duration for lec in course.lectures.all()
        )
        course.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
