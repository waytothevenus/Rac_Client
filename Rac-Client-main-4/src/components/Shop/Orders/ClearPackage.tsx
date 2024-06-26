/* eslint-disable @next/next/no-img-element */
import { ArrowRight3 } from "iconsax-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  FormProvider,
  useForm,
  useFormContext,
  type SubmitHandler,
} from "react-hook-form";
import { parseCountryCode, parseStateCode } from "~/Utils";
import { BackButton } from "~/components/Buttons/BackButton";
import { DoneButton } from "~/components/Buttons/DoneButton";
import { PayNowButton } from "~/components/Buttons/PayNowButton";
import CongratulationImage from "~/components/CongratulationImage";
import AccordionButton from "~/components/Forms/AccordionButton";
import OrderTrackingId from "~/components/OrderTrackingId";
import {
  SectionContentLayout,
  SectionHeader,
} from "~/components/Shop/Requests/RequestOrder";
import ShopPackageTable from "~/components/ShopPackageTable";
import {
  PAYMENT_METHODS,
  WAREHOUSE_LOCATIONS,
  type ORIGINS,
} from "~/constants";
import { useShopContext } from "~/contexts/ShopContext";
import { useTabContext } from "~/contexts/TabContext";
import useAccordion from "~/hooks/useAccordion";
import useMultiStepForm from "~/hooks/useMultistepForm";
import {
  AndLastly,
  PaymentMethod,
  PaymentMethods,
  ShopPackageTableFooter,
  StepIndex,
  shopPackageItemColumns,
  type stepsContentType,
} from "../Requests/RequestCheckout";
import { HighlightedInfo, LabelWithTooltip } from "../Requests/RequestDetails";
import {
  BillingAddress,
  DetailSection,
  PackageConfirmation,
  ShipmentCostsSummary,
  ShippingMethodUsed,
  type DetailSectionProps,
} from "./InitiateShipping";
import { PickUpInstructions } from "./OrdersPanel";

export type ClearPackageInputs = {
  paymentMethod: (typeof PAYMENT_METHODS)[number]["title"];
};

const emptyValue: ClearPackageInputs = {
  paymentMethod: "Paystack - Pay with Naira Card",
};

