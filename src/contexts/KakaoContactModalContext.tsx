import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import KakaoModal from "@/components/base/KakaoModal";

type KakaoContactModalContextValue = {
  openKakaoContactModal: () => void;
};

const KakaoContactModalContext =
  createContext<KakaoContactModalContextValue | null>(null);

export function KakaoContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openKakaoContactModal = useCallback(() => setOpen(true), []);

  return (
    <KakaoContactModalContext.Provider value={{ openKakaoContactModal }}>
      {children}
      {open && <KakaoModal onClose={() => setOpen(false)} />}
    </KakaoContactModalContext.Provider>
  );
}

export function useKakaoContactModal() {
  const ctx = useContext(KakaoContactModalContext);
  if (!ctx) {
    throw new Error(
      "useKakaoContactModal must be used within KakaoContactModalProvider",
    );
  }
  return ctx;
}
