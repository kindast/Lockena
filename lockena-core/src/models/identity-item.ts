import type { VaultItemBase } from "./vault-item-base";

export interface IdentityItem extends VaultItemBase {
  type: "identity";

  documentType: "passport" | "driver_license" | "id_card" | "other";
  documentName: string; // Например "Загранпаспорт"
  firstName?: string;
  lastName?: string;
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;

  notes?: string;
}
