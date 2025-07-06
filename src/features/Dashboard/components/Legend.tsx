const Legend = ({ items }: { items: { label: string; color: string }[] }) => {
  return (
    <div className="flex gap-4">
      {items.map((item) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-sm bg-[${item.color}]`}></div>
          <span className="text-sm text-black">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
