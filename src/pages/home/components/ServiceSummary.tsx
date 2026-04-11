import { useNavigate } from 'react-router-dom';
import { useLang } from '@/contexts/LanguageContext';

export default function ServiceSummary() {
  const navigate = useNavigate();
  const { t } = useLang();

  const handleShipping = () => {
    navigate('/shipping');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleMoving = () => {
    navigate('/moving');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <section className="py-20 md:py-28 bg-[#F3F4F6]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-14">
          <span className="inline-block text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">Our Services</span>
          <h2 className="text-3xl md:text-5xl font-black text-[#1E3A8A] mb-4">
            {t(
              '작은 택배부터 귀국 이사까지\n모든 한국 배송을 한 번에',
              'From Small Packages to Moving Back\nAll Korea Shipping in One Place'
            ).split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            {t(
              '귀국 이사부터 일반 택배까지 모두 가능. 빠른 상담으로 최적의 배송 방법 안내.',
              'From moving back to Korea to regular parcels. Quick consultation for the best shipping solution.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 일반 택배 */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="h-52 overflow-hidden">
              <img
                src="/images/img1.jpg"
                alt={t('한국 일반 택배', 'Korea Parcel Shipping')}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-8">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1E3A8A] text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                <i className="ri-box-3-line"></i>{t('일반 택배', 'Parcel Shipping')}
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">{t('한국 일반 택배', 'Korea Parcel Shipping')}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {t(
                  '뉴욕에서 한국으로 간편하게 보내는 택배. 의류, 생활용품, 전자제품 등 소형~중형 물품을 안전하게 배송합니다.',
                  'Easy parcel shipping from New York to Korea. Safely deliver clothing, household items, electronics, and more.'
                )}
              </p>
              <ul className="flex flex-col gap-2 mb-6">
                {[
                  t('CJ택배 연계 배송', 'CJ Logistics delivery'),
                  t('실시간 배송 추적', 'Real-time tracking'),
                  t('전문 포장 서비스', 'Professional packing'),
                  t('3~5일 소요', '3–5 days delivery'),
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <i className="ri-check-line text-orange-500"></i>{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleShipping}
                className="w-full bg-[#1E3A8A] hover:bg-[#163070] text-white font-bold py-3 rounded-full transition-colors cursor-pointer whitespace-nowrap"
              >
                {t('자세히 보기', 'Learn More')} <i className="ri-arrow-right-line ml-1"></i>
              </button>
            </div>
          </div>

          {/* 귀국 이사 */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="h-52 overflow-hidden">
              <img
                src="/images/img2.jpg"
                alt={t('귀국 이사', 'Moving Service')}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-8">
              <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                <i className="ri-luggage-cart-line"></i>{t('귀국 이사', 'Moving Service')}
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">{t('귀국 이사', 'Moving Back to Korea')}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {t(
                  '귀국 짐, 한 번에 안전하게 보내세요. 유학생 특화 서비스로 편리하게 처리해 드립니다.',
                  'Send all your belongings back to Korea at once. Specialized service for students returning home — convenient and reliable.'
                )}
              </p>
              <ul className="flex flex-col gap-2 mb-6">
                {[
                  t('유학생 특화 서비스', 'Student-specialized service'),
                  t('맞춤 견적 안내', 'Custom quote available'),
                  t('5~10일 소요', '5–10 days delivery'),
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <i className="ri-check-line text-orange-500"></i>{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleMoving}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full transition-colors cursor-pointer whitespace-nowrap"
              >
                {t('자세히 보기', 'Learn More')} <i className="ri-arrow-right-line ml-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
