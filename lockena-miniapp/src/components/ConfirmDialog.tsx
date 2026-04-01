import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Удалить",
  cancelText = "Отмена",
  confirmVariant = "danger",
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "danger";
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-[#f0f0f0] dark:bg-[#2c2c2e] rounded-xl shadow-lg w-full max-w-[270px] text-center"
          >
            <div className="p-4 border-b border-[#d1d1d6] dark:border-[#3a3a3c]">
              <h3 className="font-semibold text-black dark:text-white">
                {title}
              </h3>
              <p className="text-xs text-black/60 dark:text-white/60 mt-1">
                {message}
              </p>
            </div>
            <div className="flex flex-col">
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className={`py-3 flex justify-center items-center text-center text-sm font-semibold border-b border-[#d1d1d6] dark:border-[#3a3a3c] ${confirmVariant === "danger" ? "text-[#ff3b30]" : "text-[#007aff] dark:text-[#0a84ff]"} active:bg-black/5 dark:active:bg-white/5 transition-colors disabled:opacity-50`}
              >
                {isLoading ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  confirmText
                )}
              </button>
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="py-3 text-center text-sm text-[#007aff] dark:text-[#0a84ff] active:bg-black/5 dark:active:bg-white/5 transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
