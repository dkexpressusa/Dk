export default function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-amber-50 border-t border-amber-100">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 flex items-center justify-center bg-orange-500 rounded-md">
                <i className="ri-flight-takeoff-line text-white text-lg"></i>
              </div>
              <span className="font-black text-xl text-gray-900">DKEXPRESS</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-5 max-w-xs">
              뉴욕 플러싱에서 10년 이상 운영 중인 한국-미국 국제 택배 전문 서비스. CJ택배, FedEx, DHL과 제휴하여 안전하고 빠른 배송을 제공합니다.
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <span><i className="ri-map-pin-2-line mr-2 text-orange-400"></i>141-47 Northern Blvd, Flushing, NY 11354</span>
              <span><i className="ri-time-line mr-2 text-orange-400"></i>월~금 9AM–6PM, 토 9:30AM–6PM</span>
              <a href="tel:7187626488" className="hover:text-orange-500 transition-colors cursor-pointer"><i className="ri-phone-line mr-2 text-orange-400"></i>(718) 762-6488 / 646-500-4659</a>
              <a href="mailto:dkexpressusa@gmail.com" className="hover:text-orange-500 transition-colors cursor-pointer"><i className="ri-mail-line mr-2 text-orange-400"></i>dkexpressusa@gmail.com</a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-black text-gray-900 text-sm mb-4">서비스</h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: '서비스 소개', id: 'services' },
                { label: '배송 절차', id: 'process' },
                { label: '고객 지원', id: 'support' },
                { label: '이용 후기', id: 'reviews' },
                { label: '문의하기', id: 'contact' },
              ].map((item) => (
                <li key={item.id}>
                  <button onClick={() => scrollTo(item.id)} className="text-gray-500 text-sm hover:text-orange-500 transition-colors cursor-pointer">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tracking */}
          <div>
            <h4 className="font-black text-gray-900 text-sm mb-4">배송 조회</h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'CJ택배 조회', url: 'https://www.cjlogistics.com/ko/tool/parcel/tracking' },
                { label: 'FedEx 조회', url: 'https://www.fedex.com/ko-kr/tracking.html' },
                { label: 'DHL 조회', url: 'https://www.dhl.com/kr-ko/home/tracking.html' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.url} target="_blank" rel="noopener nofollow" className="text-gray-500 text-sm hover:text-orange-500 transition-colors cursor-pointer flex items-center gap-1">
                    <i className="ri-external-link-line text-xs"></i>{item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 text-xs">&copy; 2024 DKEXPRESS. All rights reserved.</p>
          <p className="text-gray-400 text-xs">141-47 Northern Blvd, Flushing, NY 11354</p>
        </div>
      </div>
    </footer>
  );
}
