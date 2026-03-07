import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ToggleItem = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#1c1c1e] border-b border-[#c6c6c8] dark:border-[#38383a] last:border-0">
    <span className="text-[17px] text-black dark:text-white">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "w-12.75 h-7.75 rounded-full relative transition-colors duration-200 ease-in-out",
        checked
          ? "bg-[#34c759] dark:bg-[#30d158]"
          : "bg-[#e9e9ea] dark:bg-[#39393d]",
      )}
    >
      <div
        className={cn(
          "w-6.75 h-6.75 bg-white rounded-full shadow-md absolute top-0.5 transition-transform duration-200",
          checked ? "translate-x-5.5" : "translate-x-0.5",
        )}
      />
    </button>
  </div>
);

export default ToggleItem;
