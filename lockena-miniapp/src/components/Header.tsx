const Header = ({
  title,
  left,
  right,
}: {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}) => (
  <header
    className="sticky top-0 z-50 flex h-14 items-center justify-between bg-[#f7f7f8]/90 
  dark:bg-[#1c1c1e]/80 px-4 backdrop-blur-md border-b border-[#c6c6c8] dark:border-[#38383a]"
  >
    <div className="w-10 flex justify-start">{left}</div>
    <h1 className="text-[17px] font-semibold text-center truncate px-2 dark:text-white text-black">
      {title}
    </h1>
    <div className="w-10 flex justify-end">{right}</div>
  </header>
);

export default Header;
