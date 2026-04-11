import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/contexts/LanguageContext';

const SERVICE_TYPES_KO = ['한국 일반 택배', '귀국 이사', '배송 관련 문의', '기타'];
const SERVICE_TYPES_EN = ['Korea Parcel Shipping', 'Moving Service', 'Shipping Inquiry', 'Other'];

export default function ReviewWriteForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [serviceType, setServiceType] = useState('');
  const [message, setMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { lang, t } = useLang();

  const serviceTypes = lang === 'en' ? SERVICE_TYPES_EN : SERVICE_TYPES_KO;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    setError('');

    try {
      const { error: dbError } = await supabase.from('reviews').insert({
        name: name.trim(),
        rating,
        message: message.trim(),
        service_type: serviceType || null,
        is_private: isPrivate,
        status: 'pending',
      });

      if (dbError) throw dbError;
      setSubmitted(true);
      onSubmitted?.();
    } catch {
      setError(t('제출 중 오류가 발생했습니다. 다시 시도해주세요.', 'An error occurred. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-check-line text-emerald-500 text-2xl"></i>
        </div>
        <h3 className="font-black text-gray-900 text-lg mb-1">{t('후기가 등록되었습니다!', 'Review submitted!')}</h3>
        <p className="text-gray-500 text-sm">{t('소중한 후기 감사합니다.', 'Thank you for your review.')}</p>
        <button
          onClick={() => { setSubmitted(false); setName(''); setRating(5); setServiceType(''); setMessage(''); setIsPrivate(false); }}
          className="mt-5 px-6 py-2.5 border border-gray-200 rounded-full text-sm text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
        >
          {t('다른 후기 작성하기', 'Write another review')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
          <i className="ri-error-warning-line"></i>{error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{t('이름', 'Name')} *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder={t('홍길동', 'John Doe')}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{t('이용 서비스', 'Service Used')}</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-white cursor-pointer"
          >
            <option value="">{t('선택 안함', 'Not selected')}</option>
            {serviceTypes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 mb-2 block">{t('별점', 'Rating')} *</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="cursor-pointer transition-transform hover:scale-110"
            >
              <i className={`text-3xl ${star <= (hoverRating || rating) ? 'ri-star-fill text-orange-400' : 'ri-star-line text-gray-300'}`}></i>
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500 font-semibold">{rating}{t('점', ' stars')}</span>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{t('후기 내용', 'Review')} *</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 500))}
          required
          rows={4}
          placeholder={t('서비스 이용 경험을 자유롭게 작성해주세요.', 'Share your experience with our service.')}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A] resize-none transition-colors"
        />
        <p className="text-xs text-gray-400 text-right mt-1">{message.length}/500</p>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer group w-fit">
        <div className="relative">
          <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} className="sr-only" />
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isPrivate ? 'bg-[#1E3A8A] border-[#1E3A8A]' : 'border-gray-300 group-hover:border-gray-400'}`}>
            {isPrivate && <i className="ri-check-line text-white text-xs"></i>}
          </div>
        </div>
        <span className="text-sm text-gray-600 flex items-center gap-1.5">
          <i className="ri-lock-line text-gray-400 text-sm"></i>
          {t('비공개로 작성하기', 'Post as private')}
          <span className="text-xs text-gray-400">{t('(내용이 다른 고객에게 보이지 않습니다)', '(content hidden from other users)')}</span>
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting || !name.trim() || !message.trim()}
        className="w-full bg-[#1E3A8A] hover:bg-[#1e40af] disabled:opacity-50 text-white font-bold py-3.5 rounded-full transition-colors cursor-pointer whitespace-nowrap text-sm"
      >
        {submitting ? t('등록 중...', 'Submitting...') : t('후기 등록하기', 'Submit Review')}
      </button>
    </form>
  );
}
