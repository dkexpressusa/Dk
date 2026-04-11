import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface FeaturedReview {
  id: string;
  name: string;
  rating: number;
  message: string;
  service_type: string | null;
  sort_order: number;
}

const FALLBACK: FeaturedReview[] = [
  { id: 'f1', name: '김지현', rating: 5, message: '귀국 전에 짐 보냈는데 안전하게 잘 도착했어요. 포장도 꼼꼼하게 해주셔서 정말 감사했습니다. 다음에도 꼭 이용할게요!', service_type: '귀국 이사', sort_order: 1 },
  { id: 'f2', name: '박성민', rating: 5, message: '상담이 빨라서 바로 진행했습니다. 처음 이용했는데 너무 친절하게 안내해주셔서 걱정 없이 보낼 수 있었어요.', service_type: '한국 일반 택배', sort_order: 2 },
  { id: 'f3', name: '이수연', rating: 5, message: '유학 마치고 귀국할 때 짐이 많았는데 한 번에 다 처리해주셨어요. 가격도 합리적이고 서비스도 최고예요!', service_type: '귀국 이사', sort_order: 3 },
  { id: 'f4', name: '최준혁', rating: 4, message: '실시간 추적이 가능해서 부모님도 언제 도착하는지 알 수 있어서 좋아하세요. 믿음직한 서비스입니다.', service_type: '한국 일반 택배', sort_order: 4 },
  { id: 'f5', name: '정미래', rating: 5, message: '명절 선물 보낼 때마다 이용해요. 항상 제때 도착하고 물건도 안전하게 와서 매번 만족합니다.', service_type: '한국 일반 택배', sort_order: 5 },
  { id: 'f6', name: '한동훈', rating: 5, message: '처음엔 걱정했는데 직원분이 처음부터 끝까지 친절하게 안내해주셔서 너무 편했어요. 강력 추천합니다!', service_type: '귀국 이사', sort_order: 6 },
  { id: 'f7', name: '오세진', rating: 5, message: '뉴질랜드에서 한국으로 이사할 때 이용했는데 파손 없이 완벽하게 도착했어요. 정말 믿을 수 있는 업체입니다.', service_type: '귀국 이사', sort_order: 7 },
  { id: 'f8', name: '윤하나', rating: 4, message: '카카오톡으로 상담하니까 너무 편하더라고요. 빠른 답변에 친절한 설명까지 완벽했습니다.', service_type: '한국 일반 택배', sort_order: 8 },
  { id: 'f9', name: '강민준', rating: 5, message: '부모님께 생일 선물 보냈는데 예상보다 빨리 도착해서 깜짝 놀랐어요. 앞으로도 계속 이용할게요.', service_type: '한국 일반 택배', sort_order: 9 },
  { id: 'f10', name: '임소영', rating: 5, message: '10년 넘게 이용하고 있어요. 한 번도 실망한 적 없고 항상 안전하게 배송해주셔서 정말 감사합니다.', service_type: '귀국 이사', sort_order: 10 },
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

/* ── 데스크탑: 3개씩 무한 루프 트랙 슬라이딩 ── */
function DesktopSlider({ reviews }: { reviews: FeaturedReview[] }) {
  const VISIBLE = 3;
  const GAP = 16;
  const total = reviews.length;

  // 무한 루프: 앞뒤로 cloneCount개 복사
  const cloneCount = VISIBLE;
  const cloned = [
    ...reviews.slice(-cloneCount),
    ...reviews,
    ...reviews.slice(0, cloneCount),
  ];

  // 실제 시작 = cloneCount번째 인덱스
  const [trackIndex, setTrackIndex] = useState(cloneCount);
  const [animated, setAnimated] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isJumping = useRef(false);

  // 뷰포트 크기 기반으로 카드 너비 계산
  useEffect(() => {
    const calcWidth = () => {
      if (viewportRef.current) {
        const vw = viewportRef.current.offsetWidth;
        setCardWidth((vw - GAP * (VISIBLE - 1)) / VISIBLE);
      }
    };
    calcWidth();
    window.addEventListener('resize', calcWidth);
    return () => window.removeEventListener('resize', calcWidth);
  }, []);

  const step = cardWidth + GAP; // 카드 1개 이동 거리 (px)

  const pageCount = Math.ceil(total / VISIBLE);
  const realIndex = ((trackIndex - cloneCount) % total + total) % total;
  const currentPage = Math.floor(realIndex / VISIBLE);

  const slideTo = useCallback((idx: number, withAnim = true) => {
    if (isJumping.current) return;
    setAnimated(withAnim);
    setTrackIndex(idx);
  }, []);

  const goNext = useCallback(() => {
    slideTo(trackIndex + 1);
  }, [trackIndex, slideTo]);

  const goPrev = useCallback(() => {
    slideTo(trackIndex - 1);
  }, [trackIndex, slideTo]);

  const handleTransitionEnd = useCallback(() => {
    const maxReal = cloneCount + total; // 진짜 마지막 + 1
    if (trackIndex >= maxReal) {
      // 앞 복사본 영역으로 진입 → 진짜 처음으로 순간이동
      isJumping.current = true;
      setAnimated(false);
      setTrackIndex(cloneCount + (trackIndex - maxReal));
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { isJumping.current = false; });
      });
    } else if (trackIndex < cloneCount) {
      // 뒤 복사본 영역으로 진입 → 진짜 끝으로 순간이동
      isJumping.current = true;
      setAnimated(false);
      setTrackIndex(maxReal - (cloneCount - trackIndex));
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { isJumping.current = false; });
      });
    }
  }, [trackIndex, total, cloneCount]);

  const goToPage = useCallback((page: number) => {
    slideTo(cloneCount + page * VISIBLE);
  }, [slideTo, cloneCount]);

  useEffect(() => {
    if (isHovered || total === 0) return;
    timerRef.current = setInterval(goNext, 3500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isHovered, goNext, total]);

  const translateX = step > 0 ? -(trackIndex * step) : 0;

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <i className="ri-star-fill text-orange-400 text-lg"></i>
          <h2 className="font-black text-gray-900 text-lg">추천 고객 후기</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 transition-colors cursor-pointer"
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>
          <div className="flex gap-1">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={`rounded-full transition-all cursor-pointer ${i === currentPage ? 'w-5 h-2 bg-[#1E3A8A]' : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'}`}
              />
            ))}
          </div>
          <button
            onClick={goNext}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 transition-colors cursor-pointer"
          >
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
      </div>

      {/* 슬라이드 뷰포트 */}
      <div ref={viewportRef} className="overflow-hidden rounded-2xl">
        <div
          className="flex"
          style={{
            gap: `${GAP}px`,
            transform: `translateX(${translateX}px)`,
            transition: animated ? 'transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {cloned.map((r, i) => (
            <div
              key={`${r.id}-clone-${i}`}
              className="bg-white border border-gray-100 p-5 flex flex-col gap-3 flex-shrink-0"
              style={{ width: cardWidth > 0 ? `${cardWidth}px` : `calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})` }}
            >
              <div className="flex items-center justify-between">
                <StarRating rating={r.rating} />
                {r.service_type && (
                  <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {r.service_type}
                  </span>
                )}
              </div>
              <p
                className="text-gray-700 text-sm leading-relaxed flex-1 scrollbar-hide"
                style={{
                  maxHeight: '4.5em',
                  lineHeight: '1.5em',
                  overflowY: 'auto',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                &ldquo;{r.message}&rdquo;
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                <div className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                  {r.name[0]}
                </div>
                <span className="font-bold text-gray-900 text-sm">{r.name}</span>
                <i className="ri-checkbox-circle-fill text-emerald-400 text-sm ml-auto"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 모바일: 카드 전체가 레일 위를 슬라이딩 (무한 루프) ── */
function MobileSlider({ reviews }: { reviews: FeaturedReview[] }) {
  const total = reviews.length;
  const cloneCount = 1;
  const cloned = [
    ...reviews.slice(-cloneCount),
    ...reviews,
    ...reviews.slice(0, cloneCount),
  ];

  const [trackIndex, setTrackIndex] = useState(cloneCount);
  const [animated, setAnimated] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isJumping = useRef(false);

  const realIndex = ((trackIndex - cloneCount) % total + total) % total;

  const slideTo = useCallback((idx: number, withAnim = true) => {
    if (isJumping.current) return;
    setAnimated(withAnim);
    setTrackIndex(idx);
  }, []);

  const goNext = useCallback(() => {
    slideTo(trackIndex + 1);
  }, [trackIndex, slideTo]);

  const goPrev = useCallback(() => {
    slideTo(trackIndex - 1);
  }, [trackIndex, slideTo]);

  const handleTransitionEnd = useCallback(() => {
    const maxReal = cloneCount + total;
    if (trackIndex >= maxReal) {
      isJumping.current = true;
      setAnimated(false);
      setTrackIndex(cloneCount + (trackIndex - maxReal));
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { isJumping.current = false; });
      });
    } else if (trackIndex < cloneCount) {
      isJumping.current = true;
      setAnimated(false);
      setTrackIndex(maxReal - (cloneCount - trackIndex));
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { isJumping.current = false; });
      });
    }
  }, [trackIndex, total, cloneCount]);

  useEffect(() => {
    timerRef.current = setInterval(goNext, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [goNext]);

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <i className="ri-star-fill text-orange-400"></i>
          <h2 className="font-black text-gray-900 text-base">추천 고객 후기</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 cursor-pointer"
          >
            <i className="ri-arrow-left-s-line text-sm"></i>
          </button>
          <span className="text-xs text-gray-400 font-medium">{realIndex + 1} / {total}</span>
          <button
            onClick={goNext}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 cursor-pointer"
          >
            <i className="ri-arrow-right-s-line text-sm"></i>
          </button>
        </div>
      </div>

      {/* 슬라이드 뷰포트 */}
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex"
          style={{
            transform: `translateX(-${trackIndex * 100}%)`,
            transition: animated ? 'transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {cloned.map((r, i) => (
            <div
              key={`${r.id}-m-${i}`}
              className="w-full flex-shrink-0 bg-white border border-gray-100 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">{r.name}</p>
                    <StarRating rating={r.rating} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {r.service_type && (
                    <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {r.service_type}
                    </span>
                  )}
                  <i className="ri-checkbox-circle-fill text-emerald-400 text-sm flex-shrink-0"></i>
                </div>
              </div>
              <p
                className="text-gray-700 text-sm leading-relaxed scrollbar-hide"
                style={{
                  maxHeight: '4.5em',
                  lineHeight: '1.5em',
                  overflowY: 'auto',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                &ldquo;{r.message}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 도트 인디케이터 */}
      <div className="flex justify-center gap-1.5 mt-3">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => slideTo(cloneCount + i)}
            className={`rounded-full transition-all cursor-pointer ${i === realIndex ? 'w-5 h-2 bg-[#1E3A8A]' : 'w-2 h-2 bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function FeaturedSlider() {
  const [reviews, setReviews] = useState<FeaturedReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
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
    loadReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <i className="ri-loader-4-line text-3xl text-[#1E3A8A] animate-spin"></i>
      </div>
    );
  }
  if (reviews.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="block md:hidden">
        <MobileSlider reviews={reviews} />
      </div>
      <div className="hidden md:block">
        <DesktopSlider reviews={reviews} />
      </div>
    </div>
  );
}
