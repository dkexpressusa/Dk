import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import PhoneModal from "@/components/base/PhoneModal";

type PhoneContactModalContextValue = {
  openPhoneContactModal: () => void;
};

const PhoneContactModalContext =
  createContext<PhoneContactModalContextValue | null>(null);

export function PhoneContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openPhoneContactModal = useCallback(() => setOpen(true), []);

  return (
    <PhoneContactModalContext.Provider value={{ openPhoneContactModal }}>
      {children}
      {open && <PhoneModal onClose={() => setOpen(false)} />}
    </PhoneContactModalContext.Provider>
  );
}

export function usePhoneContactModal() {
  const ctx = useContext(PhoneContactModalContext);
  if (!ctx) {
    throw new Error(
      "usePhoneContactModal must be used within PhoneContactModalProvider",
    );
  }
  return ctx;
}
