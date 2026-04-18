import { useNavigate } from 'react-router-dom';
import { useLang } from '@/contexts/LanguageContext';
import { useKakaoContactModal } from '@/contexts/KakaoContactModalContext';

export default function Footer() {
  const navigate = useNavigate();
  const { t } = useLang();
  const { openKakaoContactModal } = useKakaoContactModal();

  const links = [
    { label: t('한국 일반 택배', 'Korea Shipping'), path: '/shipping' },
    { label: t('귀국 이사', 'Moving Service'), path: '/moving' },
    { label: t('이용 방법', 'How to Use'), path: '/how-to-use' },
    { label: t('고객 후기', 'Reviews'), path: '/reviews' },
    { label: 'FAQ', path: '/faq' },
    { label: t('배송조회', 'Tracking'), path: '/tracking' },
  ];

  return (
    <footer className="bg-[#0F2460] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 flex items-center justify-center bg-[#1E3A8A] rounded-lg border-2 border-orange-500">
                <i className="ri-flight-takeoff-line text-orange-400 text-lg"></i>
              </div>
              <div className="flex flex-col leading-none gap-0.5">
                <div className="flex items-baseline gap-0">
                  <span className="font-black text-2xl tracking-tight leading-none text-white">DK</span>
                  <span className="font-black text-2xl tracking-tight leading-none text-orange-400">Express</span>
                </div>
                <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-white/40">Since 2008 · NY→Korea</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              {t(
                '2008년부터 이어온 뉴욕-한국 국제 택배 전문 서비스.\nCJ택배 연계, 검증된 배송 시스템으로 안전하게.',
                'Specialized NY-Korea international shipping since 2008.\nSafe and verified delivery via CJ Logistics.'
              )}
            </p>
            <div className="flex flex-col gap-1.5 text-sm text-white/60">
              <span><i className="ri-map-pin-2-line mr-2 text-orange-400"></i>141-47 Northern Blvd, Flushing, NY 11354</span>
              <span><i className="ri-time-line mr-2 text-orange-400"></i>{t('월~금 9AM–6PM, 토 9:30AM–6PM', 'Mon–Fri 9AM–6PM, Sat 9:30AM–6PM')}</span>
              <a href="tel:7187626488" className="hover:text-orange-400 transition-colors cursor-pointer"><i className="ri-phone-line mr-2 text-orange-400"></i>(718) 762-6488</a>
              <a href="mailto:dkexpressusa@gmail.com" className="hover:text-orange-400 transition-colors cursor-pointer"><i className="ri-mail-line mr-2 text-orange-400"></i>dkexpressusa@gmail.com</a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-4">{t('메뉴', 'Menu')}</h4>
            <ul className="flex flex-col gap-2.5">
              {links.map((l) => (
                <li key={l.path}>
                  <button onClick={() => navigate(l.path)} className="text-white/60 text-sm hover:text-orange-400 transition-colors cursor-pointer">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-4">{t('고객문의', 'Contact')}</h4>
            <div className="space-y-3">
              <button
                type="button"
                onClick={openKakaoContactModal}
                className="flex items-center gap-2 text-white/60 text-sm hover:text-orange-400 transition-colors cursor-pointer text-left w-full bg-transparent border-0 p-0"
              >
                <i className="ri-chat-3-line text-orange-400"></i>KakaoTalk
              </button>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="flex items-center gap-2 text-white/60 text-sm hover:text-orange-400 transition-colors cursor-pointer text-left w-full bg-transparent border-0 p-0"
              >
                <i className="ri-send-plane-line text-orange-400"></i>{t('문의하기', 'Contact Us')}
              </button>
            </div>
            <div className="mt-6 bg-white/10 rounded-xl p-4">
              <p className="text-white/80 text-xs font-semibold mb-1">{t('빠른 상담', 'Quick Contact')}</p>
              <a href="tel:7187626488" className="text-orange-400 font-black text-lg cursor-pointer hover:text-orange-300 transition-colors">(718) 762-6488</a>
              <p className="text-white/50 text-xs mt-1">{t('월~금 9AM–6PM, 토 9:30AM–6PM', 'Mon–Fri 9AM–6PM, Sat 9:30AM–6PM')}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs">&copy; 2024 DKEXPRESS. All rights reserved.</p>
          <p className="text-white/40 text-xs">141-47 Northern Blvd, Flushing, NY 11354</p>
        </div>
      </div>
    </footer>
  );
}
