import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { enrollmentService } from '../../services/enrollmentService';
import { progressService } from '../../services/progressService';
import CourseInfo from '../../components/courses/CourseInfo';
import LectureListItem from '../../components/courses/LectureListItem';
import Button from '../../components/common/Button';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [courseProgress, setCourseProgress] = useState(0);
  const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    fetchCourseDetail();
  }, [courseId]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch course data, enrollment status, and progress in parallel
      const [courseData, enrollmentData, progressList] = await Promise.all([
        courseService.getCourse(courseId),
        enrollmentService.checkEnrollmentStatus(courseId),
        progressService.getCourseProgress(courseId),
      ]);

      setCourse(courseData);
      setEnrollment(enrollmentData);

      // Extract lectures from course detail
      // The API returns lectures as a nested field
      const courseLectures = courseData.lectures && Array.isArray(courseData.lectures)
        ? courseData.lectures
        : [];
      setLectures(courseLectures);

      // Build progress map (lectureId -> isCompleted)
      const progressMapping = {};
      progressList.forEach((progress) => {
        progressMapping[progress.lecture] = progress.completed;
      });
      setProgressMap(progressMapping);

      // Calculate course progress percentage
      const calculatedProgress = progressService.calculateCourseProgress(
        progressList,
        courseLectures.length
      );
      setCourseProgress(calculatedProgress);
    } catch (err) {
      console.error('Failed to fetch course:', err);
      setError('강의를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrollmentLoading(true);
      const enrollmentData = await enrollmentService.enrollCourse(courseId);
      setEnrollment(enrollmentData);

      // Navigate to first lecture if available
      if (lectures.length > 0) {
        navigate(`/courses/${courseId}/lectures/${lectures[0].id}`);
      }
    } catch (err) {
      console.error('Failed to enroll:', err);
      alert('수강 신청에 실패했습니다');
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const handleUnenroll = async () => {
    if (!window.confirm('정말 수강을 취소하시겠습니까?')) {
      return;
    }

    try {
      setEnrollmentLoading(true);
      await enrollmentService.unenrollCourse(enrollment.id);
      setEnrollment(null);
    } catch (err) {
      console.error('Failed to unenroll:', err);
      alert('수강 취소에 실패했습니다');
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const handleStartLearning = () => {
    if (lectures.length > 0) {
      navigate(`/courses/${courseId}/lectures/${lectures[0].id}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[--color-bg-dark] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-12 w-12 text-[--color-primary]"
            viewBox="0 0 24 24"
          >
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
          <Link to="/courses">
            <Button variant="primary">강의 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--color-bg-dark] py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back button */}
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-[--color-text-secondary] hover:text-[--color-text-primary] mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>강의 목록으로</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - Course Info */}
          <div className="lg:col-span-2 space-y-6">
            <CourseInfo course={course} />

            {/* Enrollment Actions */}
            <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-6">
              {enrollment ? (
                <div className="space-y-4">
                  {/* Enrolled State */}
                  <div className="flex items-center gap-2 text-[--color-primary] mb-4">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">수강 중인 강의입니다</span>
                  </div>

                  {/* Progress Info */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-[--color-text-secondary]">진행률</span>
                      <span className="text-[--color-text-primary] font-medium">
                        {courseProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-[--color-bg-dark] rounded-full h-2">
                      <div
                        className="bg-[--color-primary] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${courseProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleStartLearning}
                      disabled={lectures.length === 0}
                      className="flex-1"
                    >
                      {lectures.length === 0 ? '레슨이 없습니다' : '학습 시작'}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleUnenroll}
                      loading={enrollmentLoading}
                    >
                      수강 취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Not Enrolled State */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-[--color-text-primary] mb-2">
                      이 강의를 수강하시겠습니까?
                    </h3>
                    <p className="text-sm text-[--color-text-secondary]">
                      수강 신청 후 모든 레슨에 접근할 수 있습니다
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleEnroll}
                    loading={enrollmentLoading}
                    className="w-full"
                  >
                    수강 신청
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Lecture List */}
          <div className="lg:col-span-1">
            <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg overflow-hidden sticky top-20">
              {/* Header */}
              <div className="p-4 border-b border-[--color-border]">
                <h2 className="text-lg font-semibold text-[--color-text-primary]">
                  강의 목차
                </h2>
                <p className="text-sm text-[--color-text-secondary] mt-1">
                  {lectures.length}개 레슨
                </p>
              </div>

              {/* Lecture list */}
              <div className="max-h-[600px] overflow-y-auto">
                {lectures.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-[--color-text-disabled] text-4xl mb-2">📝</div>
                    <p className="text-[--color-text-secondary]">
                      아직 레슨이 없습니다
                    </p>
                  </div>
                ) : (
                  lectures.map((lecture) => (
                    <LectureListItem
                      key={lecture.id}
                      lecture={lecture}
                      courseId={courseId}
                      isCompleted={progressMap[lecture.id] || false}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
