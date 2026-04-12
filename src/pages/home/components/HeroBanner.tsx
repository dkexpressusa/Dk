import { useLang } from '@/contexts/LanguageContext';
import { openKakaoChatLink } from '@/constants/openKakao';

export default function HeroBanner() {
  const { lang, t } = useLang();

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-x-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/hero_bg.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1a4a]/92 via-[#0a1a4a]/75 to-[#0a1a4a]/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full pt-24 pb-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 text-orange-300 text-[11px] font-bold px-4 py-2 rounded-full mb-6 backdrop-blur-sm whitespace-nowrap">
            <i className="ri-shield-check-line flex-shrink-0"></i>
            {t('뉴욕에서 한국까지, 믿고 맡기는 17년 택배 파트너', 'Your trusted NY-Korea shipping partner since 2008')}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight mb-5">
            {lang === 'ko' ? (
              <>2008년부터 시작한<br /><span className="text-orange-400">신뢰할 수 있는</span> 업체,<br />CJ택배</>
            ) : (
              <><span className="text-orange-400">Trusted</span> Since 2008,<br /><span className="text-white">DK</span><span className="text-orange-400">Express</span></>
            )}
          </h1>
          <p className="text-white/75 text-base md:text-lg leading-relaxed mb-3">
            {t('뉴욕에서 한국까지, 믿고 맡기는 17년 택배 파트너', 'Your trusted NY-to-Korea shipping partner for 17 years')}
          </p>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            {lang === 'ko' ? (
              <>유학생 귀국 짐, 걱정 없이 보내세요. CJ택배 연계, 검증된 국제 배송 서비스.<br className="hidden sm:block" />뉴욕 출발 → 한국 도착까지 전 과정 책임 배송.</>
            ) : (
              <>Send your belongings back to Korea with ease. Verified international shipping via CJ Logistics.<br className="hidden sm:block" />Full responsibility from New York to Korea arrival.</>
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <a
              {...openKakaoChatLink}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 text-base"
            >
              <i className="ri-send-plane-line"></i>
              {t('문의하기', 'Contact Us')}
            </a>
            <a
              {...openKakaoChatLink}
              className="border border-white/40 hover:border-white text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 backdrop-blur-sm whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 text-base"
            >
              <i className="ri-phone-line"></i>
              {t('전화 상담', 'Call Us')}
            </a>
            <a
              {...openKakaoChatLink}
              className="bg-[#FEE500] hover:bg-[#F5DC00] text-[#3C1E1E] font-bold px-8 py-4 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 text-base"
            >
              <i className="ri-chat-3-line"></i>
              {t('카카오톡 상담', 'KakaoTalk')}
            </a>
          </div>

          <div className="flex flex-wrap gap-6">
            {[
              { value: '17+', label: t('운영 경력 (2008~)', 'Years of Service') },
              { value: '98%', label: t('정시 배송률', 'On-time Delivery') },
              { value: 'CJ', label: t('택배 연계', 'Official Partner') },
              { value: '24/7', label: t('고객 지원', 'Customer Support') },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-white font-black text-2xl">{s.value}</p>
                <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 w-full flex justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-1 animate-bounce">
          <p className="text-white/40 text-xs">{t('스크롤', 'Scroll')}</p>
          <i className="ri-arrow-down-line text-white/40"></i>
        </div>
      </div>
    </section>
  );
}
