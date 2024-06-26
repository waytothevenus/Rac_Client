type PrimaryButtonProps = { text: string; onClick: () => void };

export const PrimaryButton = ({ text, onClick }: PrimaryButtonProps) => {
  return (
    <button
      onClick={onClick}
      aria-label={text}
      className="btn relative flex h-[40px] w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] bg-primary-600 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white md:px-6"
    >
      <span className="label-lg text-white">{text}</span>
    </button>
  );
};
