import {
  forwardRef,
  type ChangeEventHandler,
  type FocusEventHandler,
  type Ref,
} from "react";

type SelectInputProps = {
  label: string;
  options: JSX.Element;
  bg?: string;
  disabled?: boolean;
  errorMessage?: string;
  id?: string;
  value?: string;
  onBlur?: FocusEventHandler<HTMLSelectElement>;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
};

const SelectInput = (
  {
    id,
    label,
    errorMessage = "",
    options,
    bg = "bg-neutral-10",
    ...props
  }: SelectInputProps,
  ref: Ref<HTMLSelectElement>,
) => {
  return (
    <div className="relative z-0 flex w-full flex-col">
      <select
        ref={ref}
        name={id}
        id={id}
        defaultValue=""
        {...props}
        className={`peer relative block h-14 w-full overflow-x-auto rounded-[20px] border border-gray-500 px-4 py-2 leading-5 focus:border-2 focus:border-primary-600 focus:outline-none focus:ring-0 ${bg}`}
      >
        {options}
      </select>
      <label
        className={`absolute left-4 top-4 z-10 origin-[0] -translate-y-7 scale-75 transform px-1 tracking-[.03125em] text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-invalid:text-error-600 peer-focus:left-4 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:${bg} peer-focus:px-1 peer-focus:text-primary-600 ${bg}`}
      >
        {label}
      </label>

      {errorMessage && (
        <div className="px-4 pt-1 text-xs tracking-[0.4px] text-error-600">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default forwardRef(SelectInput);
