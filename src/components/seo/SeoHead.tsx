import { Fragment, useLayoutEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { normalizePathname, resolveSeo } from "@/config/seo";

/**
 * document.head에 title·description·canonical·robots·Twitter만 포털로 주입합니다.
 * Open Graph는 index.html 고정 메타를 사용합니다 (카카오 등 비-JS 크롤러 대응).
 */
export default function SeoHead() {
  const { pathname } = useLocation();
  const seo = useMemo(
    () => resolveSeo(normalizePathname(pathname)),
    [pathname],
  );

  useLayoutEffect(() => {
    document.documentElement.lang = "ko";
  }, []);

  const head = typeof document !== "undefined" ? document.head : null;
  if (!head) return null;

  return createPortal(
    <Fragment key={pathname}>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.canonicalUrl} />
      <meta name="robots" content={seo.robots ?? "index, follow"} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.ogTitle} />
      <meta name="twitter:description" content={seo.ogDescription} />
      <meta name="twitter:image" content={seo.ogImageUrl} />
    </Fragment>,
    head,
  );
}
