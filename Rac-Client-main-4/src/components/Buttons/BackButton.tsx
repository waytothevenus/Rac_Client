import { ArrowCircleLeft2 } from "iconsax-react";

type BackButtonProps = { text?: string; onClick: () => void };

export const BackButton = ({ text = "Back", onClick }: BackButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={text}
      className="btn relative flex h-[40px] w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] border border-gray-500 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white md:px-6"
    >
      <ArrowCircleLeft2
        size={18}
        variant="Bold"
        className="flex-shrink-0 text-primary-600"
      />
      <span className="label-lg whitespace-nowrap text-primary-600">
        {text}
      </span>
    </button>
  );
};
