import { useLocation } from "react-router-dom";
import { normalizePathname, resolveSeo } from "@/config/seo";

/** 현재 경로에 적용된 SEO 스냅샷 (디버그·추가 마크업용) */
export function useSeo() {
  const { pathname } = useLocation();
  return resolveSeo(normalizePathname(pathname));
}
