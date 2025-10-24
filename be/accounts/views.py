from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .models import User
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
    CustomTokenObtainPairSerializer
)


@extend_schema(
    tags=['인증'],
    summary='회원가입',
    description='새로운 사용자를 등록합니다.',
    request=UserRegistrationSerializer,
    responses={
        201: OpenApiResponse(
            response=UserSerializer,
            description='회원가입 성공'
        ),
        400: OpenApiResponse(description='유효성 검사 실패')
    }
)
class RegisterView(generics.CreateAPIView):
    """회원가입 API"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # 생성된 사용자 정보 반환
        user_serializer = UserSerializer(user)
        return Response(
            user_serializer.data,
            status=status.HTTP_201_CREATED
        )


@extend_schema(
    tags=['인증'],
    summary='로그인',
    description='이메일(또는 사용자명)과 비밀번호로 로그인하여 JWT 토큰을 발급받습니다.',
)
class CustomTokenObtainPairView(TokenObtainPairView):
    """로그인 API (JWT 토큰 발급)"""
    serializer_class = CustomTokenObtainPairSerializer


@extend_schema(
    tags=['인증'],
    summary='토큰 갱신',
    description='Refresh 토큰을 사용하여 새로운 Access 토큰을 발급받습니다.',
    responses={
        200: OpenApiResponse(description='토큰 갱신 성공'),
        401: OpenApiResponse(description='유효하지 않은 토큰')
    }
)
class CustomTokenRefreshView(TokenRefreshView):
    """토큰 갱신 API"""
    pass


@extend_schema(
    tags=['프로필'],
    summary='내 프로필 조회/수정',
    description='현재 로그인한 사용자의 프로필 정보를 조회하거나 수정합니다.',
    responses={
        200: UserProfileSerializer,
        401: OpenApiResponse(description='인증 실패')
    }
)
class ProfileView(generics.RetrieveUpdateAPIView):
    """프로필 조회 및 수정 API"""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        """프로필 수정 (PUT/PATCH)"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        """프로필 부분 수정 (PATCH)"""
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)


@extend_schema(
    tags=['프로필'],
    summary='비밀번호 변경',
    description='현재 로그인한 사용자의 비밀번호를 변경합니다.',
    request=ChangePasswordSerializer,
    responses={
        200: OpenApiResponse(description='비밀번호 변경 성공'),
        400: OpenApiResponse(description='유효성 검사 실패'),
        401: OpenApiResponse(description='인증 실패')
    }
)
class ChangePasswordView(APIView):
    """비밀번호 변경 API"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {'message': '비밀번호가 성공적으로 변경되었습니다.'},
            status=status.HTTP_200_OK
        )
