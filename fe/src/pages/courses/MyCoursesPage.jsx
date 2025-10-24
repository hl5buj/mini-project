import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentService } from '../../services/enrollmentService';
import { progressService } from '../../services/progressService';
import { courseService } from '../../services/courseService';
import Button from '../../components/common/Button';

const MyCoursesPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyEnrollments();
  }, []);

  const fetchMyEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all enrollments
      const enrollmentsData = await enrollmentService.getEnrollments();
      const enrollments = enrollmentsData.results || [];

      // Fetch course details and progress for each enrollment
      const coursesWithProgress = await Promise.all(
        enrollments.map(async (enrollment) => {
          try {
            // Fetch course details
            const courseData = await courseService.getCourse(enrollment.course);

            // Fetch progress for this course
            const progressList = await progressService.getCourseProgress(enrollment.course);

            // Calculate progress percentage
            const totalLectures = courseData.lectures?.length || 0;
            const progressPercentage = progressService.calculateCourseProgress(
              progressList,
              totalLectures
            );

            const completedLectures = progressList.filter((p) => p.completed).length;

            return {
              enrollment,
              course: courseData,
              progressPercentage,
              completedLectures,
              totalLectures,
              progressList,
            };
          } catch (err) {
            console.error('Failed to fetch course details:', err);
            return null;
          }
        })
      );

      // Filter out failed fetches
      setEnrolledCourses(coursesWithProgress.filter((item) => item !== null));
    } catch (err) {
      console.error('Failed to fetch enrollments:', err);
      setError('수강 중인 강의를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
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
  if (error) {
    return (
      <div className="min-h-screen bg-[--color-bg-dark] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[--color-primary] text-5xl mb-4">⚠️</div>
          <p className="text-[--color-text-primary] text-lg mb-4">{error}</p>
          <Button variant="primary" onClick={fetchMyEnrollments}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[--color-bg-dark] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[--color-text-primary] mb-2">
            내 강의
          </h1>
          <p className="text-[--color-text-secondary]">
            수강 중인 {enrolledCourses.length}개의 강의
          </p>
        </div>

        {/* Empty state */}
        {enrolledCourses.length === 0 ? (
          <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-12 text-center">
            <div className="text-[--color-text-disabled] text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-[--color-text-primary] mb-2">
              수강 중인 강의가 없습니다
            </h3>
            <p className="text-[--color-text-secondary] mb-6">
              새로운 강의를 찾아보세요!
            </p>
            <Link to="/courses">
              <Button variant="primary" size="lg">
                강의 둘러보기
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map(({ enrollment, course, progressPercentage, completedLectures, totalLectures }) => (
              <div
                key={enrollment.id}
                className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg overflow-hidden hover:border-[--color-primary] transition-all group"
              >
                {/* Thumbnail */}
                <Link to={`/courses/${course.id}`}>
                  <div className="relative aspect-video bg-[--color-bg-dark] overflow-hidden">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[--color-text-disabled] text-4xl">
                        📚
                      </div>
                    )}

                    {/* Progress badge */}
                    {progressPercentage > 0 && (
                      <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                        {progressPercentage}% 완료
                      </div>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4">
                  <Link to={`/courses/${course.id}`}>
                    <h3 className="text-lg font-semibold text-[--color-text-primary] mb-2 line-clamp-2 group-hover:text-[--color-primary] transition-colors">
                      {course.title}
                    </h3>
                  </Link>

                  {/* Instructor */}
                  {course.instructor && (
                    <p className="text-sm text-[--color-text-secondary] mb-3">
                      {course.instructor.username}
                    </p>
                  )}

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-[--color-text-secondary] mb-1">
                      <span>진행 상황</span>
                      <span>
                        {completedLectures} / {totalLectures} 레슨
                      </span>
                    </div>
                    <div className="w-full bg-[--color-bg-dark] rounded-full h-2">
                      <div
                        className="bg-[--color-primary] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Action button */}
                  <Link to={`/courses/${course.id}`}>
                    <Button variant="primary" size="sm" className="w-full">
                      {progressPercentage === 0 ? '학습 시작' : '계속 학습하기'}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
