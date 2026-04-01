import { RefreshCw, Wand2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Drawer } from "vaul";
import Button from "./Button";
import ToggleItem from "./ToggleItem";

const PasswordGenerator = ({
  onSelect,
}: {
  onSelect: (password: string) => void;
}) => {
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [generated, setGenerated] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const generate = useCallback(() => {
    const charset = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let chars = charset;
    if (useUppercase) chars += upper;
    if (useNumbers) chars += numbers;
    if (useSymbols) chars += symbols;

    let ret = "";
    for (let i = 0; i < length; i++) {
      ret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGenerated(ret);
  }, [length, useNumbers, useSymbols, useUppercase]);

  useEffect(() => {
    (async () => await generate())();
  }, [length, useUppercase, useNumbers, useSymbols, generate]);

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger asChild>
        <button className="text-[#4f46e5] dark:text-[#6366f1] p-1 rounded-full active:bg-gray-100 dark:active:bg-[#2c2c2e] transition-colors">
          <Wand2 size={20} />
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50" />
        <Drawer.Content className="bg-[#efeff4] dark:bg-[#1c1c1e] flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 max-h-[90vh] z-50 outline-none dark:border-[#38383a] dark:border-t">
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300 dark:bg-[#38383a] mt-3 mb-6" />

            <div className="px-4 pb-6">
              <h2 className="text-xl font-semibold mb-6 text-center dark:text-white">
                Сгенерировать пароль
              </h2>

              {/* Preview */}
              <div className="bg-white dark:bg-[#2c2c2e] rounded-xl p-4 mb-6 flex items-center justify-between shadow-sm border border-[#c6c6c8]/50 dark:border-[#38383a]">
                <div className="font-mono text-xl tracking-wide break-all mr-4 text-center w-full dark:text-white">
                  {generated}
                </div>
                <button
                  onClick={() => {
                    generate();
                  }}
                  className="text-[#4f46e5] dark:text-[#6366f1] p-2 hover:bg-gray-100 dark:hover:bg-[#3a3a3c] rounded-full"
                >
                  <RefreshCw size={20} />
                </button>
              </div>

              {/* Options */}
              <div className="bg-white dark:bg-[#2c2c2e] rounded-xl overflow-hidden mb-6 border border-[#c6c6c8]/50 dark:border-[#38383a]">
                <div className="px-4 py-4 border-b border-[#c6c6c8] dark:border-[#38383a]">
                  <div className="flex justify-between mb-2">
                    <span className="text-[17px] dark:text-white">Длина</span>
                    <span className="text-[17px] text-[#8e8e93]">{length}</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="32"
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-[#4f46e5] dark:accent-[#6366f1]"
                  />
                </div>
                <ToggleItem
                  label="Заглавные буквы (A-Z)"
                  checked={useUppercase}
                  onChange={setUseUppercase}
                />
                <ToggleItem
                  label="Числа (0-9)"
                  checked={useNumbers}
                  onChange={setUseNumbers}
                />
                <ToggleItem
                  label="Символы (!@#)"
                  checked={useSymbols}
                  onChange={setUseSymbols}
                />
              </div>

              <Button
                onClick={() => {
                  onSelect(generated);
                  setIsOpen(false);
                }}
              >
                Выбрать пароль
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default PasswordGenerator;
