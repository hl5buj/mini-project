from rest_framework import serializers
from .models import MediaFile
from accounts.serializers import UserSerializer


class MediaFileSerializer(serializers.ModelSerializer):
    """미디어 파일 Serializer"""

    uploaded_by = UserSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()
    stream_url = serializers.SerializerMethodField()

    class Meta:
        model = MediaFile
        fields = [
            'id', 'file', 'file_type', 'file_size',
            'mime_type', 'original_filename', 'uploaded_by',
            'file_url', 'stream_url', 'uploaded_at'
        ]
        read_only_fields = [
            'id', 'file_type', 'file_size', 'mime_type',
            'original_filename', 'uploaded_by', 'uploaded_at'
        ]

    def get_file_url(self, obj):
        """파일 다운로드 URL"""
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

    def get_stream_url(self, obj):
        """스트리밍 URL (비디오인 경우)"""
        request = self.context.get('request')
        if obj.file_type == 'video' and request:
            return request.build_absolute_uri(f'/api/media/{obj.id}/stream/')
        return None


class MediaFileUploadSerializer(serializers.ModelSerializer):
    """미디어 파일 업로드 Serializer"""

    class Meta:
        model = MediaFile
        fields = ['file']

    def create(self, validated_data):
        """파일 업로드"""
        request = self.context.get('request')
        validated_data['uploaded_by'] = request.user
        return super().create(validated_data)
