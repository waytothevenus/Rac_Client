import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Refresh2, VolumeLow } from "iconsax-react";
import Link from "next/link";
import { useEffect } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  type SubmitHandler,
} from "react-hook-form";
import { z } from "zod";
import { BackButton } from "~/components/Buttons/BackButton";
import { CloseModalButton } from "~/components/Buttons/CloseModalButton";
import { ConfirmNewPasswordButton } from "~/components/Buttons/ConfirmNewPasswordButton";
import ModalButton from "~/components/Buttons/ModalButton";
import { ProceedButton } from "~/components/Buttons/ProceedButton";
import PasswordInput from "~/components/Forms/Inputs/PasswordInput";
import { LoadingSpinner } from "~/components/LoadingScreen";
import {
  RequestFormHeader,
  SectionContentLayout,
} from "~/components/Shop/Requests/RequestOrder";
import { useAuthContext } from "~/contexts/AuthContext";
import useMultiStepForm from "~/hooks/useMultistepForm";
import useSubmitNewPassword from "~/hooks/useSubmitNewPassword";
import tailmater from "~/js/tailmater";

const schema = z
  .object({
    existingPassword: z.string(),
    newPassword: z
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
  })
  .superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

type AccountInformationInputs = z.infer<typeof schema>;

const emptyValue: AccountInformationInputs = {
  existingPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const AccountInformation = () => {
  const { user } = useAuthContext();

  if (!user) return;

  const token = user.jwt;

  const { isPending, error, mutateAsync } = useSubmitNewPassword(token); // todo: add snackbar for success and error

  const { step, next, isLastStep, goTo, back } = useMultiStepForm([
    <Step1 />,
    <Step2 />,
  ]);

  const formMethods = useForm<AccountInformationInputs>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: emptyValue,
  });

  const onSubmit: SubmitHandler<AccountInformationInputs> = async (data) => {
    if (isLastStep) {
      try {
        const res = await mutateAsync({
          oldPassword: data.existingPassword,
          newPassword: data.newPassword,
        });
        console.log(res);
      } catch (error) {
        console.log(error);
      } finally {
        goTo(0);
        formMethods.reset();
      }
    } else {
      next();
    }
  };

  useEffect(() => {
    tailmater();
  }, [step]);

  return (
    <div className="grid h-full grid-cols-1 gap-[10px] md:grid-cols-2 md:gap-[15px]">
      <div className="col-span-1">
        <FormProvider {...formMethods}>
          <SectionContentLayout>
            <div className="flex h-full w-full flex-col justify-between gap-[10px]">
              <div className="flex flex-col gap-[10px]">
                <div className="flex items-center gap-[10px] text-primary-900">
                  <Lock variant="Bold" />
                  <span className="title-lg">Login Details</span>
                </div>

                <div className="flex flex-col gap-[5px]">
                  <span className="body-md text-gray-700">Email:</span>
                  <span className="title-md text-gray-900">{user.email}</span>
                </div>

                <div className="flex flex-col gap-[5px]">
                  <span className="body-md text-gray-700">Password:</span>
                  <span className="title-md text-gray-900">**********</span>
                </div>
              </div>

              <div className="w-full md:max-w-[181px]">
                <ModalButton
                  modalId="changePassword"
                  label="Change Password"
                  disabled={isPending}
                  buttonClassName="btn relative flex h-[40px] w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] bg-error-600 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white md:px-6"
                  buttonContent={
                    <>
                      {isPending ? (
                        <LoadingSpinner />
                      ) : (
                        <>
                          <Refresh2
                            size={18}
                            variant="Bold"
                            className="flex-shrink-0"
                          />
                          <span className="label-lg whitespace-nowrap text-white">
                            Change Password
                          </span>
                        </>
                      )}
                    </>
                  }
                  footerContent={({ dataClose }) => {
                    return (
                      <div className="flex w-full flex-col gap-[10px] md:w-min">
                        <div className="flex w-full flex-col gap-[10px] md:flex-row">
                          {!isLastStep ? (
                            <div className="w-full md:max-w-[100px]">
                              <CloseModalButton dataClose={dataClose} />
                            </div>
                          ) : (
                            <BackButton onClick={back} />
                          )}

                          {!isLastStep ? (
                            <div className="w-full md:max-w-[172px]">
                              <ProceedButton label="Proceed" onClick={next} />
                            </div>
                          ) : (
                            <div className="w-full md:max-w-[215px]">
                              <ConfirmNewPasswordButton
                                dataClose={dataClose}
                                onClick={formMethods.handleSubmit(onSubmit)}
                                disabled={!formMethods.formState.isValid}
                              />
                            </div>
                          )}
                        </div>
                        {isLastStep && (
                          <span className="body-md">
                            Upon clicking &quot;Confirm New Password&quot;, I
                            confirm I have read and agreed to{" "}
                            <Link href="#" className="text-primary-600">
                              all terms and policies
                            </Link>
                          </span>
                        )}
                      </div>
                    );
                  }}
                >
                  <RequestFormHeader title="Change password" />

                  {step}
                </ModalButton>
              </div>
            </div>
          </SectionContentLayout>
        </FormProvider>
      </div>

      <div className="col-span-1">
        <Pinned />
      </div>
    </div>
  );
};

export const Pinned = () => {
  // todo: replace values
  return (
    <div className="h-full">
      <SectionContentLayout>
        <div className="flex h-full w-full flex-col gap-[10px]">
          <div className="flex items-center gap-[10px] text-error-600">
            <VolumeLow variant="Bold" className="rotate-90" />
            <span className="title-lg">Pinned</span>
          </div>

          <div className="flex flex-col gap-[5px]">
            <span className="body-md text-gray-700">Registered on:</span>
            <span className="title-md text-gray-900">22-03-2023 13:05</span>
          </div>

          <div className="flex flex-col gap-[5px]">
            <span className="body-md text-gray-700">Last Login:</span>
            <span className="title-md text-gray-900">22-03-2023 13:05</span>
          </div>

          <div className="flex flex-col gap-[5px]">
            <span className="body-md text-gray-700">Last Logout:</span>
            <span className="title-md text-gray-900">22-03-2023 13:05</span>
          </div>
        </div>
      </SectionContentLayout>
    </div>
  );
};

const Step1 = () => {
  const { register } = useFormContext<AccountInformationInputs>();

  return (
    <>
      <span className="title-lg text-gray-700">
        To ensure maximum security for your account, type in your existing
        password to continue.
      </span>

      <PasswordInput
        id="existingPassword"
        label="Existing Password"
        bg="bg-surface-300"
        {...register("existingPassword")}
      />
    </>
  );
};

const Step2 = () => {
  const { register, watch } = useFormContext<AccountInformationInputs>();

  useEffect(() => {
    tailmater();
  }, []);

  return (
    <>
      <span className="title-lg text-gray-700">
        Kindly enter your new password
      </span>

      <PasswordInput
        id="newPassword"
        label="New Password"
        bg="bg-surface-300"
        newPassword
        {...register("newPassword")}
        value={watch("newPassword")}
      />

      <PasswordInput
        id="confirmPassword"
        label="Confirm Password"
        bg="bg-surface-300"
        confirmPassword
        {...register("confirmPassword")}
        value={watch("confirmPassword")}
        compare={watch("newPassword")}
      />
    </>
  );
};

export default AccountInformation;
