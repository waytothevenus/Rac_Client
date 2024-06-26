import { Ship } from "iconsax-react";
import { useTabContext } from "~/contexts/TabContext";
import { type ModalCloseType } from "../Shop/Requests/RequestsPanel";

type InitiateShippingButtonProps = Partial<ModalCloseType>;

export const InitiateShippingButton = ({
  dataClose,
  onClick,
}: InitiateShippingButtonProps) => {
  const { handleActiveAction, handleTabChange } = useTabContext();

  const handleClick = () => {
    handleTabChange("orders");
    handleActiveAction("initiate shipping");
  };

  return (
    <button
      onClick={onClick ?? handleClick}
      data-close={dataClose}
      className="btn relative flex w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] bg-primary-600 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white md:px-6"
    >
      <Ship size="18" variant="Bold" />
      <span className="label-lg text-white">Initiate Shipping</span>
    </button>
  );
};
