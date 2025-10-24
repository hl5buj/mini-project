import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { lectureService } from '../../services/lectureService';
import { courseService } from '../../services/courseService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const CreateLecturePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content_type: 'video',
    content_video_url: '',
    content_text: '',
    content_link: '',
    content_file_url: '',
    order: '',
    duration: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoadingCourse(true);
      const courseData = await courseService.getCourse(courseId);
      setCourse(courseData);
    } catch (err) {
      console.error('Failed to fetch course:', err);
    } finally {
      setLoadingCourse(false);
    }
  };

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

    if (!formData.title.trim()) {
      newErrors.title = '레슨 제목은 필수입니다';
    }

    // Validate content based on type
    switch (formData.content_type) {
      case 'video':
        if (!formData.content_video_url.trim()) {
          newErrors.content_video_url = '비디오 URL은 필수입니다';
        } else if (!isValidUrl(formData.content_video_url)) {
          newErrors.content_video_url = '올바른 URL 형식이 아닙니다';
        }
        break;
      case 'text':
        if (!formData.content_text.trim()) {
          newErrors.content_text = '텍스트 내용은 필수입니다';
        }
        break;
      case 'link':
        if (!formData.content_link.trim()) {
          newErrors.content_link = '링크 URL은 필수입니다';
        } else if (!isValidUrl(formData.content_link)) {
          newErrors.content_link = '올바른 URL 형식이 아닙니다';
        }
        break;
      case 'file':
        if (!formData.content_file_url.trim()) {
          newErrors.content_file_url = '파일 URL은 필수입니다';
        } else if (!isValidUrl(formData.content_file_url)) {
          newErrors.content_file_url = '올바른 URL 형식이 아닙니다';
        }
        break;
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
      const lectureData = {
        course: parseInt(courseId),
        title: formData.title.trim(),
        content_type: formData.content_type,
      };

      // Add content based on type
      switch (formData.content_type) {
        case 'video':
          lectureData.content_video_url = formData.content_video_url.trim();
          break;
        case 'text':
          lectureData.content_text = formData.content_text.trim();
          break;
        case 'link':
          lectureData.content_link = formData.content_link.trim();
          break;
        case 'file':
          lectureData.content_file_url = formData.content_file_url.trim();
          break;
      }

      // Add optional fields
      if (formData.order) {
        lectureData.order = parseInt(formData.order);
      }
      if (formData.duration) {
        lectureData.duration = parseInt(formData.duration);
      }

      await lectureService.createLecture(lectureData);

      // Navigate to lecture management page
      navigate(`/instructor/courses/${courseId}/lectures`);
    } catch (err) {
      console.error('Failed to create lecture:', err);

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
        setErrors({ general: '레슨 생성에 실패했습니다' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingCourse) {
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

  return (
    <div className="min-h-screen bg-[--color-bg-dark] py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/instructor/courses/${courseId}/lectures`}
            className="inline-flex items-center gap-2 text-[--color-text-secondary] hover:text-[--color-text-primary] mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>레슨 관리로 돌아가기</span>
          </Link>

          <h1 className="text-3xl font-bold text-[--color-text-primary] mb-2">
            새 레슨 만들기
          </h1>
          {course && (
            <p className="text-[--color-text-secondary]">
              강의: {course.title}
            </p>
          )}
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
            label="레슨 제목"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="예: React Hooks 소개"
            required
          />

          {/* Content Type */}
          <div>
            <label className="block text-sm font-medium text-[--color-text-primary] mb-2">
              콘텐츠 타입 <span className="text-red-400">*</span>
            </label>
            <select
              name="content_type"
              value={formData.content_type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-[--color-bg-dark] border border-[--color-border] rounded-md text-[--color-text-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:border-transparent"
            >
              <option value="video">비디오</option>
              <option value="text">텍스트</option>
              <option value="link">링크</option>
              <option value="file">파일</option>
            </select>
          </div>

          {/* Dynamic content fields based on type */}
          {formData.content_type === 'video' && (
            <Input
              label="비디오 URL"
              name="content_video_url"
              type="url"
              value={formData.content_video_url}
              onChange={handleChange}
              error={errors.content_video_url}
              placeholder="https://example.com/video.mp4"
              required
            />
          )}

          {formData.content_type === 'text' && (
            <div>
              <label className="block text-sm font-medium text-[--color-text-primary] mb-2">
                텍스트 내용 <span className="text-red-400">*</span>
              </label>
              <textarea
                name="content_text"
                value={formData.content_text}
                onChange={handleChange}
                rows={10}
                className="w-full px-4 py-2.5 bg-[--color-bg-dark] border border-[--color-border] rounded-md text-[--color-text-primary] placeholder-[--color-text-disabled] focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:border-transparent resize-none"
                placeholder="레슨 내용을 작성하세요..."
              />
              {errors.content_text && (
                <p className="mt-1 text-sm text-red-400">{errors.content_text}</p>
              )}
            </div>
          )}

          {formData.content_type === 'link' && (
            <Input
              label="링크 URL"
              name="content_link"
              type="url"
              value={formData.content_link}
              onChange={handleChange}
              error={errors.content_link}
              placeholder="https://example.com"
              required
            />
          )}

          {formData.content_type === 'file' && (
            <Input
              label="파일 URL"
              name="content_file_url"
              type="url"
              value={formData.content_file_url}
              onChange={handleChange}
              error={errors.content_file_url}
              placeholder="https://example.com/file.pdf"
              required
            />
          )}

          {/* Order */}
          <Input
            label="순서"
            name="order"
            type="number"
            value={formData.order}
            onChange={handleChange}
            error={errors.order}
            placeholder="1, 2, 3..."
            min="1"
          />

          {/* Duration (for video) */}
          {formData.content_type === 'video' && (
            <Input
              label="재생시간 (초)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              error={errors.duration}
              placeholder="예: 600 (10분)"
              min="0"
            />
          )}

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
              레슨 만들기
            </Button>
            <Link to={`/instructor/courses/${courseId}/lectures`} className="flex-1">
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
            💡 콘텐츠 타입 안내
          </h3>
          <ul className="text-sm text-[--color-text-secondary] space-y-1">
            <li>• <strong>비디오</strong>: MP4, WebM 등의 비디오 파일 URL을 입력하세요</li>
            <li>• <strong>텍스트</strong>: 마크다운 형식의 텍스트 콘텐츠를 작성하세요</li>
            <li>• <strong>링크</strong>: 외부 웹사이트나 리소스의 URL을 입력하세요</li>
            <li>• <strong>파일</strong>: PDF, DOC 등의 다운로드 가능한 파일 URL을 입력하세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateLecturePage;
