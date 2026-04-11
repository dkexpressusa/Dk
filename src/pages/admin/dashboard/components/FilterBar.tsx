import { useState, useRef, useEffect } from 'react';
import { FilterState } from '../types';
import { TYPE_OPTIONS } from '../utils';

interface FilterBarProps {
  filter: FilterState;
  onFilterChange: (f: Partial<FilterState>) => void;
  selectedIds: Set<string>;
  onBulkDelete: () => void;
  onExportCSV: () => void;
  onSelectAll: () => void;
  totalFiltered: number;
  isEditMode: boolean;
  onToggleEditMode: () => void;
}

export default function FilterBar({
  filter,
  onFilterChange,
  selectedIds,
  onBulkDelete,
  onExportCSV,
  onSelectAll,
  totalFiltered,
  isEditMode,
  onToggleEditMode,
}: FilterBarProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const toggleDate = (dateStr: string) => {
    const newDates = filter.dates.includes(dateStr)
      ? filter.dates.filter(d => d !== dateStr)
      : [...filter.dates, dateStr];
    onFilterChange({ dates: newDates });
  };

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  return (
    <div className="p-3 sm:p-4 border-b border-gray-100 space-y-2 sm:space-y-3">
      {/* 검색 + 필터 */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        {/* 검색 */}
        <div className="relative flex-1 sm:flex-none">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            value={filter.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="이름 / 연락처 / 내용 검색"
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1E3A8A] w-full sm:w-52"
          />
        </div>

        {/* 필터 셀렉트들 */}
        <div className="flex gap-2 flex-wrap">
          <select
            value={filter.status}
            onChange={(e) => onFilterChange({ status: e.target.value as FilterState['status'] })}
            className="flex-1 sm:flex-none border border-gray-200 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#1E3A8A] bg-white cursor-pointer"
          >
            <option value="all">전체 상태</option>
            <option value="unread">미확인</option>
            <option value="read">확인완료</option>
          </select>

          <select
            value={filter.type}
            onChange={(e) => onFilterChange({ type: e.target.value })}
            className="flex-1 sm:flex-none border border-gray-200 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#1E3A8A] bg-white cursor-pointer"
          >
            {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          {/* 날짜 필터 */}
          <div className="relative" ref={datePickerRef}>
            <button
              onClick={() => setShowDatePicker(v => !v)}
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-2 border rounded-lg text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap ${filter.dates.length > 0 ? 'border-[#1E3A8A] bg-blue-50 text-[#1E3A8A]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
              <i className="ri-calendar-line"></i>
              {filter.dates.length > 0 ? `${filter.dates.length}일` : '날짜'}
            </button>

            {showDatePicker && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl p-4 z-30 w-64 sm:w-72">
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => setCalendarDate(new Date(year, month - 1, 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <i className="ri-arrow-left-s-line text-gray-600"></i>
                  </button>
                  <span className="text-sm font-bold text-gray-800">{year}년 {month + 1}월</span>
                  <button
                    onClick={() => setCalendarDate(new Date(year, month + 1, 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <i className="ri-arrow-right-s-line text-gray-600"></i>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-0.5 mb-1">
                  {['일', '월', '화', '수', '목', '금', '토'].map(d => (
                    <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5">
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isSelected = filter.dates.includes(dateStr);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDate(dateStr)}
                        className={`text-xs py-1.5 rounded-lg transition-colors cursor-pointer ${isSelected ? 'bg-[#1E3A8A] text-white font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                {filter.dates.length > 0 && (
                  <button
                    onClick={() => onFilterChange({ dates: [] })}
                    className="mt-3 w-full text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    날짜 필터 초기화
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 우측 버튼들 */}
      <div className="flex items-center gap-2 flex-wrap">
        {isEditMode && selectedIds.size > 0 && (
          <>
            <button
              onClick={onSelectAll}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-checkbox-multiple-line"></i>
              <span className="hidden sm:inline">전체 선택</span>
              <span className="inline sm:hidden">전체</span>
            </button>
            <button
              onClick={onBulkDelete}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-delete-bin-line"></i>{selectedIds.size}건 삭제
            </button>
          </>
        )}
        <button
          onClick={onToggleEditMode}
          className={`flex items-center gap-1.5 px-2 sm:px-3 py-2 border rounded-lg text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap ${isEditMode ? 'border-[#1E3A8A] bg-blue-50 text-[#1E3A8A]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          <i className={isEditMode ? 'ri-close-line' : 'ri-edit-line'}></i>
          <span className="hidden sm:inline">{isEditMode ? '편집 종료' : '편집 모드'}</span>
          <span className="inline sm:hidden">{isEditMode ? '종료' : '편집'}</span>
        </button>
        <button
          onClick={onExportCSV}
          className="flex items-center gap-1.5 px-2 sm:px-3 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-download-line"></i>
          <span className="hidden sm:inline">CSV 내보내기</span>
          <span className="inline sm:hidden">CSV</span>
        </button>
        <span className="text-xs text-gray-400 whitespace-nowrap ml-auto">{totalFiltered}건</span>
      </div>
    </div>
  );
}
