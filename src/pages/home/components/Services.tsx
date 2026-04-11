const services = [
  {
    name: 'CJ택배',
    icon: 'ri-truck-line',
    color: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-100',
    trackingUrl: 'https://www.cjlogistics.com/ko/tool/parcel/tracking',
    description:
      '한국 내 어디든 문 앞까지 배송되는 국내 최대 네트워크를 갖춘 프리미엄 서비스. 한국의 모든 지역에 가장 빠르고 안전한 배송을 보장합니다.',
    duration: '총 3~5일',
    features: ['한국 전국 배송', '문 앞 배달', '실시간 추적'],
  },
  {
    name: 'FedEx',
    icon: 'ri-flight-takeoff-line',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    trackingUrl: 'https://www.fedex.com/ko-kr/tracking.html',
    description:
      '글로벌 특송 네트워크를 통해 세계 각국으로 신속한 배송. 엄격한 배송 기한과 높은 신뢰성으로 비즈니스 고객에게 최적화된 서비스입니다.',
    duration: '총 2~3일',
    features: ['글로벌 네트워크', '비즈니스 최적화', '정시 보장'],
  },
  {
    name: 'DHL',
    icon: 'ri-global-line',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-100',
    trackingUrl: 'https://www.dhl.com/kr-ko/home/tracking.html',
    description:
      '국제 특송 및 화물 서비스를 위한 최적의 선택. 200개 이상의 국가로 배송 가능하며, 관세 및 국제 규정에 대한 전문 지식을 갖추고 있습니다.',
    duration: '총 2~3일',
    features: ['200개국 배송', '관세 전문', '화물 서비스'],
  },
];

const features = [
  { icon: 'ri-shield-check-line', title: '안전한 포장', desc: '전문 스태프가 물품을 철저히 보호하는 포장 서비스 제공' },
  { icon: 'ri-map-pin-2-line', title: '실시간 추적', desc: '배송 현황을 언제 어디서나 실시간으로 확인 가능' },
  { icon: 'ri-money-dollar-circle-line', title: '투명한 요금', desc: '숨은 비용 없는 명확하고 합리적인 가격 정책' },
  { icon: 'ri-customer-service-2-line', title: '전문 상담', desc: '배송 관련 모든 문의에 신속하게 답변해 드립니다' },
];

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">
            Our Services
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            배송 서비스 소개
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
            DKEXPRESS가 제공하는 다양한 배송 서비스를 확인하세요.<br />
            각 서비스별 특징과 배송 조회 방법을 안내해 드립니다.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {services.map((svc) => (
            <div
              key={svc.name}
              className={`bg-white rounded-2xl border ${svc.border} p-7 hover:-translate-y-1 transition-transform duration-300`}
            >
              <div className={`w-12 h-12 flex items-center justify-center ${svc.bg} rounded-xl mb-5`}>
                <i className={`${svc.icon} ${svc.color} text-2xl`}></i>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{svc.name}</h3>
              <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                <i className="ri-time-line"></i>
                {svc.duration}
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{svc.description}</p>
              <ul className="flex flex-col gap-2 mb-6">
                {svc.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <i className="ri-check-line text-orange-500"></i>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={svc.trackingUrl}
                target="_blank"
                rel="noopener nofollow"
                className={`inline-flex items-center gap-2 text-sm font-semibold ${svc.color} hover:underline cursor-pointer`}
              >
                배송 조회하기
                <i className="ri-external-link-line"></i>
              </a>
            </div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="w-10 h-10 flex items-center justify-center bg-orange-50 rounded-lg mb-4">
                <i className={`${f.icon} text-orange-500 text-xl`}></i>
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-1.5">{f.title}</h4>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
