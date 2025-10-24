from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """사용자 기본 Serializer"""

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'profile_image',
            'bio', 'courses_count', 'created_at'
        ]
        read_only_fields = ['id', 'courses_count', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """회원가입 Serializer"""

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        label='비밀번호 확인'
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']

    def validate_email(self, value):
        """이메일 중복 확인"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('이미 사용 중인 이메일입니다.')
        return value

    def validate_username(self, value):
        """사용자명 중복 확인"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('이미 사용 중인 사용자명입니다.')
        return value

    def validate(self, attrs):
        """비밀번호 일치 확인"""
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                'password2': '비밀번호가 일치하지 않습니다.'
            })
        return attrs

    def create(self, validated_data):
        """사용자 생성"""
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """프로필 조회 및 수정 Serializer"""

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'profile_image',
            'bio', 'courses_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'username', 'courses_count', 'created_at', 'updated_at']

    def validate_profile_image(self, value):
        """프로필 이미지 검증"""
        if value and value.size > 5 * 1024 * 1024:  # 5MB
            raise serializers.ValidationError('이미지 파일은 5MB 이하여야 합니다.')
        return value


class ChangePasswordSerializer(serializers.Serializer):
    """비밀번호 변경 Serializer"""

    old_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    new_password2 = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'},
        label='새 비밀번호 확인'
    )

    def validate_old_password(self, value):
        """현재 비밀번호 확인"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('현재 비밀번호가 올바르지 않습니다.')
        return value

    def validate(self, attrs):
        """새 비밀번호 일치 확인"""
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({
                'new_password2': '비밀번호가 일치하지 않습니다.'
            })
        return attrs

    def save(self):
        """비밀번호 변경"""
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """커스텀 JWT 토큰 Serializer (사용자 정보 포함)"""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # 토큰에 추가 정보 포함
        token['username'] = user.username
        token['email'] = user.email

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # 응답에 사용자 정보 추가
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'profile_image': self.user.profile_image.url if self.user.profile_image else None,
        }

        return data
