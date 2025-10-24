import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    category: '',
    is_published: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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

    if (!formData.title.trim()) {
      newErrors.title = '강의 제목은 필수입니다';
    } else if (formData.title.length < 3) {
      newErrors.title = '강의 제목은 최소 3자 이상이어야 합니다';
    }

    if (formData.thumbnail && !isValidUrl(formData.thumbnail)) {
      newErrors.thumbnail = '올바른 URL 형식이 아닙니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        thumbnail: formData.thumbnail.trim() || undefined,
        category: formData.category.trim() || undefined,
        is_published: formData.is_published,
      };

      // Remove undefined fields
      Object.keys(courseData).forEach((key) => {
        if (courseData[key] === undefined) {
          delete courseData[key];
        }
      });

      const newCourse = await courseService.createCourse(courseData);

      // Navigate to instructor dashboard
      navigate('/instructor/dashboard');
    } catch (err) {
      console.error('Failed to create course:', err);

      if (err.response?.data) {
        // Handle API validation errors
        const apiErrors = {};
        Object.keys(err.response.data).forEach((key) => {
          apiErrors[key] = Array.isArray(err.response.data[key])
            ? err.response.data[key][0]
            : err.response.data[key];
        });
        setErrors(apiErrors);
      } else {
        setErrors({ general: '강의 생성에 실패했습니다' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[--color-bg-dark] py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/instructor/dashboard"
            className="inline-flex items-center gap-2 text-[--color-text-secondary] hover:text-[--color-text-primary] mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>대시보드로 돌아가기</span>
          </Link>

          <h1 className="text-3xl font-bold text-[--color-text-primary] mb-2">
            새 강의 만들기
          </h1>
          <p className="text-[--color-text-secondary]">
            강의의 기본 정보를 입력하세요. 강의를 생성한 후 레슨을 추가할 수 있습니다.
          </p>
        </div>

        {/* General error */}
        {errors.general && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-6 space-y-6">
          {/* Title */}
          <Input
            label="강의 제목"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="예: React 완벽 가이드"
            required
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[--color-text-primary] mb-2">
              강의 설명
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2.5 bg-[--color-bg-dark] border border-[--color-border] rounded-md text-[--color-text-primary] placeholder-[--color-text-disabled] focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:border-transparent resize-none"
              placeholder="강의에 대한 설명을 작성하세요..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description}</p>
            )}
          </div>

          {/* Thumbnail URL */}
          <Input
            label="썸네일 URL"
            name="thumbnail"
            type="url"
            value={formData.thumbnail}
            onChange={handleChange}
            error={errors.thumbnail}
            placeholder="https://example.com/image.jpg"
          />

          {/* Category */}
          <Input
            label="카테고리"
            name="category"
            type="text"
            value={formData.category}
            onChange={handleChange}
            error={errors.category}
            placeholder="예: 프로그래밍, 디자인, 비즈니스"
          />

          {/* Is Published */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_published"
              name="is_published"
              checked={formData.is_published}
              onChange={handleChange}
              className="w-4 h-4 text-[--color-primary] bg-[--color-bg-dark] border-[--color-border] rounded focus:ring-[--color-primary] focus:ring-2"
            />
            <label htmlFor="is_published" className="text-sm text-[--color-text-primary]">
              <span className="font-medium">강의 공개</span>
              <p className="text-[--color-text-secondary] text-xs mt-1">
                체크하면 모든 사용자가 이 강의를 볼 수 있습니다
              </p>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-[--color-border]">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="flex-1"
            >
              강의 만들기
            </Button>
            <Link to="/instructor/dashboard" className="flex-1">
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={isSubmitting}
                className="w-full"
              >
                취소
              </Button>
            </Link>
          </div>
        </form>

        {/* Help text */}
        <div className="mt-6 p-4 bg-[--color-bg-secondary] border border-[--color-border] rounded-lg">
          <h3 className="text-sm font-medium text-[--color-text-primary] mb-2">
            💡 다음 단계
          </h3>
          <ul className="text-sm text-[--color-text-secondary] space-y-1">
            <li>• 강의를 생성한 후 레슨을 추가할 수 있습니다</li>
            <li>• 레슨에는 비디오, 텍스트, 링크, 파일을 포함할 수 있습니다</li>
            <li>• 강의가 준비되면 공개 설정을 활성화하세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;
