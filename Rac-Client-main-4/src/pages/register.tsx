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

const AccountForm = dynamic(
  () => import("~/components/Forms/Register/AccountForm"),
  { loading },
);

const AddressForm = dynamic(
  () => import("~/components/Forms/Register/AddressForm"),
  { loading },
);

const schema = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name must be at least 3 characters" })
    .trim(),
  lastName: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters" })
    .trim(),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email address")
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
  country: z.string().min(1, { message: "Required" }),
  state: z.string().min(1, { message: "Required" }),
  city: z.string().min(1, { message: "Required" }),
  address: z.string().min(1, { message: "Required" }).trim(),
  countryCode: z.string(),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required" })
    .trim()
    .refine(isMobilePhone, "Must be a valid phone number"),
  zipPostalCode: z.string().min(1, { message: "Required" }).trim(),
});

export type RegisterInputs = z.infer<typeof schema>;

const register = () => {
  const { user, isRegistering, registerError, handleRegister } =
    useAuthContext();

  if (user) return null;

  const formMethods = useForm<RegisterInputs>({
    mode: "all",
    resolver: zodResolver(schema),
  });
  const { step, next, isFirstStep, back, isLastStep } = useMultiStepForm([
    <AccountForm />,
    <AddressForm />,
  ]);
  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    if (!isLastStep) return next();

    const registerData = {
      firstName: capitalizeWords(data.firstName),
      lastName: capitalizeWords(data.lastName),
      email: data.email,
      password: data.password,
      country: data.country,
      countryCode: data.countryCode,
      contactAddress: [
        {
          country: data.country,
          state: data.state,
          city: data.city,
          streetAddress: data.address,
          countryCode: data.countryCode,
          phoneNumber: data.phoneNumber,
          postalCode: data.zipPostalCode,
        },
      ],
    };

    await handleRegister(registerData);
  };

  const isFieldTouched = (fieldName: FieldName<RegisterInputs>) =>
    formMethods.formState.touchedFields[fieldName];
  const hasFieldError = (fieldName: FieldName<RegisterInputs>) =>
    !formMethods.formState.errors[fieldName];

  const isFormValid =
    isFieldTouched("firstName") &&
    isFieldTouched("lastName") &&
    isFieldTouched("email") &&
    isFieldTouched("password") &&
    isFieldTouched("confirmPassword") &&
    hasFieldError("firstName") &&
    hasFieldError("lastName") &&
    hasFieldError("email") &&
    hasFieldError("password");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand">
      <div className="container flex flex-col items-center justify-center px-[20px] py-16 md:px-14">
        <Logo />

        <FormProvider {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className="mb-[30px] mt-[100px] flex w-full max-w-[600px] flex-col items-center justify-center gap-[30px] rounded-[20px] bg-white p-[20px] md:p-[30px]"
          >
            {step}

            {registerError && (
              <span className="text-error-600">{registerError}</span>
            )}

            <div className="flex gap-4">
              {!isRegistering && !isFirstStep && (
                <div className="w-full md:w-max">
                  <BackButton onClick={back} />
                </div>
              )}
              {!isLastStep ? (
                <ProceedButton
                  onClick={next}
                  disabled={
                    !(
                      isFormValid &&
                      formMethods.watch("password") ===
                        formMethods.watch("confirmPassword")
                    )
                  }
                />
              ) : (
                <CreateAccountButton
                  onClick={formMethods.handleSubmit(onSubmit)}
                  disabled={
                    isRegistering ||
                    !(
                      formMethods.formState.touchedFields.country &&
                      formMethods.formState.touchedFields.state &&
                      formMethods.formState.touchedFields.city &&
                      formMethods.formState.touchedFields.address &&
                      formMethods.formState.touchedFields.zipPostalCode &&
                      formMethods.formState.touchedFields.countryCode &&
                      formMethods.formState.touchedFields.phoneNumber &&
                      !formMethods.formState.errors.country &&
                      !formMethods.formState.errors.state &&
                      !formMethods.formState.errors.city &&
                      !formMethods.formState.errors.address &&
                      !formMethods.formState.errors.zipPostalCode &&
                      !formMethods.formState.errors.countryCode &&
                      !formMethods.formState.errors.phoneNumber
                    )
                  }
                  loading={isRegistering}
                />
              )}
            </div>

            {isLastStep && <TermsAndCondition />}
          </form>
        </FormProvider>

        <div className="text-white">
          <span className="label-lg">Already have an account?</span>
          <Link
            href="/login"
            className="label-lg px-[12px] py-[10px] text-primary-200 hover:underline"
          >
            Login
          </Link>
        </div>
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
      {loading ? <LoadingSpinner /> : "Create My Account"}
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
