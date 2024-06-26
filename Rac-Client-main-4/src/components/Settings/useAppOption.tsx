/* eslint-disable @next/next/no-img-element */
import {
  ArrowCircleRight2,
  Box1,
  MinusCirlce,
  SecuritySafe,
} from "iconsax-react";
import { useEffect } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  type SubmitHandler,
} from "react-hook-form";
import { useToggle } from "usehooks-ts";
import useMultiStepForm from "~/hooks/useMultistepForm";
import tailmater from "~/js/tailmater";
import { BackButton } from "../Buttons/BackButton";
import { CloseModalButton } from "../Buttons/CloseModalButton";
import { type ModalButtonProps } from "../Buttons/ModalButton";
import { PrimaryButton } from "../Buttons/PrimaryButton";
import { ProceedButton } from "../Buttons/ProceedButton";
import TextInput from "../Forms/Inputs/TextInput";
import {
  StepIndex,
  type stepsContentType,
} from "../Shop/Requests/RequestCheckout";
import {
  RequestFormHeader,
  SectionContentLayout,
} from "../Shop/Requests/RequestOrder";

const appEmptyValues = {
  emailCode: "",
  authCode: "",
};

type AppInputs = typeof appEmptyValues;

export const useAppOption = () => {
  const steps: [stepsContentType, ...stepsContentType[]] = [
    { title: "Email Verification", content: <AppStep1 /> },
    {
      title: "Download Authentication app",
      content: <AppStep2 />,
    },
    { title: "Connect to authenticator app", content: <AppStep3 /> },
    {
      title: "Your authentication via App is now Set Up!",
      content: <AppStep4 />,
    },
  ];
  const stepsContent = steps.map((step) => step.content);
  const {
    step,
    currentStepIndex,
    next,
    isFirstStep,
    back,
    isLastStep,
    isSecondToLastStep,
    goTo,
  } = useMultiStepForm(stepsContent);
  const currentTitle = steps[currentStepIndex]?.title ?? "";

  const formMethods = useForm<AppInputs>({
    defaultValues: appEmptyValues,
  });

  const onSubmit: SubmitHandler<AppInputs> = async (data) => {
    if (isFirstStep) {
      console.log("emailCode: ", data.emailCode);
      // todo:
    } else if (isSecondToLastStep) {
      console.log("authCode: ", data.authCode);
      // todo:
    }
    next();
  };

  useEffect(() => {
    if (isFirstStep || isLastStep) tailmater();
  }, [step]);

  const modalContent = () => {
    return (
      <FormProvider {...formMethods}>
        <RequestFormHeader title="Authentication via App Setup" />
        <StepIndex
          currentIndex={currentStepIndex}
          length={steps.length}
          title={currentTitle}
        />
        {step}
      </FormProvider>
    );
  };

  const footerContent: ModalButtonProps["footerContent"] = ({ dataClose }) => {
    return (
      <div className="flex gap-[10px]">
        {isFirstStep ? (
          <div className="w-full md:max-w-[100px]">
            <CloseModalButton dataClose={dataClose} />
          </div>
        ) : (
          <div className="w-full md:max-w-[100px]">
            <BackButton onClick={back} />
          </div>
        )}
        {!isLastStep ? (
          <>
            {!isSecondToLastStep ? (
              <div className="w-full md:max-w-[172px]">
                <ProceedButton onClick={formMethods.handleSubmit(onSubmit)} />
              </div>
            ) : (
              <div className="w-full md:max-w-[172px]">
                <ProceedButton
                  icon={<SecuritySafe size={18} variant="Bold" />}
                  label="Verify"
                  onClick={formMethods.handleSubmit(onSubmit)}
                />
              </div>
            )}
          </>
        ) : (
          <div className="w-full md:max-w-[172px]">
            <CloseModalButton
              icon={<ArrowCircleRight2 size={18} variant="Bold" />}
              label="Finish setup"
              dataClose={dataClose}
              onClick={() => goTo(0)}
              primary
            />
          </div>
        )}
      </div>
    );
  };

  return { modalContent, footerContent };
};

const AppStep1 = () => {
  const { register } = useFormContext<AppInputs>();

  return (
    <>
      <span className="body-lg text-gray-700">
        We have sent a code to your email, Kindly copy and paste it here
      </span>
      <TextInput
        id="appSetupEmailCode"
        label="Email Code"
        bg="bg-surface-300"
        {...register("emailCode")}
      />
    </>
  );
};

const AppStep2 = () => {
  return (
    <>
      <span className="body-lg text-gray-700">
        You can use any authentication app of your choice, but we recommend the
        following:
      </span>
      <div className="rounded-[20px] bg-surface-100">
        <SectionContentLayout>
          <div className="-mx-[14px] -my-[10px] flex items-center gap-[10px]">
            <img
              src="/images/google_authenticator_logo.svg"
              alt="google authenticator logo"
            />
            <span className="title-md text-gray-700">Google Authenticator</span>
          </div>
        </SectionContentLayout>
      </div>
    </>
  );
};

