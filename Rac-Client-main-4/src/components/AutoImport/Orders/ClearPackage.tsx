import { ArrowRight3, ExportCircle } from "iconsax-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  FormProvider,
  useForm,
  useFormContext,
  type SubmitHandler,
} from "react-hook-form";
import { formatCurrency } from "~/Utils";
import { BackButton } from "~/components/Buttons/BackButton";
import { DoneButton } from "~/components/Buttons/DoneButton";
import { PayNowButton } from "~/components/Buttons/PayNowButton";
import CongratulationImage from "~/components/CongratulationImage";
import OrderTrackingId from "~/components/OrderTrackingId";
import PackageTable from "~/components/PackageTable";
import { type ClearPackageInputs } from "~/components/Shop/Orders/ClearPackage";
import {
  BillingAddress,
  Summary,
} from "~/components/Shop/Orders/InitiateShipping";
import {
  AndLastly,
  CostDetailSection,
  ImportantNotice,
  PaymentMethod,
  PaymentMethods,
  StepIndex,
  SubSectionTitle,
  TotalCost,
  type stepsContentType,
} from "~/components/Shop/Requests/RequestCheckout";
import {
  SectionContentLayout,
  SectionHeader,
} from "~/components/Shop/Requests/RequestOrder";
import { PAYMENT_METHODS } from "~/constants";
import { useAutoImportContext } from "~/contexts/AutoImportContext";
import { useTabContext } from "~/contexts/TabContext";
import useMultiStepForm from "~/hooks/useMultistepForm";
import { DestinationAddressDetails } from "../Requests/RequestOrder";
import {
  AutoImportOrderItem,
  AutoImportPackageTableFooter,
  autoImportPackageItemColumns,
} from "./InitiateShipping";

const emptyValue: ClearPackageInputs = {
  paymentMethod: "Paystack - Pay with Naira Card",
};

const ClearPackage = () => {
  const [portal, setPortal] = useState<Element | DocumentFragment | null>(null);
  const { handleActiveAction, handleTabChange } = useTabContext();

  const steps: [stepsContentType, ...stepsContentType[]] = [
    { title: "Package Confirmation", content: <Step1 /> },
    {
      title: "Shipping & Billing Details Confirmation",
      content: <Step2 />,
    },
    { title: "Clear Cars", content: <Step3 /> },
    { title: "Success", content: <Step4 /> },
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
  } = useMultiStepForm(stepsContent);
  const currentTitle = steps[currentStepIndex]?.title ?? "";

  const formMethods = useForm<ClearPackageInputs>({
    defaultValues: emptyValue,
  });

  const onSubmit: SubmitHandler<ClearPackageInputs> = async (data) => {
    if (isSecondToLastStep) {
      console.log(data);
    }
  };

  const handleBack = () => {
    handleActiveAction(null);
  };

  const handleFinish = () => {
    handleTabChange("orders");
  };

  useEffect(() => {
    setPortal(document.getElementById("payNowButton"));
  }, [step]);

  return (
    <FormProvider {...formMethods}>
      <div className="flex max-w-[1032px] flex-col gap-[30px] rounded-[20px] bg-white p-[20px] md:p-[30px]">
        {!isLastStep && (
          <CongratulationImage description="You car(s) have arrived the port, proceed to clear it." />
        )}

        <StepIndex
          currentIndex={currentStepIndex}
          length={steps.length}
          title={currentTitle}
        />

        {!isLastStep ? (
          <div className="w-full md:w-max">
            <OrderTrackingId orderId="OD78667" trackingId="SH78667" />
          </div>
        ) : (
          // todo: fetch orderPackage of the requestPackage.requestId to get orderId and trackingId
          <>
            <SectionContentLayout>
              <OrderTrackingId orderId="OD78667" trackingId="SH78667" center />
            </SectionContentLayout>
            <CongratulationImage description="Expect your car(s) soon" />
          </>
        )}

        {step}

        {currentStepIndex <= 1 && (
          <div className="flex w-full flex-col items-center justify-center gap-[10px] md:w-max md:flex-row">
            {isFirstStep && (
              <div className="w-full md:max-w-[210px]">
                <BackButton onClick={handleBack} />
              </div>
            )}
            {!isFirstStep && currentStepIndex <= 1 && (
              <div className="w-full md:max-w-[210px]">
                <BackButton onClick={back} />
              </div>
            )}
            <DoneButton
              text="Proceed"
              onClick={formMethods.handleSubmit(onSubmit)}
            />
          </div>
        )}

        {isLastStep && (
          <div className="w-[200px]">
            <DoneButton text="Done" onClick={handleFinish} />
          </div>
        )}

        {portal &&
          createPortal(
            <PayNowButton onClick={formMethods.handleSubmit(onSubmit)} />,
            portal,
          )}
      </div>
    </FormProvider>
  );
};

const Step1 = () => {
  const { orderPackages } = useAutoImportContext();

  const { viewIndex } = useTabContext();

  if (viewIndex === null) return;

  const orderPackage = orderPackages?.[viewIndex];

  if (!orderPackage) return;

  return (
    <div className="flex flex-col gap-[10px]">
      <SectionHeader title="Confirm that the Car(s) below are the car(s) you wish to clear" />
      {orderPackage.items.map((item, i) => {
        return <AutoImportOrderItem key={i} item={item} index={i} />;
      })}
    </div>
  );
};

