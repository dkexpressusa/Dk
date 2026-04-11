import { useState } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import ReviewList from './components/ReviewList';
import ReviewWriteForm from './components/ReviewWriteForm';
import FeaturedSlider from './components/FeaturedSlider';
import { useLang } from '@/contexts/LanguageContext';

export default function ReviewsPage() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { t } = useLang();

  const handleSubmitted = () => {
    setShowForm(false);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <section className="pt-32 pb-14 bg-[#1E3A8A]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs font-bold px-4 py-2 rounded-full mb-6">
            <i className="ri-star-fill"></i>{t('2008년부터 시작한 신뢰할 수 있는 업체. CJ택배', 'Trusted carrier since 2008. CJ Logistics')}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">{t('고객 후기', 'Customer Reviews')}</h1>
          <p className="text-white/70 text-base">{t('DK Express를 이용하신 고객들의 생생한 경험을 확인하세요', 'See what our customers say about their experience with DKEXPRESS')}</p>
          <div className="flex gap-8 mt-8">
            {[
              { v: '98%', l: t('정시 배송률', 'On-time Rate') },
              { v: '17년', l: t('서비스 경력', 'Years of Service') },
              { v: '★ 4.9', l: t('평균 평점', 'Avg. Rating') },
            ].map(s => (
              <div key={s.l}>
                <p className="text-white font-black text-2xl">{s.v}</p>
                <p className="text-white/50 text-xs mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 md:px-10 py-10">
        <FeaturedSlider />

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          {!showForm ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900 text-sm">{t('DK Express를 이용하셨나요?', 'Have you used DKEXPRESS?')}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t('소중한 후기를 남겨주세요', 'Leave us your valuable review')}</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#1e40af] text-white font-bold rounded-full text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-edit-line"></i>{t('후기 작성하기', 'Write a Review')}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-black text-gray-900">{t('후기 작성', 'Write a Review')}</h3>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                  <i className="ri-close-line text-gray-500"></i>
                </button>
              </div>
              <ReviewWriteForm onSubmitted={handleSubmitted} />
            </div>
          )}
        </div>

        <ReviewList key={refreshKey} />
      </div>

      <Footer />
    </div>
  );
}
