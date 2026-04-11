import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import FeaturedSliderAdmin from './FeaturedSliderAdmin';

interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  service_type: string | null;
  is_private: boolean;
  reply: string | null;
  status: string;
  created_at: string;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <i key={i} className={`text-xs ${i <= rating ? 'ri-star-fill text-orange-400' : 'ri-star-line text-gray-300'}`}></i>
      ))}
    </div>
  );
}

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterService, setFilterService] = useState('전체');
  const [filterPrivate, setFilterPrivate] = useState<'all' | 'public' | 'private'>('all');
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [savingReply, setSavingReply] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setReviews(data as Review[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleSaveReply = async (id: string) => {
    setSavingReply(true);
    const { error } = await supabase.from('reviews').update({ reply: replyText.trim() || null }).eq('id', id);
    if (!error) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, reply: replyText.trim() || null } : r));
      setReplyingId(null);
      setReplyText('');
    }
    setSavingReply(false);
  };

  const handleDeleteReply = async (id: string) => {
    const { error } = await supabase.from('reviews').update({ reply: null }).eq('id', id);
    if (!error) setReviews(prev => prev.map(r => r.id === id ? { ...r, reply: null } : r));
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) {
      setReviews(prev => prev.filter(r => r.id !== id));
      setConfirmDeleteId(null);
    }
  };

  const services = ['전체', ...Array.from(new Set(reviews.filter(r => r.service_type).map(r => r.service_type as string)))];

  const filtered = reviews.filter(r => {
    const matchService = filterService === '전체' || r.service_type === filterService;
    const matchPrivate = filterPrivate === 'all' || (filterPrivate === 'private' ? r.is_private : !r.is_private);
    return matchService && matchPrivate;
  });

  const stats = {
    total: reviews.length,
    pub: reviews.filter(r => !r.is_private).length,
    priv: reviews.filter(r => r.is_private).length,
    replied: reviews.filter(r => r.reply).length,
  };

  return (
    <div>
      {/* 추천 후기 슬라이드 관리 */}
      <FeaturedSliderAdmin />

      {/* 통계 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: '전체 후기', value: stats.total, color: 'text-gray-900', bg: 'bg-white' },
          { label: '공개 후기', value: stats.pub, color: 'text-[#1E3A8A]', bg: 'bg-blue-50' },
          { label: '비공개 후기', value: stats.priv, color: 'text-gray-500', bg: 'bg-gray-50' },
          { label: '답변 완료', value: stats.replied, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-3 sm:p-4 border border-gray-100`}>
            <p className={`text-xl sm:text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 필터 */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 sm:justify-between">
          <h3 className="font-black text-gray-900 text-sm sm:text-base">후기 목록</h3>
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="flex-1 sm:flex-none border border-gray-200 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#1E3A8A] bg-white cursor-pointer"
            >
              {services.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={filterPrivate}
              onChange={(e) => setFilterPrivate(e.target.value as typeof filterPrivate)}
              className="flex-1 sm:flex-none border border-gray-200 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#1E3A8A] bg-white cursor-pointer"
            >
              <option value="all">전체</option>
              <option value="public">공개만</option>
              <option value="private">비공개만</option>
            </select>
            <button
              onClick={fetchReviews}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-refresh-line"></i>
              <span className="hidden sm:inline">새로고침</span>
            </button>
            <span className="text-xs text-gray-400">{filtered.length}개</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <i className="ri-loader-4-line text-3xl text-[#1E3A8A] animate-spin"></i>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <i className="ri-star-line text-4xl text-gray-300 mb-3"></i>
            <p className="text-gray-400 text-sm">후기가 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(r => (
              <div key={r.id} className={`p-5 ${r.is_private ? 'bg-gray-50/60' : ''}`}>
                {/* 헤더 */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                      {r.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900 text-sm">{r.name}</span>
                        {r.is_private && (
                          <span className="inline-flex items-center gap-1 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-semibold">
                            <i className="ri-lock-line text-xs"></i>비공개
                          </span>
                        )}
                        {r.reply && (
                          <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                            <i className="ri-reply-line text-xs"></i>답변완료
                          </span>
                        )}
                        {r.service_type && (
                          <span className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">{r.service_type}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={r.rating} />
                        <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                      className="px-2 sm:px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {expandedId === r.id ? '접기' : '펼치기'}
                    </button>
                    {!r.is_private && (
                      <button
                        onClick={() => {
                          setReplyingId(r.id);
                          setReplyText(r.reply || '');
                          setExpandedId(r.id);
                        }}
                        className="px-2 sm:px-3 py-1.5 text-xs bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1e40af] transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {r.reply ? '수정' : '답변'}
                      </button>
                    )}
                    {confirmDeleteId === r.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleDelete(r.id)} className="px-2 sm:px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg cursor-pointer whitespace-nowrap">확인</button>
                        <button onClick={() => setConfirmDeleteId(null)} className="px-2 sm:px-3 py-1.5 text-xs bg-gray-100 text-gray-500 rounded-lg cursor-pointer whitespace-nowrap">취소</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(r.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <i className="ri-delete-bin-line text-xs"></i>
                      </button>
                    )}
                  </div>
                </div>

                {/* 펼쳐진 내용 */}
                {expandedId === r.id && (
                  <div className="mt-4 space-y-3">
                    {/* 후기 내용 */}
                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                      {r.is_private ? (
                        <p className="text-sm text-gray-500 italic flex items-center gap-2">
                          <i className="ri-lock-line"></i>비공개 후기 — 관리자만 볼 수 있습니다
                        </p>
                      ) : null}
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{r.message}</p>
                    </div>

                    {/* 기존 답변 */}
                    {r.reply && replyingId !== r.id && (
                      <div className="bg-blue-50 rounded-xl px-4 py-3 border-l-4 border-[#1E3A8A]">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-bold text-[#1E3A8A] flex items-center gap-1">
                            <i className="ri-shield-user-line"></i>사장님 답변
                          </p>
                          <button
                            onClick={() => handleDeleteReply(r.id)}
                            className="text-xs text-red-400 hover:text-red-600 cursor-pointer"
                          >
                            답변 삭제
                          </button>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{r.reply}</p>
                      </div>
                    )}

                    {/* 답변 입력 */}
                    {replyingId === r.id && (
                      <div className="space-y-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={3}
                          placeholder="고객에게 보여질 답변을 입력하세요..."
                          className="w-full border border-[#1E3A8A] rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveReply(r.id)}
                            disabled={savingReply || !replyText.trim()}
                            className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#1e40af] disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                          >
                            {savingReply ? '저장 중...' : '답변 저장'}
                          </button>
                          <button
                            onClick={() => { setReplyingId(null); setReplyText(''); }}
                            className="px-4 py-2 bg-gray-100 text-gray-500 text-xs rounded-lg cursor-pointer whitespace-nowrap"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
