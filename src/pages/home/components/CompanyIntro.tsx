import { useLang } from '@/contexts/LanguageContext';

export default function CompanyIntro() {
  const { t } = useLang();

  const pillars = [
    { icon: 'ri-medal-line', title: t('비전', 'Vision'), desc: t('글로벌 물류의 새로운 기준을 제시합니다', 'Setting a new standard in global logistics') },
    { icon: 'ri-user-star-line', title: t('전문 인력', 'Expert Team'), desc: t('물류 전문가들이 최상의 서비스를 제공합니다', 'Logistics professionals delivering top-tier service') },
    { icon: 'ri-building-4-line', title: t('인프라', 'Infrastructure'), desc: t('뉴욕과 한국을 연결하는 강력한 물류 네트워크', 'A powerful logistics network connecting NY and Korea') },
  ];

  const sections = [
    { num: '1', title: t('회사 소개', 'About Us'), desc: t('DKEXPRESS의 역사와 서비스 철학을 알아보세요. 뉴욕과 한국을 연결하는 신뢰할 수 있는 물류 파트너입니다.', 'Learn about DKEXPRESS\'s history and service philosophy — your trusted logistics partner between NY and Korea.'), icon: 'ri-building-line' },
    { num: '2', title: t('비전 및 강점', 'Vision & Strengths'), desc: t('글로벌 물류의 새로운 기준을 제시하는 DKEXPRESS의 비전과 전문 인력, 강력한 인프라를 소개합니다.', 'Discover DKEXPRESS\'s vision, expert team, and powerful infrastructure setting new global logistics standards.'), icon: 'ri-eye-line' },
    { num: '3', title: t('고객 센터', 'Customer Support'), desc: t('문의사항이 있으신가요? 언제든지 연락주세요. 최선을 다해 도움을 드리겠습니다.', 'Have questions? Contact us anytime. We\'re always here to help.'), icon: 'ri-customer-service-2-line' },
  ];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="mb-14">
          <span className="inline-block text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">About Us</span>
          <h2 className="text-3xl md:text-5xl font-black text-[#1E3A8A] mb-3">{t('회사 소개', 'About DKEXPRESS')}</h2>
          <p className="text-gray-500 text-base">{t('세 가지 핵심 페이지로 DKEXPRESS를 만나보세요', 'Get to know DKEXPRESS through three key pillars')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {sections.map((s) => (
            <div key={s.num} className="border border-gray-100 rounded-2xl p-7 bg-gray-50 hover:bg-[#1E3A8A] group transition-all duration-300 cursor-default">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-100 group-hover:bg-orange-500 transition-colors duration-300">
                  <i className={`${s.icon} text-orange-500 group-hover:text-white text-lg transition-colors duration-300`}></i>
                </div>
                <span className="text-xs font-bold text-gray-400 group-hover:text-white/50 transition-colors duration-300 uppercase tracking-widest">{s.num}.</span>
              </div>
              <h3 className="text-lg font-black text-[#1E3A8A] group-hover:text-white mb-2 transition-colors duration-300">{s.title}</h3>
              <p className="text-gray-500 group-hover:text-white/70 text-sm leading-relaxed transition-colors duration-300">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#1E3A8A] rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {pillars.map((p, idx) => (
              <div key={p.title} className={`flex items-start gap-5 p-8 md:p-10 ${idx < pillars.length - 1 ? 'border-b md:border-b-0 md:border-r border-white/10' : ''}`}>
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white/10 rounded-xl">
                  <i className={`${p.icon} text-orange-400 text-2xl`}></i>
                </div>
                <div>
                  <h4 className="text-white font-black text-base mb-1">{p.title}</h4>
                  <p className="text-white/60 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
