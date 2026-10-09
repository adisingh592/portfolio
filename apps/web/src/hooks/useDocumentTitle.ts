import { useEffect } from "react";
import { profile } from "@/data/profile";

const BASE = `${profile.name} · Developer & Creative Technologist`;

/** Sets the browser tab title for the current page. */
export function useDocumentTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${page} · ${profile.name}` : BASE;
  }, [page]);
}
