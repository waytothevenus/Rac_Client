import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { DoneButton } from "~/components/Buttons/DoneButton";
import NeedHelpFAB from "~/components/Buttons/NeedHelpFAB";
import { ProceedButton } from "~/components/Buttons/ProceedButton";
import { SaveAsDraftButton } from "~/components/Buttons/SaveAsDraftButton";
import LabelId from "~/components/LabelId";
import { HighlightedInfo } from "~/components/Shop/Requests/RequestDetails";
import {
  RequestFormHeader,
  SectionContentLayout,
} from "~/components/Shop/Requests/RequestOrder";
import { type PACKAGE_DELIVERY_STATUS } from "~/constants";
import { useAuthContext } from "~/contexts/AuthContext";
import { useImportContext } from "~/contexts/ImportContext";
import { useTabContext } from "~/contexts/TabContext";
import useMultiStepForm from "~/hooks/useMultistepForm";
import useSubmitImportRequest from "~/hooks/useSubmitImportRequest";
import {
  Step2,
  Step3,
  schema,
  type ImportInputs,
} from "../Requests/RequestOrder";

const DraftDetails = () => {
  const { user } = useAuthContext();

  if (!user) return;

  const { isPending, error, mutateAsync } = useSubmitImportRequest(user.jwt); // todo: add snackbar for success and error

  const { localDraft, handleDraft, handleLocalDraft } = useImportContext();

  if (!localDraft) return;

  const { step, next, isLastStep, isSecondToLastStep } = useMultiStepForm([
    <Step2 />,
    <Step3 />,
  ]);

  const { handleTabChange } = useTabContext();

  const formMethods = useForm<ImportInputs>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: localDraft,
  });

  useEffect(() => {
    console.log(localDraft);
    formMethods.reset(localDraft);
  }, [localDraft]);

  const [requestId, setRequestId] = useState("");

  const onSubmit: SubmitHandler<ImportInputs> = async (data) => {
    if (isSecondToLastStep) {
      console.log(data);
      if (
        (data.requestPackage
          .deliveryStatus as (typeof PACKAGE_DELIVERY_STATUS)[number]) ===
        "Some delivered"
      ) {
        handleLocalDraft(formMethods.getValues());
      } else {
        try {
          const res = await mutateAsync(data.requestPackage);
          console.log(res);
          setRequestId(res.data.requestId);
        } catch (err) {
          console.log(err);
          return;
        }
      }
    }
    next();
  };

  const handleFinish = () => {
    handleTabChange("requests");
    handleDraft(null);
    handleLocalDraft(null);
  };

  const handleSaveAsDraft = () => {
    handleTabChange("drafts");
    handleDraft(formMethods.getValues());
    handleLocalDraft(formMethods.getValues());
  };

  return (
    <FormProvider {...formMethods}>
      <div className="flex max-w-[1000px] flex-col gap-[30px] rounded-[20px] bg-white p-[20px] md:p-[30px]">
        <RequestFormHeader title="Requesting For New Import Order" draft />

        {!isLastStep ? (
          <HighlightedInfo text="Provide as much Information as possible needed for our staffs to identify your package if it has been delivered. The more Information you provide, the easier we identify your package." />
        ) : (
          <SectionContentLayout>
            <LabelId label="Request ID" id={requestId} center={true} />
          </SectionContentLayout>
        )}

        {step}

        {!isLastStep ? (
          !isPending ? (
            <div className="flex flex-col gap-[10px] md:flex md:flex-row md:[&>*]:w-max">
              <SaveAsDraftButton onClick={handleSaveAsDraft} />
              <ProceedButton onClick={formMethods.handleSubmit(onSubmit)} />
            </div>
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
