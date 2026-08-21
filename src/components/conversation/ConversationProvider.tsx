"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ConversationContextValue = {
  isOpen: boolean;
  openConversation: () => void;
  closeConversation: () => void;
};

const ConversationContext = createContext<ConversationContextValue | null>(
  null,
);

export function ConversationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openConversation = useCallback(() => setIsOpen(true), []);
  const closeConversation = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openConversation, closeConversation }),
    [isOpen, openConversation, closeConversation],
  );

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const ctx = useContext(ConversationContext);
  if (!ctx) {
    throw new Error("useConversation must be used within ConversationProvider");
  }
  return ctx;
}
