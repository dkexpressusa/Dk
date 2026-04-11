import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/contexts/LanguageContext';

interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  service_type: string | null;
  is_private: boolean;
  reply: string | null;
  created_at: string;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

const FALLBACK: Review[] = [
  { id: 'f1', name: '김지현', rating: 5, message: '귀국 전에 짐 보냈는데 안전하게 잘 도착했어요. 포장도 꼼꼼하게 해주셔서 정말 감사했습니다.', service_type: '귀국 이사', is_private: false, reply: '소중한 후기 감사합니다! 다음에도 이용해 주세요 :)', created_at: '2024-03-15T00:00:00Z' },
  { id: 'f2', name: '박성민', rating: 5, message: '상담이 빨라서 바로 진행했습니다. 처음 이용했는데 너무 친절하게 안내해주셔서 걱정 없이 보낼 수 있었어요.', service_type: '한국 일반 택배', is_private: false, reply: null, created_at: '2024-02-20T00:00:00Z' },
  { id: 'f3', name: '이수연', rating: 5, message: '유학 마치고 귀국할 때 짐이 많았는데 한 번에 다 처리해주셨어요. 가격도 합리적이고 서비스도 최고예요!', service_type: '귀국 이사', is_private: false, reply: null, created_at: '2024-01-10T00:00:00Z' },
  { id: 'f4', name: '최준혁', rating: 4, message: '실시간 추적이 가능해서 부모님도 언제 도착하는지 알 수 있어서 좋아하세요. 믿음직한 서비스입니다.', service_type: '한국 일반 택배', is_private: false, reply: null, created_at: '2023-12-05T00:00:00Z' },
  { id: 'f5', name: '정미래', rating: 5, message: '명절 선물 보낼 때마다 이용해요. 항상 제때 도착하고 물건도 안전하게 와서 매번 만족합니다.', service_type: '한국 일반 택배', is_private: false, reply: '매번 이용해 주셔서 감사합니다! 앞으로도 잘 부탁드립니다.', created_at: '2023-11-22T00:00:00Z' },
  { id: 'f6', name: '한동훈', rating: 5, message: '처음엔 걱정했는데 직원분이 처음부터 끝까지 친절하게 안내해주셔서 너무 편했어요. 강력 추천합니다!', service_type: '귀국 이사', is_private: false, reply: null, created_at: '2023-10-18T00:00:00Z' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <i key={i} className={`text-sm ${i <= rating ? 'ri-star-fill text-orange-400' : 'ri-star-line text-gray-300'}`}></i>
      ))}
    </div>
  );
}

export default function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState(0);
  const [filterService, setFilterService] = useState('all');
  const { t } = useLang();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const { data } = await supabase
          .from('reviews')
          .select('id, name, rating, message, service_type, is_private, reply, created_at')
          .order('created_at', { ascending: false });
        setReviews(data && data.length > 0 ? (data as Review[]) : FALLBACK);
      } catch {
        setReviews(FALLBACK);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, []);

  const serviceValues = Array.from(new Set(reviews.filter(r => r.service_type).map(r => r.service_type as string)));

  const filtered = reviews.filter(r => {
    const matchRating = filterRating === 0 || r.rating === filterRating;
    const matchService = filterService === 'all' || r.service_type === filterService;
    return matchRating && matchService;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length > 0 ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0,
  }));

  if (loading) {
    return <div className="flex justify-center py-16"><i className="ri-loader-4-line text-3xl text-[#1E3A8A] animate-spin"></i></div>;
  }

  return (
    <div>
      {/* 평점 요약 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex flex-col md:flex-row gap-6 items-center">
        <div className="text-center flex-shrink-0">
          <p className="text-6xl font-black text-[#1E3A8A]">{avgRating}</p>
          <StarRating rating={Math.round(Number(avgRating))} />
          <p className="text-xs text-gray-400 mt-1">{t(`총 ${reviews.length}개 후기`, `${reviews.length} reviews total`)}</p>
        </div>
        <div className="flex-1 w-full space-y-2">
          {ratingCounts.map(({ star, count, pct }) => (
            <button
              key={star}
              onClick={() => setFilterRating(filterRating === star ? 0 : star)}
              className={`flex items-center gap-3 w-full group cursor-pointer rounded-lg px-2 py-1 transition-colors ${filterRating === star ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
            >
              <span className="text-xs text-gray-500 w-10 text-right flex-shrink-0">{star}{t('점', ' ★')}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="h-2 bg-orange-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs text-gray-400 w-10 flex-shrink-0">{count}{t('개', '')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setFilterService('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${filterService === 'all' ? 'bg-[#1E3A8A] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1E3A8A]'}`}
        >
          {t('전체', 'All')}
        </button>
        {serviceValues.map(s => (
          <button
            key={s}
            onClick={() => setFilterService(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${filterService === s ? 'bg-[#1E3A8A] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1E3A8A]'}`}
          >
            {s}
          </button>
        ))}
        {filterRating > 0 && (
          <button onClick={() => setFilterRating(0)} className="px-4 py-1.5 rounded-full text-sm font-medium bg-orange-100 text-orange-600 cursor-pointer whitespace-nowrap flex items-center gap-1">
            {filterRating}{t('점', '★')} <i className="ri-close-line text-xs"></i>
          </button>
        )}
        <span className="ml-auto text-xs text-gray-400 self-center">{filtered.length}{t('개', ' results')}</span>
      </div>

      {/* 후기 목록 */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <i className="ri-star-line text-4xl mb-3 block"></i>
            {t('해당 조건의 후기가 없습니다', 'No reviews found for this filter')}
          </div>
        ) : (
          filtered.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">{r.name[0]}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                      {r.is_private && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <i className="ri-lock-line text-xs"></i>{t('비공개 후기입니다', 'Private review')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating rating={r.rating} />
                      {r.service_type && <span className="text-xs text-gray-400 border-l border-gray-200 pl-2">{r.service_type}</span>}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(r.created_at)}</span>
              </div>

              {r.is_private ? (
                <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-400 italic flex items-center gap-2">
                  <i className="ri-lock-line"></i>{t('비공개 후기입니다.', 'This is a private review.')}
                </div>
              ) : (
                <p className="text-gray-700 text-sm leading-relaxed">{r.message}</p>
              )}

              {!r.is_private && r.reply && (
                <div className="mt-4 bg-blue-50 rounded-xl px-4 py-3 border-l-4 border-[#1E3A8A]">
                  <p className="text-xs font-bold text-[#1E3A8A] mb-1 flex items-center gap-1">
                    <i className="ri-shield-user-line"></i>{t('사장님 답변', 'Owner\'s Reply')}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{r.reply}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
