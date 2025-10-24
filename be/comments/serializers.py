from rest_framework import serializers
from .models import Comment
from accounts.serializers import UserSerializer


class CommentSerializer(serializers.ModelSerializer):
    """댓글 Serializer (대댓글 포함)"""

    author = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    reply_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id', 'lecture', 'author', 'parent',
            'content', 'replies', 'reply_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']

    def get_replies(self, obj):
        """대댓글 목록"""
        if obj.parent is None:  # 최상위 댓글만 대댓글 포함
            replies = obj.replies.all().order_by('created_at')
            return CommentListSerializer(replies, many=True).data
        return []

    def get_reply_count(self, obj):
        """대댓글 수"""
        if obj.parent is None:
            return obj.replies.count()
        return 0


class CommentListSerializer(serializers.ModelSerializer):
    """댓글 목록 Serializer (간단한 정보)"""

    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = [
            'id', 'author', 'content',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']


class CommentCreateSerializer(serializers.ModelSerializer):
    """댓글 생성 Serializer"""

    class Meta:
        model = Comment
        fields = ['lecture', 'parent', 'content']

    def validate_content(self, value):
        """내용 검증"""
        if not value or len(value.strip()) < 1:
            raise serializers.ValidationError('내용을 입력해주세요.')
        return value

    def validate(self, attrs):
        """대댓글 검증"""
        parent = attrs.get('parent')

        # 대댓글의 대댓글 방지
        if parent and parent.parent:
            raise serializers.ValidationError({
                'parent': '대댓글에는 답글을 달 수 없습니다.'
            })

        # 대댓글인 경우, 부모 댓글과 같은 레슨인지 확인
        if parent and parent.lecture != attrs.get('lecture'):
            raise serializers.ValidationError({
                'parent': '같은 레슨의 댓글에만 답글을 달 수 있습니다.'
            })

        return attrs

    def create(self, validated_data):
        """댓글 생성"""
        request = self.context.get('request')
        validated_data['author'] = request.user
        return super().create(validated_data)


class CommentUpdateSerializer(serializers.ModelSerializer):
    """댓글 수정 Serializer"""

    class Meta:
        model = Comment
        fields = ['content']

    def validate_content(self, value):
        """내용 검증"""
        if not value or len(value.strip()) < 1:
            raise serializers.ValidationError('내용을 입력해주세요.')
        return value
