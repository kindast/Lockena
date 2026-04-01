import {
  ChevronLeft,
  Plus,
  Search,
  User,
  CheckCircle2,
  Circle,
  Trash2,
  X,
} from "lucide-react";
import ListGroup from "./ListGroup";
import Page from "./Page";
import ServiceIcon from "./ServiceIcon";
import Header from "./Header";
import { useState, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import type { PasswordDto } from "../api/dto/vault-item/password.dto";
import Button from "./Button";
import Logo from "./Logo";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Dashboard = ({
  passwords,
  onAdd,
  onSelect,
  onProfile,
  onDeleteMultiple,
}: {
  passwords: PasswordDto[];
  onAdd: () => void;
  onSelect: (id: string) => void;
  onProfile: () => void;
  onDeleteMultiple?: (ids: string[]) => Promise<void>;
}) => {
  const [search, setSearch] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressRef = useRef(false);

  const startPress = (id: string) => {
    isLongPressRef.current = false;
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    pressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      if (!selectionMode) {
        setSelectionMode(true);
        setSelectedIds(new Set([id]));
      }
    }, 500);
  };

  const cancelPress = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handleClick = (id: string) => {
    cancelPress();
    if (isLongPressRef.current) return;

    if (selectionMode) {
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);

      if (newSet.size === 0) setSelectionMode(false);
      setSelectedIds(newSet);
    } else {
      onSelect(id);
    }
  };

  const handleDelete = async () => {
    if (onDeleteMultiple && selectedIds.size > 0) {
      await onDeleteMultiple(Array.from(selectedIds));
      setSelectionMode(false);
      setSelectedIds(new Set());
    }
  };

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
        title={selectionMode ? `Выбрано: ${selectedIds.size}` : "Пароли"}
        left={
          selectionMode ? (
            <button
              onClick={() => {
                setSelectionMode(false);
                setSelectedIds(new Set());
              }}
              className="text-[#6366f1] active:opacity-50"
            >
              <X size={24} />
            </button>
          ) : (
            <button
              onClick={onProfile}
              className="text-[#6366f1] active:opacity-50"
            >
              <User size={24} />
            </button>
          )
        }
        right={
          selectionMode ? (
            <button
              onClick={handleDelete}
              className="text-[#ff453a] active:opacity-50"
            >
              <Trash2 size={24} />
            </button>
          ) : (
            <button
              onClick={onAdd}
              className="text-[#6366f1] active:opacity-50"
            >
              <Plus size={24} />
            </button>
          )
        }
      />

      {passwords.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 text-[#8e8e93] px-4 text-center">
          <Logo className="w-24 h-24 mb-6" />
          <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
            Lockena
          </h2>
          <p>Ваш надежный менеджер паролей</p>
          <Button className="mt-8 w-full max-w-[240px]" onClick={onAdd}>
            Добавить пароль
          </Button>
        </div>
      )}
      {passwords.length > 0 && (
        <>
          <div className="px-4 pt-4 pb-2 flex items-center gap-3">
            <Logo className="w-8 h-8" />
            <h1 className="text-2xl font-bold text-black dark:text-white tracking-tight">
              Lockena
            </h1>
          </div>
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
                        onPointerDown={() => p.id && startPress(p.id)}
                        onPointerUp={cancelPress}
                        onPointerLeave={cancelPress}
                        onPointerCancel={cancelPress}
                        onClick={() => p.id && handleClick(p.id)}
                        className="pl-4 active:bg-[#e5e5ea] dark:active:bg-[#2c2c2e] transition-colors cursor-pointer bg-white dark:bg-[#1c1c1e] select-none"
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
                          {selectionMode ? (
                            <div className="mr-4">
                              {selectedIds.has(p.id!) ? (
                                <CheckCircle2 className="w-6 h-6 text-[#6366f1]" />
                              ) : (
                                <Circle className="w-6 h-6 text-[#c7c7cc] dark:text-[#545458]" />
                              )}
                            </div>
                          ) : (
                            <ChevronLeft className="w-5 h-5 rotate-180 text-[#c7c7cc] dark:text-[#545458]" />
                          )}
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
