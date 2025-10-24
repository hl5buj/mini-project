import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = '사용자명을 입력해주세요';
    } else if (formData.username.length < 3) {
      newErrors.username = '사용자명은 최소 3자 이상이어야 합니다';
    } else if (!/^[\w.@+-]+$/.test(formData.username)) {
      newErrors.username = '사용자명은 문자, 숫자, @/./+/-/_ 만 사용 가능합니다';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 최소 8자 이상이어야 합니다';
    }

    if (!formData.password2) {
      newErrors.password2 = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.password2) {
      newErrors.password2 = '비밀번호가 일치하지 않습니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register(formData);

      if (result.success) {
        navigate('/');
      } else {
        setErrors({ general: result.error || '회원가입에 실패했습니다' });
      }
    } catch (error) {
      setErrors({ general: '회원가입 중 오류가 발생했습니다' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[--color-bg-dark] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[--color-primary] mb-2">
            Learning Platform
          </h1>
          <p className="text-[--color-text-secondary]">
            새로운 계정을 만들어 학습을 시작하세요
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-[--color-bg-secondary] rounded-lg p-8 shadow-lg border border-[--color-border]">
          <h2 className="text-2xl font-semibold text-[--color-text-primary] mb-6">
            회원가입
          </h2>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-900/20 border border-[--color-primary] rounded-md">
              <p className="text-sm text-[--color-primary]">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="username"
              type="text"
              label="사용자명"
              placeholder="사용자명을 입력하세요"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              required
              autoComplete="username"
            />

            <Input
              name="email"
              type="email"
              label="이메일"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              name="password"
              type="password"
              label="비밀번호"
              placeholder="8자 이상의 비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="new-password"
            />

            <Input
              name="password2"
              type="password"
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.password2}
              onChange={handleChange}
              error={errors.password2}
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isSubmitting || loading}
              disabled={isSubmitting || loading}
            >
              가입하기
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[--color-border]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[--color-bg-secondary] text-[--color-text-secondary]">
                이미 계정이 있으신가요?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6">
            <Link to="/login">
              <Button variant="outline" fullWidth>
                로그인
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-[--color-text-secondary]">
          회원가입 시 이용약관 및 개인정보처리방침에 동의하게 됩니다
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
