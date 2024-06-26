import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { BackButton } from "~/components/Buttons/BackButton";
import { DoneButton } from "~/components/Buttons/DoneButton";
import NeedHelpFAB from "~/components/Buttons/NeedHelpFAB";
import { ProceedButton } from "~/components/Buttons/ProceedButton";
import { SaveAsDraftButton } from "~/components/Buttons/SaveAsDraftButton";
import CongratulationImage from "~/components/CongratulationImage";
import LabelId from "~/components/LabelId";
import {
  StepIndex,
  type stepsContentType,
} from "~/components/Shop/Requests/RequestCheckout";
import {
  RequestFormHeader,
  SectionContentLayout,
} from "~/components/Shop/Requests/RequestOrder";
import { useAuthContext } from "~/contexts/AuthContext";
import { useAutoImportContext } from "~/contexts/AutoImportContext";
import { useTabContext } from "~/contexts/TabContext";
import useMultiStepForm from "~/hooks/useMultistepForm";
import useSubmitAutoImportRequest from "~/hooks/useSubmitAutoImportRequest";
import {
  Step1,
  Step2,
  Step3,
  Step4,
  schema,
  type AutoImportInputs,
} from "../Requests/RequestOrder";

const DraftDetails = () => {
  const { user } = useAuthContext();

  if (!user) return;

  const { isPending, error, mutateAsync } = useSubmitAutoImportRequest(
    user.jwt,
  ); // todo: add snackbar for success and error

  const { localDraft, handleLocalDraft, handleDraft } = useAutoImportContext();

  if (!localDraft) return;

  const { handleTabChange, handleActiveAction } = useTabContext();

  const steps: [stepsContentType, ...stepsContentType[]] = [
    { title: "Package Details", content: <Step1 /> },
    {
      title: "Shipping & Billing Address",
      content: <Step2 />,
    },
    { title: "Order Summary", content: <Step3 /> },
    { title: "Success", content: <Step4 /> },
  ];
  const stepsContent = steps.map((step) => step.content);
  const {
    step,
    currentStepIndex,
    next,
    isFirstStep,
    isSecondToLastStep,
    isLastStep,
    back,
  } = useMultiStepForm(stepsContent);
  const currentTitle = steps[currentStepIndex]?.title ?? "";

  const formMethods = useForm<AutoImportInputs>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: localDraft,
  });

  useEffect(() => {
    console.log(localDraft);
    formMethods.reset(localDraft);
  }, [localDraft]);

  const [requestId, setRequestId] = useState("");

  const onSubmit: SubmitHandler<AutoImportInputs> = async (data) => {
    if (isSecondToLastStep) {
      console.log(data);
      try {
        const res = await mutateAsync(data.requestPackage);
        console.log(res);
        setRequestId(res.data.requestId);
      } catch (err) {
        console.log(err);
        return;
      }
    }
    next();
  };

  const handleFinish = () => {
    handleTabChange("requests");
    handleDraft(null);
    handleLocalDraft(null);
  };

  const handleBack = () => {
    handleActiveAction(null);
  };

  const handleSaveAsDraft = () => {
    handleTabChange("drafts");
    handleDraft(formMethods.getValues());
    handleLocalDraft(formMethods.getValues());
  };

  const handleStep1Validation = async () => {
    const a = await formMethods.trigger("requestPackage.originWarehouse", {
      shouldFocus: true,
    });
    const b = await formMethods.trigger("requestPackage.items", {
      shouldFocus: true,
    });
    if (a && b) next();
  };

  const handleStep2Validation = async () => {
    const a = await formMethods.trigger("requestPackage.destinationDetails", {
      shouldFocus: true,
    });
    const b = await formMethods.trigger("requestPackage.billingDetails", {
      shouldFocus: true,
    });
    if (a && b) next();
  };

  return (
    <FormProvider {...formMethods}>
      <div className="flex max-w-[1000px] flex-col gap-[30px] rounded-[20px] bg-white p-[20px] md:p-[30px]">
        <RequestFormHeader title="Requesting For New Auto Import Order" draft />

        <StepIndex
          currentIndex={currentStepIndex}
          length={steps.length}
          title={currentTitle}
        />

        {isLastStep && (
          <>
            <SectionContentLayout>
              <LabelId label="Request ID" id={requestId} center />
            </SectionContentLayout>
            <CongratulationImage description="You have just successfully requested an order for Auto Import service." />
          </>
        )}

        {step}

        {!isLastStep ? (
          !isPending ? (
            <>
              <div className="hidden gap-[10px] md:flex [&>*]:w-max">
                {!isFirstStep && !isLastStep && <BackButton onClick={back} />}
                <SaveAsDraftButton onClick={handleSaveAsDraft} />
                <ProceedButton
                  onClick={
                    isFirstStep
                      ? handleStep1Validation
                      : currentStepIndex === 1
                        ? handleStep2Validation
                        : formMethods.handleSubmit(onSubmit)
                  }
                />
              </div>
              {/* for mobile screen */}
              <div className="grid w-full grid-cols-2 gap-[10px] md:hidden">
                <div className="col-span-full [@media(min-width:320px)]:col-span-1">
                  {isFirstStep && <BackButton onClick={handleBack} />}
                  {!isFirstStep && !isLastStep && <BackButton onClick={back} />}
                </div>
                <div className="col-span-full [@media(min-width:320px)]:col-span-1">
                  <ProceedButton
                    onClick={
                      isFirstStep
                        ? handleStep1Validation
                        : currentStepIndex === 1
                          ? handleStep2Validation
                          : formMethods.handleSubmit(onSubmit)
                    }
                  />
                </div>
                <div className="col-span-full">
                  <SaveAsDraftButton onClick={handleSaveAsDraft} />
                </div>
              </div>
            </>
          ) : (
            <div className="w-full">
              <div className="linear-loader relative flex h-1 w-full overflow-hidden bg-gray-100">
                <div className="bar absolute inset-0 w-full bg-primary-600"></div>
                <div className="bar absolute inset-0 w-full bg-primary-600"></div>
              </div>
            </div>
          )
        ) : (
          <div className="w-full md:w-[200px]">
            <DoneButton onClick={handleFinish} />
          </div>
        )}
        <NeedHelpFAB />
      </div>
    </FormProvider>
  );
};

export default DraftDetails;
