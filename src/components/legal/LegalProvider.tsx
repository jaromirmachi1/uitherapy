"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type LegalContextValue = {
  isOpen: boolean;
  openLegal: () => void;
  closeLegal: () => void;
};

const LegalContext = createContext<LegalContextValue | null>(null);

export function LegalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openLegal = useCallback(() => setIsOpen(true), []);
  const closeLegal = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openLegal, closeLegal }),
    [isOpen, openLegal, closeLegal],
  );

  return (
    <LegalContext.Provider value={value}>{children}</LegalContext.Provider>
  );
}

export function useLegal() {
  const ctx = useContext(LegalContext);
  if (!ctx) {
    throw new Error("useLegal must be used within LegalProvider");
  }
  return ctx;
}
