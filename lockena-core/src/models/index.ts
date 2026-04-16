import type { BankCardItem } from "./bank-card-item";
import type { IdentityItem } from "./identity-item";
import type { PasswordItem } from "./password-item";
import type { SecureNoteItem } from "./secure-note-item";

export * from "./bank-card-item";
export * from "./identity-item";
export * from "./password-item";
export * from "./secure-note-item";
export * from "./vault-item-base";

export type VaultItem =
  | PasswordItem
  | BankCardItem
  | SecureNoteItem
  | IdentityItem;
