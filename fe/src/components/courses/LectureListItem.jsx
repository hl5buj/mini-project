import { Link } from 'react-router-dom';
import { formatDuration } from '../../utils/formatters';

const LectureListItem = ({ lecture, courseId, isActive = false, isCompleted = false }) => {
  const { id, title, content_type, order, duration } = lecture;

  // Icon based on content type
  const getContentIcon = () => {
    switch (content_type) {
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

  return (
    <Link
      to={`/courses/${courseId}/lectures/${id}`}
      className={`block group ${
        isActive ? 'bg-[--color-bg-hover]' : 'hover:bg-[--color-bg-hover]'
      } transition-colors`}
    >
      <div className="flex items-center gap-3 p-3 border-b border-[--color-border]">
        {/* Order number */}
        <div className="flex-shrink-0 w-8 text-center">
          <span className="text-[--color-text-secondary] text-sm font-medium">
            {order || '?'}
          </span>
        </div>

        {/* Content type icon */}
        <div
          className={`flex-shrink-0 ${
            isActive ? 'text-[--color-primary]' : 'text-[--color-text-secondary]'
          } group-hover:text-[--color-primary] transition-colors`}
        >
          {getContentIcon()}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-medium truncate ${
              isActive
                ? 'text-[--color-primary]'
                : 'text-[--color-text-primary] group-hover:text-[--color-primary]'
            } transition-colors`}
          >
            {title}
          </h4>
        </div>

        {/* Duration */}
        {duration > 0 && (
          <div className="flex-shrink-0 text-[--color-text-secondary] text-xs">
            {formatDuration(duration)}
          </div>
        )}

        {/* Completion indicator */}
        {isCompleted && (
          <div className="flex-shrink-0 text-[--color-primary]" title="완료">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </Link>
  );
};

export default LectureListItem;
