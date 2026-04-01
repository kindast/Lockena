import { clsx, type ClassValue } from "clsx";
import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Page = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.2 }}
    className={cn(
      "min-h-screen bg-[#efeff4] dark:bg-[#000000] pb-20 font-sans text-black dark:text-white",
      className,
    )}
  >
    {children}
  </motion.div>
);

export default Page;
