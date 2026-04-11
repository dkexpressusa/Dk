import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { supabase } from '@/lib/supabase';

interface FAQ {
  id: string;
  category: string;
  category_en: string | null;
  question: string;
  answer: string;
  question_en: string | null;
  answer_en: string | null;
  sort_order: number;
  created_at: string;
}

type Mode = 'list' | 'add' | 'edit';

const DEFAULT_CATEGORIES = ['배송 관련', '금지 물품', '요금 및 결제', '귀국 이사', '기타'];

interface CategoryEditModalProps {
  category: string;
  categoryEn: string;
  onSave: (ko: string, en: string) => Promise<void>;
  onClose: () => void;
}

function CategoryEditModal({ category, categoryEn, onSave, onClose }: CategoryEditModalProps) {
  const [ko, setKo] = useState(category);
  const [en, setEn] = useState(categoryEn);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!ko.trim()) return;
    setSaving(true);
    await onSave(ko.trim(), en.trim());
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-gray-900 text-base">카테고리 수정</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors">
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">카테고리 이름 (한국어)</label>
            <input
              type="text"
              value={ko}
              onChange={e => setKo(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Category Name (English)</label>
            <input
              type="text"
              value={en}
              onChange={e => setEn(e.target.value)}
              placeholder="e.g. Shipping"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A]"
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-5">
          <button onClick={onClose} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors">취소</button>
          <button
            onClick={handleSave}
            disabled={saving || !ko.trim()}
            className="px-4 py-2.5 bg-[#1E3A8A] text-white rounded-lg text-sm font-bold hover:bg-[#1a3278] cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface FAQFormModalProps {
  mode: 'add' | 'edit';
  form: { category: string; question: string; answer: string; question_en: string; answer_en: string };
  dropdownCategories: string[];
  categoryEnMap: Record<string, string>;
  showNewCategory: boolean;
  newCategory: string;
  saving: boolean;
  onFormChange: (field: string, value: string) => void;
  onNewCategoryChange: (val: string) => void;
  onToggleNewCategory: (show: boolean) => void;
  onSave: () => void;
  onClose: () => void;
}

