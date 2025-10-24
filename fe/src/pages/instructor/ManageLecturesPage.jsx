import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { lectureService } from '../../services/lectureService';
import Button from '../../components/common/Button';
import { formatDate, formatDuration } from '../../utils/formatters';

const ManageLecturesPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourseAndLectures();
  }, [courseId]);

  const fetchCourseAndLectures = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch course and lectures in parallel
      const [courseData, lecturesData] = await Promise.all([
        courseService.getCourse(courseId),
        lectureService.getLectures({
          course: courseId,
          ordering: 'order',
        }),
      ]);

      setCourse(courseData);
      setLectures(lecturesData.results || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('강의 정보를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLecture = async (lectureId, lectureTitle) => {
    if (!window.confirm(`정말 "${lectureTitle}" 레슨을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await lectureService.deleteLecture(lectureId);
      await fetchCourseAndLectures(); // Refresh the list
    } catch (err) {
      console.error('Failed to delete lecture:', err);
      alert('레슨 삭제에 실패했습니다');
    }
  };

  // Content type icon
  const getContentTypeIcon = (contentType) => {
    switch (contentType) {
      case 'video':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        );
      case 'text':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'link':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
        );
      case 'file':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getContentTypeLabel = (contentType) => {
    const labels = {
      video: '비디오',
      text: '텍스트',
      link: '링크',
      file: '파일',
    };
    return labels[contentType] || contentType;
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
  if (error || !course) {
    return (
      <div className="min-h-screen bg-[--color-bg-dark] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[--color-primary] text-5xl mb-4">⚠️</div>
          <p className="text-[--color-text-primary] text-lg mb-4">
            {error || '강의를 찾을 수 없습니다'}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary" onClick={fetchCourseAndLectures}>
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
      <div className="max-w-7xl mx-auto px-4">
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

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[--color-text-primary] mb-2">
                레슨 관리
              </h1>
              <p className="text-[--color-text-secondary] mb-2">
                {course.title}
              </p>
              <p className="text-sm text-[--color-text-disabled]">
                {lectures.length}개의 레슨
              </p>
            </div>
            <Link to={`/instructor/courses/${courseId}/lectures/create`}>
              <Button variant="primary" size="lg">
                + 새 레슨 추가
              </Button>
            </Link>
          </div>
        </div>

        {/* Course Info Card */}
        <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-6 mb-6">
          <div className="flex gap-6">
            {course.thumbnail && (
              <div className="w-48 aspect-video bg-[--color-bg-dark] rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xl font-semibold text-[--color-text-primary]">
                  {course.title}
                </h2>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    course.is_published
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {course.is_published ? '공개' : '비공개'}
                </div>
              </div>
              {course.description && (
                <p className="text-[--color-text-secondary] text-sm mb-3 line-clamp-2">
                  {course.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-[--color-text-disabled]">
                <span>카테고리: {course.category || '없음'}</span>
                <span>•</span>
                <span>생성일: {formatDate(course.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lectures List */}
        {lectures.length === 0 ? (
          <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-12 text-center">
            <div className="text-[--color-text-disabled] text-6xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold text-[--color-text-primary] mb-2">
              아직 레슨이 없습니다
            </h3>
            <p className="text-[--color-text-secondary] mb-6">
              첫 번째 레슨을 추가해보세요!
            </p>
            <Link to={`/instructor/courses/${courseId}/lectures/create`}>
              <Button variant="primary" size="lg">
                레슨 추가
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[--color-text-primary] mb-4">
              레슨 목록
            </h2>

            {lectures.map((lecture, index) => (
              <div
                key={lecture.id}
                className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-6 hover:border-[--color-primary] transition-colors"
              >
                <div className="flex items-start gap-6">
                  {/* Order number */}
                  <div className="flex-shrink-0 w-12 h-12 bg-[--color-bg-dark] rounded-lg flex items-center justify-center">
                    <span className="text-lg font-semibold text-[--color-text-primary]">
                      {lecture.order || index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2 text-[--color-text-secondary]">
                            {getContentTypeIcon(lecture.content_type)}
                            <span className="text-xs font-medium">
                              {getContentTypeLabel(lecture.content_type)}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-[--color-text-primary] mb-1">
                          {lecture.title}
                        </h3>
                        {lecture.content_text && (
                          <p className="text-sm text-[--color-text-secondary] line-clamp-2">
                            {lecture.content_text}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-sm text-[--color-text-disabled] mb-4">
                      <span>생성일: {formatDate(lecture.created_at)}</span>
                      {lecture.duration > 0 && (
                        <>
                          <span>•</span>
                          <span>재생시간: {formatDuration(lecture.duration)}</span>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <Link to={`/courses/${courseId}/lectures/${lecture.id}`}>
                        <Button variant="outline" size="sm">
                          미리보기
                        </Button>
                      </Link>
                      <Link to={`/instructor/courses/${courseId}/lectures/${lecture.id}/edit`}>
                        <Button variant="outline" size="sm">
                          수정
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLecture(lecture.id, lecture.title)}
                        className="text-[--color-primary] hover:bg-[--color-primary]/10"
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLecturesPage;
