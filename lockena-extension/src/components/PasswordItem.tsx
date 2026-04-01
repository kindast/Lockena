import { LogIn } from "lucide-react";
import type { PasswordDto } from "../api/dto/vault-item/password.dto";
import { ServiceIcon } from "./ServiceIcon";

type PasswordItemProps = {
  password: PasswordDto;
  onAutofill: () => void;
};

export function PasswordItem({ password, onAutofill }: PasswordItemProps) {
  return (
    <div className="group flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-slate-50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white">
        <ServiceIcon serviceName={password.serviceName} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-medium text-slate-900">{password.serviceName}</div>
        <div className="truncate text-sm text-slate-500">{password.login}</div>
      </div>

      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-indigo-50 hover:text-[#4F39F6]"
          onClick={(event) => {
            event.stopPropagation();
            onAutofill();
          }}
          aria-label={`Autofill ${password.serviceName}`}
        >
          <LogIn className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
