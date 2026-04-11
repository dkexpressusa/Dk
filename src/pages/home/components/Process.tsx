const steps = [
  {
    num: '01',
    icon: 'ri-inbox-archive-line',
    title: '접수 및 포장',
    desc: '매장 방문 또는 전화로 배송 서비스를 신청하고 물품을 맡깁니다. 전문 스태프가 물품을 안전하게 포장하고 배송 방식에 따라 분류합니다.',
  },
  {
    num: '02',
    icon: 'ri-flight-takeoff-line',
    title: '국제 운송',
    desc: '항공편을 통해 한국으로 물품이 운송됩니다. CJ택배 3~5일, FedEx 2~3일, DHL 2~3일 소요됩니다.',
  },
  {
    num: '03',
    icon: 'ri-map-pin-2-line',
    title: '국내 배송 및 추적',
    desc: '한국 내 배송 파트너를 통해 최종 목적지까지 배송됩니다. 모든 배송은 실시간 추적 서비스를 통해 현재 위치와 상태를 확인하실 수 있습니다.',
  },
];

const stats = [
  { value: '98%', label: '정시 배송률' },
  { value: '10년+', label: '서비스 경력' },
  { value: '2~5일', label: '평균 배송 기간' },
  { value: '24/7', label: '고객 지원' },
];

export default function Process() {
  return (
    <section id="process" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">
            How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            배송 절차 및 소요 시간
          </h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            저희 서비스는 다음과 같이 3단계로 진행됩니다
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-orange-200 z-0" style={{ left: '16.67%', right: '16.67%' }} />

          {steps.map((step, idx) => (
            <div key={step.num} className="relative z-10 flex flex-col items-center text-center">
              {/* Step circle */}
              <div className="w-20 h-20 flex items-center justify-center bg-orange-500 rounded-full mb-6 shadow-lg shadow-orange-200 relative">
                <i className={`${step.icon} text-white text-3xl`}></i>
                <span className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center bg-gray-900 text-white text-xs font-black rounded-full">
                  {idx + 1}
                </span>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100"
            >
              <p className="text-3xl md:text-4xl font-black text-orange-500 mb-1">{stat.value}</p>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Shipping time detail */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <i className="ri-time-line text-orange-500"></i>
            배송사별 소요 시간 안내
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { carrier: 'CJ택배', time: '총 3~5일', detail: '항공 1~3일 + 국내 배송 1~2일', color: 'bg-red-500' },
              { carrier: 'FedEx', time: '총 2~3일', detail: '항공 1~2일 + 국내 배송 1일', color: 'bg-orange-500' },
              { carrier: 'DHL', time: '총 2~3일', detail: '항공 1~2일 + 국내 배송 1일', color: 'bg-yellow-500' },
            ].map((item) => (
              <div key={item.carrier} className="flex items-start gap-4">
                <div className={`w-2 h-2 rounded-full ${item.color} mt-2 flex-shrink-0`} />
                <div>
                  <p className="font-bold text-gray-900 text-sm">{item.carrier}</p>
                  <p className="text-orange-500 font-black text-lg">{item.time}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