function FAQFormModal({
  mode, form, dropdownCategories, categoryEnMap,
  showNewCategory, newCategory, saving,
  onFormChange, onNewCategoryChange, onToggleNewCategory,
  onSave, onClose,
}: FAQFormModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-auto overflow-y-auto max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h3 className="font-black text-gray-900 text-base">{mode === 'add' ? 'FAQ 추가' : 'FAQ 수정'}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors">
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* 카테고리 */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">카테고리</label>
            {!showNewCategory ? (
              <div className="flex gap-2">
                <select
                  value={form.category}
                  onChange={e => onFormChange('category', e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#1E3A8A] cursor-pointer"
                >
                  {dropdownCategories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button
                  onClick={() => onToggleNewCategory(true)}
                  className="px-3 py-2.5 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-[#1E3A8A] hover:text-[#1E3A8A] cursor-pointer whitespace-nowrap transition-colors"
                >
                  + 새 카테고리
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={e => onNewCategoryChange(e.target.value)}
                  placeholder="새 카테고리 이름 입력"
                  className="flex-1 border border-[#1E3A8A] rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                />
                <button
                  onClick={() => { onToggleNewCategory(false); onNewCategoryChange(''); }}
                  className="px-3 py-2.5 border border-gray-200 rounded-lg text-xs text-gray-500 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors"
                >
                  취소
                </button>
              </div>
            )}
            {!showNewCategory && categoryEnMap[form.category] && (
              <p className="text-xs text-gray-400 mt-1">영어: {categoryEnMap[form.category]}</p>
            )}
          </div>

          {/* 질문 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">질문 (한국어) *</label>
              <input
                type="text"
                value={form.question}
                onChange={e => onFormChange('question', e.target.value)}
                placeholder="자주 묻는 질문을 입력하세요"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Question (English)</label>
              <input
                type="text"
                value={form.question_en}
                onChange={e => onFormChange('question_en', e.target.value)}
                placeholder="e.g. How long does shipping take?"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
          </div>

          {/* 답변 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">답변 (한국어) *</label>
              <textarea
                value={form.answer}
                onChange={e => onFormChange('answer', e.target.value)}
                placeholder="답변 내용을 입력하세요"
                rows={5}
                maxLength={500}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A] resize-none"
              />
              <p className="text-right text-xs text-gray-400 mt-1">{form.answer.length}/500</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Answer (English)</label>
              <textarea
                value={form.answer_en}
                onChange={e => onFormChange('answer_en', e.target.value)}
                placeholder="Enter English answer here"
                rows={5}
                maxLength={500}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A] resize-none"
              />
              <p className="text-right text-xs text-gray-400 mt-1">{form.answer_en.length}/500</p>
            </div>
          </div>
        </div>

        {/* 푸터 버튼 */}
        <div className="flex gap-2 justify-end px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors"
          >
            취소
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-5 py-2.5 bg-[#1E3A8A] text-white rounded-lg text-sm font-bold hover:bg-[#1a3278] cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50"
          >
            {saving ? '저장 중...' : mode === 'add' ? '추가하기' : '수정 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface SortableItemProps {
  faq: FAQ;
  isDragMode: boolean;
  expandedId: string | null;
  deleteConfirmId: string | null;
  onExpand: (id: string) => void;
  onEdit: (faq: FAQ) => void;
  onDeleteConfirm: (id: string | null) => void;
  onDelete: (id: string) => void;
}

function SortableItem({ faq, isDragMode, expandedId, deleteConfirmId, onExpand, onEdit, onDeleteConfirm, onDelete }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: faq.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 10 : undefined };

  return (
    <div ref={setNodeRef} style={style} className="border-t border-gray-50">
      <div
        className={`px-5 py-4 flex items-start gap-3 transition-colors ${isDragMode ? 'bg-blue-50/30 cursor-grab active:cursor-grabbing' : 'hover:bg-gray-50 cursor-pointer'}`}
        onClick={() => !isDragMode && onExpand(faq.id)}
      >
        {isDragMode ? (
          <div {...attributes} {...listeners} className="flex-shrink-0 mt-0.5 w-6 h-6 flex items-center justify-center text-gray-400 cursor-grab active:cursor-grabbing">
            <i className="ri-draggable text-lg"></i>
          </div>
        ) : (
          <i className={`ri-arrow-right-s-line text-gray-400 text-lg mt-0.5 flex-shrink-0 transition-transform duration-200 ${expandedId === faq.id ? 'rotate-90' : ''}`}></i>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900">{faq.question}</p>
          {faq.question_en && <p className="text-xs text-gray-400 mt-0.5">{faq.question_en}</p>}
          {!isDragMode && expandedId === faq.id && (
            <div className="mt-2 space-y-2">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
              {faq.answer_en && (
                <div className="bg-orange-50 rounded-lg p-3 border-l-2 border-orange-300">
                  <p className="text-xs font-bold text-orange-500 mb-1">EN</p>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{faq.answer_en}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {!isDragMode && (
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2" onClick={e => e.stopPropagation()}>
            <button onClick={() => onEdit(faq)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] text-gray-400 cursor-pointer transition-colors">
              <i className="ri-edit-line text-sm"></i>
            </button>
            {deleteConfirmId === faq.id ? (
              <div className="flex items-center gap-1">
                <button onClick={() => onDelete(faq.id)} className="px-2.5 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap hover:bg-red-600 transition-colors">삭제</button>
                <button onClick={() => onDeleteConfirm(null)} className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-500 cursor-pointer whitespace-nowrap hover:bg-gray-50 transition-colors">취소</button>
              </div>
            ) : (
              <button onClick={() => onDeleteConfirm(faq.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-red-400 hover:text-red-400 text-gray-400 cursor-pointer transition-colors">
                <i className="ri-delete-bin-line text-sm"></i>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FAQTab() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>('list');
  const [editTarget, setEditTarget] = useState<FAQ | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('전체');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [isDragMode, setIsDragMode] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [localFaqs, setLocalFaqs] = useState<FAQ[]>([]);
  const [categoryEditTarget, setCategoryEditTarget] = useState<{ ko: string; en: string } | null>(null);

  const [form, setForm] = useState({
    category: DEFAULT_CATEGORIES[0],
    question: '',
    answer: '',
    question_en: '',
    answer_en: '',
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('faqs').select('*').order('sort_order', { ascending: true });
      if (!error && data) { setFaqs(data as FAQ[]); setLocalFaqs(data as FAQ[]); }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFaqs(); }, [fetchFaqs]);

  // DB에서 가져온 실제 카테고리 목록 (중복 제거, 순서 유지)
  const dbCategories = Array.from(new Set(faqs.map(f => f.category)));
  // 드롭다운용: DB 카테고리만 사용 (하드코딩 제거)
  const dropdownCategories = dbCategories.length > 0
    ? dbCategories
    : DEFAULT_CATEGORIES;

  const allCategories = ['전체', ...dbCategories];
  const filtered = filterCategory === '전체' ? localFaqs : localFaqs.filter(f => f.category === filterCategory);
  const grouped = filtered.reduce<Record<string, FAQ[]>>((acc, faq) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category].push(faq);
    return acc;
  }, {});

  // 카테고리별 영어 이름 맵 (첫 번째 FAQ의 category_en 사용)
  const categoryEnMap = faqs.reduce<Record<string, string>>((acc, faq) => {
    if (!acc[faq.category] && faq.category_en) acc[faq.category] = faq.category_en;
    return acc;
  }, {});

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setLocalFaqs(prev => {
      const oldIndex = prev.findIndex(f => f.id === active.id);
      const newIndex = prev.findIndex(f => f.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    await Promise.all(localFaqs.map((faq, idx) => supabase.from('faqs').update({ sort_order: idx + 1 }).eq('id', faq.id)));
    setFaqs(localFaqs);
    setIsDragMode(false);
    setSavingOrder(false);
  };

  const handleCancelDrag = () => { setLocalFaqs(faqs); setIsDragMode(false); };

  const openAdd = () => {
    setForm({ category: dropdownCategories[0], question: '', answer: '', question_en: '', answer_en: '' });
    setShowNewCategory(false);
    setNewCategory('');
    setEditTarget(null);
    setMode('add');
  };

  const openEdit = (faq: FAQ) => {
    setForm({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      question_en: faq.question_en || '',
      answer_en: faq.answer_en || '',
    });
    setShowNewCategory(false);
    setNewCategory('');
    setEditTarget(faq);
    setMode('edit');
  };

  const closeModal = () => {
    setMode('list');
    setEditTarget(null);
    setShowNewCategory(false);
    setNewCategory('');
  };

  const handleFormChange = (field: string, value: string) => {
    setForm(p => ({ ...p, [field]: value }));
  };

  const handleSave = async () => {
    const finalCategory = showNewCategory ? newCategory.trim() : form.category;
    if (!finalCategory || !form.question.trim() || !form.answer.trim()) return;
    setSaving(true);

    // 선택된 카테고리의 영어 이름 자동 매핑
    const resolvedCategoryEn = categoryEnMap[finalCategory] || null;

    const payload = {
      category: finalCategory,
      category_en: resolvedCategoryEn,
      question: form.question.trim(),
      answer: form.answer.trim(),
      question_en: form.question_en.trim() || null,
      answer_en: form.answer_en.trim() || null,
    };

    if (mode === 'add') {
      const maxOrder = faqs.length > 0 ? Math.max(...faqs.map(f => f.sort_order)) : 0;
      const { error } = await supabase.from('faqs').insert({ ...payload, sort_order: maxOrder + 1 });
      if (!error) { await fetchFaqs(); closeModal(); }
    } else if (mode === 'edit' && editTarget) {
      const { error } = await supabase.from('faqs').update(payload).eq('id', editTarget.id);
      if (!error) { await fetchFaqs(); closeModal(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (!error) {
      setFaqs(prev => prev.filter(f => f.id !== id));
      setLocalFaqs(prev => prev.filter(f => f.id !== id));
      setDeleteConfirmId(null);
      if (expandedId === id) setExpandedId(null);
    }
  };

  // 카테고리 이름 수정 - 해당 카테고리의 모든 FAQ 업데이트
  const handleCategoryEdit = async (newKo: string, newEn: string) => {
    if (!categoryEditTarget) return;
    const oldKo = categoryEditTarget.ko;

    // 해당 카테고리의 모든 FAQ ID 수집
    const targetFaqs = faqs.filter(f => f.category === oldKo);
    if (targetFaqs.length === 0) {
      setCategoryEditTarget(null);
      return;
    }

    await Promise.all(
      targetFaqs.map(faq =>
        supabase.from('faqs').update({ category: newKo, category_en: newEn || null }).eq('id', faq.id)
      )
    );

    await fetchFaqs();

    // 필터 카테고리도 업데이트
    if (filterCategory === oldKo) setFilterCategory(newKo);

    setCategoryEditTarget(null);
  };

  return (
    <div>
      {/* 카테고리 수정 모달 */}
      {categoryEditTarget && (
        <CategoryEditModal
          category={categoryEditTarget.ko}
          categoryEn={categoryEditTarget.en}
          onSave={handleCategoryEdit}
          onClose={() => setCategoryEditTarget(null)}
        />
      )}

      {/* FAQ 추가/수정 모달 */}
      {(mode === 'add' || mode === 'edit') && (
        <FAQFormModal
          mode={mode}
          form={form}
          dropdownCategories={dropdownCategories}
          categoryEnMap={categoryEnMap}
          showNewCategory={showNewCategory}
          newCategory={newCategory}
          saving={saving}
          onFormChange={handleFormChange}
          onNewCategoryChange={setNewCategory}
          onToggleNewCategory={setShowNewCategory}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 font-semibold mb-1">전체 FAQ</p>
          <p className="text-3xl font-black text-[#1E3A8A]">{faqs.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 font-semibold mb-1">카테고리 수</p>
          <p className="text-3xl font-black text-orange-500">{Array.from(new Set(faqs.map(f => f.category))).length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-black text-gray-900">FAQ 목록</h3>
            {!isDragMode && (
              <div className="flex gap-1.5 flex-wrap">
                {allCategories.map(cat => (
                  <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer whitespace-nowrap transition-colors ${filterCategory === cat ? 'bg-[#1E3A8A] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{cat}</button>
                ))}
              </div>
            )}
            {isDragMode && <span className="text-xs text-blue-500 font-semibold flex items-center gap-1"><i className="ri-draggable"></i>드래그로 순서를 변경하세요</span>}
          </div>
          <div className="flex items-center gap-2">
            {isDragMode ? (
              <>
                <button onClick={handleCancelDrag} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap transition-colors">취소</button>
                <button onClick={handleSaveOrder} disabled={savingOrder} className="flex items-center gap-1.5 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50">
                  <i className="ri-save-line"></i>{savingOrder ? '저장 중...' : '순서 저장'}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { setIsDragMode(true); setFilterCategory('전체'); setExpandedId(null); }} className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] text-gray-500 rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap transition-colors">
                  <i className="ri-drag-move-line"></i>순서 변경
                </button>
                <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap transition-colors">
                  <i className="ri-add-line"></i>FAQ 추가
                </button>
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <i className="ri-loader-4-line animate-spin text-2xl mr-2"></i>불러오는 중...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <i className="ri-question-answer-line text-4xl mb-3"></i>
            <p className="text-sm">등록된 FAQ가 없습니다</p>
            <button onClick={openAdd} className="mt-4 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg text-sm font-bold cursor-pointer whitespace-nowrap">첫 FAQ 추가하기</button>
          </div>
        ) : isDragMode ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={localFaqs.map(f => f.id)} strategy={verticalListSortingStrategy}>
              <div className="divide-y divide-gray-100">
                {localFaqs.map(faq => (
                  <SortableItem key={faq.id} faq={faq} isDragMode={true} expandedId={expandedId} deleteConfirmId={deleteConfirmId} onExpand={id => setExpandedId(p => p === id ? null : id)} onEdit={openEdit} onDeleteConfirm={setDeleteConfirmId} onDelete={handleDelete} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="divide-y divide-gray-100">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="px-5 py-3 bg-gray-50 flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center bg-orange-500 rounded-md text-white text-xs font-black">{items.length}</span>
                  <span className="text-sm font-black text-[#1E3A8A]">{category}</span>
                  {categoryEnMap[category] && (
                    <span className="text-xs text-gray-400 font-normal">/ {categoryEnMap[category]}</span>
                  )}
                  <button
                    onClick={() => setCategoryEditTarget({ ko: category, en: categoryEnMap[category] || '' })}
                    className="ml-1 w-6 h-6 flex items-center justify-center rounded-md border border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] text-gray-400 cursor-pointer transition-colors"
                    title="카테고리 수정"
                  >
                    <i className="ri-edit-line text-xs"></i>
                  </button>
                </div>
                {items.map(faq => (
                  <SortableItem key={faq.id} faq={faq} isDragMode={false} expandedId={expandedId} deleteConfirmId={deleteConfirmId} onExpand={id => setExpandedId(p => p === id ? null : id)} onEdit={openEdit} onDeleteConfirm={setDeleteConfirmId} onDelete={handleDelete} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
