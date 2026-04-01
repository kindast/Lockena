import { toast } from "sonner";
import Header from "./Header";
import InputItem from "./InputItem";
import ListGroup from "./ListGroup";
import Page from "./Page";
import { useCallback, useEffect, useState } from "react";
import CategoryPicker from "./CategoryPicker";
import PasswordGenerator from "./PasswordGenerator";
import type { PasswordDto } from "../api/dto/vault-item/password.dto";
import { LoaderCircle, Save, X } from "lucide-react";

const CATEGORIES: string[] = [
  "Личное",
  "Работа",
  "Финансы",
  "Соцсети",
  "Другое",
];

const PasswordForm = ({
  initialData,
  onSave,
  onCancel,
}: {
  initialData?: PasswordDto;
  onSave: (data: PasswordDto) => Promise<void>;
  onCancel: () => void;
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<PasswordDto>>({
    serviceName: "",
    login: "",
    password: "",
    url: "",
    category: "",
    notes: "",
  });

  const handleChange = (field: keyof PasswordDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = useCallback(async () => {
    if (!formData.serviceName || !formData.login || !formData.password) {
      toast.error("Пожалуйста, заполните обязательные поля");
      return;
    }
    const dataToSave: PasswordDto = {
      serviceName: formData.serviceName!,
      login: formData.login!,
      password: formData.password!,
      url: formData.url || "",
      category: formData.category || "Личное",
      notes: formData.notes || "",
    };
    setIsSaving(true);
    await onSave(dataToSave);
    setIsSaving(false);
  }, [formData, onSave]);

  useEffect(() => {
    const loadInitialData = () => {
      if (initialData) {
        setFormData({
          serviceName: initialData.serviceName,
          login: initialData.login,
          password: initialData.password,
          url: initialData.url,
          category:
            CATEGORIES.find((c) => c === initialData.category) || "Личное",
          notes: initialData.notes,
        });
      }
    };
    loadInitialData();
  }, [initialData]);

  return (
    <Page className="z-30 absolute top-0 left-0 w-full bg-[#efeff4] dark:bg-[#000000]">
      <Header
        title={initialData ? "Редактирование пароля" : "Новый пароль"}
        left={
          <button
            onClick={onCancel}
            className="text-[#4f46e5] dark:text-[#6366f1] text-[17px]"
          >
            <X />
          </button>
        }
        right={
          <button
            onClick={() => {
              if (!isSaving) handleSubmit();
            }}
            className="text-[#4f46e5] dark:text-[#6366f1] font-bold text-[17px]"
          >
            {isSaving ? <LoaderCircle className="animate-spin" /> : <Save />}
          </button>
        }
      />

      <div className="mt-6">
        <ListGroup>
          <div className="border-b border-[#c6c6c8] dark:border-[#38383a] ">
            <InputItem
              label="Сервис"
              value={formData.serviceName || ""}
              onChange={(v) => handleChange("serviceName", v)}
              placeholder="Например Netflix"
            />
          </div>
          <div className="border-b border-[#c6c6c8] dark:border-[#38383a] ">
            <InputItem
              label="Логин"
              value={formData.login || ""}
              onChange={(v) => handleChange("login", v)}
              placeholder="Имя пользователя или Email"
            />
          </div>
          <div className="">
            <InputItem
              label="Пароль"
              value={formData.password || ""}
              onChange={(v) => handleChange("password", v)}
              type="text"
              placeholder="Пароль"
              rightElement={
                <PasswordGenerator
                  onSelect={(pwd) => handleChange("password", pwd)}
                />
              }
            />
          </div>
        </ListGroup>

        <ListGroup title="ДЕТАЛИ">
          <div className="border-b border-[#c6c6c8] dark:border-[#38383a] ">
            <InputItem
              label="Веб-сайт"
              value={formData.url || ""}
              onChange={(v) => handleChange("url", v)}
              placeholder="https://example.com"
            />
          </div>
          <div className="border-b border-[#c6c6c8] dark:border-[#38383a] ">
            <CategoryPicker
              label="Категория"
              value={formData.category || "Личное"}
              onChange={(v) => handleChange("category", v)}
              options={CATEGORIES}
            />
          </div>
        </ListGroup>

        <ListGroup title="ЗАМЕТКИ">
          <InputItem
            value={formData.notes || ""}
            onChange={(v) => handleChange("notes", v)}
            placeholder="Добавьте любые дополнительные сведения..."
            multiline
          />
        </ListGroup>
      </div>
    </Page>
  );
};

export default PasswordForm;
