import { useState, type ReactNode } from "react";
import type { ModalProviderProps } from "../types/modal.types";
import { ModalContext } from "../contexts/ModalContext";

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const showModal = (content: ReactNode): void => {
    setModalContent(content);
    setIsOpen(true);
  };

  const hideModal = (): void => {
    setIsOpen(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal, isOpen }}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={hideModal}
        >
          <div onClick={(e) => e.stopPropagation()}>{modalContent}</div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
