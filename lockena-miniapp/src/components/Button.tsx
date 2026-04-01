import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Button = ({
  children,
  onClick,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}) => {
  const bg =
    variant === "primary"
      ? "bg-[#4f46e5] text-white dark:bg-[#6366f1] dark:text-white"
      : variant === "danger"
        ? "bg-[#ff3b30] text-white dark:bg-[#ff453a] dark:text-white"
        : "bg-[#e5e5ea] text-[#4f46e5] dark:bg-[#2c2c2e] dark:text-[#6366f1]";
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full py-3.5 rounded-xl text-[17px] font-semibold active:opacity-80 transition-opacity",
        bg,
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
