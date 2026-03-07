export interface SignUpDto {
  initData: string;
  encryptedMasterKey: string;
  salt: string;
  masterKeyIv: string;
}
