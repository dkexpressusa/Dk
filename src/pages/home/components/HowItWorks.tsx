import { useLang } from '@/contexts/LanguageContext';

export default function HowItWorks() {
  const { t } = useLang();

  const steps = [
    { num: '01', icon: 'ri-chat-1-line', title: t('상담', 'Consultation'), desc: t('전화 또는 이메일로 문의주시면 배송 방법과 비용을 안내해 드립니다.', 'Contact us by phone or email and we\'ll guide you on shipping options and costs.') },
    { num: '02', icon: 'ri-file-list-3-line', title: t('견적 안내', 'Quote'), desc: t('물품 종류, 무게, 수량에 따라 최적의 배송 방법과 견적을 제공합니다.', 'We provide the best shipping method and quote based on item type, weight, and quantity.') },
    { num: '03', icon: 'ri-inbox-archive-line', title: t('접수', 'Drop-off'), desc: t('매장 방문 또는 픽업 서비스로 물품을 접수하고 전문 포장을 진행합니다.', 'Drop off at our store or use pickup service. Professional packing included.') },
    { num: '04', icon: 'ri-flight-takeoff-line', title: t('배송', 'Delivery'), desc: t('CJ택배 연계로 한국까지 안전하게 배송. 실시간 추적으로 현황 확인 가능.', 'Safe delivery to Korea via CJ Logistics. Real-time tracking available.') },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#1E3A8A]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-14">
          <span className="inline-block text-orange-400 text-xs font-bold tracking-widest uppercase mb-3">Simple Process</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">{t('서비스 진행 방식', 'How It Works')}</h2>
          <p className="text-white/60 text-base max-w-md mx-auto">{t('문의만 주시면 끝까지 안내해드립니다', 'Just contact us — we\'ll guide you every step of the way')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={step.num} className="relative">
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-px border-t-2 border-dashed border-white/20 z-0" style={{ width: 'calc(100% - 80px)', left: '80px' }} />
              )}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 flex items-center justify-center bg-orange-500 rounded-full mb-5 relative">
                  <i className={`${step.icon} text-white text-3xl`}></i>
                  <span className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center bg-white text-[#1E3A8A] text-xs font-black rounded-full">{idx + 1}</span>
                </div>
                <h3 className="text-white font-black text-lg mb-2">{step.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
