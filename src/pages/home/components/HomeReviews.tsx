import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/contexts/LanguageContext';

interface FeaturedReview {
  id: string;
  name: string;
  rating: number;
  message: string;
  service_type: string | null;
  sort_order: number;
}

const FALLBACK: FeaturedReview[] = [
  { id: 'f1', name: '김지현', rating: 5, message: '귀국 전에 짐 보냈는데 안전하게 잘 도착했어요. 포장도 꼼꼼하게 해주셔서 정말 감사했습니다.', service_type: '귀국 이사', sort_order: 1 },
  { id: 'f2', name: '박성민', rating: 5, message: '상담이 빨라서 바로 진행했습니다. 처음 이용했는데 너무 친절하게 안내해주셔서 걱정 없이 보낼 수 있었어요.', service_type: '한국 일반 택배', sort_order: 2 },
  { id: 'f3', name: '이수연', rating: 5, message: '유학 마치고 귀국할 때 짐이 많았는데 한 번에 다 처리해주셨어요. 가격도 합리적이고 서비스도 최고예요!', service_type: '귀국 이사', sort_order: 3 },
  { id: 'f4', name: '최준혁', rating: 4, message: '실시간 추적이 가능해서 부모님도 언제 도착하는지 알 수 있어서 좋아하세요. 믿음직한 서비스입니다.', service_type: '한국 일반 택배', sort_order: 4 },
  { id: 'f5', name: '정미래', rating: 5, message: '명절 선물 보낼 때마다 이용해요. 항상 제때 도착하고 물건도 안전하게 와서 매번 만족합니다.', service_type: '한국 일반 택배', sort_order: 5 },
  { id: 'f6', name: '한동훈', rating: 5, message: '처음엔 걱정했는데 직원분이 처음부터 끝까지 친절하게 안내해주셔서 너무 편했어요. 강력 추천합니다!', service_type: '귀국 이사', sort_order: 6 },
];

function StarRating({ rating, dark = false }: { rating: number; dark?: boolean }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <i key={i} className={`text-sm ${i <= rating ? 'ri-star-fill text-orange-400' : `ri-star-line ${dark ? 'text-white/30' : 'text-gray-300'}`}`}></i>
      ))}
    </div>
  );
}

