import type { ReactNode } from "react";

export interface ModalContextType {
  showModal: (content: ReactNode) => void;
  hideModal: () => void;
  isOpen: boolean;
}

export interface ModalProviderProps {
  children: ReactNode;
}
