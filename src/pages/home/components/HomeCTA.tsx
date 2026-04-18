import { useLang } from '@/contexts/LanguageContext';
import { useKakaoContactModal } from '@/contexts/KakaoContactModalContext';

export default function HomeCTA() {
  const { t } = useLang();
  const { openKakaoContactModal } = useKakaoContactModal();

  return (
    <section className="py-20 bg-[#F3F4F6]">
      <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
        <div className="bg-[#1E3A8A] rounded-3xl px-8 py-14 md:py-16">
          <span className="inline-block bg-orange-500/20 text-orange-300 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
            {t('2008년부터 시작한 신뢰할 수 있는 업체', 'Trusted Since 2008')}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            {t('지금 바로 상담하세요', 'Get a Free Consultation')}
          </h2>
          <p className="text-white/60 text-base mb-8 max-w-md mx-auto">
            {t(
              '빠른 상담으로 최적의 배송 방법을 안내해 드립니다.\n문의만 주시면 끝까지 책임지겠습니다.',
              'We\'ll find the best shipping solution for you.\nJust reach out — we\'ll handle everything.'
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={openKakaoContactModal}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full transition-all hover:scale-105 cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
            >
              <i className="ri-send-plane-line"></i>{t('문의하기', 'Contact Us')}
            </button>
            <button
              type="button"
              onClick={openKakaoContactModal}
              className="border border-white/30 hover:border-white text-white font-semibold px-8 py-4 rounded-full transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
            >
              <i className="ri-phone-line"></i>{t('전화 상담', 'Call Us')}
            </button>
            <button
              type="button"
              onClick={openKakaoContactModal}
              className="bg-[#FEE500] hover:bg-[#F5DC00] text-[#3C1E1E] font-bold px-8 py-4 rounded-full transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
            >
              <i className="ri-chat-3-line"></i>{t('카카오톡 상담', 'KakaoTalk')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
