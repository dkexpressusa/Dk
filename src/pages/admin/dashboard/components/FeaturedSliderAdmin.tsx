import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface FeaturedReview {
  id: string;
  name: string;
  rating: number;
  message: string;
  service_type: string | null;
  sort_order: number;
}

interface CustomerReview {
  id: string;
  name: string;
  rating: number;
  message: string;
  service_type: string | null;
  created_at: string;
  is_private: boolean;
}

function StarRating({ rating, small }: { rating: number; small?: boolean }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <i key={i} className={`${small ? 'text-xs' : 'text-sm'} ${i <= rating ? 'ri-star-fill text-orange-400' : 'ri-star-line text-gray-300'}`}></i>
      ))}
    </div>
  );
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export default function FeaturedSliderAdmin() {
  const [featured, setFeatured] = useState<FeaturedReview[]>([]);
  const [customers, setCustomers] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [addingId, setAddingId] = useState<string | null>(null);
  const [showSortMode, setShowSortMode] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  // 드래그 상태
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [sortList, setSortList] = useState<FeaturedReview[]>([]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [featuredRes, customersRes] = await Promise.all([
        supabase.from('featured_reviews').select('*').order('sort_order', { ascending: true }),
        supabase.from('reviews').select('id, name, rating, message, service_type, created_at, is_private').eq('is_private', false).order('created_at', { ascending: false }),
      ]);
      if (featuredRes.data) setFeatured(featuredRes.data as FeaturedReview[]);
      if (customersRes.data) setCustomers(customersRes.data as CustomerReview[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const total = featured.length;
  const maxIndex = Math.max(0, total - 1);
  const currentReview = featured[currentIndex] || null;

  // 고객 후기 중 아직 추천에 없는 것만 필터
  const filteredCustomers = customers.filter(c => {
    const alreadyAdded = featured.some(
      f => f.name === c.name && f.message === c.message
    );
    if (alreadyAdded) return false;
    if (!pickerSearch.trim()) return true;
    const q = pickerSearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.message.toLowerCase().includes(q) || (c.service_type || '').toLowerCase().includes(q);
  });

  const handleAddFromCustomer = async (c: CustomerReview) => {
    setAddingId(c.id);
    const maxOrder = featured.length > 0 ? Math.max(...featured.map(f => f.sort_order)) : 0;
    const { data, error } = await supabase
      .from('featured_reviews')
      .insert({
        name: c.name,
        rating: c.rating,
        message: c.message,
        service_type: c.service_type,
        sort_order: maxOrder + 1,
      })
      .select()
      .single();
    if (!error && data) {
      const newFeatured = [...featured, data as FeaturedReview];
      setFeatured(newFeatured);
      setCurrentIndex(newFeatured.length - 1);
    }
    setAddingId(null);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('featured_reviews').delete().eq('id', id);
    if (!error) {
      const newFeatured = featured.filter(r => r.id !== id);
      setFeatured(newFeatured);
      setConfirmDeleteId(null);
      setCurrentIndex(i => Math.min(i, Math.max(0, newFeatured.length - 1)));
    }
  };

  /* ── 드래그 정렬 ── */
  const handleStartSort = () => {
    setSortList([...featured]);
    setShowSortMode(true);
  };

  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = dragIndexRef.current;
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragOverIndex(null);
      return;
    }
    const newList = [...sortList];
    const [removed] = newList.splice(dragIndex, 1);
    newList.splice(dropIndex, 0, removed);
    setSortList(newList);
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    try {
      const updates = sortList.map((r, i) =>
        supabase.from('featured_reviews').update({ sort_order: i + 1 }).eq('id', r.id)
      );
      await Promise.all(updates);
      const updated = sortList.map((r, i) => ({ ...r, sort_order: i + 1 }));
      setFeatured(updated);
      setShowSortMode(false);
      setCurrentIndex(0);
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <i className="ri-star-fill text-orange-400"></i>
          <h3 className="font-black text-gray-900">추천 후기 슬라이드 관리</h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">총 {total}개</span>
        </div>
        <div className="flex items-center gap-2">
          {!showSortMode ? (
            <>
              <button
                onClick={handleStartSort}
                disabled={total < 2}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-drag-move-line"></i>순서 변경
              </button>
              <button
                onClick={() => { setShowPicker(v => !v); setPickerSearch(''); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1E3A8A] hover:bg-[#1e40af] text-white text-sm font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className={showPicker ? 'ri-close-line' : 'ri-add-line'}></i>
                {showPicker ? '닫기' : '후기 추가'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowSortMode(false)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 cursor-pointer whitespace-nowrap"
              >
                취소
              </button>
              <button
                onClick={handleSaveOrder}
                disabled={savingOrder}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-save-line"></i>
                {savingOrder ? '저장 중...' : '순서 저장'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* 고객 후기 선택 패널 */}
      {showPicker && !showSortMode && (
        <div className="border-b border-gray-100 bg-orange-50/50">
          <div className="px-5 py-3 border-b border-orange-100 flex items-center gap-3">
            <i className="ri-search-line text-gray-400 text-sm"></i>
            <input
              value={pickerSearch}
              onChange={e => setPickerSearch(e.target.value)}
              placeholder="이름, 내용, 서비스로 검색..."
              className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700 placeholder-gray-400"
              autoFocus
            />
            <span className="text-xs text-gray-400 whitespace-nowrap">{filteredCustomers.length}개</span>
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-orange-100/60">
            {filteredCustomers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <i className="ri-inbox-line text-3xl mb-2"></i>
                <p className="text-sm">
                  {customers.length === 0 ? '고객 후기가 없습니다' : '검색 결과가 없거나 모두 추가됐어요'}
                </p>
              </div>
            ) : (
              filteredCustomers.map(c => (
                <div key={c.id} className="flex items-start gap-3 px-5 py-3 hover:bg-orange-50 transition-colors">
                  <div className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0 mt-0.5">
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-bold text-gray-900 text-sm">{c.name}</span>
                      <StarRating rating={c.rating} small />
                      {c.service_type && (
                        <span className="text-xs text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded-full">{c.service_type}</span>
                      )}
                      <span className="text-xs text-gray-400 ml-auto">{formatDate(c.created_at)}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{c.message}</p>
                  </div>
                  <button
                    onClick={() => handleAddFromCustomer(c)}
                    disabled={addingId === c.id}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-[#1E3A8A] hover:bg-[#1e40af] disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {addingId === c.id ? (
                      <i className="ri-loader-4-line animate-spin"></i>
                    ) : (
                      <><i className="ri-add-line"></i>추가</>
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <i className="ri-loader-4-line text-3xl text-[#1E3A8A] animate-spin"></i>
        </div>
      ) : total === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <i className="ri-star-line text-4xl mb-2"></i>
          <p className="text-sm">추천 후기가 없습니다.</p>
          <p className="text-xs mt-1">위의 &ldquo;후기 추가&rdquo; 버튼으로 고객 후기를 선택해 추가하세요!</p>
        </div>
      ) : showSortMode ? (
        /* ── 드래그 정렬 모드 ── */
        <div className="p-5">
          <p className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
            <i className="ri-drag-move-line"></i>
            드래그해서 순서를 바꾸세요. 저장 버튼을 눌러야 반영됩니다.
          </p>
          <div className="space-y-2">
            {sortList.map((r, i) => (
              <div
                key={r.id}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={e => handleDragOver(e, i)}
                onDrop={e => handleDrop(e, i)}
                onDragEnd={() => setDragOverIndex(null)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing select-none ${
                  dragOverIndex === i
                    ? 'border-[#1E3A8A] bg-blue-50'
                    : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center text-gray-300 flex-shrink-0">
                  <i className="ri-drag-move-2-line text-lg"></i>
                </div>
                <div className="w-6 h-6 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                  {i + 1}
                </div>
                <div className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {r.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{r.name}</span>
                    <StarRating rating={r.rating} small />
                    {r.service_type && (
                      <span className="text-xs text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded-full">{r.service_type}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{r.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── 슬라이드 뷰 모드 ── */
        <div className="p-5">
          {/* 네비게이션 */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500 font-medium">{currentIndex + 1} / {total}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-s-line text-lg"></i>
              </button>
              <div className="flex gap-1">
                {featured.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`rounded-full transition-all cursor-pointer ${i === currentIndex ? 'w-5 h-2 bg-[#1E3A8A]' : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentIndex(i => Math.min(maxIndex, i + 1))}
                disabled={currentIndex >= maxIndex}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <i className="ri-arrow-right-s-line text-lg"></i>
              </button>
            </div>
          </div>

          {/* 현재 카드 */}
          {currentReview && (
            <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
              <div className="flex flex-col gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {currentReview.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{currentReview.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <StarRating rating={currentReview.rating} />
                      {currentReview.service_type && (
                        <span className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">
                          {currentReview.service_type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 삭제 버튼 */}
                {confirmDeleteId === currentReview.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(currentReview.id)}
                      className="flex-1 px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg cursor-pointer whitespace-nowrap font-bold text-center"
                    >
                      삭제 확인
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="flex-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-500 rounded-lg cursor-pointer whitespace-nowrap text-center"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(currentReview.id)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 border border-red-100 rounded-lg text-xs text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <i className="ri-delete-bin-line"></i>슬라이드에서 제거
                  </button>
                )}
              </div>

              <p className="text-gray-700 text-sm leading-relaxed bg-white rounded-xl px-4 py-3 border border-gray-100">
                &ldquo;{currentReview.message}&rdquo;
              </p>

              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <i className="ri-information-line"></i>
                슬라이드에서 제거해도 고객 후기 목록에는 그대로 남아있어요
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
