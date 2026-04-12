/** 카카오톡 오픈채팅 — 상담·문의 CTA 공통 */
export const OPEN_KAKAO_CHAT_URL = "https://open.kakao.com/o/goICtJAc" as const;

export const openKakaoChatLink = {
  href: OPEN_KAKAO_CHAT_URL,
  target: "_blank" as const,
  rel: "noopener noreferrer" as const,
};
