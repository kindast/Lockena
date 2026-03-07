interface RangeProps {
  label?: string;
  id: string;
  value: number;
  min: number;
  max: number;
  className?: string;
  readonly?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function Range({
  label,
  id,
  value,
  className,
  min,
  max,
  onChange,
}: RangeProps) {
  return (
    <div className={className + " relative"}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={onChange}
          className={`w-full h-2 bg-gray-200 dark:bg-[#3a3a3c] rounded-lg appearance-none cursor-pointer accent-[#4f46e5] dark:accent-[#6366f1]`}
        />
      </div>
      <div className="absolute right-0 top-0 dark:text-gray-300">{value}</div>
    </div>
  );
}

export default Range;
