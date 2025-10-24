import VideoPlayer from './VideoPlayer';

const LectureContent = ({ lecture, onVideoTimeUpdate, onVideoEnded }) => {
  const { content_type, content_text, video_url, media_file } = lecture;

  // Render based on content type
  switch (content_type) {
    case 'video':
      // Video from uploaded media file or external URL
      const videoSrc = media_file
        ? `http://localhost:8000/api/media/${media_file}/stream/`
        : video_url;

      if (!videoSrc) {
        return (
          <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-12 text-center">
            <div className="text-[--color-text-disabled] text-5xl mb-4">📹</div>
            <p className="text-[--color-text-secondary]">비디오를 찾을 수 없습니다</p>
          </div>
        );
      }

      return (
        <VideoPlayer
          videoUrl={videoSrc}
          onTimeUpdate={onVideoTimeUpdate}
          onEnded={onVideoEnded}
        />
      );

    case 'text':
      return (
        <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-8">
          <div className="prose prose-invert max-w-none">
            <div className="text-[--color-text-primary] whitespace-pre-wrap leading-relaxed">
              {content_text || '텍스트 내용이 없습니다.'}
            </div>
          </div>
        </div>
      );

    case 'link':
      return (
        <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-[--color-primary] text-5xl">🔗</div>
            <h3 className="text-xl font-semibold text-[--color-text-primary]">
              외부 링크
            </h3>
            {video_url ? (
              <>
                <p className="text-[--color-text-secondary] mb-4">
                  아래 링크를 클릭하여 콘텐츠를 확인하세요
                </p>
                <a
                  href={video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[--color-primary] hover:bg-[--color-primary-dark] text-white rounded-md font-medium transition-colors"
                >
                  <span>링크 열기</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
                <p className="text-sm text-[--color-text-disabled] break-all max-w-2xl">
                  {video_url}
                </p>
              </>
            ) : (
              <p className="text-[--color-text-secondary]">링크가 설정되지 않았습니다</p>
            )}
          </div>
        </div>
      );

    case 'file':
      return (
        <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-[--color-primary] text-5xl">📎</div>
            <h3 className="text-xl font-semibold text-[--color-text-primary]">
              첨부 파일
            </h3>
            {media_file ? (
              <>
                <p className="text-[--color-text-secondary] mb-4">
                  첨부된 파일을 다운로드하여 확인하세요
                </p>
                <a
                  href={`http://localhost:8000/api/media/${media_file}/`}
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[--color-primary] hover:bg-[--color-primary-dark] text-white rounded-md font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>파일 다운로드</span>
                </a>
              </>
            ) : (
              <p className="text-[--color-text-secondary]">첨부 파일이 없습니다</p>
            )}
          </div>
        </div>
      );

    default:
      return (
        <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-12 text-center">
          <div className="text-[--color-text-disabled] text-5xl mb-4">❓</div>
          <p className="text-[--color-text-secondary]">
            지원하지 않는 콘텐츠 타입입니다
          </p>
        </div>
      );
  }
};

export default LectureContent;
