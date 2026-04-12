import { useState, useEffect } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/contexts/LanguageContext';
import { openKakaoChatLink } from '@/constants/openKakao';

interface FAQ {
  id: string;
  category: string;
  category_en: string | null;
  question: string;
  answer: string;
  question_en: string | null;
  answer_en: string | null;
  sort_order: number;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang, t } = useLang();

  useEffect(() => {
    const fetchFaqs = async () => {
      const { data, error } = await supabase.from('faqs').select('*').order('sort_order', { ascending: true });
      if (!error && data) setFaqs(data as FAQ[]);
      setLoading(false);
    };
    fetchFaqs();
  }, []);

  // 영어일 때 영어 컬럼 사용, 없으면 한국어 fallback
  const getCategory = (faq: FAQ) => lang === 'en' ? (faq.category_en || faq.category) : faq.category;
  const getQuestion = (faq: FAQ) => lang === 'en' ? (faq.question_en || faq.question) : faq.question;
  const getAnswer = (faq: FAQ) => lang === 'en' ? (faq.answer_en || faq.answer) : faq.answer;

  const categories = Array.from(new Set(faqs.map(f => getCategory(f))));
  const grouped = categories.map((cat, catIdx) => ({
    category: cat,
    catIdx,
    items: faqs.filter(f => getCategory(f) === cat),
  }));

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-16 bg-[#1E3A8A]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 text-orange-300 text-[11px] font-bold px-4 py-2 rounded-full mb-6 whitespace-nowrap">
            <i className="ri-shield-check-line flex-shrink-0"></i>{t('2008년부터 시작한 신뢰할 수 있는 업체. CJ택배', 'Trusted Since 2008 · CJ Logistics Partner')}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">{t('자주 묻는 질문', 'Frequently Asked Questions')}</h1>
          <p className="text-white/70 text-lg">{t('궁금하신 점을 빠르게 확인하세요', 'Find quick answers to your questions')}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <i className="ri-loader-4-line animate-spin text-2xl mr-2"></i>{t('불러오는 중...', 'Loading...')}
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <i className="ri-question-answer-line text-4xl mb-3 block"></i>
              <p>{t('등록된 FAQ가 없습니다', 'No FAQs available yet')}</p>
            </div>
          ) : (
            grouped.map(({ category, catIdx, items }) => (
              <div key={category} className="mb-12 last:mb-0">
                <h2 className="text-xl font-black text-[#1E3A8A] mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm">{catIdx + 1}</span>
                  {category}
                </h2>
                <div className="space-y-3">
                  {items.map((item) => {
                    const isOpen = openIndex === item.id;
                    return (
                      <div key={item.id} className="bg-[#F3F4F6] rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : item.id)}
                          className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                        >
                          <span className="font-bold text-gray-900 text-sm pr-4">{getQuestion(item)}</span>
                          <i className={`ri-${isOpen ? 'subtract' : 'add'}-line text-orange-500 text-xl flex-shrink-0`}></i>
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5">
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{getAnswer(item)}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          <div className="mt-16 bg-[#1E3A8A] rounded-2xl p-8 text-center">
            <h3 className="text-xl font-black text-white mb-2">{t('지금 바로 문의하세요', 'Still Have Questions?')}</h3>
            <p className="text-white/60 text-sm mb-6">{t('직접 문의하시면 빠르게 답변드리겠습니다', 'Contact us directly and we\'ll get back to you quickly')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a {...openKakaoChatLink} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-colors">
                <i className="ri-send-plane-line"></i>{t('문의하기', 'Contact Us')}
              </a>
              <a {...openKakaoChatLink} className="border border-white/30 hover:border-white text-white font-semibold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-colors">
                <i className="ri-phone-line"></i>{t('전화 상담', 'Call Us')}
              </a>
              <a {...openKakaoChatLink} className="bg-[#FEE500] hover:bg-[#F5DC00] text-[#3C1E1E] font-bold px-8 py-3.5 rounded-full cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-colors">
                <i className="ri-chat-3-line"></i>{t('카카오톡 상담', 'KakaoTalk')}
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
