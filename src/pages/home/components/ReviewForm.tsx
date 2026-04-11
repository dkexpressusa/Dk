import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '@/lib/supabase';

const SERVICE_TYPES = ['한국 일반 택배', '귀국 이사', '배송 관련 문의', '기타'];

export default function ReviewForm() {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [serviceType, setServiceType] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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
        status: 'pending',
      });

      if (dbError) throw dbError;
      setSubmitted(true);
    } catch {
      setError('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-check-line text-emerald-500 text-2xl"></i>
        </div>
        <h3 className="font-black text-gray-900 text-lg mb-2">후기가 접수되었습니다!</h3>
        <p className="text-gray-500 text-sm">검토 후 홈페이지에 게시됩니다. 소중한 후기 감사합니다.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-100">
      <h3 className="font-black text-gray-900 text-lg mb-6">후기 작성하기</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
          <i className="ri-error-warning-line"></i>{error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">이름 *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="홍길동"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">별점 *</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <i className={`text-2xl ${star <= (hoverRating || rating) ? 'ri-star-fill text-orange-400' : 'ri-star-line text-gray-300'}`}></i>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500 self-center">{rating}점</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">이용 서비스</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-white cursor-pointer"
          >
            <option value="">선택 안함</option>
            {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">후기 내용 *</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 500))}
            required
            rows={4}
            placeholder="서비스 이용 경험을 자유롭게 작성해주세요."
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A] resize-none transition-colors"
          />
          <p className="text-xs text-gray-400 text-right mt-1">{message.length}/500</p>
        </div>

        <button
          type="submit"
          disabled={submitting || !name.trim() || !message.trim()}
          className="w-full bg-[#1E3A8A] hover:bg-[#1e40af] disabled:opacity-50 text-white font-bold py-3 rounded-full transition-colors cursor-pointer whitespace-nowrap"
        >
          {submitting ? '제출 중...' : '후기 제출하기'}
        </button>
        <p className="text-xs text-gray-400 text-center">검토 후 홈페이지에 게시됩니다</p>
      </div>
    </form>
  );
}
