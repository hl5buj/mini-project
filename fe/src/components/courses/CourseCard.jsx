import { Link } from 'react-router-dom';
import { formatDuration, formatRelativeTime } from '../../utils/formatters';

const CourseCard = ({ course }) => {
  const {
    id,
    title,
    description,
    thumbnail,
    instructor,
    lectures_count,
    total_duration,
    created_at,
  } = course;

  // Default thumbnail if none provided
  const thumbnailUrl = thumbnail || 'https://via.placeholder.com/320x180?text=No+Thumbnail';

  return (
    <Link to={`/courses/${id}`} className="block group">
      <div className="bg-[--color-bg-secondary] rounded-lg overflow-hidden transition-all duration-200 hover:bg-[--color-bg-hover]">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-[--color-bg-dark]">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/320x180?text=No+Thumbnail';
            }}
          />
          {/* Duration badge */}
          {total_duration > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
              {formatDuration(total_duration)}
            </div>
          )}
        </div>

        {/* Course Info */}
        <div className="p-3">
          {/* Title */}
          <h3 className="text-[--color-text-primary] font-semibold text-sm line-clamp-2 mb-1 group-hover:text-[--color-primary] transition-colors">
            {title}
          </h3>

          {/* Instructor */}
          <p className="text-[--color-text-secondary] text-xs mb-1">
            {instructor?.username || '강사명 없음'}
          </p>

          {/* Description */}
          <p className="text-[--color-text-disabled] text-xs line-clamp-2 mb-2">
            {description}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-2 text-[--color-text-disabled] text-xs">
            <span>{lectures_count || 0}개 레슨</span>
            <span>•</span>
            <span>{formatRelativeTime(created_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
