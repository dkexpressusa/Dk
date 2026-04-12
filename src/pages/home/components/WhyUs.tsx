import { useLang } from '@/contexts/LanguageContext';

export default function WhyUs() {
  const { t } = useLang();

  const reasons = [
    { icon: 'ri-calendar-check-line', title: t('2008년부터 운영', 'Operating Since 2008'), desc: t('17년간 수천 건 이상의 배송 경험. 오랜 노하우로 어떤 상황에서도 안전하게 처리합니다.', '17+ years and thousands of shipments. Our expertise ensures safe handling in any situation.'), highlight: t('17년+ 경력', '17+ Years') },
    { icon: 'ri-truck-line', title: t('CJ택배 연계', 'Official CJ Logistics Partner'), desc: t('한국 최대 물류 네트워크 CJ택배와 연계하여 전국 어디든 빠르고 안전하게 배송합니다.', 'Partnered with CJ Logistics, Korea\'s largest delivery network, for fast and safe nationwide delivery.'), highlight: 'CJ택배' },
    { icon: 'ri-customer-service-2-line', title: t('빠른 상담 대응', 'Fast Customer Support'), desc: t('문의만 주시면 끝까지 안내해드립니다. 전화, 이메일로 신속하게 답변드립니다.', 'We guide you through every step. Quick responses via phone and email.'), highlight: t('즉시 상담', 'Instant Support') },
    { icon: 'ri-shield-check-line', title: t('전 과정 책임 배송', 'End-to-End Responsibility'), desc: t('뉴욕 출발부터 한국 도착까지 전 과정을 책임집니다. 기본 보험 적용으로 안심 배송.', 'We take full responsibility from NY departure to Korea arrival. Basic insurance included.'), highlight: t('책임 보장', 'Guaranteed') },
  ];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">Why DKEXPRESS</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#1E3A8A] mb-5 leading-tight">
              {t('뉴욕에서 한국까지,', 'From New York to Korea,')}
              <br />
              <span className="text-orange-500">{t('믿고 맡기는 파트너', 'Your Trusted Partner')}</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              {t('2008년부터 이어온 신뢰. CJ택배 연계와 수천 건의 배송 경험으로 귀하의 소중한 물품을 안전하게 전달합니다.', 'Trust built since 2008. With CJ Logistics partnership and thousands of deliveries, we safely deliver your precious belongings.')}
            </p>
            <div className="bg-[#1E3A8A] rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <i className="ri-award-line text-white text-2xl"></i>
                  </div>
                  <div>
                    <p className="text-white/70 text-xs font-semibold">Since 2008</p>
                    <p className="text-xl font-black">{t('17년+ 운영 경력', '17+ Years of Service')}</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">
                  {t('"2008년부터 시작한 업체로 신뢰할 수 있는 업체. CJ택배"\n수천 건의 배송 경험으로 검증된 서비스를 제공합니다.', '"Trusted since 2008, partnered with CJ Logistics."\nVerified service backed by thousands of successful deliveries.')}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {reasons.map((r) => (
              <div key={r.title} className="bg-[#F3F4F6] rounded-2xl p-6 border border-gray-100">
                <div className="w-11 h-11 flex items-center justify-center bg-[#1E3A8A] rounded-xl mb-4">
                  <i className={`${r.icon} text-white text-xl`}></i>
                </div>
                <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full mb-2">{r.highlight}</span>
                <h3 className="font-black text-gray-900 text-sm mb-2">{r.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
