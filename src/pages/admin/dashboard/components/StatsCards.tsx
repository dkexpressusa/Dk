import { Contact } from '../types';
import { getMonthlyStats } from '../utils';

interface StatsCardsProps {
  contacts: Contact[];
}

export default function StatsCards({ contacts }: StatsCardsProps) {
  const total = contacts.length;
  const unread = contacts.filter(c => c.status === 'unread').length;
  const read = contacts.filter(c => c.status === 'read').length;
  const readRate = total > 0 ? Math.round((read / total) * 100) : 0;
  const monthlyStats = getMonthlyStats(contacts);
  const maxCount = Math.max(...monthlyStats.map(m => m.count), 1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {/* 기본 통계 */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-bold text-gray-500">문의 현황</h3>
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <i className="ri-mail-line text-[#1E3A8A] text-xs sm:text-sm"></i>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-black text-gray-900">{total}</p>
            <p className="text-xs text-gray-400 mt-0.5">전체</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-black text-orange-500">{unread}</p>
            <p className="text-xs text-gray-400 mt-0.5">미확인</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-black text-emerald-500">{read}</p>
            <p className="text-xs text-gray-400 mt-0.5">확인완료</p>
          </div>
        </div>
      </div>

      {/* 처리율 */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-bold text-gray-500">처리율</h3>
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
            <i className="ri-pie-chart-line text-emerald-600 text-xs sm:text-sm"></i>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-14 h-14 sm:w-16 sm:h-16 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="#10b981" strokeWidth="3"
                strokeDasharray={`${readRate} ${100 - readRate}`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-black text-gray-900">
              {readRate}%
            </span>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-600">전체 문의 중</p>
            <p className="text-base sm:text-lg font-black text-emerald-600">{read}건</p>
            <p className="text-xs text-gray-400">확인 완료</p>
          </div>
        </div>
      </div>

      {/* 월별 차트 */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-bold text-gray-500">월별 문의 추이</h3>
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-50 rounded-lg flex items-center justify-center">
            <i className="ri-bar-chart-line text-orange-500 text-xs sm:text-sm"></i>
          </div>
        </div>
        {monthlyStats.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">데이터 없음</p>
        ) : (
          <div className="flex items-end gap-1.5 h-14">
            {monthlyStats.map(({ month, count }) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-gray-600">{count}</span>
                <div
                  className="w-full bg-[#1E3A8A] rounded-t-sm transition-all"
                  style={{ height: `${Math.max((count / maxCount) * 40, 4)}px` }}
                />
                <span className="text-[9px] text-gray-400 whitespace-nowrap">{month.slice(5)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
