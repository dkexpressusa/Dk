import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { normalizePathname, resolveSeo } from "@/config/seo";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const metas = document.head.querySelectorAll("meta");
  for (let i = 0; i < metas.length; i++) {
    const m = metas[i];
    if (m.getAttribute(attr) === key) {
      m.setAttribute("content", content);
      return;
    }
  }
  const el = document.createElement("meta");
  el.setAttribute(attr, key);
  el.setAttribute("content", content);
  document.head.appendChild(el);
}

function upsertLink(rel: string, href: string) {
  const links = document.head.querySelectorAll(`link[rel="${rel}"]`);
  if (links.length > 0) {
    (links[0] as HTMLLinkElement).setAttribute("href", href);
    return;
  }
  const el = document.createElement("link");
  el.setAttribute("rel", rel);
  el.setAttribute("href", href);
  document.head.appendChild(el);
}

/**
 * 라우트 변경 시 title·meta·canonical·OG·Twitter를 갱신합니다.
 */
export default function SeoHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = normalizePathname(pathname);
    const seo = resolveSeo(path);

    document.title = seo.title;
    document.documentElement.lang = "ko";

    upsertMeta("name", "description", seo.description);
    upsertLink("canonical", seo.canonicalUrl);

    upsertMeta("name", "robots", seo.robots ?? "index, follow");

    upsertMeta("property", "og:title", seo.ogTitle);
    upsertMeta("property", "og:description", seo.ogDescription);
    upsertMeta("property", "og:type", seo.ogType);
    upsertMeta("property", "og:url", seo.canonicalUrl);
    upsertMeta("property", "og:image", seo.ogImageUrl);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", seo.ogTitle);
    upsertMeta("name", "twitter:description", seo.ogDescription);
    upsertMeta("name", "twitter:image", seo.ogImageUrl);
  }, [pathname]);

  return null;
}
