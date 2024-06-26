// import Link from "next/link";
// // import { ChangePasswordFormC } from "~/components/Forms/PasswordReset/ChangePasswordFormC";
// import ChangePasswordFormC from "~/components/Forms/PasswordReset/ChangePasswordFormC";
// import Logo from "~/components/Logo";
// import { useAuthContext } from "~/contexts/AuthContext";

// const ChangePasswordForm = () => {
//   const { user } = useAuthContext();

//   if (user) return null;

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center bg-brand">
//       <div className="container flex flex-col items-center justify-center px-[20px] py-16 md:px-14">
//         <Logo />

//         <ChangePasswordFormC />
//       </div>
//     </main>
//   );
// };

// export default ChangePasswordForm;

import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  FormProvider,
  useForm,
  type FieldName,
  type SubmitHandler,
} from "react-hook-form";
import Balancer from "react-wrap-balancer";
import isMobilePhone from "validator/lib/isMobilePhone";
import { z } from "zod";
import { capitalizeWords } from "~/Utils";
import { BackButton } from "~/components/Buttons/BackButton";
import { ProceedButton } from "~/components/Buttons/ProceedButton";
import { LoadingSpinner } from "~/components/LoadingScreen";
import Logo from "~/components/Logo";
import { useAuthContext } from "~/contexts/AuthContext";
import { loading } from "~/contexts/TabContext";
import useMultiStepForm from "~/hooks/useMultistepForm";

// const AccountForm = dynamic(
//   () => import("~/components/Forms/Register/AccountForm"),
//   { loading },
// );

// const AddressForm = dynamic(
//   () => import("~/components/Forms/Register/AddressForm"),
//   { loading },
// );
import ChangePasswordFormC from "~/components/Forms/PasswordReset/ChangePasswordFormC";
const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email address")
    .trim(),
  code: z
    .string()
    .min(6, { message: "Last name must be at least 3 characters" })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .refine(
      (value) => /(?=.*[a-z])/.test(value),
      "At least one lowercase letter",
    )
    .refine(
      (value) => /(?=.*[A-Z])/.test(value),
      "At least one uppercase character",
    )
    .refine(
      (value) => /(?=.*\d)|(?=.*\W)/.test(value),
      "Must contain a number or special character",
    ),
  confirmPassword: z.string(),
});

export type RegisterInputs = z.infer<typeof schema>;

const register = () => {
  const { user, isRegistering, registerError, handleConfirmPasswordReset } =
    useAuthContext();

  if (user) return null;

  const formMethods = useForm<RegisterInputs>({
    mode: "all",
    resolver: zodResolver(schema),
  });
  // const { step, next, isFirstStep, back, isLastStep } = useMultiStepForm([
  //   <AccountForm />,
  //   <AddressForm />,
  // ]);
  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    // if (!isLastStep) return next();

    const registerData = {
      email: data.email,
      otp: data.code,
      newPassword: data.password,
    };

    await handleConfirmPasswordReset(registerData);
  };

  const isFieldTouched = (fieldName: FieldName<RegisterInputs>) =>
    formMethods.formState.touchedFields[fieldName];
  const hasFieldError = (fieldName: FieldName<RegisterInputs>) =>
    !formMethods.formState.errors[fieldName];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand">
      <div className="container flex flex-col items-center justify-center px-[20px] py-16 md:px-14">
        <Logo />

        <FormProvider {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className="mb-[30px] mt-[100px] flex w-full max-w-[600px] flex-col items-center justify-center gap-[30px] rounded-[20px] bg-white p-[20px] md:p-[30px]"
          >
            <ChangePasswordFormC />

            {registerError && (
              <span className="text-error-600">{registerError}</span>
            )}

            <div className="flex gap-4">
              <CreateAccountButton
                onClick={formMethods.handleSubmit(onSubmit)}
                disabled={
                  // isRegistering ||
                  !(
                    formMethods.formState.touchedFields.email &&
                    formMethods.formState.touchedFields.code &&
                    formMethods.formState.touchedFields.password ===
                      formMethods.formState.touchedFields.confirmPassword
                  )
                }
                loading={isRegistering}
              />
            </div>
          </form>
        </FormProvider>
      </div>
    </main>
  );
};

type CreateAccountButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
};

const CreateAccountButton = ({
  onClick,
  disabled = false,
  loading = false,
}: CreateAccountButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="btn relative flex h-[40px] flex-row items-center justify-center gap-x-2 rounded-[6.25rem] bg-primary-600 px-6 py-2.5 text-sm font-medium tracking-[.00714em] text-white hover:shadow-md"
    >
      {loading ? <LoadingSpinner /> : "Comfirm"}
    </button>
  );
};

const TermsAndCondition = () => {
  return (
    <div className="body-md text-center text-black">
      <Balancer>
        You accept the privacy statement of RAC&nbsp;Logistics by clicking the{" "}
        <span className="label-lg text-primary-600">Create My Account </span>
        button
      </Balancer>
    </div>
  );
};

export default register;
