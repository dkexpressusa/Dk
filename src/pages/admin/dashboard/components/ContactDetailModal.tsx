import { useState, useEffect } from 'react';
import { Contact } from '../types';
import { formatDate, STATUS_LABELS } from '../utils';
import { supabase } from '@/lib/supabase';

interface ContactDetailModalProps {
  contact: Contact;
  onClose: () => void;
  onUpdate: (updated: Contact) => void;
  onDelete: (id: string) => void;
}

export default function ContactDetailModal({ contact, onClose, onUpdate, onDelete }: ContactDetailModalProps) {
  const [memoText, setMemoText] = useState(contact.admin_memo || '');
  const [savingMemo, setSavingMemo] = useState(false);
  const [deletingMemo, setDeletingMemo] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMemoText(contact.admin_memo || '');
  }, [contact]);

  const handleSaveMemo = async () => {
    setSavingMemo(true);
    const { error } = await supabase.from('contacts').update({ admin_memo: memoText }).eq('id', contact.id);
    if (!error) {
      onUpdate({ ...contact, admin_memo: memoText });
    }
    setSavingMemo(false);
  };

  const handleDeleteMemo = async () => {
    setDeletingMemo(true);
    const { error } = await supabase.from('contacts').update({ admin_memo: null }).eq('id', contact.id);
    if (!error) {
      setMemoText('');
      onUpdate({ ...contact, admin_memo: null });
    }
    setDeletingMemo(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase.from('contacts').delete().eq('id', contact.id);
    if (!error) {
      onDelete(contact.id);
      onClose();
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    const { error } = await supabase.from('contacts').update({ status: newStatus }).eq('id', contact.id);
    if (!error) {
      onUpdate({ ...contact, status: newStatus as Contact['status'] });
    }
  };

  const copyPhone = () => {
    if (contact.phone) {
      navigator.clipboard.writeText(contact.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-black text-gray-900">문의 상세</h3>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_LABELS[contact.status]?.color}`}>
              {STATUS_LABELS[contact.status]?.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-gray-500"></i>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">이름</p>
              <p className="font-semibold text-gray-900 text-sm">{contact.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">연락처</p>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900 text-sm">{contact.phone || '-'}</p>
                {contact.phone && (
                  <button
                    onClick={copyPhone}
                    className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                    title="복사"
                  >
                    <i className={`text-xs ${copied ? 'ri-check-line text-emerald-500' : 'ri-file-copy-line text-gray-400'}`}></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">이메일</p>
            <p className="font-semibold text-gray-900 text-sm">{contact.email}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">문의 유형</p>
            <p className="font-semibold text-gray-900 text-sm">{contact.type || '-'}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">문의 내용</p>
            <p className="text-gray-800 text-sm leading-relaxed bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">{contact.message}</p>
          </div>

          {/* 관리자 메모 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <i className="ri-sticky-note-line text-orange-400"></i>관리자 메모
              </p>
              {contact.admin_memo && (
                <button
                  onClick={handleDeleteMemo}
                  disabled={deletingMemo}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                >
                  메모 삭제
                </button>
              )}
            </div>
            <textarea
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
              rows={3}
              placeholder="내부 메모를 입력하세요..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A] resize-none"
            />
            <button
              onClick={handleSaveMemo}
              disabled={savingMemo}
              className="mt-2 px-4 py-2 bg-[#1E3A8A] hover:bg-[#1e40af] disabled:opacity-60 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              {savingMemo ? '저장 중...' : '메모 저장'}
            </button>
          </div>

          {/* 하단 */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-400 mb-1">접수일시</p>
              <p className="text-sm text-gray-600">{formatDate(contact.created_at)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">상태 변경</p>
              <select
                value={contact.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1E3A8A] bg-white cursor-pointer"
              >
                <option value="unread">미확인</option>
                <option value="read">확인완료</option>
              </select>
            </div>
          </div>

          {/* 삭제 */}
          <div className="pt-2">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full py-2.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-delete-bin-line mr-1.5"></i>이 문의 삭제
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
                >
                  정말 삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
