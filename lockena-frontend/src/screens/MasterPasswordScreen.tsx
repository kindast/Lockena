import Button from "../components/ui/Button";
import Logo from "../components/ui/Logo";
import PasswordField from "../components/ui/PasswordField";
import { useMemo, useState } from "react";

function validate(password: string): string {
  let error = "";

  if (!password) error = "Пароль обязателен";
  else if (password.length < 8) error = "Пароль минимум 8 символов";
  else if (password.length > 100) error = "Пароль: максимум 100 символов";

  return error;
}

interface MasterPasswordScreenProps {
  password: string;
  error: string;
  onChangePassword: (password: string) => void;
  onSubmit: () => void;
}

function MasterPasswordScreen({
  password,
  error,
  onChangePassword,
  onSubmit,
}: MasterPasswordScreenProps) {
  const [touched, setTouched] = useState<boolean>(false);
  const errors = useMemo<string>(() => {
    return error ? error : validate(password);
  }, [password, error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 p-4 ">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center">
              <Logo />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
              Lockena
            </h1>
            <p className="font-medium text-gray-600 dark:text-gray-300">
              Менеджер паролей
            </p>
          </div>

          <div className="space-y-4">
            <PasswordField
              id="password"
              label="Мастер-пароль для расшифровки  "
              value={password}
              onChange={(e) => onChangePassword(e.target.value)}
              onBlur={() => setTouched(true)}
              errors={touched ? (errors ?? "") : ""}
            />
            <Button
              title="Расшифровать"
              disabled={Object.keys(errors).length !== 0 && !error && touched}
              onClick={onSubmit}
            />
            {errors && Array.isArray(errors) && (
              <div className=" rounded-xl py-2 text-xs text-red-600">
                {errors.map((value, index) => {
                  return <p key={index}>{value}</p>;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MasterPasswordScreen;