const ClearPackage = () => {
  const [portal, setPortal] = useState<Element | DocumentFragment | null>(null);
  const { orderPackages } = useShopContext();
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

const BillingDetailsConfirmation = () => {
  const { orderPackages } = useShopContext();
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

type DestinationShippingAddressProps = {
  destinationWarehouse: (typeof ORIGINS)[number];
};

export const DestinationShippingAddress = ({
  destinationWarehouse,
}: DestinationShippingAddressProps) => {
  const { open, toggle } = useAccordion(true);

  return (
    <SectionContentLayout>
      <div className="flex w-full flex-col gap-[30px]">
        <div className="flex w-full items-center justify-between">
          <h4 className="title-md md:title-lg text-gray-700">
            Destination/Shipping Address
          </h4>
          <AccordionButton {...{ open, toggle }} />
        </div>

        {open && (
          <div className="flex flex-col gap-[30px]">
            <div className="flex flex-col gap-[10px]">
              <HighlightedInfo text="Your Items have been delivered to this RAC Logistics warehouse in Nigeria where you can pickup from when it arrives Nigeria." />
              <DetailSection label="Destination" value={destinationWarehouse} />
            </div>
            <DestinationAddressDetails
              warehouseLocation={WAREHOUSE_LOCATIONS[destinationWarehouse]}
            />
          </div>
        )}
      </div>
    </SectionContentLayout>
  );
};

export const PurpleDetailSection = ({
  label,
  value,
  colSpanMobile = "full",
  colSpanDesktop = "full",
  tooltip,
}: DetailSectionProps) => {
  return (
    <div
      className={`col-span-${colSpanMobile} flex flex-col gap-[5px] md:col-span-${colSpanDesktop}`}
    >
      {tooltip ? (
        <div className="text-primary-600">
          <LabelWithTooltip label={label} tooltip={tooltip} />
        </div>
      ) : (
        <span className="body-md h-[40px] max-w-[128px] text-primary-600">
          {label}:
        </span>
      )}
      <span className="title-md md:title-lg font-medium text-primary-900">
        {value}
      </span>
    </div>
  );
};

type DestinationAddressDetailsProps = {
  warehouseLocation: (typeof WAREHOUSE_LOCATIONS)[(typeof ORIGINS)[number]];
};

const DestinationAddressDetails = ({
  warehouseLocation,
}: DestinationAddressDetailsProps) => {
  console.log("warehouseLocation", warehouseLocation);

  if (!warehouseLocation) {
    return;
  }

  const { address, country, state, city, zipPostalCode } = warehouseLocation;

  return (
    <>
      <div className="flex items-center">
        <span className="title-md md:title-lg text-primary-900">
          Destination address
        </span>

        <hr className="mx-[10px] flex-grow border-dashed border-primary-900" />
      </div>
      <div className="grid w-full grid-cols-1 gap-[20px] md:grid-cols-10">
        <PurpleDetailSection
          label="First Name"
          value="N/A"
          colSpanDesktop={4}
        />
        <PurpleDetailSection label="Last Name" value="N/A" colSpanDesktop={4} />
        <PurpleDetailSection label="Street Address" value={address} />
        <PurpleDetailSection
          label="Country"
          value={parseCountryCode(country)}
          colSpanMobile={1}
          colSpanDesktop={2}
        />
        <PurpleDetailSection
          label="State"
          value={parseStateCode(state, country)}
          colSpanMobile={1}
          colSpanDesktop={2}
        />
        <PurpleDetailSection
          label="City"
          value={city}
          colSpanMobile={1}
          colSpanDesktop={2}
        />
        <PurpleDetailSection
          label="Zip/postal Code"
          value={zipPostalCode}
          colSpanMobile={1}
          colSpanDesktop={2}
        />
      </div>
    </>
  );
};

export const ClearPackageStep = () => {
  const { register } = useFormContext<ClearPackageInputs>();
  const { orderPackages } = useShopContext();
  const { viewIndex } = useTabContext();

  if (viewIndex === null) return;

  const orderPackage = orderPackages?.[viewIndex];

  if (!orderPackage) return;

  const defaultColumns = useMemo(shopPackageItemColumns, []);

  const totals = {
    numberOfItems: orderPackage.items.length,
    grossWeight: orderPackage.items.reduce(
      (acc, item) => (acc += item.weight),
      0,
    ),
    itemsCostFromStore: orderPackage.items.reduce(
      (acc, item) => (acc += item.originalCost),
      0,
    ),
    processingFee: orderPackage.items.reduce(
      (acc, item) => (acc += item.relatedCosts.processingFee),
      0,
    ),
    urgentPurchaseFee: orderPackage.items.reduce(
      (acc, item) => (acc += item.relatedCosts.urgentPurchaseFee),
      0,
    ),
    shippingToOriginWarehouseCost: orderPackage.items.reduce(
      (acc, item) => (acc += item.relatedCosts.shippingToOriginWarehouseCost),
      0,
    ),
    shopForMeCost: orderPackage.items.reduce(
      (acc, item) => (acc += item.relatedCosts.shopForMeCost),
      0,
    ),
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <SectionHeader title="Package details Summary" />
      <ShopPackageTable
        columns={defaultColumns}
        data={orderPackage.items}
        tableFooter={<ShopPackageTableFooter totals={totals} />}
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
                The total you are paying now includes only the Shipping fees
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

type SuccessProps = {
  officeLocation: (typeof WAREHOUSE_LOCATIONS)[(typeof ORIGINS)[number]];
};

export const Success = ({ officeLocation }: SuccessProps) => {
  return (
    <div className="flex flex-col gap-[30px]">
      <OfficePickupAddress officeLocation={officeLocation} />
      <SectionHeader title="How to pick up" />
      <PickUpInstructions />
      <AndLastly />
    </div>
  );
};

type OfficePickupAddressProps = SuccessProps;

const OfficePickupAddress = ({ officeLocation }: OfficePickupAddressProps) => {
  const { open, toggle } = useAccordion(true);
  const { address, country, state, city, zipPostalCode } = officeLocation;

  return (
    <SectionContentLayout>
      <div className="flex w-full flex-col gap-[30px]">
        <div className="flex w-full items-center justify-between">
          <h4 className="title-md md:title-lg text-gray-700">
            Our office address to pick up your package
          </h4>
          <AccordionButton {...{ open, toggle }} />
        </div>

        {open && (
          <div className="grid w-full grid-cols-1 gap-[15px] md:grid-cols-10">
            <DetailSection label="Pickup Address" value={address} />
            <DetailSection
              label="Country"
              value={parseCountryCode(country)}
              colSpanDesktop={2}
            />
            <DetailSection
              label="State"
              value={parseStateCode(state, country)}
              colSpanDesktop={2}
            />
            <DetailSection label="City" value={city} colSpanDesktop={2} />
            <DetailSection
              label="Zip/postal Code"
              value={zipPostalCode}
              colSpanDesktop={2}
            />
          </div>
        )}
      </div>
    </SectionContentLayout>
  );
};

export default ClearPackage;
