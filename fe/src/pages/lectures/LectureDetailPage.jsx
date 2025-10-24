import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { lectureService } from '../../services/lectureService';
import { progressService } from '../../services/progressService';
import LectureContent from '../../components/lectures/LectureContent';
import LectureNavigation from '../../components/lectures/LectureNavigation';
import LectureListItem from '../../components/courses/LectureListItem';
import CommentList from '../../components/comments/CommentList';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';

const LectureDetailPage = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState(null);
  const [allLectures, setAllLectures] = useState([]);
  const [prevLecture, setPrevLecture] = useState(null);
  const [nextLecture, setNextLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progressMap, setProgressMap] = useState({});

  // Debounce timer for video progress
  const progressTimerRef = useRef(null);

  useEffect(() => {
    fetchLectureDetail();
    fetchAllLectures();
  }, [lectureId]);

  const fetchLectureDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch lecture data and progress in parallel
      const [lectureData, progressData] = await Promise.all([
        lectureService.getLecture(lectureId),
        progressService.getLectureProgress(lectureId),
      ]);

      setLecture(lectureData);
      setIsCompleted(progressData?.completed || false);
    } catch (err) {
      console.error('Failed to fetch lecture:', err);
      setError('레슨을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLectures = async () => {
    try {
      // Fetch lectures and course progress in parallel
      const [lecturesData, progressList] = await Promise.all([
        lectureService.getLectures({
          course: courseId,
          ordering: 'order',
        }),
        progressService.getCourseProgress(courseId),
      ]);

      const lectures = lecturesData.results || [];
      setAllLectures(lectures);

      // Build progress map (lectureId -> isCompleted)
      const progressMapping = {};
      progressList.forEach((progress) => {
        progressMapping[progress.lecture] = progress.completed;
      });
      setProgressMap(progressMapping);

      // Find current lecture index
      const currentIndex = lectures.findIndex(
        (l) => l.id === parseInt(lectureId)
      );

      if (currentIndex !== -1) {
        setPrevLecture(currentIndex > 0 ? lectures[currentIndex - 1] : null);
        setNextLecture(
          currentIndex < lectures.length - 1 ? lectures[currentIndex + 1] : null
        );
      }
    } catch (err) {
      console.error('Failed to fetch lectures:', err);
    }
  };

  const handleVideoTimeUpdate = (currentTime, duration) => {
    if (!duration || duration === 0) return;

    const progressPercentage = (currentTime / duration) * 100;

    // Debounce progress updates (save every 5 seconds)
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
    }

    progressTimerRef.current = setTimeout(async () => {
      try {
        await progressService.updateVideoProgress(lectureId, progressPercentage);

        // Update completed state if reached 90%
        if (progressPercentage >= 90 && !isCompleted) {
          setIsCompleted(true);
        }
      } catch (err) {
        console.error('Failed to save progress:', err);
      }
    }, 5000);
  };

  const handleVideoEnded = async () => {
    try {
      // Mark as completed
      await progressService.markAsCompleted(lectureId);
      setIsCompleted(true);

      // Auto-navigate to next lecture if available
      if (nextLecture) {
        setTimeout(() => {
          if (window.confirm('다음 레슨으로 이동하시겠습니까?')) {
            navigate(`/courses/${courseId}/lectures/${nextLecture.id}`);
          }
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to mark as completed:', err);
    }
  };

  const handleMarkAsCompleted = async () => {
    try {
      await progressService.markAsCompleted(lectureId);
      setIsCompleted(true);
    } catch (err) {
      console.error('Failed to mark as completed:', err);
      alert('완료 표시에 실패했습니다');
    }
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current);
      }
    };
  }, []);

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
          <p className="text-[--color-text-secondary]">레슨을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !lecture) {
    return (
      <div className="min-h-screen bg-[--color-bg-dark] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[--color-primary] text-5xl mb-4">⚠️</div>
          <p className="text-[--color-text-primary] text-lg mb-4">
            {error || '레슨을 찾을 수 없습니다'}
          </p>
          <Link to={`/courses/${courseId}`}>
            <Button variant="primary">강의로 돌아가기</Button>
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
          to={`/courses/${courseId}`}
          className="inline-flex items-center gap-2 text-[--color-text-secondary] hover:text-[--color-text-primary] mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>강의로 돌아가기</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lecture content */}
            <LectureContent
              lecture={lecture}
              onVideoTimeUpdate={handleVideoTimeUpdate}
              onVideoEnded={handleVideoEnded}
            />

            {/* Lecture info */}
            <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-6">
              <h1 className="text-2xl font-bold text-[--color-text-primary] mb-4">
                {lecture.title}
              </h1>

              {/* Course info */}
              {lecture.course && (
                <div className="mb-4 pb-4 border-b border-[--color-border]">
                  <Link
                    to={`/courses/${courseId}`}
                    className="text-[--color-primary] hover:underline"
                  >
                    {lecture.course.title}
                  </Link>
                </div>
              )}

              {/* Meta info */}
              <div className="flex flex-wrap gap-4 text-sm text-[--color-text-secondary] mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>{formatDate(lecture.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  <span>순서: {lecture.order || '?'}</span>
                </div>
              </div>

              {/* Completion status */}
              <div className="mb-4 pb-4 border-b border-[--color-border]">
                {isCompleted ? (
                  <div className="flex items-center gap-2 text-[--color-primary]">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">완료한 레슨입니다</span>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAsCompleted}
                  >
                    완료 표시
                  </Button>
                )}
              </div>

              {/* Text content if available */}
              {lecture.content_text && lecture.content_type !== 'text' && (
                <div className="mt-4 p-4 bg-[--color-bg-dark] rounded-md">
                  <p className="text-[--color-text-secondary] whitespace-pre-wrap">
                    {lecture.content_text}
                  </p>
                </div>
              )}

              {/* Navigation */}
              <LectureNavigation
                courseId={courseId}
                prevLecture={prevLecture}
                nextLecture={nextLecture}
              />
            </div>

            {/* Comments section */}
            <CommentList lectureId={lectureId} />
          </div>

          {/* Sidebar - Lecture playlist */}
          <div className="lg:col-span-1">
            <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg overflow-hidden sticky top-20">
              <div className="p-4 border-b border-[--color-border]">
                <h2 className="text-lg font-semibold text-[--color-text-primary]">
                  재생목록
                </h2>
                <p className="text-sm text-[--color-text-secondary] mt-1">
                  {allLectures.length}개 레슨
                </p>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {allLectures.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-[--color-text-secondary]">레슨 목록이 없습니다</p>
                  </div>
                ) : (
                  allLectures.map((lec) => (
                    <LectureListItem
                      key={lec.id}
                      lecture={lec}
                      courseId={courseId}
                      isActive={lec.id === parseInt(lectureId)}
                      isCompleted={progressMap[lec.id] || false}
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

export default LectureDetailPage;
