export interface SignUpDto {
  email: string;
  password: string;
  encryptedMasterKey: string;
  salt: string;
  masterKeyIv: string;
}
