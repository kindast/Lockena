import TableRow from "./TableRow";
import type { PasswordDto } from "../../api/dto/vault-item/password.dto";

interface TableRowProps {
  passwords: PasswordDto[];
  onDelete: (password: PasswordDto) => void;
  onEdit: (password: PasswordDto) => void;
}

function Table({ passwords, onDelete, onEdit }: TableRowProps) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 text-sm">
              Сервис
            </th>
            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300  text-sm">
              Логин
            </th>
            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300  text-sm">
              Пароль
            </th>
            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300  text-sm">
              URL
            </th>
            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300  text-sm">
              Категория
            </th>
            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300  text-sm">
              Обновлен
            </th>
            <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300  text-sm">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="border-t border-gray-200 dark:border-gray-700">
          {passwords.map((password) => {
            return (
              <TableRow
                key={password.id}
                password={password}
                onDelete={() => onDelete(password)}
                onEdit={() => onEdit(password)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
