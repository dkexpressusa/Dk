import { Contact } from '../types';
import { formatDate, STATUS_LABELS } from '../utils';

interface ContactTableProps {
  contacts: Contact[];
  loading: boolean;
  isEditMode: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onOpenDetail: (c: Contact) => void;
  onStatusChange: (id: string, status: string) => void;
  updatingId: string | null;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (p: number) => void;
}

export default function ContactTable({
  contacts,
  loading,
  isEditMode,
  selectedIds,
  onToggleSelect,
  onOpenDetail,
  onStatusChange,
  updatingId,
  page,
  pageSize,
  totalCount,
  onPageChange,
}: ContactTableProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <i className="ri-loader-4-line text-3xl text-[#1E3A8A] animate-spin"></i>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <i className="ri-inbox-line text-4xl text-gray-300 mb-3"></i>
        <p className="text-gray-400 text-sm">문의 내역이 없습니다</p>
      </div>
    );
  }

  return (
    <>
      {/* 모바일 카드 뷰 */}
      <div className="block sm:hidden divide-y divide-gray-100">
        {contacts.map((c) => (
          <div
            key={c.id}
            className={`p-4 transition-colors cursor-pointer ${c.status === 'unread' ? 'bg-orange-50/40' : 'hover:bg-gray-50/60'} ${selectedIds.has(c.id) ? 'bg-blue-50' : ''}`}
            onClick={() => isEditMode ? onToggleSelect(c.id) : onOpenDetail(c)}
          >
            <div className="flex items-start gap-3">
              {isEditMode && (
                <input
                  type="checkbox"
                  checked={selectedIds.has(c.id)}
                  onChange={() => onToggleSelect(c.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 rounded cursor-pointer accent-[#1E3A8A] mt-0.5 flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {c.status === 'unread' && (
                      <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></span>
                    )}
                    <span className={`text-sm font-bold text-gray-900 truncate ${c.status === 'unread' ? 'font-black' : ''}`}>
                      {c.name}
                    </span>
                    {c.admin_memo && (
                      <i className="ri-sticky-note-line text-orange-400 text-xs flex-shrink-0" title="메모 있음"></i>
                    )}
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${STATUS_LABELS[c.status]?.color}`}>
                    {STATUS_LABELS[c.status]?.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate mb-1">{c.message}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {c.phone && <span className="text-xs text-gray-400">{c.phone}</span>}
                  {c.type && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{c.type}</span>
                  )}
                  <span className="text-xs text-gray-300 ml-auto">{formatDate(c.created_at)}</span>
                </div>
                {!isEditMode && (
                  <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={c.status}
                      onChange={(e) => onStatusChange(c.id, e.target.value)}
                      disabled={updatingId === c.id}
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[#1E3A8A] bg-white cursor-pointer disabled:opacity-50"
                    >
                      <option value="unread">미확인</option>
                      <option value="read">확인완료</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 데스크탑 테이블 뷰 */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 font-semibold">
              {isEditMode && <th className="px-4 py-3 w-10"></th>}
              <th className="text-left px-5 py-3">이름</th>
              <th className="text-left px-5 py-3">연락처</th>
              <th className="text-left px-5 py-3">이메일</th>
              <th className="text-left px-5 py-3">문의 내용</th>
              <th className="text-left px-5 py-3">문의 유형</th>
              <th className="text-left px-5 py-3">접수일</th>
              <th className="text-left px-5 py-3">상태</th>
              {!isEditMode && <th className="text-left px-5 py-3">관리</th>}
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr
                key={c.id}
                className={`border-t border-gray-100 transition-colors cursor-pointer ${c.status === 'unread' ? 'bg-orange-50/40 font-semibold' : 'hover:bg-gray-50/60'} ${selectedIds.has(c.id) ? 'bg-blue-50' : ''}`}
                onClick={() => isEditMode ? onToggleSelect(c.id) : onOpenDetail(c)}
              >
                {isEditMode && (
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(c.id)}
                      onChange={() => onToggleSelect(c.id)}
                      className="w-4 h-4 rounded cursor-pointer accent-[#1E3A8A]"
                    />
                  </td>
                )}
                <td className="px-5 py-4 text-sm text-gray-900">
                  <div className="flex items-center gap-2">
                    {c.status === 'unread' && (
                      <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></span>
                    )}
                    {c.name}
                    {c.admin_memo && (
                      <i className="ri-sticky-note-line text-orange-400 text-xs" title="메모 있음"></i>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{c.phone || '-'}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{c.email}</td>
                <td className="px-5 py-4 text-sm text-gray-500 max-w-[200px]">
                  <span className="truncate block">{c.message}</span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{c.type || '-'}</td>
                <td className="px-5 py-4 text-sm text-gray-400 whitespace-nowrap">{formatDate(c.created_at)}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_LABELS[c.status]?.color}`}>
                    {STATUS_LABELS[c.status]?.label}
                  </span>
                </td>
                {!isEditMode && (
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={c.status}
                      onChange={(e) => onStatusChange(c.id, e.target.value)}
                      disabled={updatingId === c.id}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#1E3A8A] bg-white cursor-pointer disabled:opacity-50"
                    >
                      <option value="unread">미확인</option>
                      <option value="read">확인완료</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 py-4 border-t border-gray-100">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <i className="ri-arrow-left-s-line text-sm"></i>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer ${p === page ? 'bg-[#1E3A8A] text-white font-bold' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <i className="ri-arrow-right-s-line text-sm"></i>
          </button>
        </div>
      )}
    </>
  );
}
