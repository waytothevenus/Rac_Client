import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  type SubmitHandler,
} from "react-hook-form";
import { BackButton } from "~/components/Buttons/BackButton";
import { DoneButton } from "~/components/Buttons/DoneButton";
import NeedHelpFAB from "~/components/Buttons/NeedHelpFAB";
import { ProceedButton } from "~/components/Buttons/ProceedButton";
import { SaveAsDraftButton } from "~/components/Buttons/SaveAsDraftButton";
import CongratulationImage from "~/components/CongratulationImage";
import {
  Guidelines,
  OfficeDeliverAddress,
  Step1,
  Step2,
  emptyValue,
  schema,
  type DeliveryStatusMapType,
  type ImportInputs,
  type InstructionsMapType,
} from "~/components/Import/Requests/RequestOrder";
import LabelId from "~/components/LabelId";
import { StepDescription } from "~/components/Shop/Orders/OrdersPanel";
import { HighlightedInfo } from "~/components/Shop/Requests/RequestDetails";
import {
  RequestFormHeader,
  SectionContentLayout,
  SectionHeader,
} from "~/components/Shop/Requests/RequestOrder";
import {
  WAREHOUSE_LOCATIONS,
  type ORIGINS,
  type PACKAGE_DELIVERY_STATUS,
} from "~/constants";
import { useAuthContext } from "~/contexts/AuthContext";
import { useExportContext } from "~/contexts/ExportContext";
import { useTabContext } from "~/contexts/TabContext";
import useMultiStepForm from "~/hooks/useMultistepForm";
import useSubmitExportRequest from "~/hooks/useSubmitExportRequest";

export type ExportInputs = ImportInputs;

const RequestOrder = () => {
  const { user } = useAuthContext();

  if (!user) return;

  const { isPending, error, mutateAsync } = useSubmitExportRequest(user.jwt); // todo: add snackbar for success and error

  const { step, next, isFirstStep, isLastStep, isSecondToLastStep, goTo } =
    useMultiStepForm([<Step1 />, <Step2 />, <Step3 />]);

  const { handleRequests, handleLocalDraft, handleDraft } = useExportContext();
  const { handleActiveAction, handleTabChange } = useTabContext();

  const formMethods = useForm<ExportInputs>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: emptyValue,
  });

  const [requestId, setRequestId] = useState("");

  const onSubmit: SubmitHandler<ExportInputs> = async (data) => {
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
    handleRequests();
    handleTabChange("requests");
    handleDraft(null);
  };

  const handleBack = () => {
    handleActiveAction(null);
  };

  const handleSaveAsDraft = () => {
    handleTabChange("drafts");
    handleLocalDraft(formMethods.getValues());
  };

  const handleFirstStep = () => {
    if (
      (formMethods.getValues().requestPackage
        .deliveryStatus as (typeof PACKAGE_DELIVERY_STATUS)[number]) ===
      "None delivered"
    ) {
      goTo(2);
    } else {
      next();
    }
  };

  return (
    <FormProvider {...formMethods}>
      <div className="flex max-w-[1000px] flex-col gap-[30px] rounded-[20px] bg-white p-[20px] md:p-[30px]">
        <RequestFormHeader title="Requesting For New Export Order" />

        {!isLastStep ? (
          <HighlightedInfo text="Provide as much Information as possible needed for our staffs to identify your package if it has been delivered. The more Information you provide, the easier we identify your package." />
        ) : (
          (formMethods.getValues().requestPackage
            .deliveryStatus as (typeof PACKAGE_DELIVERY_STATUS)[number]) !==
            "None delivered" && (
            <SectionContentLayout>
              <LabelId label="Request ID" id={requestId} center={true} />
            </SectionContentLayout>
          )
        )}

        {step}

        {isFirstStep && (
          <div className="flex w-full flex-col gap-[10px] md:flex-row md:[&>*]:w-max">
            <BackButton onClick={handleBack} />
            <ProceedButton
              onClick={handleFirstStep}
              disabled={
                formMethods.watch("requestPackage.originWarehouse") === "" ||
                formMethods.watch("requestPackage.deliveryStatus") === ""
              }
            />
          </div>
        )}

        {!isFirstStep &&
          !isLastStep &&
          (!isPending ? (
            <>
              <div className="hidden gap-[10px] md:flex [&>*]:w-max">
                <BackButton onClick={handleBack} />
                <SaveAsDraftButton onClick={handleSaveAsDraft} />
                <ProceedButton onClick={formMethods.handleSubmit(onSubmit)} />
              </div>
              {/* for mobile screen */}
              <div className="grid w-full grid-cols-2 gap-[10px] md:hidden">
                <div className="col-span-full [@media(min-width:320px)]:col-span-1">
                  <BackButton onClick={handleBack} />
                </div>
                <div className="col-span-full [@media(min-width:320px)]:col-span-1">
                  <ProceedButton onClick={formMethods.handleSubmit(onSubmit)} />
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
          ))}

        {isLastStep && (
          <div className="w-full md:w-[200px]">
            <DoneButton onClick={handleFinish} />
          </div>
        )}

        <NeedHelpFAB />
      </div>
    </FormProvider>
  );
};

