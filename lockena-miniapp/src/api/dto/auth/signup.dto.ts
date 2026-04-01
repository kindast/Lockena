export interface SignUpDto {
  initData: string;
  password: string;
  encryptedMasterKey: string;
  salt: string;
  masterKeyIv: string;
}
