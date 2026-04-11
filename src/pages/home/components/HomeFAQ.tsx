import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/contexts/LanguageContext';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  question_en?: string;
  answer_en?: string;
  sort_order: number;
}

export default function HomeFAQ() {
  const [open, setOpen] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const { lang, t } = useLang();

  useEffect(() => {
    const fetchFaqs = async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('id, question, answer, sort_order')
        .order('sort_order', { ascending: true })
        .limit(6);
      if (!error && data) setFaqs(data as FAQ[]);
    };
    fetchFaqs();
  }, []);

  const fallbackFaqs: FAQ[] = [
    { id: 'f1', question: '배송 기간이 얼마나 걸리나요?', answer: '일반 택배는 3~5일, 귀국 이사는 5~10일 소요됩니다.', question_en: 'How long does shipping take?', answer_en: 'Regular parcels take 3–5 days, and moving shipments take 5–10 days.', sort_order: 1 },
    { id: 'f2', question: '배송 가능한 물품은 무엇인가요?', answer: '의류, 생활용품, 전자제품, 화장품 등 대부분의 일반 물품이 가능합니다.', question_en: 'What items can be shipped?', answer_en: 'Most general items including clothing, household goods, electronics, and cosmetics are accepted.', sort_order: 2 },
    { id: 'f3', question: '배송비는 어떻게 계산되나요?', answer: '무게와 부피에 따라 계산됩니다. 정확한 견적은 문의해 주세요.', question_en: 'How is the shipping cost calculated?', answer_en: 'Costs are based on weight and volume. Please contact us for an accurate quote.', sort_order: 3 },
    { id: 'f4', question: '픽업 서비스가 있나요?', answer: '네, 뉴욕 일부 지역에서 픽업 서비스를 제공합니다. 문의해 주세요.', question_en: 'Is pickup service available?', answer_en: 'Yes, we offer pickup service in select areas of New York. Please contact us for details.', sort_order: 4 },
    { id: 'f5', question: '배송 추적이 가능한가요?', answer: '네, CJ택배 및 FedEx/DHL 운송장 번호로 실시간 추적이 가능합니다.', question_en: 'Can I track my shipment?', answer_en: 'Yes, real-time tracking is available via CJ Logistics and FedEx/DHL tracking numbers.', sort_order: 5 },
    { id: 'f6', question: '포장재를 제공해 주시나요?', answer: '네, 박스, 에어캡 등 포장재를 제공해 드립니다.', question_en: 'Do you provide packing materials?', answer_en: 'Yes, we provide boxes, bubble wrap, and other packing materials.', sort_order: 6 },
  ];

  const displayFaqs = faqs.length > 0 ? faqs : fallbackFaqs;

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <div className="text-center mb-14">
          <span className="inline-block text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-black text-[#1E3A8A] mb-4">{t('자주 묻는 질문', 'Frequently Asked Questions')}</h2>
          <p className="text-gray-500 text-base">{t('문의 전 불안을 해소해 드립니다', 'Find answers before reaching out')}</p>
        </div>

        <div className="flex flex-col gap-3">
          {displayFaqs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-gray-900 text-sm pr-4">
                  {lang === 'en' && faq.question_en ? faq.question_en : faq.question}
                </span>
                <i className={`ri-arrow-down-s-line text-gray-400 text-xl flex-shrink-0 transition-transform duration-200 ${open === faq.id ? 'rotate-180' : ''}`}></i>
              </button>
              {open === faq.id && (
                <div className="px-6 pb-5">
                  <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-wrap">
                    {lang === 'en' && faq.answer_en ? faq.answer_en : faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
