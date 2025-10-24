import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const EditCoursePage = () => {
  const { courseId } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setLoadError(null);

      const courseData = await courseService.getCourse(courseId);

      setFormData({
        title: courseData.title || '',
        description: courseData.description || '',
        thumbnail: courseData.thumbnail || '',
        category: courseData.category || '',
        is_published: courseData.is_published || false,
      });
    } catch (err) {
      console.error('Failed to fetch course:', err);
      setLoadError('강의 정보를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

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

      await courseService.updateCourse(courseId, courseData);

      // Navigate to instructor dashboard
      navigate('/instructor/dashboard');
    } catch (err) {
      console.error('Failed to update course:', err);

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
        setErrors({ general: '강의 수정에 실패했습니다' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[--color-bg-dark] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-12 w-12 text-[--color-primary]" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-[--color-text-secondary]">강의를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="min-h-screen bg-[--color-bg-dark] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[--color-primary] text-5xl mb-4">⚠️</div>
          <p className="text-[--color-text-primary] text-lg mb-4">{loadError}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary" onClick={fetchCourseData}>
              다시 시도
            </Button>
            <Link to="/instructor/dashboard">
              <Button variant="outline">대시보드로 돌아가기</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            강의 수정
          </h1>
          <p className="text-[--color-text-secondary]">
            강의의 기본 정보를 수정하세요.
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
              변경사항 저장
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
            💡 팁
          </h3>
          <ul className="text-sm text-[--color-text-secondary] space-y-1">
            <li>• 강의 제목과 설명을 명확하게 작성하면 더 많은 학생들이 찾을 수 있습니다</li>
            <li>• 썸네일 이미지는 16:9 비율을 권장합니다</li>
            <li>• 강의가 준비되면 공개 설정을 활성화하세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;
