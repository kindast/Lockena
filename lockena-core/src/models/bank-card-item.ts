import type { VaultItemBase } from "./vault-item-base";

export interface BankCardItem extends VaultItemBase {
  type: "bank_card";

  cardName: string;
  cardholderName?: string;
  cardNumber?: string;
  expirationMonth?: string;
  expirationYear?: string;
  cvv?: string;
  pin?: string;

  notes?: string;
}
