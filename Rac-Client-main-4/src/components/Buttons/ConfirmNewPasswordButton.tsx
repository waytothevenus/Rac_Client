import { TickCircle } from "iconsax-react";

type ConfirmNewPasswordButtonProps = {
  dataClose?: string;
  disabled?: boolean;
  onClick?: () => void;
};

export const ConfirmNewPasswordButton = ({
  dataClose,
  disabled = false,
  onClick,
}: ConfirmNewPasswordButtonProps) => {
  return (
    <button
      aria-label="Confirm New Password"
      data-close={dataClose}
      onClick={onClick}
      disabled={disabled}
      className="btn relative flex h-[40px] w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] bg-error-600 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white md:px-6"
    >
      <TickCircle size={18} variant="Bold" className="flex-shrink-0" />
      <span className="label-lg whitespace-nowrap text-white">
        Confirm New Password
      </span>
    </button>
  );
};
