export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative w-full h-[600px] md:h-[720px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://readdy.ai/api/search-image?query=New%20York%20City%20skyline%20at%20blue%20hour%20dusk%20with%20airplane%20flying%20over%20Manhattan%20skyscrapers%20dramatic%20sky%20cargo%20shipping%20logistics%20professional%20photography%20wide%20angle%20cinematic&width=1440&height=720&seq=dkexpress-hero-001&orientation=landscape')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/60 to-gray-900/30" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="flex mb-6">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 text-orange-300 font-semibold px-4 py-1.5 rounded-full backdrop-blur-sm whitespace-nowrap text-[11px] sm:text-xs">
              <i className="ri-shield-check-line" style={{flexShrink: 0}}></i>
              뉴욕에서 한국까지, 믿고 맡기는 17년 택배 파트너
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
            뉴욕에서 한국으로<br />
            <span className="text-orange-400">안전하고 빠르게</span>
          </h1>
          <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
            지난 10년간 뉴욕 플러싱에서 운영해온 DKEXPRESS가 귀하의 소중한 물품을 안전하고 신속하게 배송해 드립니다.
            CJ택배, FedEx, DHL과 제휴하여 최고의 국제 물류 서비스를 제공합니다.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => scrollTo('contact')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full transition-all duration-200 hover:scale-105 whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
            >
              <i className="ri-send-plane-line"></i>
              지금 문의하기
            </button>
            <button
              onClick={() => scrollTo('services')}
              className="border border-white/50 hover:border-white text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200 backdrop-blur-sm whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
            >
              서비스 알아보기
              <i className="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>

        {/* Floating Stats Card */}
        <div className="absolute bottom-10 right-6 md:right-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 hidden md:block">
          <p className="text-white/70 text-xs mb-3 font-medium">실시간 배송 현황</p>
          <div className="flex gap-6">
            {[
              { value: '98%', label: '정시 배송률' },
              { value: '10년', label: '서비스 경력' },
              { value: '24/7', label: '고객 지원' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-white font-black text-xl">{stat.value}</p>
                <p className="text-white/60 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
