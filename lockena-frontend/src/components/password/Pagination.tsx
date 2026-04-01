import { useCallback } from "react";
import AccentButton from "../ui/AccentButton";

export type PaginationValues = {
  page: number;
  pageSize: number;
  total: number;
};

interface PaginationProps {
  pagination: PaginationValues;
  onChange: (pagination: PaginationValues) => void;
}

function Pagination({ pagination, onChange }: PaginationProps) {
  const getPages = useCallback(() => {
    if (pagination.total === 0) return [];
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);

    if (!totalPages || totalPages <= 0) return [];

    if (totalPages === 1) return [1];

    if (pagination.page === 1) return totalPages === 2 ? [1, 2] : [1, 2, 3];

    if (pagination.page === totalPages)
      return totalPages === 2
        ? [1, 2]
        : [totalPages - 2, totalPages - 1, totalPages];

    return [pagination.page - 1, pagination.page, pagination.page + 1];
  }, [pagination]);

  return (
    <div className="flex-wrap shrink-0  dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      <p className="text-gray-600 dark:text-gray-300  text-sm">
        Показано {Math.min(pagination.pageSize, pagination.total)} из{" "}
        {pagination.total}
      </p>
      <div className="flex gap-2">
        <AccentButton
          title="< Назад"
          onClick={() => {
            onChange({ ...pagination, page: pagination.page - 1 });
          }}
          className="w-25 h-10 text-sm"
          disabled={pagination.page === 1}
        />
        {getPages().map((pageNum) => {
          return (
            <button
              key={pageNum}
              className={`w-10 h-10 font-medium rounded-lg transition-colors cursor-pointer 
                      ${
                        pagination.page === pageNum
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                      }`}
              onClick={() => {
                onChange({ ...pagination, page: pageNum });
              }}
            >
              {pageNum}
            </button>
          );
        })}
        <AccentButton
          title="Вперед >"
          onClick={() => {
            onChange({ ...pagination, page: pagination.page + 1 });
          }}
          className="w-25 h-10 text-sm"
          disabled={
            pagination.page ===
            Math.ceil(pagination.total / pagination.pageSize)
          }
        />
      </div>
    </div>
  );
}
export default Pagination;
