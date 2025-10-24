from rest_framework import serializers
from .models import Course
from accounts.serializers import UserSerializer


class CourseListSerializer(serializers.ModelSerializer):
    """강의 목록 Serializer (간단한 정보)"""

    instructor = UserSerializer(read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'thumbnail',
            'instructor', 'is_published', 'lectures_count',
            'total_duration', 'created_at'
        ]
        read_only_fields = ['id', 'lectures_count', 'total_duration', 'created_at']


class CourseDetailSerializer(serializers.ModelSerializer):
    """강의 상세 Serializer (레슨 목록 포함)"""

    instructor = UserSerializer(read_only=True)
    lectures = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'thumbnail',
            'instructor', 'is_published', 'lectures_count',
            'total_duration', 'lectures', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'instructor', 'lectures_count',
            'total_duration', 'created_at', 'updated_at'
        ]

    def get_lectures(self, obj):
        """레슨 목록 (순서대로)"""
        from lectures.serializers import LectureListSerializer
        lectures = obj.lectures.all().order_by('order')
        return LectureListSerializer(lectures, many=True).data


class CourseCreateSerializer(serializers.ModelSerializer):
    """강의 생성 Serializer"""

    class Meta:
        model = Course
        fields = ['title', 'description', 'thumbnail', 'is_published']

    def validate_title(self, value):
        """제목 검증"""
        if len(value) < 2:
            raise serializers.ValidationError('제목은 2자 이상이어야 합니다.')
        return value

    def validate_description(self, value):
        """설명 검증"""
        if len(value) < 10:
            raise serializers.ValidationError('설명은 10자 이상이어야 합니다.')
        return value

    def create(self, validated_data):
        """강의 생성 (강사는 요청 사용자로 자동 설정)"""
        request = self.context.get('request')
        validated_data['instructor'] = request.user
        return super().create(validated_data)


class CourseUpdateSerializer(serializers.ModelSerializer):
    """강의 수정 Serializer"""

    class Meta:
        model = Course
        fields = ['title', 'description', 'thumbnail', 'is_published']

    def validate_title(self, value):
        """제목 검증"""
        if value and len(value) < 2:
            raise serializers.ValidationError('제목은 2자 이상이어야 합니다.')
        return value

    def validate_description(self, value):
        """설명 검증"""
        if value and len(value) < 10:
            raise serializers.ValidationError('설명은 10자 이상이어야 합니다.')
        return value
