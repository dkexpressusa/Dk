import { useEffect, useState } from "react";
import { PHONE_DISPLAY, PHONE_TEL_HREF } from "@/constants/phoneContact";

interface PhoneModalProps {
  onClose: () => void;
}

export default function PhoneModal({ onClose }: PhoneModalProps) {
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const showCopiedToast = () => {
    setToast(true);
    window.setTimeout(() => setToast(false), 2500);
  };

  const digitsOnly = PHONE_DISPLAY.replace(/\D/g, "");

  const handleCopy = () => {
    void navigator.clipboard.writeText(digitsOnly).then(showCopiedToast).catch(() => {
      try {
        const ta = document.createElement("textarea");
        ta.value = digitsOnly;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showCopiedToast();
      } catch {
        /* ignore */
      }
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
        role="presentation"
      >
        <div
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="phone-modal-title"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
            aria-label="닫기"
          >
            <i className="ri-close-line text-2xl leading-none" />
          </button>

          <div className="px-5 pb-6 pt-14 sm:px-8 sm:pb-8 sm:pt-16">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <i className="ri-phone-line text-orange-500 text-3xl" />
              </div>
            </div>

            <h2
              id="phone-modal-title"
              className="text-center text-xl font-black text-[#1E3A8A] sm:text-2xl"
            >
              전화 상담 안내
            </h2>

            <p className="mt-3 text-center text-sm leading-relaxed text-gray-500">
              아래 번호로 전화 주시면 빠르게 안내해 드립니다.
            </p>

            <a
              href={PHONE_TEL_HREF}
              className="mt-8 flex w-full items-center justify-center rounded-2xl bg-[#1E3A8A] py-4 text-center text-2xl font-black text-white transition-colors hover:bg-[#163070] cursor-pointer"
            >
              {PHONE_DISPLAY}
            </a>

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer whitespace-nowrap"
              >
                번호 복사
              </button>
            </div>

            <p className="mt-6 text-center text-xs leading-relaxed text-gray-400">
              모바일에서는 위 번호를 누르면 전화 앱으로 연결됩니다.
              <br />
              월~금 9AM–6PM, 토 9:30AM–6PM
            </p>
          </div>
        </div>
      </div>

      {toast && (
        <div
          className="fixed bottom-8 left-1/2 z-[300] -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg"
          role="status"
        >
          번호가 복사되었습니다
        </div>
      )}
    </>
  );
}
