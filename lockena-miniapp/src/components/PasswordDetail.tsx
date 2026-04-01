import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Pencil,
} from "lucide-react";
import Button from "./Button";
import ListGroup from "./ListGroup";
import Page from "./Page";
import ServiceIcon from "./ServiceIcon";
import Header from "./Header";
import { toast } from "sonner";
import { useState } from "react";
import type { PasswordDto } from "../api/dto/vault-item/password.dto";

const PasswordDetail = ({
  entry,
  onBack,
  onEdit,
  onDelete,
}: {
  entry: PasswordDto;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} скопирован в буфер обмена`);
  };

  return (
    <Page className="z-20 absolute top-0 left-0 w-full bg-[#efeff4] dark:bg-[#000000]">
      <Header
        title={entry.serviceName}
        left={
          <button
            onClick={onBack}
            className="flex items-center text-[#4f46e5] dark:text-[#6366f1] -ml-1"
          >
            <ArrowLeft />
          </button>
        }
        right={
          <button
            onClick={onEdit}
            className="text-[#4f46e5] dark:text-[#6366f1] text-[17px]"
          >
            <Pencil size={20} />
          </button>
        }
      />

      <div className="flex flex-col items-center py-8">
        <ServiceIcon name={entry.serviceName} size={20} />
        <h2 className="mt-4 text-2xl font-bold dark:text-white">
          {entry.serviceName}
        </h2>
        <p className="text-[#8e8e93]">{entry.category}</p>
      </div>

      <ListGroup>
        <div className="pl-4 pr-4 py-3 bg-white dark:bg-[#1c1c1e] flex items-center justify-between border-b border-[#c6c6c8] dark:border-[#38383a]">
          <div className="flex-1">
            <p className="text-[13px] text-[#8e8e93] mb-1">Логин</p>
            <p className="text-[17px] select-all dark:text-white">
              {entry.login}
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(entry.login, "Логин")}
            className="p-2 text-[#4f46e5] dark:text-[#6366f1] active:opacity-50"
          >
            <Copy size={20} />
          </button>
        </div>

        <div className="pl-4 pr-4 py-3 bg-white dark:bg-[#1c1c1e] flex items-center justify-between">
          <div className="flex-1">
            <p className="text-[13px] text-[#8e8e93] mb-1">Пароль</p>
            <div className="flex items-center">
              <p className="text-[17px] font-mono tracking-wide mr-2 dark:text-white">
                {showPassword ? entry.password : "••••••••••••"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 text-[#4f46e5] dark:text-[#6366f1] active:opacity-50"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button
              onClick={() => copyToClipboard(entry.password, "Пароль")}
              className="p-2 text-[#4f46e5] dark:text-[#6366f1] active:opacity-50"
            >
              <Copy size={20} />
            </button>
          </div>
        </div>
      </ListGroup>

      {(entry.url || entry.notes) && (
        <ListGroup>
          {entry.url && (
            <div className="pl-4 pr-4 py-3 bg-white dark:bg-[#1c1c1e] flex items-center justify-between border-b border-[#c6c6c8] dark:border-[#38383a] last:border-0">
              <div className="flex-1 overflow-hidden">
                <p className="text-[13px] text-[#8e8e93] mb-1">Веб-сайт</p>
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[17px] text-[#4f46e5] dark:text-[#6366f1] truncate block"
                >
                  {entry.url}
                </a>
              </div>
              <ExternalLink
                size={18}
                className="text-[#c7c7cc] dark:text-[#545458] ml-2"
              />
            </div>
          )}
          {entry.notes && (
            <div className="pl-4 pr-4 py-3 bg-white dark:bg-[#1c1c1e] border-b border-[#c6c6c8] dark:border-[#38383a] last:border-0">
              <p className="text-[13px] text-[#8e8e93] mb-1">Заметки</p>
              <p className="text-[17px] whitespace-pre-wrap dark:text-white">
                {entry.notes}
              </p>
            </div>
          )}
        </ListGroup>
      )}

      <div className="px-4 mt-8">
        <Button variant="danger" onClick={onDelete}>
          Удалить пароль
        </Button>
      </div>
    </Page>
  );
};

export default PasswordDetail;
