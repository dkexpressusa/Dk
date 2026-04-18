import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useLang } from '@/contexts/LanguageContext';
import { useKakaoContactModal } from '@/contexts/KakaoContactModalContext';
import { usePhoneContactModal } from '@/contexts/PhoneContactModalContext';

const galleryItems = [
  { img: '/images/img3.jpg', labelKo: '안전한 포장 작업', labelEn: 'Safe Packing Process' },
  { img: '/images/img4.jpg', labelKo: '운송장 부착 및 접수', labelEn: 'Label & Registration' },
  { img: '/images/img5.jpg', labelKo: '항공 운송', labelEn: 'Air Freight' },
  { img: '/images/img6.jpg', labelKo: '한국 내 CJ택배 배달', labelEn: 'CJ Logistics Delivery in Korea' },
];

export default function ShippingPage() {
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const { openKakaoContactModal } = useKakaoContactModal();
  const { openPhoneContactModal } = usePhoneContactModal();

  const items = [
    t('의류 및 패션 아이템', 'Clothing & Fashion Items'),
    t('생활용품 및 주방용품', 'Household & Kitchen Goods'),
    t('전자제품 (소형)', 'Electronics (Small)'),
    t('화장품 및 건강식품', 'Cosmetics & Health Products'),
    t('책 및 문서류', 'Books & Documents'),
    t('장난감 및 선물용품', 'Toys & Gift Items'),
  ];

  const prohibited = [
    t('위험물 (폭발물, 인화성 물질)', 'Hazardous Materials (Explosives, Flammables)'),
    t('동식물 및 식물', 'Animals & Plants'),
    t('현금, 귀금속', 'Cash & Precious Metals'),
    t('불법 물품', 'Illegal Items'),
    t('냉동/냉장 식품', 'Frozen/Refrigerated Food'),
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-16 bg-[#1E3A8A]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 text-orange-300 text-[11px] font-bold px-4 py-2 rounded-full mb-6 whitespace-nowrap">
            <i className="ri-shield-check-line flex-shrink-0"></i>{t('2008년부터 시작한 신뢰할 수 있는 업체. CJ택배', 'Trusted Since 2008 · CJ Logistics Partner')}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">{t('한국 일반 택배', 'Korea Parcel Shipping')}</h1>
          <p className="text-white/70 text-lg max-w-xl">{t('뉴욕에서 한국으로 간편하게 보내는 택배. CJ택배 연계로 전국 어디든 안전하게.', 'Easy parcel shipping from New York to Korea. Safe nationwide delivery via CJ Logistics.')}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-black text-[#1E3A8A] mb-5">{t('배송 가능 품목', 'Accepted Items')}</h2>
            <ul className="flex flex-col gap-3 mb-8">
              {items.map(i => (
                <li key={i} className="flex items-center gap-3 text-gray-700 text-sm">
                  <i className="ri-check-line text-orange-500 text-lg"></i>{i}
                </li>
              ))}
            </ul>
            <h3 className="text-lg font-black text-red-500 mb-3">{t('배송 제한 품목', 'Prohibited Items')}</h3>
            <ul className="flex flex-col gap-2">
              {prohibited.map(i => (
                <li key={i} className="flex items-center gap-3 text-gray-500 text-sm">
                  <i className="ri-close-line text-red-400"></i>{i}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#F3F4F6] rounded-3xl p-8">
            <h3 className="text-xl font-black text-[#1E3A8A] mb-6">{t('배송 절차', 'Shipping Process')}</h3>
            {[
              { title: t('상담 및 접수', 'Consultation & Registration'), desc: t('전화 또는 방문으로 배송 신청', 'Apply by phone or in-person visit') },
              { title: t('전문 포장', 'Professional Packing'), desc: t('물품에 맞는 안전한 포장 진행', 'Safe packing tailored to your items') },
              { title: t('항공 운송', 'Air Freight'), desc: t('뉴욕 → 한국 항공 운송 (1~3일)', 'New York → Korea air freight (1–3 days)') },
              { title: t('CJ택배 배송', 'CJ Logistics Delivery'), desc: t('한국 내 CJ택배로 문 앞 배달 (1~2일)', 'Door-to-door delivery in Korea via CJ (1–2 days)') },
            ].map((s, idx) => (
              <div key={s.title} className="flex gap-4 mb-5 last:mb-0">
                <div className="w-10 h-10 flex items-center justify-center bg-orange-500 rounded-full text-white font-black text-sm flex-shrink-0">{idx + 1}</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{s.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
            <div className="mt-6 bg-[#1E3A8A] rounded-xl p-4 text-center">
              <p className="text-white/70 text-xs mb-1">{t('총 소요 시간', 'Total Delivery Time')}</p>
              <p className="text-white font-black text-2xl">{t('3~5일', '3–5 Days')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F3F4F6]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <span className="inline-block text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">Real Cases</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1E3A8A] mb-3">{t('실제 배송 사례', 'Real Shipping Cases')}</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">{t('포장부터 한국 도착까지, DK Express의 실제 배송 과정을 확인하세요', 'See the actual shipping process from packing to Korea arrival')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {galleryItems.map((item) => (
              <div key={item.labelKo} className="group rounded-2xl overflow-hidden bg-white border border-gray-100">
                <div className="w-full h-52 overflow-hidden">
                  <img src={item.img} alt={lang === 'en' ? item.labelEn : item.labelKo} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <p className="font-bold text-gray-800 text-sm">{lang === 'en' ? item.labelEn : item.labelKo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#1E3A8A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">{t('지금 바로 문의하세요', 'Get in Touch Today')}</h2>
          <p className="text-white/60 mb-6">{t('빠른 상담으로 최적의 배송 방법을 안내해 드립니다', 'Quick consultation to find the best shipping solution for you')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button type="button" onClick={() => navigate('/contact')} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-colors flex items-center justify-center gap-2">
              <i className="ri-send-plane-line"></i>{t('문의하기', 'Contact Us')}
            </button>
            <button type="button" onClick={openPhoneContactModal} className="border border-white/30 hover:border-white text-white font-semibold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-colors">
              <i className="ri-phone-line"></i>{t('전화 상담', 'Call Us')}
            </button>
            <button type="button" onClick={openKakaoContactModal} className="bg-[#FEE500] hover:bg-[#F5DC00] text-[#3C1E1E] font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-colors">
              <i className="ri-chat-3-line"></i>{t('카카오톡 상담', 'KakaoTalk')}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
