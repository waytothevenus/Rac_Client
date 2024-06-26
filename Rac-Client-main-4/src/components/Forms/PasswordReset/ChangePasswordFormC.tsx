import { useFormContext } from "react-hook-form";
import { useAuthContext } from "~/contexts/AuthContext";
import { type RegisterInputs } from "~/pages/change-password";
import FormHeader from "../FormHeader";
import PasswordInput from "../Inputs/PasswordInput";
import TextInput from "../Inputs/TextInput";

const ChangePasswordFormC = () => {
  const { isRegistering } = useAuthContext();
  const { register, watch } = useFormContext<RegisterInputs>();

  return (
    <>
      <FormHeader title="Reset your password" />
      <div className="flex w-full flex-col gap-[30px]">
        <TextInput
          id="email"
          label="Email"
          type="email"
          disabled={isRegistering}
          {...register("email")}
        />

        <TextInput
          id="code"
          label="Enter Code"
          type="code"
          disabled={isRegistering}
          {...register("code")}
        />
        <PasswordInput
          id="password"
          label="New Password"
          disabled={isRegistering}
          newPassword
          {...register("password")}
          value={watch("password")}
        />
        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          disabled={isRegistering}
          confirmPassword
          {...register("confirmPassword")}
          value={watch("confirmPassword")}
          compare={watch("password")}
        />
      </div>
    </>
  );
};

export default ChangePasswordFormC;
