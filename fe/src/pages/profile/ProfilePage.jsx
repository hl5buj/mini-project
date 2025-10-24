import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'

  // Profile form state
  const [profileData, setProfileData] = useState({
    email: user?.email || '',
    profile_image: user?.profile_image || '',
    bio: user?.bio || '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password form state
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password2: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileErrors({});

    const newErrors = {};

    if (!profileData.email) {
      newErrors.email = '이메일을 입력해주세요';
    }

    if (profileData.profile_image && !isValidUrl(profileData.profile_image)) {
      newErrors.profile_image = '올바른 URL 형식이 아닙니다';
    }

    if (Object.keys(newErrors).length > 0) {
      setProfileErrors(newErrors);
      return;
    }

    setIsUpdatingProfile(true);

    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setProfileSuccess('프로필이 성공적으로 업데이트되었습니다');
      } else {
        setProfileErrors({ general: result.error });
      }
    } catch (error) {
      setProfileErrors({ general: '프로필 업데이트 중 오류가 발생했습니다' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordErrors({});

    const newErrors = {};

    if (!passwordData.old_password) {
      newErrors.old_password = '현재 비밀번호를 입력해주세요';
    }

    if (!passwordData.new_password) {
      newErrors.new_password = '새 비밀번호를 입력해주세요';
    } else if (passwordData.new_password.length < 8) {
      newErrors.new_password = '비밀번호는 최소 8자 이상이어야 합니다';
    }

    if (!passwordData.new_password2) {
      newErrors.new_password2 = '비밀번호 확인을 입력해주세요';
    } else if (passwordData.new_password !== passwordData.new_password2) {
      newErrors.new_password2 = '비밀번호가 일치하지 않습니다';
    }

    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const result = await changePassword(passwordData);
      if (result.success) {
        setPasswordSuccess('비밀번호가 성공적으로 변경되었습니다');
        setPasswordData({
          old_password: '',
          new_password: '',
          new_password2: '',
        });
      } else {
        setPasswordErrors({ general: result.error });
      }
    } catch (error) {
      setPasswordErrors({ general: '비밀번호 변경 중 오류가 발생했습니다' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const isValidUrl = (string) => {
    if (!string) return true; // Empty is valid
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-[--color-bg-dark] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header with User Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[--color-text-primary] mb-4">
            프로필 설정
          </h1>

          {/* User Stats Card */}
          <div className="bg-[--color-bg-secondary] border border-[--color-border] rounded-lg p-6">
            <div className="flex items-center gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {profileData.profile_image || user?.profile_image ? (
                  <img
                    src={profileData.profile_image || user?.profile_image}
                    alt={user?.username}
                    className="w-24 h-24 rounded-full object-cover border-2 border-[--color-border]"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&size=96&background=ff0000&color=fff`;
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[--color-bg-dark] flex items-center justify-center border-2 border-[--color-border]">
                    <span className="text-3xl font-bold text-[--color-text-primary]">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[--color-text-primary] mb-1">
                  {user?.username}
                </h2>
                <p className="text-[--color-text-secondary] mb-3">
                  {user?.email}
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[--color-text-disabled]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[--color-text-secondary]">
                      가입일: {new Date(user?.created_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[--color-text-disabled]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    <span className="text-[--color-text-secondary]">
                      생성한 강의: {user?.courses_count || 0}개
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-[--color-border]">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-[--color-primary] border-b-2 border-[--color-primary]'
                : 'text-[--color-text-secondary] hover:text-[--color-text-primary]'
            }`}
          >
            프로필 정보
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'password'
                ? 'text-[--color-primary] border-b-2 border-[--color-primary]'
                : 'text-[--color-text-secondary] hover:text-[--color-text-primary]'
            }`}
          >
            비밀번호 변경
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-[--color-bg-secondary] rounded-lg p-8 border border-[--color-border]">
            <h2 className="text-xl font-semibold text-[--color-text-primary] mb-6">
              프로필 정보
            </h2>

            {profileSuccess && (
              <div className="mb-4 p-3 bg-green-900/20 border border-green-500 rounded-md">
                <p className="text-sm text-green-500">{profileSuccess}</p>
              </div>
            )}

            {profileErrors.general && (
              <div className="mb-4 p-3 bg-red-900/20 border border-[--color-primary] rounded-md">
                <p className="text-sm text-[--color-primary]">{profileErrors.general}</p>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">
                  사용자명
                </label>
                <div className="px-4 py-2.5 bg-[--color-bg-dark] border border-[--color-border] rounded-md text-[--color-text-secondary]">
                  {user?.username}
                </div>
                <p className="mt-1 text-sm text-[--color-text-disabled]">
                  사용자명은 변경할 수 없습니다
                </p>
              </div>

              <Input
                name="email"
                type="email"
                label="이메일"
                placeholder="이메일을 입력하세요"
                value={profileData.email}
                onChange={handleProfileChange}
                error={profileErrors.email}
                required
              />

              <div>
                <Input
                  name="profile_image"
                  type="url"
                  label="프로필 이미지 URL"
                  placeholder="https://example.com/profile.jpg"
                  value={profileData.profile_image}
                  onChange={handleProfileChange}
                  error={profileErrors.profile_image}
                />
                {profileData.profile_image && isValidUrl(profileData.profile_image) && (
                  <div className="mt-3">
                    <p className="text-sm text-[--color-text-secondary] mb-2">미리보기:</p>
                    <img
                      src={profileData.profile_image}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-[--color-border]"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[--color-text-primary] mb-1.5">
                  자기소개
                </label>
                <textarea
                  name="bio"
                  placeholder="자기소개를 입력하세요"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-2.5 bg-[--color-bg-dark] border border-[--color-border] rounded-md text-[--color-text-primary] placeholder-[--color-text-disabled] focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:border-transparent resize-none"
                />
                <p className="mt-1 text-sm text-[--color-text-disabled]">
                  {profileData.bio.length}/500
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={isUpdatingProfile}
                disabled={isUpdatingProfile}
              >
                프로필 저장
              </Button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-[--color-bg-secondary] rounded-lg p-8 border border-[--color-border]">
            <h2 className="text-xl font-semibold text-[--color-text-primary] mb-6">
              비밀번호 변경
            </h2>

            {passwordSuccess && (
              <div className="mb-4 p-3 bg-green-900/20 border border-green-500 rounded-md">
                <p className="text-sm text-green-500">{passwordSuccess}</p>
              </div>
            )}

            {passwordErrors.general && (
              <div className="mb-4 p-3 bg-red-900/20 border border-[--color-primary] rounded-md">
                <p className="text-sm text-[--color-primary]">{passwordErrors.general}</p>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <Input
                name="old_password"
                type="password"
                label="현재 비밀번호"
                placeholder="현재 비밀번호를 입력하세요"
                value={passwordData.old_password}
                onChange={handlePasswordChange}
                error={passwordErrors.old_password}
                required
                autoComplete="current-password"
              />

              <Input
                name="new_password"
                type="password"
                label="새 비밀번호"
                placeholder="8자 이상의 새 비밀번호를 입력하세요"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                error={passwordErrors.new_password}
                required
                autoComplete="new-password"
              />

              <Input
                name="new_password2"
                type="password"
                label="새 비밀번호 확인"
                placeholder="새 비밀번호를 다시 입력하세요"
                value={passwordData.new_password2}
                onChange={handlePasswordChange}
                error={passwordErrors.new_password2}
                required
                autoComplete="new-password"
              />

              <Button
                type="submit"
                variant="primary"
                loading={isUpdatingPassword}
                disabled={isUpdatingPassword}
              >
                비밀번호 변경
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
