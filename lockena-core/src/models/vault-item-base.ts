/**
 * Поддерживаемые типы защищенных записей в хранилище
 */
export type VaultItemType =
  | "password"
  | "bank_card"
  | "secure_note"
  | "identity";

/**
 * Базовые поля, которые есть у абсолютно любой записи
 */
export interface VaultItemBase {
  id?: string;
  type: VaultItemType;
  createdAtUtc?: string;
  updatedAtUtc?: string;
}
