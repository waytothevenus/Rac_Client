import { ArrowRight3 } from "iconsax-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  FormProvider,
  useForm,
  useFormContext,
  type SubmitHandler,
} from "react-hook-form";
import { formatCurrency, formatDimension, formatWeight } from "~/Utils";
import { BackButton } from "~/components/Buttons/BackButton";
import { DoneButton } from "~/components/Buttons/DoneButton";
import { PayNowButton } from "~/components/Buttons/PayNowButton";
import CongratulationImage from "~/components/CongratulationImage";
import AccordionButton from "~/components/Forms/AccordionButton";
import OrderTrackingId from "~/components/OrderTrackingId";
import PackageTable from "~/components/PackageTable";
import {
  DestinationShippingAddress,
  Success,
  type ClearPackageInputs,
} from "~/components/Shop/Orders/ClearPackage";
import {
  BillingAddress,
  DetailSection,
  ShippingMethodUsed,
  Summary,
  type ShipmentCostsSummaryProps,
} from "~/components/Shop/Orders/InitiateShipping";
import {
  CostDetailSection,
  PaymentMethod,
  PaymentMethods,
  StepIndex,
  TotalCost,
  type stepsContentType,
} from "~/components/Shop/Requests/RequestCheckout";
import {
  HighlightedInfo,
  PackageOrigin,
} from "~/components/Shop/Requests/RequestDetails";
import {
  SectionContentLayout,
  SectionHeader,
} from "~/components/Shop/Requests/RequestOrder";
import { PAYMENT_METHODS, WAREHOUSE_LOCATIONS } from "~/constants";
import {
  useImportContext,
  type ImportItemType,
} from "~/contexts/ImportContext";
import { useTabContext } from "~/contexts/TabContext";
import useAccordion from "~/hooks/useAccordion";
import useMultiStepForm from "~/hooks/useMultistepForm";
import {
  ImportPackageTableFooter,
  importPackageItemColumns,
} from "./InitiateShipping";

const emptyValue: ClearPackageInputs = {
  paymentMethod: "Paystack - Pay with Naira Card",
};

