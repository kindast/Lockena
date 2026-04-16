import type { VaultItemBase } from "./vault-item-base";

export interface PasswordItem extends VaultItemBase {
  type: "password";

  serviceName: string;
  login: string;
  password: string;
  url?: string;

  notes?: string;
}
