import { useEffect, useState } from "react";
import {
  KAKAO_QR_IMAGE_SRC,
  KAKAO_TALK_ID_COPY,
  KAKAO_TALK_ID_LABEL,
} from "@/constants/kakaoContact";

interface KakaoModalProps {
  onClose: () => void;
}

export default function KakaoModal({ onClose }: KakaoModalProps) {
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

  const handleCopy = () => {
    void navigator.clipboard.writeText(KAKAO_TALK_ID_COPY).then(showCopiedToast).catch(() => {
      try {
        const ta = document.createElement("textarea");
        ta.value = KAKAO_TALK_ID_COPY;
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
          aria-labelledby="kakao-modal-title"
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
            <h2
              id="kakao-modal-title"
              className="text-center text-xl font-black text-[#1E3A8A] sm:text-2xl"
            >
              카카오톡 문의 안내
            </h2>

            <div className="my-6 flex justify-center sm:my-8">
              <div className="w-full max-w-[240px] rounded-xl bg-[#F3F4F6] p-4 sm:max-w-[260px] sm:p-5">
                <img
                  src={KAKAO_QR_IMAGE_SRC}
                  alt="카카오톡 QR 코드"
                  className="mx-auto h-auto w-full max-h-[260px] object-contain"
                  width={260}
                  height={260}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <p className="text-center text-lg font-bold tracking-wide text-gray-900 sm:text-left sm:text-xl">
                {KAKAO_TALK_ID_LABEL}
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 rounded-full bg-[#FEE500] px-5 py-2.5 text-sm font-bold text-[#3C1E1E] transition-colors hover:bg-[#F5DC00] cursor-pointer whitespace-nowrap"
              >
                복사하기
              </button>
            </div>

            <p className="mt-6 text-center text-sm leading-relaxed text-gray-500">
              카카오톡에 접속 후
              <br />
              친구추가 → QR코드 스캔 또는
              <br />
              아이디를 붙여넣어 친구추가 해주세요.
            </p>
          </div>
        </div>
      </div>

      {toast && (
        <div
          className="fixed bottom-8 left-1/2 z-[300] -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg"
          role="status"
        >
          복사되었습니다
        </div>
      )}
    </>
  );
}
