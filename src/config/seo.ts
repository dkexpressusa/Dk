/**
 * 단일 소스에서 사이트 URL·OG 기본값·페이지별 SEO 메타를 관리합니다.
 * 배포 도메인은 VITE_PUBLIC_SITE_URL 로 덮어쓸 수 있습니다.
 */

const DEFAULT_SITE_URL = "https://dkexpress.us";

export const SITE_URL = (() => {
  const raw = import.meta.env.VITE_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
  const cleaned = String(raw).trim().replace(/\s+/g, "").replace(/\/+$/, "");
  return cleaned || DEFAULT_SITE_URL;
})();

/** public 폴더 기준 OG 이미지 경로 (절대 URL로 변환됨) */
export const DEFAULT_OG_IMAGE_PATH = "/og-image.jpg";

export type SeoEntry = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  /** 기본 website; 필요 시 article 등으로 확장 */
  ogType?: "website" | "article";
  /** 비어 있으면 index, follow */
  robots?: string;
};

const pages: Record<string, SeoEntry> = {
  "/": {
    title: "뉴욕 한국택배 전문 dkexpress | 유학생 귀국이사 배송",
    description:
      "뉴욕, 퀸즈, 맨하탄 등 전지역에서 한국으로 안전하게 배송하는 택배 서비스. 2008년부터 운영된 신뢰 기반 업체로 빠른 상담 지원.",
    ogTitle: "뉴욕 한국택배 dkexpress",
    ogDescription: "뉴욕 전지역 한국택배, 유학생 귀국이사 전문",
  },
  "/how-to-use": {
    title: "dkexpress 소개 | 2008년 시작 뉴욕 한국택배 전문업체",
    description:
      "2008년부터 운영된 뉴욕 한국택배 전문 dkexpress. CJ택배 연계로 안전하고 신뢰할 수 있는 배송 서비스를 제공합니다.",
    ogTitle: "dkexpress 소개",
    ogDescription: "2008년 시작 신뢰 기반 택배업체",
  },
  "/shipping": {
    title: "서비스 안내 | 뉴욕 한국택배 유학생 귀국이사 전문",
    description:
      "뉴욕, 플러싱, 퀸즈, 뉴저지 전지역 한국택배 및 유학생 귀국이사, 소형이사, 항공배송 서비스 제공.",
    ogTitle: "택배 및 귀국이사 서비스",
    ogDescription: "한국택배, 유학생 이사 전문 서비스",
  },
  "/moving": {
    title: "유학생 귀국이사 | 뉴욕 한국택배 전문 dkexpress",
    description:
      "뉴욕·뉴저지 전지역 귀국이사 및 한국 향 항공 배송. 포장부터 한국 배달까지 안전하게 지원합니다.",
    ogTitle: "귀국이사 서비스",
    ogDescription: "유학생 귀국이사·항공 배송 전문",
  },
  "/reviews": {
    title: "이용 후기 | 뉴욕 한국택배 dkexpress 고객 리뷰",
    description:
      "뉴욕 한국택배 이용 고객들의 실제 후기. 빠른 상담과 안전한 배송으로 높은 만족도를 제공하는 dkexpress.",
    ogTitle: "고객 후기",
    ogDescription: "실제 이용 후기와 만족도",
  },
  "/contact": {
    title: "문의 및 상담 | 뉴욕 한국택배 빠른 상담 dkexpress",
    description:
      "뉴욕 전지역 한국택배 및 귀국이사 상담 문의. 빠르고 친절한 상담으로 최적의 배송 서비스를 안내드립니다.",
    ogTitle: "문의 및 상담",
    ogDescription: "빠른 상담 및 문의 안내",
  },
  "/tracking": {
    title: "배송 조회 | 뉴욕 한국택배 dkexpress",
    description:
      "dkexpress 배송 상태 조회. 운송장 번호로 빠르게 배송 진행 상황을 확인하세요.",
    ogTitle: "배송 조회",
    ogDescription: "택배 배송 상태 확인",
  },
  "/faq": {
    title: "자주 묻는 질문 | 뉴욕 한국택배 dkexpress",
    description:
      "뉴욕 한국택배·귀국이사 이용 시 자주 묻는 질문과 답변을 안내합니다.",
    ogTitle: "FAQ",
    ogDescription: "이용 안내 및 자주 묻는 질문",
  },
};

const adminRobots = "noindex, nofollow";

const adminPages: Record<string, SeoEntry> = {
  "/admin": {
    title: "관리자 로그인 | dkexpress",
    description: "dkexpress 관리자 페이지입니다.",
    ogTitle: "dkexpress 관리자",
    ogDescription: "관리자 로그인",
    robots: adminRobots,
  },
  "/admin/dashboard": {
    title: "관리자 대시보드 | dkexpress",
    description: "dkexpress 관리자 대시보드입니다.",
    ogTitle: "dkexpress 관리자",
    ogDescription: "관리자 대시보드",
    robots: adminRobots,
  },
};

const fallback: SeoEntry = {
  title: "dkexpress | 뉴욕 한국택배",
  description:
    "뉴욕에서 한국으로 안전하게 배송하는 dkexpress 한국택배·귀국이사 서비스.",
  ogTitle: "dkexpress",
  ogDescription: "뉴욕 한국택배 전문",
  robots: "noindex, follow",
};

const knownPaths = new Set<string>([
  ...Object.keys(pages),
  ...Object.keys(adminPages),
]);

export function isKnownPublicRoute(pathname: string): boolean {
  return knownPaths.has(pathname);
}

function withBasePath(pathname: string): string {
  const base = __BASE_PATH__;
  if (base === "/") return pathname;
  const baseNorm = base.replace(/\/+$/, "");
  if (pathname === "/") return `${baseNorm}/`;
  return `${baseNorm}${pathname}`;
}

export function getCanonicalUrl(pathname: string): string {
  const path = withBasePath(pathname);
  return new URL(path, `${SITE_URL}/`).href;
}

export function getAbsoluteOgImageUrl(): string {
  return new URL(DEFAULT_OG_IMAGE_PATH, `${SITE_URL}/`).href;
}

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function resolveSeo(pathname: string): SeoEntry & {
  canonicalUrl: string;
  ogImageUrl: string;
  ogType: "website" | "article";
} {
  const path = normalizePathname(pathname);
  const is404 = !isKnownPublicRoute(path);
  const base = is404
    ? { ...fallback, robots: "noindex, follow" }
    : adminPages[path] ?? pages[path] ?? { ...fallback, robots: "noindex, follow" };

  return {
    ...base,
    canonicalUrl: getCanonicalUrl(path),
    ogImageUrl: getAbsoluteOgImageUrl(),
    ogType: base.ogType ?? "website",
  };
}
