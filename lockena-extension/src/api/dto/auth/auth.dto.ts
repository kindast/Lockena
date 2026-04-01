export interface AuthDto {
  email: string;
  accessToken: string;
  refreshToken: string;

  encryptedMasterKey: string;
  masterKeyIv: string;
  salt: string;
}