function chunkReviews(arr: FeaturedReview[], size: number): FeaturedReview[][] {
  const result: FeaturedReview[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}

/* ── 데스크탑: 3개씩 페이지 슬라이드 ── */
function DesktopSlider({ reviews, t }: { reviews: FeaturedReview[]; t: (ko: string, en: string) => string }) {
  const pages = chunkReviews(reviews, 3);
  const pageCount = pages.length;
  const clonedPages = pageCount > 0 ? [pages[pageCount - 1], ...pages, pages[0]] : [];

  const [trackPage, setTrackPage] = useState(1);
  const [page, setPage] = useState(0);
  const [animated, setAnimated] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isJumping = useRef(false);

  useEffect(() => {
    if (pageCount > 0) { setTrackPage(1); setPage(0); }
  }, [pageCount]);

  const slideTo = useCallback((idx: number, withAnim = true) => {
    if (isJumping.current) return;
    setAnimated(withAnim);
    setTrackPage(idx);
    setPage(((idx - 1) % pageCount + pageCount) % pageCount);
  }, [pageCount]);

  const goNext = useCallback(() => slideTo(trackPage + 1), [trackPage, slideTo]);
  const goPrev = useCallback(() => slideTo(trackPage - 1), [trackPage, slideTo]);

  const handleTransitionEnd = useCallback(() => {
    if (pageCount === 0) return;
    if (trackPage >= pageCount + 1) {
      isJumping.current = true;
      setAnimated(false);
      setTrackPage(1); setPage(0);
      requestAnimationFrame(() => requestAnimationFrame(() => { isJumping.current = false; }));
    } else if (trackPage <= 0) {
      isJumping.current = true;
      setAnimated(false);
      setTrackPage(pageCount); setPage(pageCount - 1);
      requestAnimationFrame(() => requestAnimationFrame(() => { isJumping.current = false; }));
    }
  }, [trackPage, pageCount]);

  useEffect(() => {
    if (isHovered || pageCount === 0) return;
    timerRef.current = setInterval(goNext, 3500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isHovered, goNext, pageCount]);

  return (
    <>
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span className="inline-block text-orange-400 text-xs font-bold tracking-widest uppercase mb-3">Customer Reviews</span>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">{t('고객 후기', 'Customer Reviews')}</h2>
          <p className="text-white/60 text-sm">{t('실제 이용 고객들의 생생한 경험을 확인하세요', 'See what our real customers have to say')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={goPrev} className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer">
            <i className="ri-arrow-left-s-line text-lg"></i>
          </button>
          <div className="flex gap-1.5">
            {pages.map((_, i) => (
              <button key={i} onClick={() => slideTo(i + 1)}
                className={`rounded-full transition-all cursor-pointer ${i === page ? 'w-6 h-2 bg-orange-400' : 'w-2 h-2 bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
          <button onClick={goNext} className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer">
            <i className="ri-arrow-right-s-line text-lg"></i>
          </button>
        </div>
      </div>

      {/* 슬라이더 */}
      <div
        className="overflow-hidden mb-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(-${trackPage * 100}%)`,
            transition: animated ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            willChange: 'transform',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {clonedPages.map((group, gi) => (
            <div key={gi} className="flex gap-5 flex-shrink-0" style={{ width: '100%' }}>
              {group.map((r) => (
                <div
                  key={r.id}
                  className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 flex flex-col gap-4"
                  style={{ width: 'calc(33.333% - 14px)', flexShrink: 0 }}
                >
                  <div className="flex items-center justify-between">
                    <StarRating rating={r.rating} dark />
                    {r.service_type && (
                      <span className="text-xs text-white/50 bg-white/10 border border-white/10 px-2 py-0.5 rounded-full whitespace-nowrap">{r.service_type}</span>
                    )}
                  </div>
                  <p className="text-white/85 text-sm leading-relaxed flex-1 italic scrollbar-hide"
                    style={{ maxHeight: '4.5em', lineHeight: '1.5em', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    &ldquo;{r.message}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                    <div className="w-9 h-9 bg-orange-400 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">{r.name[0]}</div>
                    <span className="font-bold text-white text-sm">{r.name}</span>
                    <i className="ri-checkbox-circle-fill text-emerald-400 text-sm ml-auto"></i>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── 모바일: 1개씩 슬라이드 (무한루프) ── */
function MobileSlider({ reviews, t }: { reviews: FeaturedReview[]; t: (ko: string, en: string) => string }) {
  const total = reviews.length;
  // 무한루프: 앞뒤 1개씩 복제
  const cloned = total > 0 ? [reviews[total - 1], ...reviews, reviews[0]] : [];

  const [trackIndex, setTrackIndex] = useState(1);
  const [realIndex, setRealIndex] = useState(0);
  const [animated, setAnimated] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isJumping = useRef(false);

  useEffect(() => {
    if (total > 0) { setTrackIndex(1); setRealIndex(0); }
  }, [total]);

  const slideTo = useCallback((idx: number, withAnim = true) => {
    if (isJumping.current) return;
    setAnimated(withAnim);
    setTrackIndex(idx);
    setRealIndex(((idx - 1) % total + total) % total);
  }, [total]);

  const goNext = useCallback(() => slideTo(trackIndex + 1), [trackIndex, slideTo]);
  const goPrev = useCallback(() => slideTo(trackIndex - 1), [trackIndex, slideTo]);

  const handleTransitionEnd = useCallback(() => {
    if (total === 0) return;
    if (trackIndex >= total + 1) {
      isJumping.current = true;
      setAnimated(false);
      setTrackIndex(1); setRealIndex(0);
      requestAnimationFrame(() => requestAnimationFrame(() => { isJumping.current = false; }));
    } else if (trackIndex <= 0) {
      isJumping.current = true;
      setAnimated(false);
      setTrackIndex(total); setRealIndex(total - 1);
      requestAnimationFrame(() => requestAnimationFrame(() => { isJumping.current = false; }));
    }
  }, [trackIndex, total]);

  useEffect(() => {
    timerRef.current = setInterval(goNext, 3500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [goNext]);

  return (
    <>
      {/* 헤더 */}
      <div className="mb-8">
        <span className="inline-block text-orange-400 text-xs font-bold tracking-widest uppercase mb-3">Customer Reviews</span>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">{t('고객 후기', 'Customer Reviews')}</h2>
          <div className="flex items-center gap-2">
            <button onClick={goPrev} className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 bg-white/10 text-white cursor-pointer">
              <i className="ri-arrow-left-s-line"></i>
            </button>
            <span className="text-white/50 text-xs font-medium">{realIndex + 1} / {total}</span>
            <button onClick={goNext} className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 bg-white/10 text-white cursor-pointer">
              <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </div>
      </div>

      {/* 슬라이더 */}
      <div className="overflow-hidden mb-8">
        <div
          className="flex"
          style={{
            transform: `translateX(-${trackIndex * 100}%)`,
            transition: animated ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            willChange: 'transform',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {cloned.map((r, i) => (
            <div
              key={`${r.id}-m${i}`}
              className="w-full flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <StarRating rating={r.rating} dark />
                {r.service_type && (
                  <span className="text-xs text-white/50 bg-white/10 border border-white/10 px-2 py-0.5 rounded-full whitespace-nowrap">{r.service_type}</span>
                )}
              </div>
              <p className="text-white/85 text-sm leading-relaxed italic">
                &ldquo;{r.message}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <div className="w-9 h-9 bg-orange-400 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">{r.name[0]}</div>
                <span className="font-bold text-white text-sm">{r.name}</span>
                <i className="ri-checkbox-circle-fill text-emerald-400 text-sm ml-auto"></i>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 도트 인디케이터 */}
      <div className="flex justify-center gap-1.5 mb-8">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => slideTo(i + 1)}
            className={`rounded-full transition-all cursor-pointer ${i === realIndex ? 'w-5 h-2 bg-orange-400' : 'w-2 h-2 bg-white/30'}`}
          />
        ))}
      </div>
    </>
  );
}

/* ── 메인 컴포넌트 ── */
export default function HomeReviews() {
  const [reviews, setReviews] = useState<FeaturedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('featured_reviews')
          .select('*')
          .order('sort_order', { ascending: true });
        setReviews(data && data.length > 0 ? (data as FeaturedReview[]) : FALLBACK);
      } catch {
        setReviews(FALLBACK);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="py-20 md:py-28 bg-[#1E3A8A]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {loading ? (
          <div className="flex justify-center py-16">
            <i className="ri-loader-4-line text-3xl text-white/50 animate-spin"></i>
          </div>
        ) : (
          <>
            {/* 모바일: 1개씩 */}
            <div className="block md:hidden">
              <MobileSlider reviews={reviews} t={t} />
            </div>
            {/* 데스크탑: 3개씩 */}
            <div className="hidden md:block">
              <DesktopSlider reviews={reviews} t={t} />
            </div>
          </>
        )}

        <div className="text-center">
          <Link
            to="/reviews"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-full transition-colors cursor-pointer whitespace-nowrap text-sm"
          >
            <i className="ri-star-line"></i>
            {t('모든 후기 보기', 'View All Reviews')}
          </Link>
          <p className="text-white/40 text-xs mt-3">
            {t('후기 작성도 후기 페이지에서 하실 수 있어요', 'You can also write a review on the reviews page')}
          </p>
        </div>
      </div>
    </section>
  );
}