const ClearPackage = () => {
  const [portal, setPortal] = useState<Element | DocumentFragment | null>(null);
  const { orderPackages } = useImportContext();
  const { viewIndex, handleActiveAction, handleTabChange } = useTabContext();

  if (viewIndex === null) return;

  const orderPackage = orderPackages?.[viewIndex];

  if (!orderPackage) return;

  const steps: [stepsContentType, ...stepsContentType[]] = [
    { title: "Package Confirmation", content: <PackageConfirmation /> },
    {
      title: "Shipping & Billing Details Confirmation",
      content: <BillingDetailsConfirmation />,
    },
    { title: "Clear Package", content: <ClearPackageStep /> },
    {
      title: "Success",
      content: (
        <Success
          officeLocation={WAREHOUSE_LOCATIONS[orderPackage.originWarehouse]}
        />
      ),
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
  } = useMultiStepForm(stepsContent);
  const currentTitle = steps[currentStepIndex]?.title ?? "";

  const formMethods = useForm<ClearPackageInputs>({
    defaultValues: emptyValue,
  });

  const onSubmit: SubmitHandler<ClearPackageInputs> = async (data) => {
    if (isSecondToLastStep) {
      console.log(data);
    }
    next();
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
          <CongratulationImage description="Your package have arrived its destination. Proceed to clear it." />
        )}

        <StepIndex
          currentIndex={currentStepIndex}
          length={steps.length}
          title={currentTitle}
        />

        {!isLastStep ? (
          <div className="w-full md:w-max">
            <OrderTrackingId
              orderId={orderPackage.orderId}
              trackingId={orderPackage.trackingId}
            />
          </div>
        ) : (
          <>
            <SectionContentLayout>
              <OrderTrackingId
                orderId={orderPackage.orderId}
                trackingId={orderPackage.trackingId}
                center
              />
            </SectionContentLayout>
            <CongratulationImage description='You can now pick up your package from our office in Nigeria (your selected "Destination")' />
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

        {currentStepIndex === 3 && (
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

const PackageConfirmation = () => {
  const { orderPackages } = useImportContext();

  const { viewIndex } = useTabContext();

  if (viewIndex === null) return;

  const orderPackage = orderPackages?.[viewIndex];

  if (!orderPackage) return;

  return (
    <div className="flex flex-col gap-[10px]">
      <SectionHeader title="Package Details" />
      <PackageOrigin>
        <HighlightedInfo
          text="Your Items will be delivered here after we help you purchase your them
        and they will be shipped from here to our pickup office in Nigeria"
        />
        <DetailSection
          label="Country of Purchase"
          value={orderPackage.originWarehouse}
        />
      </PackageOrigin>
      <hr className="block w-full border-dashed border-primary-900" />
      {orderPackage.items.map((item, i) => {
        return <ImportOrderItem key={i} item={item} index={i} />;
      })}
    </div>
  );
};

type ImportOrderItemProps = { index: number; item: ImportItemType };

export const ImportOrderItem = ({ index, item }: ImportOrderItemProps) => {
  const { open, toggle } = useAccordion(true);

  return (
    <SectionContentLayout>
      <div className="flex w-full flex-col gap-[30px]">
        <div className="flex w-full items-center justify-between">
          <h4 className="title-md md:title-lg font-medium text-gray-700">
            Item - <span className="text-primary-600">#{index + 1}</span>
          </h4>
          <AccordionButton {...{ open, toggle }} />
        </div>
        {open && <ImportOrderItemDetails item={item} />}
      </div>
    </SectionContentLayout>
  );
};

type ImportOrderItemDetailsProps = { item: ImportItemType };

const ImportOrderItemDetails = ({ item }: ImportOrderItemDetailsProps) => {
  return (
    <div className="grid w-full grid-cols-1 gap-[15px] md:grid-cols-10">
      <DetailSection label="Item Name" value={item.name} colSpanDesktop={4} />
      <DetailSection
        label="Item Original Cost"
        value={formatCurrency(item.originalCost)}
        colSpanDesktop={2}
      />
      <DetailSection
        label="Quantity"
        value={item.quantity}
        colSpanDesktop={3}
      />
      <DetailSection
        label="Weight"
        value={formatWeight(item.weight)}
        colSpanDesktop={2}
      />
      <DetailSection
        label="Height"
        value={formatDimension(item.height)}
        colSpanDesktop={2}
      />
      <DetailSection
        label="Length"
        value={formatDimension(item.length)}
        colSpanDesktop={2}
      />
      <DetailSection
        label="Width"
        value={formatDimension(item.width)}
        colSpanDesktop={2}
      />
      <DetailSection label="Product/Item Picture" value={item.image} image />
      <DetailSection label="Product Description" value={item.description} />

      {item.properties?.map((property, i) => {
        return (
          <DetailSection
            key={`property-${i}`}
            label={property.label}
            value={property.value}
            colSpanDesktop={3}
          />
        );
      })}
    </div>
  );
};

const BillingDetailsConfirmation = () => {
  const { orderPackages } = useImportContext();
  const { viewIndex } = useTabContext();

  if (viewIndex === null) return;

  const orderPackage = orderPackages?.[viewIndex];

  if (!orderPackage) return;

  return (
    <div className="flex flex-col gap-[10px]">
      <DestinationShippingAddress
        destinationWarehouse={orderPackage.destinationWarehouse}
      />
      <BillingAddress billingDetails={orderPackage.billingDetails} />
    </div>
  );
};

const ClearPackageStep = () => {
  const { register } = useFormContext<ClearPackageInputs>();
  const { orderPackages } = useImportContext();
  const { viewIndex } = useTabContext();

  if (viewIndex === null) return;

  const orderPackage = orderPackages?.[viewIndex];

  if (!orderPackage) return;

  const defaultColumns = useMemo(importPackageItemColumns, []);

  const totals = {
    numberOfItems: orderPackage.items.length,
    grossWeight: orderPackage.items.reduce(
      (acc, item) => (acc += item.weight),
      0,
    ),
    declaredValue: orderPackage.items.reduce(
      (acc, item) => (acc += item.originalCost),
      0,
    ),
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <SectionHeader title="Package details Summary" />
      <PackageTable
        columns={defaultColumns}
        data={orderPackage.items}
        tableFooter={<ImportPackageTableFooter totals={totals} />}
      />

      <ShippingMethodUsed value={orderPackage.shippingMethod} />

      <SectionHeader title="Payment Methods" />
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

      <SectionHeader title="Shipment costs" />
      <ShipmentCostsSummary
        footer={
          <div className="flex flex-col gap-[5px]">
            <div className="flex items-center gap-[10px]">
              <ArrowRight3 className="text-error-600" variant="Bold" />
              <span className="label-md w-fit font-medium text-secondary-900">
                The total you are paying now includes only the Shipping fees and
                is to be paid upon clearing/arrival of your package
              </span>
            </div>
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
        }
        payButton
      />
    </div>
  );
};

const ShipmentCostsSummary = ({
  footer,
  payButton = false,
}: ShipmentCostsSummaryProps) => {
  const { orderPackages } = useImportContext();
  const { viewIndex } = useTabContext();

  if (viewIndex === null) return;

  const orderPackage = orderPackages?.[viewIndex];

  if (!orderPackage) return;

  const {
    shippingCost = 0,
    clearingPortHandlingCost = 0,
    otherCharges = 0,
    storageCharge = 0,
    insurance = 0,
    valueAddedTax,
    paymentMethodSurcharge,
    discount,
  } = orderPackage.packageCosts;

  const total = [
    shippingCost,
    clearingPortHandlingCost,
    otherCharges,
    storageCharge,
    insurance,
    valueAddedTax,
    paymentMethodSurcharge,
  ].reduce((total, cost) => (total += cost));

  return (
    <div className="flex flex-col rounded-[20px] border border-primary-100">
      <Summary>
        <CostDetailSection
          label="Shipping Cost"
          value={formatCurrency(shippingCost)}
        />
        <CostDetailSection
          label="Clearing, Port Handling"
          value={formatCurrency(clearingPortHandlingCost)}
        />
        <CostDetailSection
          label="Other Charges"
          value={formatCurrency(otherCharges)}
        />
        <CostDetailSection
          label="Storage Charge"
          value={formatCurrency(storageCharge)}
        />
        <CostDetailSection
          label="Insurance"
          value={formatCurrency(insurance)}
        />
        <CostDetailSection label="VAT" value={formatCurrency(valueAddedTax)} />
        <CostDetailSection
          label="Payment Method Surcharge"
          value={formatCurrency(paymentMethodSurcharge)}
        />
        <CostDetailSection
          label="Discount"
          value={`- ${formatCurrency(discount)}`}
        />
        <TotalCost total={total - discount} />
      </Summary>
      <div className="flex flex-col justify-center gap-[20px] p-[20px]">
        {footer}
        {payButton && (
          <div
            className="w-full self-center md:max-w-[500px]"
            id="payNowButton"
          >
            {/* portal for pay now button */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClearPackage;
