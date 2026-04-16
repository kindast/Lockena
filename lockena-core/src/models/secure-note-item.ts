import type { VaultItemBase } from "./vault-item-base";

export interface SecureNoteItem extends VaultItemBase {
  type: "secure_note";

  title: string;
  content: string;
}
