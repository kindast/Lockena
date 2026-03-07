import { useContext } from "react";
import type { ModalContextType } from "../types/modal.types";
import { ModalContext } from "../contexts/ModalContext";

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }

  return context;
};
