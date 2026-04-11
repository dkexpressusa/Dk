import { useState } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useNavigate } from 'react-router-dom';
import PhoneModal from '@/components/base/PhoneModal';
import KakaoModal from '@/components/base/KakaoModal';
import { useLang } from '@/contexts/LanguageContext';

const galleryItems = [
  { img: '/images/img7.jpg', labelKo: '귀국 짐 포장 준비', labelEn: 'Packing for Return' },
  { img: '/images/img8.jpg', labelKo: '항공 화물 운송', labelEn: 'Air Cargo Shipping' },
  { img: '/images/img9.jpg', labelKo: '한국 도착 및 배달', labelEn: 'Arrival & Delivery in Korea' },
];

export default function MovingPage() {
  const navigate = useNavigate();
  const [showPhone, setShowPhone] = useState(false);
  const [showKakao, setShowKakao] = useState(false);
  const { lang, t } = useLang();

  const items = [
    t('의류 및 패션 아이템', 'Clothing & Fashion Items'),
    t('생활용품 및 주방용품', 'Household & Kitchen Goods'),
    t('전자제품 (소형)', 'Electronics (Small)'),
    t('화장품 및 건강식품', 'Cosmetics & Health Products'),
    t('책 및 문서류', 'Books & Documents'),
    t('스포츠 용품', 'Sports Equipment'),
    t('장난감 및 선물용품', 'Toys & Gift Items'),
  ];

  const prohibited = [
    t('위험물 (폭발물, 인화성 물질)', 'Hazardous Materials'),
    t('동식물 및 식물', 'Animals & Plants'),
    t('현금, 귀금속', 'Cash & Precious Metals'),
    t('불법 물품', 'Illegal Items'),
    t('냉동/냉장 식품', 'Frozen/Refrigerated Food'),
  ];

  const features = [
    { icon: 'ri-graduation-cap-line', title: t('유학생 특화', 'Student Specialized'), desc: t('유학 마치고 귀국하는 학생들을 위한 맞춤 서비스. 짐 정리부터 배송까지 한 번에.', 'Tailored service for students returning home. From packing to delivery, all in one.') },
    { icon: 'ri-price-tag-3-line', title: t('맞춤 견적', 'Custom Quote'), desc: t('물품 종류와 수량에 따라 최적의 방법과 합리적인 견적을 제공합니다.', 'We provide the best method and a fair quote based on your item types and quantity.') },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-16 bg-[#1E3A8A]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 text-orange-300 text-[11px] font-bold px-4 py-2 rounded-full mb-6 whitespace-nowrap">
            <i className="ri-shield-check-line flex-shrink-0"></i>{t('2008년부터 시작한 신뢰할 수 있는 업체. CJ택배', 'Trusted Since 2008 · CJ Logistics Partner')}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">{t('귀국 이사', 'Moving Back to Korea')}</h1>
          <p className="text-white/70 text-lg max-w-xl">{t('귀국 짐, 한 번에 안전하게 보내세요. 유학생 특화 서비스로 편리하게.', 'Send all your belongings back to Korea at once. Specialized for students — convenient and reliable.')}</p>
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
            <h3 className="text-xl font-black text-[#1E3A8A] mb-6">{t('배송 절차', 'Moving Process')}</h3>
            {[
              { title: t('상담 및 견적', 'Consultation & Quote'), desc: t('물품 목록 전달 후 맞춤 견적 안내', 'Send your item list and receive a custom quote') },
              { title: t('픽업 또는 방문 접수', 'Pickup or Drop-off'), desc: t('지정 장소 픽업 또는 매장 방문', 'Pickup at your location or visit our store') },
              { title: t('항공 운송 및 배송', 'Air Freight & Delivery'), desc: t('CJ택배 연계로 한국 도착 후 배달', 'Delivered in Korea via CJ Logistics') },
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
              <p className="text-white font-black text-2xl">{t('5~10일', '5–10 Days')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F3F4F6]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <span className="inline-block text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">Real Cases</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1E3A8A] mb-3">{t('실제 이사 사례', 'Real Moving Cases')}</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">{t('귀국 짐 포장부터 한국 도착까지, DK Express의 실제 이사 과정을 확인하세요', 'See the actual moving process from packing to Korea arrival with DKEXPRESS')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
          <div className="mt-10 bg-white rounded-2xl p-8 border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-11 h-11 flex items-center justify-center bg-[#1E3A8A] rounded-xl flex-shrink-0">
                  <i className={`${f.icon} text-white text-xl`}></i>
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-sm mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
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
            <button onClick={() => navigate('/contact')} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-colors flex items-center justify-center gap-2">
              <i className="ri-send-plane-line"></i>{t('문의하기', 'Contact Us')}
            </button>
            <button onClick={() => setShowPhone(true)} className="border border-white/30 hover:border-white text-white font-semibold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-colors">
              <i className="ri-phone-line"></i>{t('전화 상담', 'Call Us')}
            </button>
            <button onClick={() => setShowKakao(true)} className="bg-[#FEE500] hover:bg-[#F5DC00] text-[#3C1E1E] font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-colors">
              <i className="ri-chat-3-line"></i>{t('카카오톡 상담', 'KakaoTalk')}
            </button>
          </div>
        </div>
      </section>

      <Footer />
      {showPhone && <PhoneModal onClose={() => setShowPhone(false)} />}
      {showKakao && <KakaoModal onClose={() => setShowKakao(false)} />}
    </div>
  );
}
