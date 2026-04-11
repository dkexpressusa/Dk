import { useEffect, useState } from 'react';

interface KakaoModalProps {
  onClose: () => void;
}

export default function KakaoModal({ onClose }: KakaoModalProps) {
  const [copied, setCopied] = useState(false);
  const kakaoId = 'dkexpress';

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(kakaoId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 mx-4 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 카카오 아이콘 */}
        <div className="w-16 h-16 bg-[#FEE500] rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-chat-3-line text-[#3C1E1E] text-3xl"></i>
        </div>
        <h3 className="text-xl font-black text-[#1E3A8A] mb-1">카카오톡 상담</h3>
        <p className="text-gray-500 text-sm mb-6">아이디로 검색하거나 QR코드를 스캔해 주세요</p>

        {/* QR 코드 */}
        <div className="bg-[#F3F4F6] rounded-2xl p-5 mb-5">
          <p className="text-xs text-gray-400 font-semibold mb-3">카카오톡 QR 코드</p>
          <div className="w-40 h-40 mx-auto bg-white rounded-xl flex items-center justify-center border border-gray-200 overflow-hidden">
            <img
              src="/images/KakaoTalk_20260407_002904904.jpg"
              alt="카카오톡 QR코드"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-xs text-gray-400 mt-3">카카오톡 앱에서 QR코드 스캔</p>
        </div>

        {/* 아이디 복사 */}
        <div className="bg-[#FEE500]/20 border border-[#FEE500] rounded-2xl p-4 mb-5">
          <p className="text-xs text-gray-500 font-semibold mb-2">카카오톡 아이디</p>
          <div className="flex items-center justify-between gap-3">
            <span className="font-black text-[#1E3A8A] text-xl tracking-wide">{kakaoId}</span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-[#FEE500] hover:bg-[#F5DC00] text-[#3C1E1E]'
              }`}
            >
              <i className={`${copied ? 'ri-check-line' : 'ri-file-copy-line'}`}></i>
              {copied ? '복사됨!' : '복사'}
            </button>
          </div>
        </div>

        <p className="text-gray-400 text-xs mb-5">
          카카오톡 앱 &rarr; 친구 &rarr; 검색에서<br />
          아이디를 입력하거나 QR코드를 스캔하세요
        </p>

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
