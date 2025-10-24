import { Link } from 'react-router-dom';
import Button from '../common/Button';

const LectureNavigation = ({ courseId, prevLecture, nextLecture }) => {
  return (
    <div className="flex items-center justify-between gap-4 pt-6 border-t border-[--color-border]">
      {/* Previous Lecture */}
      {prevLecture ? (
        <Link
          to={`/courses/${courseId}/lectures/${prevLecture.id}`}
          className="flex-1"
        >
          <Button variant="outline" className="w-full justify-start">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="text-left">
                <div className="text-xs text-[--color-text-disabled]">이전 레슨</div>
                <div className="text-sm font-medium truncate max-w-[200px]">
                  {prevLecture.title}
                </div>
              </div>
            </div>
          </Button>
        </Link>
      ) : (
        <div className="flex-1">
          <Button variant="outline" disabled className="w-full">
            <span className="text-[--color-text-disabled]">이전 레슨 없음</span>
          </Button>
        </div>
      )}

      {/* Next Lecture */}
      {nextLecture ? (
        <Link
          to={`/courses/${courseId}/lectures/${nextLecture.id}`}
          className="flex-1"
        >
          <Button variant="primary" className="w-full justify-end">
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-xs opacity-80">다음 레슨</div>
                <div className="text-sm font-medium truncate max-w-[200px]">
                  {nextLecture.title}
                </div>
              </div>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Button>
        </Link>
      ) : (
        <div className="flex-1">
          <Button variant="outline" disabled className="w-full">
            <span className="text-[--color-text-disabled]">다음 레슨 없음</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default LectureNavigation;
