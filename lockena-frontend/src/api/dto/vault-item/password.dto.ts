export interface PasswordDto {
  id?: string;
  serviceName: string;
  login: string;
  password: string;
  category: "personal" | "work" | "finance" | "social" | "other" | string;
  url?: string;
  notes?: string;
  updatedAtUtc?: string;
}
