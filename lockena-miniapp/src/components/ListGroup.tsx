const ListGroup = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    {title && (
      <h3 className="mb-2 ml-4 text-[13px] uppercase text-[#6d6d72] dark:text-[#8e8e93]  font-normal tracking-wide mt-6">
        {title}
      </h3>
    )}
    <div className="bg-white dark:bg-[#1c1c1e] border-y border-[#c6c6c8] dark:border-[#38383a] sm:border sm:rounded-xl sm:mx-4 overflow-hidden">
      {children}
    </div>
  </div>
);

export default ListGroup;
