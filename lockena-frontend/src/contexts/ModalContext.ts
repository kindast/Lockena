import { createContext } from "react";
import type { ModalContextType } from "../types/modal.types";

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined,
);
