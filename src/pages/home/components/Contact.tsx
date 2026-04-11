import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '@/lib/supabase';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: Record<string, unknown> = {
      name: formData.get('name') as string,
      phone: (formData.get('phone') as string) || null,
      email: formData.get('email') as string,
      type: (formData.get('service') as string) || null,
      message: formData.get('message') as string,
      status: 'unread',
    };
    try {
      const { error: dbError } = await supabase.from('contacts').insert([payload]);
      if (dbError) throw dbError;
      setSubmitted(true);
    } catch {
      setError('전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Info */}
          <div>
            <span className="inline-block text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">Contact Us</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">회사 소개 및<br />연락처</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              지난 10년간 뉴욕 플러싱에서 운영해온 DK Express는 뉴욕과 한국을 연결하는 신뢰할 수 있는 물류 파트너입니다.
              CJ택배, FedEx, DHL과의 제휴를 통해 최고의 국제 물류 서비스를 제공합니다.
            </p>

            <div className="flex flex-col gap-5">
              {[
                { icon: 'ri-map-pin-2-line', label: '주소', value: '141-47 Northern Blvd, Flushing, NY 11354' },
                { icon: 'ri-time-line', label: '영업시간', value: '월~금 9AM–6PM, 토 9:30AM–6PM' },
                { icon: 'ri-phone-line', label: '전화', value: '(718) 762-6488 / 646-500-4659' },
                { icon: 'ri-mail-line', label: '이메일', value: 'dkexpressusa@gmail.com' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-xl flex-shrink-0">
                    <i className={`${item.icon} text-orange-500 text-lg`}></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold mb-0.5">{item.label}</p>
                    <p className="text-gray-800 text-sm font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-gray-200 h-48">
              <iframe
                title="DK Express 위치"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.4!2d-73.8305!3d40.7614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2601b0e3b3b3b%3A0x0!2s141-47+Northern+Blvd%2C+Flushing%2C+NY+11354!5e0!3m2!1sko!2sus!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-4">
                  <i className="ri-check-line text-green-500 text-3xl"></i>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">문의가 접수되었습니다!</h3>
                <p className="text-gray-500 text-sm">빠른 시일 내에 연락드리겠습니다.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-black text-gray-900 mb-6">문의하기</h3>
                <form data-readdy-form="true" onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">이름 *</label>
                      <input name="name" required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors" placeholder="홍길동" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">전화번호</label>
                      <input name="phone" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors" placeholder="010-0000-0000" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">이메일 *</label>
                    <input name="email" type="email" required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors" placeholder="example@email.com" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">배송 서비스</label>
                    <select name="service" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors bg-white">
                      <option value="">선택해주세요</option>
                      <option value="CJ택배">CJ택배</option>
                      <option value="FedEx">FedEx</option>
                      <option value="DHL">DHL</option>
                      <option value="기타">기타 문의</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">문의 내용 *</label>
                    <textarea
                      name="message"
                      required
                      maxLength={500}
                      rows={4}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors resize-none"
                      placeholder="문의하실 내용을 입력해주세요. (최대 500자)"
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-xs text-center">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-full transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {loading ? '전송 중...' : '문의 보내기'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
