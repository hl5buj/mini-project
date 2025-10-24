from rest_framework import serializers
from .models import Lecture
from courses.serializers import CourseListSerializer


class LectureListSerializer(serializers.ModelSerializer):
    """레슨 목록 Serializer (간단한 정보)"""

    class Meta:
        model = Lecture
        fields = [
            'id', 'course', 'title', 'content_type',
            'order', 'duration', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class LectureDetailSerializer(serializers.ModelSerializer):
    """레슨 상세 Serializer"""

    course = CourseListSerializer(read_only=True)

    class Meta:
        model = Lecture
        fields = [
            'id', 'course', 'title', 'content_type',
            'content_text', 'video_url', 'media_file',
            'order', 'duration', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LectureCreateSerializer(serializers.ModelSerializer):
    """레슨 생성 Serializer"""

    class Meta:
        model = Lecture
        fields = [
            'course', 'title', 'content_type',
            'content_text', 'video_url', 'media_file',
            'order', 'duration'
        ]

    def validate_title(self, value):
        """제목 검증"""
        if len(value) < 2:
            raise serializers.ValidationError('제목은 2자 이상이어야 합니다.')
        return value

    def validate(self, attrs):
        """콘텐츠 타입별 필수 필드 검증"""
        content_type = attrs.get('content_type')

        if content_type == 'text' and not attrs.get('content_text'):
            raise serializers.ValidationError({
                'content_text': '텍스트 콘텐츠는 필수입니다.'
            })

        if content_type == 'link' and not attrs.get('video_url'):
            raise serializers.ValidationError({
                'video_url': '비디오 URL은 필수입니다.'
            })

        if content_type in ['video', 'file'] and not attrs.get('media_file'):
            raise serializers.ValidationError({
                'media_file': '미디어 파일은 필수입니다.'
            })

        return attrs

    def create(self, validated_data):
        """레슨 생성"""
        lecture = super().create(validated_data)

        # 강의의 레슨 수 업데이트
        course = lecture.course
        course.lectures_count = course.lectures.count()
        course.total_duration = sum(
            lec.duration for lec in course.lectures.all()
        )
        course.save()

        return lecture


class LectureUpdateSerializer(serializers.ModelSerializer):
    """레슨 수정 Serializer"""

    class Meta:
        model = Lecture
        fields = [
            'title', 'content_type',
            'content_text', 'video_url', 'media_file',
            'order', 'duration'
        ]

    def validate_title(self, value):
        """제목 검증"""
        if value and len(value) < 2:
            raise serializers.ValidationError('제목은 2자 이상이어야 합니다.')
        return value

    def validate(self, attrs):
        """콘텐츠 타입별 필수 필드 검증"""
        instance = self.instance
        content_type = attrs.get('content_type', instance.content_type)

        # 텍스트 타입
        if content_type == 'text':
            content_text = attrs.get('content_text', instance.content_text)
            if not content_text:
                raise serializers.ValidationError({
                    'content_text': '텍스트 콘텐츠는 필수입니다.'
                })

        # 링크 타입
        if content_type == 'link':
            video_url = attrs.get('video_url', instance.video_url)
            if not video_url:
                raise serializers.ValidationError({
                    'video_url': '비디오 URL은 필수입니다.'
                })

        # 비디오/파일 타입
        if content_type in ['video', 'file']:
            media_file = attrs.get('media_file', instance.media_file)
            if not media_file:
                raise serializers.ValidationError({
                    'media_file': '미디어 파일은 필수입니다.'
                })

        return attrs

    def update(self, instance, validated_data):
        """레슨 수정"""
        lecture = super().update(instance, validated_data)

        # 강의의 총 재생시간 업데이트
        course = lecture.course
        course.total_duration = sum(
            lec.duration for lec in course.lectures.all()
        )
        course.save()

        return lecture