export const Step3 = () => {
  const { getValues } = useFormContext<ExportInputs>();

  const deliveryStatusMap: DeliveryStatusMapType = {
    "None delivered": {
      imageText: (
        <CongratulationImage
          title="OOPS... You can't request for an Export order yet"
          description={
            <>
              Send your package to our Warehouse in United States (your selected
              <b>&quot;Origin&quot;</b>)
            </>
          }
        />
      ),
      whatNext: (
        <Guidelines>
          <StepDescription
            stepNumber={1}
            description="Once you are sure that this package has gotten to the warehouse address above, attempt requesting for a new export order and provide us information we need to Identify the package as yours."
            backgroundColor="bg-primary-600"
          />

          <StepDescription
            stepNumber={2}
            description={
              <span className="body-lg md:title-lg text-gray-900">
                Here are some tip to help us quickly identify your package
                <ul className="list-item pl-[30px] [&>*]:list-disc">
                  <li>Attach your USER ID on the Package if you can.</li>
                  <li>
                    If you are purchasing the package directly from the seller,
                    provide us the TRACKING ID or any other related ID on the
                    package that is Unique to your order from the seller.
                  </li>
                  <li>
                    If you have the actual picture of the package, provide it
                    while requesting for the Export order on our website
                  </li>
                </ul>
              </span>
            }
            backgroundColor="bg-primary-600"
          />
        </Guidelines>
      ),
    },
    "All delivered": {
      imageText: (
        <CongratulationImage description="You have just successfully requested for Export service." />
      ),
      whatNext: <Instructions />,
    },
    "Some delivered": {
      imageText: (
        <CongratulationImage
          title="OOPS... You can't request for an Export order yet"
          description={
            <>
              Your request has been as <b>&quot;Draft&quot;</b>. To complete
              your request, kindly send the remaining items in your package to
              our Warehouse in United States (your selected{" "}
              <b>&quot;Origin&quot;</b>)
            </>
          }
        />
      ),
      whatNext: (
        <Guidelines>
          <StepDescription
            stepNumber={1}
            description={
              <>
                Once you are sure that all the items yet to be delivered in your
                package have gotten to the warehouse address above, come to the
                <b>'Draft'</b> folder to update the 'Item Delivery Status' of
                these items and submit your request for a new export order
              </>
            }
            backgroundColor="bg-primary-600"
          />

          <StepDescription
            stepNumber={2}
            description={
              <span className="body-lg md:title-lg text-gray-900">
                Here are some tip to help us quickly identify your package
                <ul className="list-item pl-[30px] [&>*]:list-disc">
                  <li>Attach your USER ID on the Package if you can.</li>
                  <li>
                    If you are purchasing the package directly from the seller,
                    provide us the TRACKING ID or any other related ID on the
                    package that is Unique to your order from the seller.
                  </li>
                  <li>
                    If you have the actual picture of the package, provide it
                    while requesting for the Export order on our website
                  </li>
                </ul>
              </span>
            }
            backgroundColor="bg-primary-600"
          />
        </Guidelines>
      ),
    },
  };

  return (
    <div className="flex flex-col gap-[30px]">
      {
        deliveryStatusMap[
          getValues().requestPackage
            .deliveryStatus as (typeof PACKAGE_DELIVERY_STATUS)[number]
        ].imageText
      }
      {getValues().requestPackage.deliveryStatus !== "All delivered" && (
        <OfficeDeliverAddress
          officeLocation={
            WAREHOUSE_LOCATIONS[
              getValues().requestPackage
                .originWarehouse as (typeof ORIGINS)[number]
            ]
          }
        />
      )}
      <div className="flex flex-col gap-[10px]">
        <SectionHeader title="What Next?" />
        <SectionContentLayout>
          {
            deliveryStatusMap[
              getValues().requestPackage
                .deliveryStatus as (typeof PACKAGE_DELIVERY_STATUS)[number]
            ].whatNext
          }
        </SectionContentLayout>
      </div>
    </div>
  );
};

const Instructions = () => {
  const instructions: InstructionsMapType[] = [
    {
      content: (
        <>
          Kindly note that we use the package descriptions you provided to
          identify the package you claim to have been delivered to our Warehouse
          (<span className="text-primary-600">Origin warehouse</span> you
          selected) for shipping.
        </>
      ),
    },
    {
      content:
        "After we have been able to Identify your package, you will be notified so you can proceed to Initiate shipping processes for your package.",
    },
    {
      content:
        "After we have confirmed your payment, we will begin your shipment processes and you can track package till it gets delivered.",
    },
  ];

  return (
    <div className="flex flex-col gap-[20px]">
      <span className="title-md md:title-lg pl-[11px] font-medium text-neutral-700 md:pl-[14px] md:font-bold">
        Here is how to pick your package up from our office
      </span>
      <ul className="flex flex-col gap-[14px]">
        {instructions.map((item, i) => (
          <StepDescription
            key={i}
            stepNumber={i + 1}
            description={item.content}
            backgroundColor="bg-primary-600"
          />
        ))}
      </ul>
    </div>
  );
};

export default RequestOrder;
