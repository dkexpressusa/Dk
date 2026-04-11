import { useState } from 'react';

const reviews = [
  {
    name: '김지현',
    location: '뉴욕 퀸즈 거주',
    rating: 5,
    text: '지난 3년간 DKEXPRESS를 통해 한국으로 물품을 보내고 있습니다. 항상 정확한 시간에 배송되고, 어떤 물품도 손상 없이 도착했습니다. 특히 명절 선물 배송 때 보여준 신속함에 매우 감동받았습니다.',
  },
  {
    name: '박성민',
    location: '뉴저지 거주',
    rating: 5,
    text: '처음에는 반신반의했는데, 이제는 한국에 물건 보낼 때 무조건 DKEXPRESS입니다. 직원분들이 너무 친절하고 포장도 꼼꼼하게 해주셔서 항상 안심이 됩니다. 강력 추천합니다!',
  },
  {
    name: '이수연',
    location: '맨해튼 거주',
    rating: 5,
    text: '귀국 이사 때 이용했는데 정말 만족스러웠어요. 짐이 많았는데도 꼼꼼하게 포장해주시고 한국에 무사히 도착했습니다. 가격도 합리적이고 서비스도 최고예요.',
  },
  {
    name: '최준혁',
    location: '브루클린 거주',
    rating: 5,
    text: '한국 부모님께 선물을 보낼 때마다 이용합니다. 실시간 추적이 가능해서 부모님도 언제 도착하는지 알 수 있어서 좋아하세요. 10년 경력이 느껴지는 믿음직한 서비스입니다.',
  },
];

export default function Reviews() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? reviews.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === reviews.length - 1 ? 0 : c + 1));

  const review = reviews[current];

  return (
    <section id="reviews" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-orange-500 text-xs font-bold tracking-widest uppercase mb-3">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            이용 후기 및 추천
          </h2>
          <p className="text-gray-500 text-base">고객들이 직접 경험한 DKEXPRESS 서비스</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-16 max-w-lg mx-auto">
          {[
            { value: '98%', label: '정시 배송률', sub: '약속한 시간 내 배송' },
            { value: '10년', label: '서비스 경력', sub: '쌓아온 전문성' },
          ].map((s) => (
            <div key={s.label} className="text-center bg-orange-50 rounded-2xl p-8 border border-orange-100">
              <p className="text-4xl md:text-5xl font-black text-orange-500 mb-1">{s.value}</p>
              <p className="font-bold text-gray-900 text-sm mb-1">{s.label}</p>
              <p className="text-gray-400 text-xs">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Review Carousel */}
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100 max-w-3xl mx-auto">
          <div className="flex gap-1 mb-6">
            {Array.from({ length: review.rating }).map((_, i) => (
              <i key={i} className="ri-star-fill text-orange-400 text-lg"></i>
            ))}
          </div>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-8 italic">
            &ldquo;{review.text}&rdquo;
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-black text-gray-900">{review.name}</p>
              <p className="text-gray-400 text-sm">{review.location}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full hover:border-orange-400 transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-line text-gray-600"></i>
              </button>
              <button
                onClick={next}
                className="w-10 h-10 flex items-center justify-center bg-orange-500 rounded-full hover:bg-orange-600 transition-colors cursor-pointer"
              >
                <i className="ri-arrow-right-line text-white"></i>
              </button>
            </div>
          </div>
          {/* Dots */}
          <div className="flex gap-2 mt-6">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === current ? 'w-6 bg-orange-500' : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
