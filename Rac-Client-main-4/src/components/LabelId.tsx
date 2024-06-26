type LabelIdProps = { label: string; id: string; center?: boolean };

const LabelId = ({ label, id, center = false }: LabelIdProps) => {
  return (
    <div
      className={`title-lg md:headline-sm flex w-full items-center gap-[5px] text-neutral-900 ${
        center ? "justify-center" : ""
      }`}
    >
      <span>{label}:</span>
      <span className="font-bold">{id}</span>
    </div>
  );
};

export default LabelId;
