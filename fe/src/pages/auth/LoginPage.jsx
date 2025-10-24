import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
      newErrors.username = '사용자명 또는 이메일을 입력해주세요';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
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
      const result = await login(formData.username, formData.password);

      if (result.success) {
        navigate('/');
      } else {
        setErrors({ general: result.error || '로그인에 실패했습니다' });
      }
    } catch (error) {
      setErrors({ general: '로그인 중 오류가 발생했습니다' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[--color-bg-dark] px-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[--color-primary] mb-2">
            Learning Platform
          </h1>
          <p className="text-[--color-text-secondary]">
            로그인하여 강의를 시청하세요
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-[--color-bg-secondary] rounded-lg p-8 shadow-lg border border-[--color-border]">
          <h2 className="text-2xl font-semibold text-[--color-text-primary] mb-6">
            로그인
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
              label="사용자명 또는 이메일"
              placeholder="사용자명 또는 이메일을 입력하세요"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              required
              autoComplete="username"
            />

            <Input
              name="password"
              type="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isSubmitting || loading}
              disabled={isSubmitting || loading}
            >
              로그인
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[--color-border]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[--color-bg-secondary] text-[--color-text-secondary]">
                계정이 없으신가요?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6">
            <Link to="/register">
              <Button variant="outline" fullWidth>
                회원가입
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-[--color-text-secondary]">
          학습 플랫폼에 오신 것을 환영합니다
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
