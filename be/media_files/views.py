from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.http import FileResponse, Http404, HttpResponse
from drf_spectacular.utils import extend_schema, OpenApiResponse
import os
import re
from wsgiref.util import FileWrapper
from .models import MediaFile
from .serializers import MediaFileSerializer, MediaFileUploadSerializer


class IsOwnerOrReadOnly(IsAuthenticatedOrReadOnly):
    """업로더만 삭제 가능"""

    def has_object_permission(self, request, view, obj):
        # 읽기 권한은 모두에게
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        # 삭제 권한은 업로더에게만
        return obj.uploaded_by == request.user


@extend_schema(tags=['미디어'])
class MediaFileViewSet(viewsets.ModelViewSet):
    """미디어 파일 업로드 및 관리 API"""

    queryset = MediaFile.objects.select_related('uploaded_by')
    permission_classes = [IsOwnerOrReadOnly]
    http_method_names = ['get', 'post', 'delete']

    def get_serializer_class(self):
        """액션별 Serializer 선택"""
        if self.action == 'create':
            return MediaFileUploadSerializer
        return MediaFileSerializer

    @extend_schema(
        summary='미디어 파일 목록 조회',
        description='업로드된 미디어 파일 목록을 조회합니다.'
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary='미디어 파일 상세 조회',
        description='미디어 파일의 상세 정보를 조회합니다.'
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary='미디어 파일 업로드',
        description='비디오, 문서, 이미지 파일을 업로드합니다. (인증 필요)',
        request=MediaFileUploadSerializer,
        responses={
            201: MediaFileSerializer,
            400: OpenApiResponse(description='파일 검증 실패')
        }
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        media_file = serializer.save()

        # 생성된 파일 정보 반환
        output_serializer = MediaFileSerializer(media_file, context={'request': request})
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        summary='미디어 파일 삭제',
        description='미디어 파일을 삭제합니다. (업로더만 가능)'
    )
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # 파일 시스템에서 실제 파일 삭제
        if instance.file and os.path.isfile(instance.file.path):
            os.remove(instance.file.path)

        # DB에서 삭제
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        summary='비디오 스트리밍',
        description='비디오 파일을 HTTP Range 요청으로 스트리밍합니다.',
        responses={
            200: OpenApiResponse(description='스트리밍 성공'),
            206: OpenApiResponse(description='부분 콘텐츠 (Partial Content)'),
            404: OpenApiResponse(description='파일을 찾을 수 없음')
        }
    )
    @action(detail=True, methods=['get'], permission_classes=[])
    def stream(self, request, pk=None):
        """비디오 파일 스트리밍 (HTTP Range 요청 지원)"""
        media = self.get_object()

        # 비디오 파일이 아니면 에러
        if media.file_type != 'video':
            return Response(
                {'error': '비디오 파일만 스트리밍할 수 있습니다.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 파일 존재 확인
        if not os.path.exists(media.file.path):
            raise Http404('파일을 찾을 수 없습니다.')

        # 파일 크기
        file_size = os.path.getsize(media.file.path)

        # Range 요청 헤더 확인
        range_header = request.META.get('HTTP_RANGE', '').strip()

        if range_header:
            # Range 요청 파싱 (예: bytes=0-1023)
            range_match = re.match(r'bytes=(\d+)-(\d*)', range_header)
            if range_match:
                start = int(range_match.group(1))
                end = int(range_match.group(2)) if range_match.group(2) else file_size - 1
                length = end - start + 1

                # 범위 유효성 검사
                if start >= file_size or end >= file_size or start > end:
                    response = HttpResponse(status=416)  # Range Not Satisfiable
                    response['Content-Range'] = f'bytes */{file_size}'
                    return response

                # Partial Content 응답 (206)
                file = open(media.file.path, 'rb')
                file.seek(start)
                response = FileResponse(
                    FileWrapper(file),
                    status=206,
                    content_type=media.mime_type or 'video/mp4'
                )
                response['Content-Length'] = str(length)
                response['Content-Range'] = f'bytes {start}-{end}/{file_size}'
                response['Accept-Ranges'] = 'bytes'
                return response

        # 일반 응답 (Range 요청 없음)
        response = FileResponse(
            open(media.file.path, 'rb'),
            content_type=media.mime_type or 'video/mp4'
        )
        response['Content-Length'] = str(file_size)
        response['Accept-Ranges'] = 'bytes'
        return response

