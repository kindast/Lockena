import { clsx, type ClassValue } from "clsx";
import { Check, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Drawer } from "vaul";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CategoryPicker = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger asChild>
        <div className="flex items-center pl-4 pr-4 py-3 bg-white dark:bg-[#1c1c1e] cursor-pointer active:bg-[#e5e5ea] dark:active:bg-[#2c2c2e] transition-colors">
          <span className="w-24 text-[17px] text-black dark:text-white pt-0.5">
            {label}
          </span>
          <div className="flex-1 text-[17px] text-black dark:text-white truncate  pr-2">
            {value}
          </div>
          <ChevronLeft className="w-5 h-5 rotate-180 text-[#c7c7cc]" />
        </div>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50" />
        <Drawer.Content className="bg-[#efeff4] dark:bg-[#000000] dark:border-[#38383a] dark:border-t flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 max-h-[85vh] z-50 outline-none">
          <div className="p-4 bg-white dark:bg-[#1c1c1e] rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300 dark:bg-[#38383a] mb-6" />
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-4 text-center dark:text-white text-black">
                Выберите категорию
              </h2>
              <div className="bg-[#efeff4] dark:bg-[#2c2c2e] rounded-xl overflow-hidden dark:border dark:border-[#38383a]">
                {options.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between px-4 py-3.5 bg-white active:bg-[#e5e5ea] dark:bg-[#1c1c1e] dark:active:bg-[#2c2c2e] transition-colors cursor-pointer border-b border-[#c6c6c8] dark:border-[#38383a] last:border-0",
                    )}
                  >
                    <span className="text-[17px] text-black dark:text-white">
                      {opt}
                    </span>
                    {value === opt && (
                      <Check className="w-5 h-5 text-[#4f46e5] dark:text-[#6366f1]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="h-6" />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default CategoryPicker;
