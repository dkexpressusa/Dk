import { Fragment, useLayoutEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { normalizePathname, resolveSeo } from "@/config/seo";

/**
 * document.head에 React 포털로 메타를 주입합니다.
 * (CSR에서 useEffect만 쓰면 페인트·검사 타이밍에 태그가 안 보이는 경우가 있어
 *  useLayoutEffect + 포털로 동일 커밋에서 head를 갱신합니다.)
 */
export default function SeoHead() {
  const { pathname } = useLocation();
  const seo = useMemo(
    () => resolveSeo(normalizePathname(pathname)),
    [pathname],
  );

  useLayoutEffect(() => {
    document.documentElement.lang = "ko";
    document.querySelectorAll("meta[data-og-default]").forEach((el) => el.remove());
  }, []);

  const head = typeof document !== "undefined" ? document.head : null;
  if (!head) return null;

  return createPortal(
    <Fragment key={pathname}>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.canonicalUrl} />
      <meta name="robots" content={seo.robots ?? "index, follow"} />
      <meta property="og:title" content={seo.ogTitle} />
      <meta property="og:description" content={seo.ogDescription} />
      <meta property="og:type" content={seo.ogType} />
      <meta property="og:url" content={seo.canonicalUrl} />
      <meta property="og:image" content={seo.ogImageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.ogTitle} />
      <meta name="twitter:description" content={seo.ogDescription} />
      <meta name="twitter:image" content={seo.ogImageUrl} />
    </Fragment>,
    head,
  );
}
