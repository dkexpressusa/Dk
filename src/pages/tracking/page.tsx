import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useLang } from '@/contexts/LanguageContext';
import { useKakaoContactModal } from '@/contexts/KakaoContactModalContext';
import { usePhoneContactModal } from '@/contexts/PhoneContactModalContext';

export default function TrackingPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { openKakaoContactModal } = useKakaoContactModal();
  const { openPhoneContactModal } = usePhoneContactModal();

  const trackingLinks = [
    { name: t('CJ택배', 'CJ Logistics'), url: 'https://www.cjlogistics.com/ko/tool/parcel/tracking', desc: t('한국 내 최종 배송 조회', 'Final delivery tracking in Korea'), color: 'bg-[#1E3A8A]' },
    { name: 'FedEx', url: 'https://www.fedex.com/ko-kr/tracking.html', desc: t('국제 항공 운송 조회', 'International air freight tracking'), color: 'bg-[#4B1480]' },
    { name: 'DHL', url: 'https://www.dhl.com/kr-ko/home/tracking.html', desc: t('국제 항공 운송 조회', 'International air freight tracking'), color: 'bg-[#D40511]' },
  ];

  const notices = [
    t('배송 접수 후 24시간 이내에 운송장 번호가 발급됩니다.', 'A tracking number will be issued within 24 hours of shipment registration.'),
    t('국제 항공 운송은 FedEx 또는 DHL로 진행되며, 한국 내 배송은 CJ택배로 연계됩니다.', 'International air freight is handled by FedEx or DHL, and domestic delivery in Korea is via CJ Logistics.'),
    t('운송장 번호가 확인되지 않거나 조회가 불가능한 경우 고객센터로 문의해 주세요.', 'If your tracking number is not found or tracking is unavailable, please contact our customer service.'),
    t('배송 현황은 실시간으로 업데이트되며, 도착 예정일은 현지 사정에 따라 변경될 수 있습니다.', 'Tracking status is updated in real time. Estimated arrival dates may change due to local conditions.'),
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-16 bg-[#1E3A8A]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 text-orange-300 text-[11px] font-bold px-4 py-2 rounded-full mb-6 whitespace-nowrap">
            <i className="ri-shield-check-line flex-shrink-0"></i>{t('2008년부터 시작한 신뢰할 수 있는 업체. CJ택배', 'Trusted Since 2008 · CJ Logistics Partner')}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">{t('배송 조회', 'Shipment Tracking')}</h1>
          <p className="text-white/70 text-lg max-w-xl">{t('운송장 번호로 실시간 배송 현황을 확인하세요', 'Check your real-time shipment status with your tracking number')}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {trackingLinks.map((item) => (
              <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="group bg-[#F3F4F6] hover:bg-white rounded-2xl p-8 border border-gray-100 hover:border-orange-200 transition-all cursor-pointer">
                <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <i className="ri-truck-line text-white text-2xl"></i>
                </div>
                <h3 className="font-black text-gray-900 text-xl mb-2">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{item.desc}</p>
                <div className="flex items-center text-orange-500 font-semibold text-sm">
                  <span>{t('조회하기', 'Track Now')}</span>
                  <i className="ri-arrow-right-line ml-1 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </a>
            ))}
          </div>

          <div className="bg-[#F3F4F6] rounded-3xl p-8 md:p-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-information-line text-orange-500 text-3xl"></i>
              </div>
              <h3 className="text-2xl font-black text-[#1E3A8A] mb-4">{t('배송 조회 안내', 'Tracking Guide')}</h3>
              <div className="text-left space-y-4 text-gray-600 text-sm mb-10">
                {notices.map((n, i) => (
                  <p key={i} className="flex items-start gap-3">
                    <i className="ri-check-line text-orange-500 mt-0.5"></i>
                    <span>{n}</span>
                  </p>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-8">
                <p className="text-gray-500 text-sm mb-5">{t('문의가 필요하신가요?', 'Need assistance?')}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button type="button" onClick={() => navigate('/contact')} className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full transition-colors cursor-pointer whitespace-nowrap">
                    <i className="ri-send-plane-line"></i>{t('문의하기', 'Contact Us')}
                  </button>
                  <button type="button" onClick={openPhoneContactModal} className="inline-flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#152a66] text-white font-bold px-8 py-3.5 rounded-full transition-colors cursor-pointer whitespace-nowrap">
                    <i className="ri-phone-line"></i>{t('전화 상담', 'Call Us')}
                  </button>
                  <button type="button" onClick={openKakaoContactModal} className="inline-flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#F5DC00] text-[#3C1E1E] font-bold px-8 py-3.5 rounded-full transition-colors cursor-pointer whitespace-nowrap">
                    <i className="ri-chat-3-line"></i>{t('카카오톡 상담', 'KakaoTalk')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
