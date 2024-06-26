import { Eye, EyeSlash, TickCircle } from "iconsax-react";
import {
  forwardRef,
  useState,
  type ChangeEventHandler,
  type FocusEventHandler,
  type Ref,
} from "react";

type PasswordInputProps = {
  id: string;
  label: string;
  bg?: string;
  confirmPassword?: boolean;
  newPassword?: boolean;
  value?: string;
  compare?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
};

const PasswordInput = (
  {
    id,
    label,
    bg = "bg-neutral-10",
    confirmPassword = false,
    newPassword = false,
    value = "",
    compare = "",
    ...props
  }: PasswordInputProps,
  ref: Ref<HTMLInputElement>,
) => {
  const [show, setShow] = useState(false);

  const toggleVisibility = () => {
    setShow((prev) => !prev);
  };

  return (
    <div className="relative flex flex-col gap-[10px]">
      <div className="relative z-0">
        <input
          ref={ref}
          type={show ? "text" : "password"}
          aria-label={label}
          name={id}
          id={id}
          className={`peer relative block h-14 w-full overflow-x-auto rounded-[20px] border border-gray-500 py-2 pl-4 pr-14 leading-5 focus:border-2 focus:border-primary-600 focus:outline-none focus:ring-0 ${bg}`}
          placeholder=" "
          {...props}
        />

        <label
          htmlFor={id}
          className={`absolute left-4 top-4 z-10 origin-[0] -translate-y-7 scale-75 transform px-1 tracking-[.03125em] text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-invalid:text-error-600 peer-focus:left-4 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:${bg} peer-focus:text-primary-600 ${bg}`}
        >
          {label}
        </label>

        <button
          className="absolute right-4 top-4 z-10"
          type="button"
          onClick={toggleVisibility}
        >
          {show ? (
            <Eye variant="Bold" className="text-gray-700" />
          ) : (
            <EyeSlash variant="Bold" className="text-gray-700" />
          )}
        </button>
      </div>

      {newPassword && (
        <div className="grid grid-cols-1 gap-[10px] px-[10px] md:grid-cols-2">
          <SupportingText
            text="At least one lowercase letter"
            state={value === "" ? null : /(?=.*[a-z])/.test(value)}
          />
          <SupportingText
            text="Minimum of 8 characters"
            state={value === "" ? null : value.length >= 8}
          />
          <SupportingText
            text="At least one uppercase character"
            state={value === "" ? null : /(?=.*[A-Z])/.test(value)}
          />
          <SupportingText
            text="Must contain a number or special character"
            state={value === "" ? null : /(?=.*\d)|(?=.*\W)/.test(value)}
          />
        </div>
      )}

      {confirmPassword && (
        <div className="px-[10px]">
          <SupportingText
            text="Passwords match each other"
            state={value === "" ? null : value === compare}
          />
        </div>
      )}
    </div>
  );
};

type SupportingTextProps = { text: string; state: boolean | null };

const SupportingText = ({ text, state }: SupportingTextProps) => {
  const iconColor =
    state === null
      ? "text-gray-500"
      : state
        ? "text-primary-600"
        : "text-error-600";

  const textColor =
    state === null
      ? "text-gray-700"
      : state
        ? "text-primary-900"
        : "text-error-900";

  return (
    <div className="flex items-center gap-[10px]">
      <TickCircle
        size={18}
        variant="Bold"
        className={`flex-shrink-0 ${iconColor}`}
      />
      <span className={`body-sm ${textColor}`}>{text} </span>
    </div>
  );
};

export default forwardRef(PasswordInput);
