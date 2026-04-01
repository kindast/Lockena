import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Grid,
  List,
  Plus,
  Search,
} from "lucide-react";
import TextField from "../ui/TextField";
import Button from "../ui/Button";

export type ParamsHeaderValues = {
  search: string;
  sortDirection: "Asc" | "Desc";
  sortField: "name" | "updated";
  viewMode: "grid" | "table";
};

interface ParamsHeaderProps {
  values: ParamsHeaderValues;
  onChange: (values: ParamsHeaderValues) => void;
  onAdd: () => void;
}

function ParamsHeader({ values, onChange, onAdd }: ParamsHeaderProps) {
  const [windowWidth, setWindowWidth] = useState<number>(1200);
  const [showSortModal, setShowSortModal] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth <= 1100) onChange({ ...values, viewMode: "grid" });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onChange, values]);

  return (
    <div className=" dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700  px-2 sm:px-6 py-1 sm:py-3 shrink-0 flex items-center gap-2 flex-wrap">
      <TextField
        id="search"
        value={values.search}
        onChange={(e) => {
          onChange({ ...values, search: e.target.value });
        }}
        className="grow-3"
        placeholder="Поиск по названию..."
        icon={<Search />}
      />
      <div className="flex gap-2">
        <div
          className="border border-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded-lg cursor-pointer p-3 text-gray-600 dark:text-gray-300"
          onClick={() => {
            onChange({
              ...values,
              sortDirection: values.sortDirection === "Asc" ? "Desc" : "Asc",
            });
          }}
        >
          {values.sortDirection === "Asc" ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
        </div>
      </div>
      <div
        className="relative select-none grow"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          onClick={() => setShowSortModal((p) => !p)}
          className="cursor-pointer relative "
        >
          <TextField
            id="sort"
            readonly
            value={
              values.sortField === "name" ? "По имени" : "По дате изменения"
            }
            className="text-gray-600 dark:text-gray-300 select-none "
          />
          <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-300 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className={
            showSortModal
              ? "absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
              : "hidden"
          }
        >
          <div
            className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => {
              onChange({ ...values, sortField: "name" });
              setShowSortModal(false);
            }}
          >
            По имени
          </div>
          <div
            className="text-sm text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => {
              onChange({ ...values, sortField: "updated" });
              setShowSortModal(false);
            }}
          >
            По дате изменения
          </div>
        </div>
      </div>
      {windowWidth > 1100 && (
        <div
          className={`flex items-center border dark:border-gray-600 border-gray-300 rounded-lg overflow-hidden`}
        >
          <button
            onClick={() => onChange({ ...values, viewMode: "grid" })}
            className={`p-3 cursor-pointer ${values.viewMode === "grid" ? "dark:bg-gray-700 dark:text-white bg-gray-100 text-gray-900" : "dark:text-gray-400 dark:hover:text-gray-300 text-gray-600 hover:text-gray-900"} transition-colors`}
            title="Карточки"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChange({ ...values, viewMode: "table" })}
            className={`p-3 cursor-pointer ${values.viewMode === "table" ? "dark:bg-gray-700 dark:text-white bg-gray-100 text-gray-900" : "dark:text-gray-400 dark:hover:text-gray-300 text-gray-600 hover:text-gray-900"} transition-colors`}
            title="Таблица"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="grow min-w-50">
        <Button title="Добавить пароль" onClick={onAdd} icon={<Plus />} />
      </div>
    </div>
  );
}
export default ParamsHeader;
