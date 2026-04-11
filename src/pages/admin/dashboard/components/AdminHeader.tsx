import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface AdminHeaderProps {
  unreadCount: number;
}

export default function AdminHeader({ unreadCount }: AdminHeaderProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin', { replace: true });
  };

  return (
    <>
      {unreadCount > 0 && (
        <div className="bg-orange-500 text-white text-xs sm:text-sm px-4 py-2 flex items-center justify-center gap-2">
          <i className="ri-notification-3-fill animate-pulse"></i>
          <span>미확인 문의 <strong>{unreadCount}건</strong></span>
        </div>
      )}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1E3A8A] rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="ri-shield-user-line text-white text-xs sm:text-sm"></i>
          </div>
          <span className="font-black text-[#1E3A8A] text-sm sm:text-lg">
            <span className="hidden sm:inline">DKEXPRESS </span>관리자
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="/"
            className="text-xs sm:text-sm text-gray-500 hover:text-[#1E3A8A] transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap"
          >
            <i className="ri-home-line"></i>
            <span className="hidden sm:inline">홈으로</span>
          </a>
          <button
            onClick={handleLogout}
            className="text-xs sm:text-sm text-gray-500 hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap"
          >
            <i className="ri-logout-box-line"></i>
            <span className="hidden sm:inline">로그아웃</span>
          </button>
        </div>
      </header>
    </>
  );
}
