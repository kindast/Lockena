import { ChevronLeft, Plus, Search, User } from "lucide-react";
import ListGroup from "./ListGroup";
import Page from "./Page";
import ServiceIcon from "./ServiceIcon";
import Header from "./Header";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import type { PasswordDto } from "../api/dto/vault-item/password.dto";
import Button from "./Button";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Dashboard = ({
  passwords,
  onAdd,
  onSelect,
  onProfile,
}: {
  passwords: PasswordDto[];
  onAdd: () => void;
  onSelect: (id: string) => void;
  onProfile: () => void;
}) => {
  const [search, setSearch] = useState("");

  const filtered = passwords.filter(
    (p) =>
      p.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      p.login.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const categories = Array.from(
    new Set(filtered.map((p) => p.category)),
  ).sort();

  return (
    <Page>
      <Header
        title="Пароли"
        left={
          <button onClick={onProfile} className="text-[#6366f1]">
            <User size={24} />
          </button>
        }
        right={
          <button onClick={onAdd} className="text-[#6366f1]">
            <Plus size={24} />
          </button>
        }
      />

      {passwords.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 text-[#8e8e93]">
          <Search size={48} className="mb-4 opacity-20" />
          <p>У вас пока нет сохраненных паролей</p>
          <Button className="mt-6 max-w-[50%]" onClick={onAdd}>
            Добавить первый пароль
          </Button>
        </div>
      )}
      {passwords.length > 0 && (
        <>
          <div className="px-4 py-3 sticky top-14 bg-[#efeff4] dark:bg-[#000000] z-40">
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-[#8e8e93]"
                size={18}
              />
              <input
                type="text"
                placeholder="Поиск"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#e3e3e9] dark:bg-[#1c1c1e] pl-10 pr-4 py-2 rounded-xl text-[17px] outline-none placeholder-[#8e8e93] dark:border dark:border-[#38383a]"
              />
            </div>
          </div>

          <div className="pb-8">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-20 text-[#8e8e93]">
                <Search size={48} className="mb-4 opacity-20" />
                <p>Пароли не найдены</p>
              </div>
            ) : (
              categories.map((cat) => (
                <ListGroup key={cat} title={cat}>
                  {filtered
                    .filter((p) => p.category === cat)
                    .map((p, idx, arr) => (
                      <div
                        key={p.id}
                        onClick={() => p.id && onSelect(p.id)}
                        className="pl-4 active:bg-[#e5e5ea] dark:active:bg-[#2c2c2e] transition-colors cursor-pointer bg-white dark:bg-[#1c1c1e]"
                      >
                        <div
                          className={cn(
                            "flex items-center py-2.5 pr-4",
                            idx !== arr.length - 1 &&
                              "border-b border-[#c6c6c8] dark:border-[#38383a]",
                          )}
                        >
                          <div className="mr-3">
                            <ServiceIcon name={p.serviceName} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[17px] font-semibold text-black dark:text-white  leading-tight">
                              {p.serviceName}
                            </h4>
                            <p className="text-[15px] text-[#8e8e93] truncate">
                              {p.login}
                            </p>
                          </div>
                          <ChevronLeft className="w-5 h-5 rotate-180 text-[#c7c7cc] dark:text-[#545458]" />
                        </div>
                      </div>
                    ))}
                </ListGroup>
              ))
            )}
          </div>
        </>
      )}
    </Page>
  );
};

export default Dashboard;
