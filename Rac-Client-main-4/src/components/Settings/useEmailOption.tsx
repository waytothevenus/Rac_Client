import { ArrowCircleRight2, Box1 } from "iconsax-react";
import { useEffect } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  type SubmitHandler,
} from "react-hook-form";
import { useAuthContext } from "~/contexts/AuthContext";
import useMultiStepForm from "~/hooks/useMultistepForm";
import tailmater from "~/js/tailmater";
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

const emailEmptyValues = {
  emailCode: "",
};

type EmailInputs = typeof emailEmptyValues;

const useEmailOption = () => {
  const steps: [stepsContentType, ...stepsContentType[]] = [
    { title: "Email Verification", content: <EmailStep1 /> },
    {
      title: "Your authentication via Email is now Set Up!",
      content: <EmailStep2 />,
    },
  ];
  const stepsContent = steps.map((step) => step.content);
  const { step, currentStepIndex, next, isFirstStep, isLastStep, goTo } =
    useMultiStepForm(stepsContent);
  const currentTitle = steps[currentStepIndex]?.title ?? "";

  const formMethods = useForm<EmailInputs>({
    defaultValues: emailEmptyValues,
  });

  const onSubmit: SubmitHandler<EmailInputs> = async (data) => {
    if (isFirstStep) {
      console.log("emailCode: ", data.emailCode);
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
          <>
            <div className="w-full md:max-w-[100px]">
              <CloseModalButton dataClose={dataClose} />
            </div>

            <div className="w-full md:max-w-[172px]">
              <ProceedButton onClick={formMethods.handleSubmit(onSubmit)} />
            </div>
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

const EmailStep1 = () => {
  const { user } = useAuthContext();

  if (!user) return;

  const { register } = useFormContext<EmailInputs>();

  return (
    <>
      <span className="body-lg text-gray-700">
        We have sent a code to your email <b>{user.email}</b>, Kindly copy and
        paste the received code here to verify that you still have access to the
        email address.
      </span>
      <TextInput
        id="emailSetupEmailCode"
        label="Email Code"
        bg="bg-surface-300"
        {...register("emailCode")}
      />
    </>
  );
};

const EmailStep2 = () => {
  const { user } = useAuthContext();

  if (!user) return;

  return (
    <div className="flex flex-col gap-[15px]">
      <span className="title-md md:title-lg text-gray-700">
        Each time you access your account, you&apos;ll be required to input a
        code sent to your email address: <b>{user.email}</b>. In case you lose
        access to your mobile device, utilize the backup codes below to disable
        mobile authentication.
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

export default useEmailOption;
