const InputItem = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline = false,
  rightElement,
}: {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  rightElement?: React.ReactNode;
}) => (
  <div className="flex items-center pl-4 pr-4 py-3 bg-white dark:bg-[#1c1c1e]">
    {label && (
      <span className="w-24 text-[17px] text-black dark:text-white pt-0.5">
        {label}
      </span>
    )}
    <div className="flex-1 flex items-center min-w-0">
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="flex-1 text-[17px] outline-none placeholder-[#c7c7cc] dark:placeholder-[#545458] bg-transparent resize-none font-sans"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-[17px] outline-none placeholder-[#c7c7cc] dark:placeholder-[#545458] bg-transparent h-6 font-sans min-w-0"
        />
      )}
      {rightElement && <div className="ml-2 shrink-0">{rightElement}</div>}
    </div>
  </div>
);

export default InputItem;
