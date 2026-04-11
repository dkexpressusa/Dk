import { useEffect } from 'react';

interface PhoneModalProps {
  onClose: () => void;
}

export default function PhoneModal({ onClose }: PhoneModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 mx-4 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-phone-line text-orange-500 text-3xl"></i>
        </div>
        <h3 className="text-xl font-black text-[#1E3A8A] mb-2">전화 상담</h3>
        <p className="text-gray-500 text-sm mb-6">아래 번호로 전화 주시면 빠르게 안내해 드립니다</p>
        <a
          href="tel:7187626488"
          className="block bg-[#1E3A8A] hover:bg-[#163070] text-white font-black text-2xl py-4 rounded-2xl transition-colors cursor-pointer mb-5"
        >
          (718) 762-6488
        </a>
        <p className="text-gray-400 text-xs mb-5">월~금 9AM–6PM, 토 9:30AM–6PM<br />PC에서는 번호를 확인 후 핸드폰으로 전화해 주세요</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
