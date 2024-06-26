import { forwardRef, useEffect, type ReactNode, type Ref } from "react";
import { createPortal } from "react-dom";
import tailmater from "~/js/tailmater";

export type ModalButtonProps = {
  modalId: string;
  label: string;
  buttonClassName?: string;
  buttonContent?: JSX.Element;
  disabled?: boolean;
  footerContent: ({ dataClose }: { dataClose: string }) => React.ReactNode;
  children: ReactNode;
};

const ModalButton = (
  {
    modalId,
    label,
    buttonClassName = "btn relative flex h-[40px] w-full items-center justify-center rounded-[6.25rem] hover:bg-surface-300 focus:bg-surface-400",
    buttonContent,
    disabled = false,
    footerContent,
    children,
  }: ModalButtonProps,
  ref: Ref<HTMLButtonElement>,
) => {
  const dataTarget = `#${modalId}`;

  useEffect(() => {
    tailmater();
  }, []);

  return (
    <>
      <button
        aria-label={label}
        data-type="dialogs"
        data-target={dataTarget}
        disabled={disabled}
        className={buttonClassName}
        ref={ref}
      >
        {buttonContent ? buttonContent : label}
      </button>
      {createPortal(
        <div
          id={modalId}
          className="ease-[cubic-bezier(0, 0, 0, 1)] fixed left-0 top-0 z-50 flex h-0 w-full justify-center overflow-auto p-4 opacity-0 duration-[400ms] md:items-center  [&.show]:inset-0 [&.show]:h-full [&.show]:opacity-100"
        >
          <div
            data-close={dataTarget}
            className="backDialog fixed z-40 hidden overflow-auto bg-black opacity-50"
          ></div>
          <div className="z-50 flex h-max w-full max-w-[900px] flex-col gap-[30px] rounded-[20px] bg-surface-300 p-[20px] md:p-[30px]">
            {children}
            {footerContent?.({ dataClose: dataTarget })}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};

export default forwardRef(ModalButton);
