import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { courseService } from '../../services/courseService';
import { enrollmentService } from '../../services/enrollmentService';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';

const InstructorDashboardPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [courseStats, setCourseStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  const fetchInstructorCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch courses created by the current user (instructor)
      const coursesData = await courseService.getCourses({
        instructor: user?.id,
      });

      const instructorCourses = coursesData.results || [];
      setCourses(instructorCourses);

      // Fetch enrollment stats for each course
      const stats = {};
      await Promise.all(
        instructorCourses.map(async (course) => {
          try {
            const enrollmentsData = await enrollmentService.getEnrollments({
              course: course.id,
            });

            stats[course.id] = {
              enrollmentCount: enrollmentsData.results?.length || 0,
              lectureCount: course.lectures?.length || 0,
            };
          } catch (err) {
            console.error(`Failed to fetch stats for course ${course.id}:`, err);
            stats[course.id] = {
              enrollmentCount: 0,
              lectureCount: 0,
            };
          }
        })
      );

      setCourseStats(stats);
    } catch (err) {
      console.error('Failed to fetch instructor courses:', err);
      setError('강의 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('정말 이 강의를 삭제하시겠습니까? 모든 레슨과 수강 데이터가 삭제됩니다.')) {
      return;
    }

    try {
      await courseService.deleteCourse(courseId);
      await fetchInstructorCourses(); // Refresh the list
    } catch (err) {
      console.error('Failed to delete course:', err);
      alert('강의 삭제에 실패했습니다');
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
          <Button variant="primary" onClick={fetchInstructorCourses}>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[--color-text-primary] mb-2">
              강사 대시보드
            </h1>
            <p className="text-[--color-text-secondary]">
              {courses.length}개의 강의를 관리하고 있습니다
            </p>
          </div>
          <Link to="/instructor/courses/create">
            <Button variant="primary" size="lg">
              + 새 강의 만들기
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Courses */}
          <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[--color-text-secondary] text-sm mb-1">전체 강의</p>
                <p className="text-3xl font-bold text-[--color-text-primary]">
                  {courses.length}
                </p>
              </div>
              <div className="text-[--color-primary] text-4xl">📚</div>
            </div>
          </div>

          {/* Total Students */}
          <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[--color-text-secondary] text-sm mb-1">전체 수강생</p>
                <p className="text-3xl font-bold text-[--color-text-primary]">
                  {Object.values(courseStats).reduce((sum, stat) => sum + stat.enrollmentCount, 0)}
                </p>
              </div>
              <div className="text-[--color-primary] text-4xl">👥</div>
            </div>
          </div>

          {/* Total Lectures */}
          <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[--color-text-secondary] text-sm mb-1">전체 레슨</p>
                <p className="text-3xl font-bold text-[--color-text-primary]">
                  {Object.values(courseStats).reduce((sum, stat) => sum + stat.lectureCount, 0)}
                </p>
              </div>
              <div className="text-[--color-primary] text-4xl">🎓</div>
            </div>
          </div>
        </div>

        {/* Courses List */}
        {courses.length === 0 ? (
          <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-12 text-center">
            <div className="text-[--color-text-disabled] text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-[--color-text-primary] mb-2">
              아직 강의가 없습니다
            </h3>
            <p className="text-[--color-text-secondary] mb-6">
              첫 번째 강의를 만들어보세요!
            </p>
            <Link to="/instructor/courses/create">
              <Button variant="primary" size="lg">
                강의 만들기
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[--color-text-primary] mb-4">
              내 강의 목록
            </h2>

            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-6 hover:border-[--color-primary] transition-colors"
              >
                <div className="flex gap-6">
                  {/* Thumbnail */}
                  <Link to={`/courses/${course.id}`} className="flex-shrink-0">
                    <div className="w-48 aspect-video bg-[--color-bg-dark] rounded-lg overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[--color-text-disabled] text-4xl">
                          📚
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <Link to={`/courses/${course.id}`}>
                          <h3 className="text-xl font-semibold text-[--color-text-primary] hover:text-[--color-primary] transition-colors mb-1">
                            {course.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-[--color-text-secondary]">
                          생성일: {formatDate(course.created_at)}
                        </p>
                      </div>

                      {/* Status badge */}
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

                    {/* Description */}
                    <p className="text-[--color-text-secondary] text-sm mb-4 line-clamp-2">
                      {course.description || '설명이 없습니다'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm text-[--color-text-secondary] mb-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span>{courseStats[course.id]?.enrollmentCount || 0}명 수강</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                        <span>{courseStats[course.id]?.lectureCount || 0}개 레슨</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <Link to={`/instructor/courses/${course.id}/lectures`}>
                        <Button variant="primary" size="sm">
                          레슨 관리
                        </Button>
                      </Link>
                      <Link to={`/instructor/courses/${course.id}/edit`}>
                        <Button variant="outline" size="sm">
                          수정
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCourse(course.id)}
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

export default InstructorDashboardPage;
