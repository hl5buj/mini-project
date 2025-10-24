import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[--color-bg-dark]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[--color-text-primary] mb-4">
            Learning Platform에 오신 것을 환영합니다
          </h1>
          <p className="text-xl text-[--color-text-secondary]">
            안녕하세요, <span className="text-[--color-primary]">{user?.username}</span>님!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 강의 목록 카드 */}
          <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-6 hover:border-[--color-primary] transition-colors">
            <div className="text-[--color-primary] text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-[--color-text-primary] mb-2">
              강의 둘러보기
            </h3>
            <p className="text-[--color-text-secondary] mb-4">
              다양한 강의를 찾아보고 학습을 시작하세요
            </p>
            <Link
              to="/courses"
              className="inline-block text-[--color-primary] hover:underline"
            >
              강의 보러 가기 →
            </Link>
          </div>

          {/* 내 강의 카드 */}
          <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-6 hover:border-[--color-primary] transition-colors">
            <div className="text-[--color-primary] text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold text-[--color-text-primary] mb-2">
              내 강의
            </h3>
            <p className="text-[--color-text-secondary] mb-4">
              수강 중인 강의와 학습 진도를 확인하세요
            </p>
            <Link
              to="/my-courses"
              className="inline-block text-[--color-primary] hover:underline"
            >
              내 강의 보기 →
            </Link>
          </div>

          {/* 프로필 카드 */}
          <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-6 hover:border-[--color-primary] transition-colors">
            <div className="text-[--color-primary] text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-[--color-text-primary] mb-2">
              프로필
            </h3>
            <p className="text-[--color-text-secondary] mb-4">
              프로필 정보를 확인하고 설정을 변경하세요
            </p>
            <Link
              to="/profile"
              className="inline-block text-[--color-primary] hover:underline"
            >
              프로필 보기 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
