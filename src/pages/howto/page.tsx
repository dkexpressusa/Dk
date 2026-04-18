import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useLang } from '@/contexts/LanguageContext';
import { useKakaoContactModal } from '@/contexts/KakaoContactModalContext';

export default function HowToPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { openKakaoContactModal } = useKakaoContactModal();

  const steps = [
    {
      n: 1, icon: 'ri-chat-1-line',
      title: t('상담 문의', 'Consultation'),
      desc: t('전화 (718) 762-6488 또는 이메일 dkexpressusa@gmail.com으로 문의해 주세요. 배송 물품, 수량, 목적지를 알려주시면 최적의 방법을 안내해 드립니다.', 'Contact us at (718) 762-6488 or dkexpressusa@gmail.com. Let us know your items, quantity, and destination and we\'ll guide you to the best option.'),
      tip: t('영업시간: 월~금 9AM–6PM, 토 9:30AM–6PM', 'Hours: Mon–Fri 9AM–6PM, Sat 9:30AM–6PM'),
    },
    {
      n: 2, icon: 'ri-file-list-3-line',
      title: t('견적 안내', 'Quote'),
      desc: t('물품의 무게, 부피, 종류에 따라 CJ택배 / FedEx / DHL 중 최적의 배송 방법과 비용을 안내해 드립니다. 숨은 비용 없이 투명하게 안내합니다.', 'Based on weight, volume, and item type, we\'ll recommend the best option among CJ Logistics, FedEx, or DHL — with full transparency, no hidden fees.'),
      tip: t('정확한 견적을 위해 물품 목록을 미리 준비해 주세요.', 'Prepare your item list in advance for an accurate quote.'),
    },
    {
      n: 3, icon: 'ri-inbox-archive-line',
      title: t('접수 및 포장', 'Drop-off & Packing'),
      desc: t('매장 방문(141-47 Northern Blvd, Flushing, NY 11354) 또는 픽업 서비스를 이용해 물품을 접수합니다. 전문 스태프가 안전하게 포장해 드립니다.', 'Visit our store (141-47 Northern Blvd, Flushing, NY 11354) or use our pickup service. Our staff will pack your items safely.'),
      tip: t('포장재는 저희가 제공합니다.', 'We provide all packing materials.'),
    },
    {
      n: 4, icon: 'ri-flight-takeoff-line',
      title: t('항공 운송', 'Air Freight'),
      desc: t('접수된 물품은 항공편으로 한국으로 운송됩니다. CJ택배 3~5일, FedEx/DHL 2~3일 소요됩니다.', 'Your items are shipped to Korea by air. CJ Logistics takes 3–5 days; FedEx/DHL takes 2–3 days.'),
      tip: t('운송 중 실시간 추적이 가능합니다.', 'Real-time tracking is available during transit.'),
    },
    {
      n: 5, icon: 'ri-map-pin-2-line',
      title: t('한국 내 배송 완료', 'Delivery in Korea'),
      desc: t('CJ택배를 통해 한국 내 지정 주소로 배달됩니다. 배송 완료 후 수취인에게 연락이 갑니다.', 'Delivered to your specified address in Korea via CJ Logistics. The recipient will be notified upon delivery.'),
      tip: t('배송 조회: cjlogistics.com', 'Track at: cjlogistics.com'),
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-16 bg-[#1E3A8A]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 text-orange-300 text-[11px] font-bold px-4 py-2 rounded-full mb-6 whitespace-nowrap">
            <i className="ri-shield-check-line flex-shrink-0"></i>{t('2008년부터 시작한 신뢰할 수 있는 업체. CJ택배', 'Trusted Since 2008 · CJ Logistics Partner')}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">{t('이용 방법', 'How to Use')}</h1>
          <p className="text-white/70 text-lg max-w-xl">{t('처음 이용하시는 분도 걱정 없이. 단계별로 안내해 드립니다.', 'No worries if it\'s your first time. We\'ll guide you step by step.')}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <div className="flex flex-col gap-6 mb-16">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-6 items-start bg-[#F3F4F6] rounded-2xl p-7 border border-gray-100">
                <div className="w-14 h-14 flex items-center justify-center bg-[#1E3A8A] rounded-2xl flex-shrink-0">
                  <i className={`${s.icon} text-white text-2xl`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-orange-500 font-black text-sm whitespace-nowrap">STEP {s.n}</span>
                    <h3 className="font-black text-gray-900 text-lg">{s.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{s.desc}</p>
                  <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <i className="ri-lightbulb-line"></i>{s.tip}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#1E3A8A] rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-black text-white mb-2">{t('지금 바로 문의하세요', 'Get in Touch Today')}</h2>
            <p className="text-white/60 text-sm mb-6">{t('문의만 주시면 끝까지 안내해드립니다', 'Just reach out — we\'ll guide you every step of the way')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button type="button" onClick={() => navigate('/contact')} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap transition-colors flex items-center justify-center gap-2">
                <i className="ri-send-plane-line"></i>{t('문의하기', 'Contact Us')}
              </button>
              <button type="button" onClick={openKakaoContactModal} className="border border-white/30 hover:border-white text-white font-semibold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-colors">
                <i className="ri-phone-line"></i>{t('전화 상담', 'Call Us')}
              </button>
              <button type="button" onClick={openKakaoContactModal} className="bg-[#FEE500] hover:bg-[#F5DC00] text-[#3C1E1E] font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-colors">
                <i className="ri-chat-3-line"></i>{t('카카오톡 상담', 'KakaoTalk')}
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
