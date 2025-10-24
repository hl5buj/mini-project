import { formatDuration, formatDate } from '../../utils/formatters';

const CourseInfo = ({ course }) => {
  const {
    title,
    description,
    instructor,
    lectures_count,
    total_duration,
    created_at,
    updated_at,
  } = course;

  return (
    <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-6">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-[--color-text-primary] mb-4">
        {title}
      </h1>

      {/* Instructor */}
      <div className="flex items-center gap-3 mb-4">
        {instructor?.profile_image ? (
          <img
            src={instructor.profile_image}
            alt={instructor.username}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[--color-primary] flex items-center justify-center text-white font-semibold">
            {instructor?.username?.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-[--color-text-primary] font-medium">
            {instructor?.username || '강사명 없음'}
          </p>
          <p className="text-[--color-text-secondary] text-sm">
            {instructor?.email}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-6 mb-6 text-sm">
        <div className="flex items-center gap-2 text-[--color-text-secondary]">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
          <span>{lectures_count || 0}개 레슨</span>
        </div>

        {total_duration > 0 && (
          <div className="flex items-center gap-2 text-[--color-text-secondary]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>총 {formatDuration(total_duration)}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-[--color-text-secondary]">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span>생성일: {formatDate(created_at)}</span>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-lg font-semibold text-[--color-text-primary] mb-2">
          강의 소개
        </h2>
        <p className="text-[--color-text-secondary] whitespace-pre-line leading-relaxed">
          {description || '강의 설명이 없습니다.'}
        </p>
      </div>

      {/* Instructor Bio */}
      {instructor?.bio && (
        <div className="mt-6 pt-6 border-t border-[--color-border]">
          <h2 className="text-lg font-semibold text-[--color-text-primary] mb-2">
            강사 소개
          </h2>
          <p className="text-[--color-text-secondary] whitespace-pre-line leading-relaxed">
            {instructor.bio}
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseInfo;
