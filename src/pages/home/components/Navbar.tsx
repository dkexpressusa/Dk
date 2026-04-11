import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollTo('hero')}>
          <div className="w-9 h-9 flex items-center justify-center bg-[#1E3A8A] rounded-lg border-2 border-orange-500">
            <i className="ri-flight-takeoff-line text-orange-400 text-lg"></i>
          </div>
          <div className="flex flex-col leading-none gap-0.5">
            <div className="flex items-baseline gap-0">
              <span className={`font-black text-2xl tracking-tight leading-none ${scrolled ? 'text-[#1E3A8A]' : 'text-white'}`}>DK</span>
              <span className="font-black text-2xl tracking-tight leading-none text-orange-400">Express</span>
            </div>
            <span className={`text-[8px] font-bold tracking-[0.2em] uppercase ${scrolled ? 'text-gray-400' : 'text-white/50'}`}>Since 2008 · NY→Korea</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: '서비스 소개', id: 'services' },
            { label: '배송 절차', id: 'process' },
            { label: '고객 지원', id: 'support' },
            { label: '이용 후기', id: 'reviews' },
            { label: '연락처', id: 'contact' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                scrolled ? 'text-gray-600 hover:text-orange-500' : 'text-white/90 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:7187626488"
            className={`text-sm font-medium whitespace-nowrap ${scrolled ? 'text-gray-700' : 'text-white/90'}`}
          >
            <i className="ri-phone-line mr-1"></i>718-762-6488
          </a>
          <button
            onClick={() => scrollTo('contact')}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors whitespace-nowrap cursor-pointer"
          >
            문의하기
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`md:hidden w-8 h-8 flex items-center justify-center cursor-pointer ${scrolled ? 'text-gray-800' : 'text-white'}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`text-xl ${menuOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {[
            { label: '서비스 소개', id: 'services' },
            { label: '배송 절차', id: 'process' },
            { label: '고객 지원', id: 'support' },
            { label: '이용 후기', id: 'reviews' },
            { label: '연락처', id: 'contact' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-left text-gray-700 font-medium text-sm cursor-pointer hover:text-orange-500 transition-colors"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('contact')}
            className="bg-orange-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full whitespace-nowrap cursor-pointer"
          >
            문의하기
          </button>
        </div>
      )}
    </nav>
  );
}
