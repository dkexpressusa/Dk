import { openKakaoChatLink } from '@/constants/openKakao';

const supportItems = [
  {
    icon: 'ri-search-eye-line',
    title: '배송 조회',
    desc: '홈페이지 상단의 배송 조회 버튼을 클릭한 후 송장번호를 입력하시면 실시간으로 배송 현황을 확인하실 수 있습니다.',
    links: [
      { label: 'CJ택배 배송조회', url: 'https://www.cjlogistics.com/ko/tool/parcel/tracking' },
      { label: 'FedEx 배송조회', url: 'https://www.fedex.com/ko-kr/tracking.html' },
      { label: 'DHL 배송조회', url: 'https://www.dhl.com/kr-ko/home/tracking.html' },
    ],
  },
  {
    icon: 'ri-forbid-2-line',
    title: '배송 제한 품목',
    desc: '일반 생활용품, 의류, 식품(일부 제한), 전자제품 등 대부분의 물품 배송이 가능합니다. 단, 위험물, 동식물, 귀중품, 불법 물품 등은 배송이 제한됩니다.',
    links: [],
  },
  {
    icon: 'ri-money-dollar-circle-line',
    title: '관세 및 보상 안내',
    desc: '한국으로의 배송 시 15만원 이상의 물품에는 관세가 부과될 수 있으며, 이는 수취인 부담입니다. 모든 배송은 기본 보험이 적용되며 최대 $500까지 보상 가능합니다.',
    links: [],
  },
];

export default function Support() {
  return (
    <section id="support" className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">
            Customer Support
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            고객 지원
          </h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            배송 조회부터 관세 안내까지, 고객님이 필요한 모든 정보를 제공합니다
          </p>
        </div>

        {/* Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {supportItems.map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-7 border border-gray-100">
              <div className="w-12 h-12 flex items-center justify-center bg-orange-50 rounded-xl mb-5">
                <i className={`${item.icon} text-orange-500 text-2xl`}></i>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.desc}</p>
              {item.links.length > 0 && (
                <div className="flex flex-col gap-2">
                  {item.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener nofollow"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:underline cursor-pointer"
                    >
                      <i className="ri-external-link-line"></i>
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Banner */}
        <div className="bg-gray-900 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-black text-xl md:text-2xl mb-2">
              배송 불가 품목이나 특수 문의가 있으신가요?
            </h3>
            <p className="text-gray-400 text-sm">유선 또는 이메일로 문의해 주시면 신속하게 답변해 드립니다.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              {...openKakaoChatLink}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-chat-3-line"></i>
              카카오톡 상담
            </a>
            <a
              {...openKakaoChatLink}
              className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white font-semibold px-6 py-3 rounded-full transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-send-plane-line"></i>
              문의하기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
