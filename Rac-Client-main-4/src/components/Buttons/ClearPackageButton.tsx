import { ClipboardTick } from "iconsax-react";
import { useTabContext } from "~/contexts/TabContext";
import { type ModalCloseType } from "../Shop/Requests/RequestsPanel";

type ClearPackageButtonProps = ModalCloseType;

export const ClearPackageButton = ({
  dataClose,
  onClick,
}: ClearPackageButtonProps) => {
  const { handleActiveAction } = useTabContext();

  const handleClick = () => {
    handleActiveAction("clear package");
  };

  return (
    <button
      data-close={dataClose}
      onClick={onClick ?? handleClick}
      className="btn relative flex h-[40px] w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] bg-primary-600 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white md:px-6"
    >
      <ClipboardTick variant="Bold" />
      <span className="label-lg text-white">Clear Package</span>
    </button>
  );
};
