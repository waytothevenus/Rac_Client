import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { DoneButton } from "~/components/Buttons/DoneButton";
import NeedHelpFAB from "~/components/Buttons/NeedHelpFAB";
import { ProceedButton } from "~/components/Buttons/ProceedButton";
import { SaveAsDraftButton } from "~/components/Buttons/SaveAsDraftButton";
import LabelId from "~/components/LabelId";
import { useAuthContext } from "~/contexts/AuthContext";
import { useShopContext } from "~/contexts/ShopContext";
import { useTabContext } from "~/contexts/TabContext";
import useMultiStepForm from "~/hooks/useMultistepForm";
import useSubmitShopRequest from "~/hooks/useSubmitShopRequest";
import {
  RequestFormHeader,
  RequestOrderStep1,
  RequestOrderStep2,
  SectionContentLayout,
  schema,
  type ShopInputs,
} from "../Requests/RequestOrder";

const DraftDetails = () => {
  const { user } = useAuthContext();

  if (!user) return;

  const { isPending, error, mutateAsync } = useSubmitShopRequest(user.jwt);

  const { localDraft, handleLocalDraft } = useShopContext();

  if (!localDraft) return;

  const { step, next, isLastStep, isSecondToLastStep } = useMultiStepForm([
    <RequestOrderStep1 />,
    <RequestOrderStep2 />,
  ]);

  const { handleTabChange } = useTabContext();

  const formMethods = useForm<ShopInputs>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: localDraft,
  });

  useEffect(() => {
    console.log(localDraft);
    formMethods.reset(localDraft);
  }, [localDraft]);

  const [requestId, setRequestId] = useState("");

  const onSubmit: SubmitHandler<ShopInputs> = async (data) => {
    if (isSecondToLastStep) {
      console.log("submitting user package...");
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
    handleLocalDraft(null);
  };

  const handleSaveAsDraft = () => {
    handleTabChange("drafts");
    handleLocalDraft(formMethods.getValues());
  };

  return (
    <FormProvider {...formMethods}>
      <div className="flex flex-col gap-[30px] rounded-[20px] bg-white p-[20px] md:p-[30px]">
        <RequestFormHeader
          title="Requesting For New Shop For Me Service"
          draft
        />

        {isLastStep && (
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
