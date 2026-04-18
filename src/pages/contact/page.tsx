import { useState } from 'react';
import type { FormEvent } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/contexts/LanguageContext';
import { useKakaoContactModal } from '@/contexts/KakaoContactModalContext';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serviceType, setServiceType] = useState('');
  const [error, setError] = useState('');
  const { t } = useLang();
  const { openKakaoContactModal } = useKakaoContactModal();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: Record<string, unknown> = {
      name: formData.get('name') as string,
      phone: (formData.get('phone') as string) || null,
      email: formData.get('email') as string,
      type: (formData.get('type') as string) || null,
      message: formData.get('message') as string,
      status: 'unread',
    };
    const showDims = serviceType === '한국 일반 택배' || serviceType === 'Korea Parcel Shipping' || serviceType === '귀국 이사' || serviceType === 'Moving Service';
    if (showDims) {
      const w = formData.get('width'); const h = formData.get('height');
      const d = formData.get('depth'); const wt = formData.get('weight');
      if (w) payload.width = parseFloat(w as string);
      if (h) payload.height = parseFloat(h as string);
      if (d) payload.depth = parseFloat(d as string);
      if (wt) payload.weight = parseFloat(wt as string);
    }
    try {
      const { error: dbError } = await supabase.from('contacts').insert([payload]);
      if (dbError) throw dbError;
      setSubmitted(true);
    } catch (err) {
      setError(t('문의 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', 'An error occurred. Please try again later.'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showDimensions = serviceType === '한국 일반 택배' || serviceType === 'Korea Parcel Shipping' || serviceType === '귀국 이사' || serviceType === 'Moving Service';

  const serviceOptions = [
    { ko: '한국 일반 택배', en: 'Korea Parcel Shipping' },
    { ko: '귀국 이사', en: 'Moving Service' },
    { ko: '예약문의', en: 'Reservation Inquiry' },
    { ko: '가격문의', en: 'Price Inquiry' },
    { ko: '기타', en: 'Other' },
  ];

  const contactInfo = [
    { icon: 'ri-map-pin-2-line', label: t('주소', 'Address'), value: '141-47 Northern Blvd, Flushing, NY 11354' },
    { icon: 'ri-time-line', label: t('영업시간', 'Hours'), value: t('월~금 9AM–6PM, 토 9:30AM–6PM', 'Mon–Fri 9AM–6PM, Sat 9:30AM–6PM') },
    { icon: 'ri-phone-line', label: t('전화', 'Phone'), value: '718-762-6488' },
    { icon: 'ri-mail-line', label: t('이메일', 'Email'), value: 'dkexpressusa@gmail.com' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-16 bg-[#1E3A8A]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 text-orange-300 text-[11px] font-bold px-4 py-2 rounded-full mb-6 whitespace-nowrap">
            <i className="ri-shield-check-line flex-shrink-0"></i>{t('2008년부터 시작한 신뢰할 수 있는 업체. CJ택배', 'Trusted Since 2008 · CJ Logistics Partner')}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">{t('문의하기', 'Contact Us')}</h1>
          <p className="text-white/70 text-lg">{t('빠른 상담으로 최적의 배송 방법을 안내해 드립니다', 'Quick consultation to find the best shipping solution for you')}</p>
        </div>
      </section>

      <section className="py-16 bg-[#F3F4F6]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-black text-[#1E3A8A] mb-6">{t('연락처 정보', 'Contact Information')}</h2>
            <div className="flex flex-col gap-5 mb-8">
              {contactInfo.map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#1E3A8A] rounded-xl flex-shrink-0">
                    <i className={`${item.icon} text-white text-lg`}></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold mb-0.5">{item.label}</p>
                    <p className="text-gray-800 text-sm font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
              <h3 className="text-lg font-black text-[#1E3A8A] mb-4 flex items-center gap-2">
                <i className="ri-customer-service-line text-orange-500"></i>{t('고객문의', 'Customer Support')}
              </h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={openKakaoContactModal}
                  className="flex items-center gap-3 p-3 bg-[#F3F4F6] rounded-xl hover:bg-orange-50 transition-colors cursor-pointer w-full text-left border-0"
                >
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center"><i className="ri-send-plane-line text-white text-lg"></i></div>
                  <div>
                    <p className="text-xs text-gray-400">{t('문의하기', 'Contact')}</p>
                    <p className="font-bold text-gray-900">{t('카카오톡 문의', 'KakaoTalk')}</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={openKakaoContactModal}
                  className="flex items-center gap-3 p-3 bg-[#F3F4F6] rounded-xl hover:bg-yellow-50 transition-colors cursor-pointer w-full text-left border-0"
                >
                  <div className="w-10 h-10 bg-[#FEE500] rounded-lg flex items-center justify-center"><i className="ri-chat-3-line text-[#3C1E1E] text-lg"></i></div>
                  <div>
                    <p className="text-xs text-gray-400">KakaoTalk</p>
                    <p className="font-bold text-gray-900">dkexpress</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-200 h-52">
              <iframe title="DK Express Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.4!2d-73.8305!3d40.7614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2601b0e3b3b3b%3A0x0!2s141-47+Northern+Blvd%2C+Flushing%2C+NY+11354!5e0!3m2!1sko!2sus!4v1" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-4">
                  <i className="ri-check-line text-green-500 text-3xl"></i>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{t('문의가 접수되었습니다!', 'Your inquiry has been received!')}</h3>
                <p className="text-gray-500 text-sm">{t('빠른 시일 내에 연락드리겠습니다.', 'We will get back to you shortly.')}</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-black text-[#1E3A8A] mb-6">{t('문의하기', 'Send a Message')}</h3>
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}
                <form data-readdy-form="true" onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{t('이름', 'Name')} *</label>
                      <input name="name" required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors" placeholder={t('홍길동', 'John Doe')} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{t('전화번호', 'Phone')}</label>
                      <input name="phone" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors" placeholder="010-0000-0000" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{t('이메일', 'Email')} *</label>
                    <input name="email" type="email" required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors" placeholder="example@email.com" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{t('문의 유형', 'Inquiry Type')}</label>
                    <select name="type" value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors bg-white">
                      <option value="">{t('선택해주세요', 'Please select')}</option>
                      {serviceOptions.map(o => (
                        <option key={o.ko} value={o.ko}>{t(o.ko, o.en)}</option>
                      ))}
                    </select>
                  </div>
                  {showDimensions && (
                    <div className="bg-[#F3F4F6] rounded-xl p-4 space-y-4">
                      <p className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                        <i className="ri-information-line text-orange-500"></i>
                        {t('알고 계시다면 입력해 주세요 (선택사항)', 'Enter if known (optional)')}
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        <div><label className="text-xs text-gray-400 mb-1 block">{t('가로 (inch)', 'Width (in)')}</label><input name="width" type="number" step="0.1" min="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1E3A8A]" placeholder="0" /></div>
                        <div><label className="text-xs text-gray-400 mb-1 block">{t('세로 (inch)', 'Height (in)')}</label><input name="height" type="number" step="0.1" min="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1E3A8A]" placeholder="0" /></div>
                        <div><label className="text-xs text-gray-400 mb-1 block">{t('높이 (inch)', 'Depth (in)')}</label><input name="depth" type="number" step="0.1" min="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1E3A8A]" placeholder="0" /></div>
                      </div>
                      <div><label className="text-xs text-gray-400 mb-1 block">{t('무게 (lb)', 'Weight (lb)')}</label><input name="weight" type="number" step="0.1" min="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1E3A8A]" placeholder="0" /></div>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{t('문의 내용', 'Message')} *</label>
                    <textarea name="message" required maxLength={500} rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1E3A8A] transition-colors resize-none" placeholder={t('배송 물품, 수량, 목적지 등을 알려주세요. (최대 500자)', 'Please describe your items, quantity, destination, etc. (max 500 chars)')} />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-colors cursor-pointer whitespace-nowrap">
                    {loading ? t('전송 중...', 'Sending...') : t('문의 보내기', 'Send Message')}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