const AppStep3 = () => {
  const [showCode, toggle] = useToggle(false);
  const { register } = useFormContext<AppInputs>();

  return (
    <div className="flex flex-col gap-[30px]">
      <div className="rounded-[20px] bg-surface-100">
        <SectionContentLayout>
          {!showCode ? (
            <div className="flex flex-col gap-[10px] md:-mx-[14px]">
              <span className="title-md md:title-lg text-gray-700">
                Scan the QR code using your preferred authentication app and
                enter the provided code below. This app will be required for
                every login to your RAC Logistics dashboard.
              </span>
              <div className="flex flex-col items-center gap-[20px] md:flex-row">
                <img
                  src="https://placehold.co/250x250/cac4d0/1d192b?text=QR%20Code"
                  alt="qr code"
                  className="p-[10px]"
                />

                <div className="flex w-full flex-col items-center gap-[10px] px-[10px] md:w-max md:items-start">
                  <div className="flex gap-[5px] text-gray-500">
                    <MinusCirlce
                      size={18}
                      variant="Bold"
                      className="flex-shrink-0"
                    />
                    <span className="body-sm whitespace-nowrap">
                      You can&apos;t scan QR code?
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label={"Show code"}
                    onClick={toggle}
                    className="btn relative flex h-[40px] w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] border border-gray-500 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white md:px-6"
                  >
                    <span className="label-lg whitespace-nowrap text-primary-600">
                      Show code
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="-my-[10px] flex flex-col gap-[30px] md:-mx-[14px]">
              <span className="title-md md:title-lg text-gray-700">
                Insert the provided code into your mobile authentication app.
                Retrieve the code shown by the mobile app and proceed with the
                setup. This app will be required for every login to your RAC
                Logistics dashboard.
              </span>
              <div className="flex flex-col items-center gap-[20px] md:flex-row">
                <div className="h-max w-full rounded-[20px] bg-surface-300 text-center md:w-max">
                  <SectionContentLayout>
                    <span className="title-md md:title-lg w-full text-gray-700">
                      DF3R HGTY FGTR GHUU
                    </span>
                  </SectionContentLayout>
                </div>

                <div className="flex w-full flex-col items-center gap-[10px] px-[10px] md:w-max md:items-start">
                  <div className="flex gap-[5px] text-gray-500">
                    <MinusCirlce
                      size={18}
                      variant="Bold"
                      className="flex-shrink-0"
                    />
                    <span className="body-sm whitespace-nowrap">
                      You want to scan QR code?
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label={"Show QR code"}
                    onClick={toggle}
                    className="btn relative flex h-[40px] w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] border border-gray-500 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white md:px-6"
                  >
                    <span className="label-lg whitespace-nowrap text-primary-600">
                      Show QR code
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </SectionContentLayout>
      </div>

      <TextInput
        id="authCode"
        label="Authenticator Code"
        bg="bg-surface-300"
        {...register("authCode")}
      />
    </div>
  );
};

const AppStep4 = () => {
  return (
    <div className="flex flex-col gap-[15px]">
      <span className="title-md md:title-lg text-gray-700">
        Each time you access your account, you&apos;ll be required to input a
        generated code from your mobile application. In case you lose access to
        your mobile device, utilize the backup codes below to disable mobile
        authentication.
      </span>
      <div className="rounded-[20px] bg-surface-100">
        <SectionContentLayout>
          <div className="flex flex-col gap-[30px] md:-mx-[14px]">
            <span className="title-md md:title-lg text-gray-700">
              Insert the provided code into your mobile authentication app.
              Retrieve the code shown by the mobile app and proceed with the
              setup. This app will be required for every login to your RAC
              Logistics dashboard.
            </span>
            <div className="flex flex-col items-center gap-[20px] md:flex-row">
              <div className="w-full rounded-[20px] bg-surface-300">
                <SectionContentLayout>
                  <div className="flex w-full flex-col items-center justify-center gap-[10px]">
                    <span className="title-md md:title-lg text-gray-700">
                      DF3R HGTY FGTR GHUU
                    </span>
                    <span className="title-md md:title-lg text-gray-700">
                      DF3R HGTY FGTR GHUU
                    </span>
                    <span className="title-md md:title-lg text-gray-700">
                      DF3R HGTY FGTR GHUU
                    </span>
                    <span className="title-md md:title-lg text-gray-700">
                      DF3R HGTY FGTR GHUU
                    </span>
                    <span className="title-md md:title-lg text-gray-700">
                      DF3R HGTY FGTR GHUU
                    </span>
                    <span className="title-md md:title-lg text-gray-700">
                      DF3R HGTY FGTR GHUU
                    </span>
                    <span className="title-md md:title-lg text-gray-700">
                      DF3R HGTY FGTR GHUU
                    </span>
                    <span className="title-md md:title-lg text-gray-700">
                      DF3R HGTY FGTR GHUU
                    </span>
                    <span className="title-md md:title-lg text-gray-700">
                      DF3R HGTY FGTR GHUU
                    </span>
                    <span className="title-md md:title-lg text-gray-700">
                      DF3R HGTY FGTR GHUU
                    </span>
                  </div>
                </SectionContentLayout>
              </div>

              <div className="flex flex-col gap-[10px]">
                <div className="flex gap-[5px] text-gray-500">
                  <Box1 size={18} variant="Bold" className="flex-shrink-0" />
                  <span className="body-sm whitespace-nowrap">
                    How do you want to store them?
                  </span>
                </div>

                <PrimaryButton text="Download" onClick={() => undefined} />

                <button
                  type="button"
                  aria-label={"Print"}
                  onClick={() => undefined}
                  className="btn relative flex h-[40px] w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] border border-gray-500 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white md:px-6"
                >
                  <span className="label-lg whitespace-nowrap text-primary-600">
                    Print
                  </span>
                </button>
              </div>
            </div>
          </div>
        </SectionContentLayout>
      </div>
    </div>
  );
};
