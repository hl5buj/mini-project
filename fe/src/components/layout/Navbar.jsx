import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[--color-bg-secondary] border-b border-[--color-border] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-[--color-primary] text-2xl font-bold">
              📚 Learning Platform
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated && (
              <>
                <Link
                  to="/"
                  className="text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors"
                >
                  홈
                </Link>
                <Link
                  to="/courses"
                  className="text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors"
                >
                  강의
                </Link>
                <Link
                  to="/my-courses"
                  className="text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors"
                >
                  내 강의
                </Link>
                <Link
                  to="/instructor/dashboard"
                  className="text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors"
                >
                  강사 대시보드
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <div className="flex items-center gap-2 hover:bg-[--color-bg-hover] px-3 py-2 rounded-md transition-colors">
                    {user?.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt={user.username}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[--color-primary] flex items-center justify-center text-white font-semibold">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-[--color-text-primary] hidden md:block">
                      {user?.username}
                    </span>
                  </div>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    로그인
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    회원가입
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