const Step2 = () => {
  const { orderPackages } = useAutoImportContext();
  const { viewIndex } = useTabContext();

  if (viewIndex === null) return;

  const orderPackage = orderPackages?.[viewIndex];

  if (!orderPackage) return;

  return (
    <div className="flex flex-col gap-[10px]">
      <DestinationAddressDetails
        destinationDetails={orderPackage.destinationDetails}
      />
      <BillingAddress billingDetails={orderPackage.billingDetails} />
    </div>
  );
};

const Step3 = () => {
  const { register } = useFormContext<ClearPackageInputs>();
  const { orderPackages } = useAutoImportContext();
  const { viewIndex } = useTabContext();

  if (viewIndex === null) return;

  const orderPackage = orderPackages?.[viewIndex];

  if (!orderPackage) return;

  const defaultColumns = useMemo(autoImportPackageItemColumns, []);

  const totals = {
    declaredValue: orderPackage.items.reduce(
      (acc, item) => (acc += item.value),
      0,
    ),
    pickupCost: orderPackage.items.reduce(
      (acc, item) => (acc += item.pickupDetails?.pickupCost ?? 0),
      0,
    ),
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <SectionHeader title="Package details Summary" />
      <PackageTable
        columns={defaultColumns}
        data={orderPackage.items}
        tableFooter={<AutoImportPackageTableFooter totals={totals} />}
      />

      <SectionHeader title="Payment Methods" />
      <div className="pl-[14px]">
        <SubSectionTitle title="Select the Payment Method You Wish to Use" />
      </div>
      <PaymentMethods>
        {PAYMENT_METHODS.map((paymentMethod) => {
          return (
            <PaymentMethod
              key={paymentMethod.title}
              paymentMethod={paymentMethod}
              {...register("paymentMethod")}
            />
          );
        })}
      </PaymentMethods>

      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-12">
        <div className="flex flex-col gap-[15px] md:col-span-4 md:max-w-[300px]">
          <SectionHeader title="Take Note" />
          <ImportantNotice />
        </div>
        <div className="flex flex-col gap-[15px] md:col-span-8">
          <SectionHeader title="Order costs" />
          <CostsSummary />
        </div>
      </div>
    </div>
  );
};

const CostsSummary = () => {
  const { orderPackages } = useAutoImportContext();
  const { viewIndex } = useTabContext();

  if (viewIndex === null) return;

  const orderPackage = orderPackages?.[viewIndex];

  if (!orderPackage) return;

  const {
    clearingPortHandlingCost = 0,
    valueAddedTax,
    paymentMethodSurcharge,
    discount,
  } = orderPackage.packageCosts;

  const total = [
    clearingPortHandlingCost,
    valueAddedTax,
    paymentMethodSurcharge,
  ].reduce((total, cost) => (total += cost));

  return (
    <div className="flex flex-col rounded-[20px] border border-primary-100">
      <Summary>
        {valueAddedTax && (
          <CostDetailSection
            label="Customs Clearing"
            value={formatCurrency(clearingPortHandlingCost)}
          />
        )}
        <CostDetailSection label="VAT" value={formatCurrency(valueAddedTax)} />
        {paymentMethodSurcharge && (
          <CostDetailSection
            label="Payment Method Surcharge"
            value={formatCurrency(paymentMethodSurcharge)}
          />
        )}
        {discount && (
          <CostDetailSection
            label="Discount"
            value={`- ${formatCurrency(discount)}`}
          />
        )}
        <TotalCost total={total - discount} />
      </Summary>
      <div className="flex flex-col items-center justify-center gap-[20px] p-[20px]">
        <div className="flex flex-col gap-[5px]">
          <div className="flex items-center gap-[10px]">
            <ArrowRight3 className="text-primary-900" variant="Bold" />
            <span className="label-md w-fit font-medium text-secondary-900">
              Prices and subtotals are displayed including taxes
            </span>
          </div>
          <div className="flex items-center gap-[10px]">
            <ArrowRight3 className="text-primary-900" variant="Bold" />
            <span className="label-md w-fit font-medium text-secondary-900">
              Discounts are calculated based on prices and subtotals taken
              without considering taxes
            </span>
          </div>
        </div>
        <div className="w-[168px]" id="payNowButton">
          {/* portal for pay now button */}
        </div>
      </div>
    </div>
  );
};

const Step4 = () => {
  return (
    <div className="flex flex-col gap-[30px]">
      <div className="flex flex-col gap-[10px]">
        <SectionHeader title="Track your package" />
        <SectionContentLayout>
          <div className="flex flex-col gap-[10px]">
            <h3 className="title-lg font-bold text-neutral-900">
              Here are more information on how to track
            </h3>
            <ul className="flex flex-col gap-[14px]">
              <li className="flex items-center gap-[26px]">
                <span className="rounded-[20px] bg-primary-600 p-[10px] text-white">
                  1
                </span>
                <span className="title-lg text-neutral-900">
                  You can start tracking your package in the next 24 hrs using
                  the <b>Tracking ID</b> above or{" "}
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <span className="inline-flex items-center gap-[5px] font-bold text-primary-600">
                      this link
                      <ExportCircle color="#292D32" size={18} />
                    </span>
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </SectionContentLayout>
      </div>
      <AndLastly />
    </div>
  );
};

export default ClearPackage;
