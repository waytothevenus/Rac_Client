import { ArrowCircleLeft2 } from "iconsax-react";
import { useEffect } from "react";
import tailmater from "~/js/tailmater";

export type CloseModalButtonProps = {
  icon?: JSX.Element;
  label?: string;
  dataClose?: string;
  disabled?: boolean;
  primary?: boolean;
  onClick?: () => void;
};

export const CloseModalButton = ({
  icon = (
    <ArrowCircleLeft2 size={18} variant="Bold" className="flex-shrink-0" />
  ),
  label = "Back",
  dataClose = undefined,
  disabled = false,
  primary,
  onClick,
}: CloseModalButtonProps) => {
  useEffect(() => {
    tailmater();
  }, []);

  if (primary) {
    return (
      <button
        type="button"
        aria-label={label}
        data-close={dataClose}
        onClick={onClick}
        disabled={disabled}
        className="btn relative flex h-[40px] w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] bg-primary-600 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white md:px-6"
      >
        {icon}
        <span className="label-lg whitespace-nowrap text-white">{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      data-close={dataClose}
      onClick={onClick}
      className="btn relative flex h-[40px] w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] border border-gray-500 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-primary-600 md:px-6"
    >
      {icon}
      <span className="label-lg whitespace-nowrap">{label}</span>
    </button>
  );
};
