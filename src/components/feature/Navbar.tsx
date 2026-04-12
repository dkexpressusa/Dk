import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLang } from '@/contexts/LanguageContext';
import { openKakaoChatLink } from '@/constants/openKakao';

const navLinksKo = [
  { label: '한국 일반 택배', labelEn: 'Korea Shipping', path: '/shipping' },
  { label: '귀국 이사', labelEn: 'Moving Service', path: '/moving' },
  { label: '이용 방법', labelEn: 'How to Use', path: '/how-to-use' },
  { label: '고객 후기', labelEn: 'Reviews', path: '/reviews' },
  { label: 'FAQ', labelEn: 'FAQ', path: '/faq' },
  { label: '배송조회', labelEn: 'Tracking', path: '/tracking' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { lang, setLang, t } = useLang();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDark = isHome && !scrolled;

  const handleLogoClick = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled || !isHome ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <button onClick={handleLogoClick} className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9 h-9 flex items-center justify-center bg-[#1E3A8A] rounded-lg border-2 border-orange-500">
            <i className={`ri-flight-takeoff-line text-lg ${isDark ? 'text-orange-400' : 'text-orange-400'}`}></i>
          </div>
          <div className="flex flex-col leading-none gap-0.5">
            <div className="flex items-baseline gap-0">
              <span className={`font-black text-2xl tracking-tight leading-none ${isDark ? 'text-white' : 'text-[#1E3A8A]'}`}>DK</span>
              <span className={`font-black text-2xl tracking-tight leading-none ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>Express</span>
            </div>
            <span className={`text-[8px] font-bold tracking-[0.2em] uppercase ${isDark ? 'text-white/50' : 'text-gray-400'}`}>Since 2008 · NY→Korea</span>
          </div>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinksKo.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                location.pathname === link.path
                  ? 'text-orange-500 font-bold'
                  : isDark
                  ? 'text-white/85 hover:text-white'
                  : 'text-gray-600 hover:text-[#1E3A8A]'
              }`}
            >
              {lang === 'ko' ? link.label : link.labelEn}
            </button>
          ))}
        </div>

        {/* CTA + Language */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Toggle */}
          <div className={`flex items-center rounded-full border text-xs font-bold overflow-hidden ${isDark ? 'border-white/30' : 'border-gray-200'}`}>
            <button
              onClick={() => setLang('ko')}
              className={`px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                lang === 'ko'
                  ? 'bg-orange-500 text-white'
                  : isDark
                  ? 'text-white/70 hover:text-white'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              KO
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                lang === 'en'
                  ? 'bg-orange-500 text-white'
                  : isDark
                  ? 'text-white/70 hover:text-white'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              EN
            </button>
          </div>

          <a
            {...openKakaoChatLink}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors whitespace-nowrap cursor-pointer inline-flex items-center justify-center"
          >
            {t('문의하기', 'Contact Us')}
          </a>
        </div>

        {/* Mobile */}
        <button
          className={`md:hidden w-8 h-8 flex items-center justify-center cursor-pointer ${isDark ? 'text-white' : 'text-gray-800'}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`text-xl ${menuOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-3">
          {navLinksKo.map((link) => (
            <button
              key={link.path}
              onClick={() => { navigate(link.path); setMenuOpen(false); }}
              className={`text-left text-sm font-medium cursor-pointer py-1 ${location.pathname === link.path ? 'text-orange-500 font-bold' : 'text-gray-700 hover:text-orange-500'}`}
            >
              {lang === 'ko' ? link.label : link.labelEn}
            </button>
          ))}
          {/* Mobile Language Toggle */}
          <div className="flex items-center gap-2 py-1">
            <span className="text-xs text-gray-400 font-semibold">Language:</span>
            <div className="flex items-center rounded-full border border-gray-200 text-xs font-bold overflow-hidden">
              <button
                onClick={() => { setLang('ko'); setMenuOpen(false); }}
                className={`px-3 py-1.5 transition-colors cursor-pointer ${lang === 'ko' ? 'bg-orange-500 text-white' : 'text-gray-500'}`}
              >
                KO
              </button>
              <button
                onClick={() => { setLang('en'); setMenuOpen(false); }}
                className={`px-3 py-1.5 transition-colors cursor-pointer ${lang === 'en' ? 'bg-orange-500 text-white' : 'text-gray-500'}`}
              >
                EN
              </button>
            </div>
          </div>
          <a {...openKakaoChatLink} onClick={() => setMenuOpen(false)} className="bg-orange-500 text-white text-sm font-bold px-5 py-2.5 rounded-full whitespace-nowrap cursor-pointer mt-2 inline-flex items-center justify-center">
            {t('문의하기', 'Contact Us')}
          </a>
        </div>
      )}
    </nav>
  );
}
