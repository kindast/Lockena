export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  encryptedMasterKey: string;
  salt: string;
}
