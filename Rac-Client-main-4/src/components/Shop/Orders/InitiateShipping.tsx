/* eslint-disable @next/next/no-img-element */
import { ArrowRight3, ExportCircle } from "iconsax-react";
import {
  forwardRef,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import {
  FormProvider,
  useForm,
  useFormContext,
  type SubmitHandler,
} from "react-hook-form";
import {
  formatCurrency,
  formatDimension,
  formatWeight,
  parseCountryCode,
  parseStateCode,
} from "~/Utils";
import { BackButton } from "~/components/Buttons/BackButton";
import { DoneButton } from "~/components/Buttons/DoneButton";
import { PayNowButton } from "~/components/Buttons/PayNowButton";
import CongratulationImage from "~/components/CongratulationImage";
import AccordionButton from "~/components/Forms/AccordionButton";
import SelectInput from "~/components/Forms/Inputs/SelectInput";
import OrderTrackingId from "~/components/OrderTrackingId";
import {
  SectionContentLayout,
  SectionHeader,
  TooltipButton,
} from "~/components/Shop/Requests/RequestOrder";
import ShopPackageTable from "~/components/ShopPackageTable";
import SuccessImportantNotice from "~/components/SuccessImportantNotice";
import {
  DESTINATIONS,
  SHIPPING_METHOD_OPTIONS,
  type SHIPPING_METHODS,
} from "~/constants";
import { type BillingDetailsType } from "~/contexts/AutoImportContext";
import { useShopContext, type ShopItemType } from "~/contexts/ShopContext";
import { useTabContext } from "~/contexts/TabContext";
import useAccordion from "~/hooks/useAccordion";
import useMultiStepForm from "~/hooks/useMultistepForm";
import { InitiateShippingButton } from "../../Buttons/InitiateShippingButton";
import {
  AndLastly,
  CostDetailSection,
  ShopPackageTableFooter,
  StepIndex,
  SubSectionTitle,
  TotalCost,
  shopPackageItemColumns,
  type stepsContentType,
} from "../Requests/RequestCheckout";
import { LabelWithTooltip, PackageOrigin } from "../Requests/RequestDetails";
import { PurpleDetailSection } from "./ClearPackage";

type InitiateShippingInputs = {
  destinationWarehouse: (typeof DESTINATIONS)[number];
  shippingMethod: (typeof SHIPPING_METHODS)[number];
};

const emptyValue: InitiateShippingInputs = {
  destinationWarehouse: "Nigeria Warehouse (Lagos)",
  shippingMethod: "basic",
};

const InitiateShipping = () => {
  const [portal, setPortal] = useState<Element | DocumentFragment | null>(null);
  const { orderPackages } = useShopContext();
  const { viewIndex, handleActiveAction, handleTabChange } = useTabContext();

  if (viewIndex === null) return;

  const orderPackage = orderPackages?.[viewIndex];

  if (!orderPackage) return;

  const steps: [stepsContentType, ...stepsContentType[]] = [
    { title: "Package Confirmation", content: <PackageConfirmation /> },
    {
      title: "Shipping & Billing Address",
      content: <BillingAddressStep />,
    },
    { title: "Initiate Shipping", content: <InitiateShippingStep /> },
    { title: "Success", content: <Success /> },
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

  const formMethods = useForm<InitiateShippingInputs>({
    defaultValues: emptyValue,
  });

  const onSubmit: SubmitHandler<InitiateShippingInputs> = async (data) => {
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
      <div className="flex max-w-[997px] flex-col gap-[30px] rounded-[20px] bg-white p-[20px] md:p-[30px]">
        {!isLastStep && (
          <CongratulationImage description="Your Package have arrived its Origin warehouse. Proceed to initiate shipping" />
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
            <CongratulationImage description="You have just successfully iInitiated shipment of your items" />
          </>
        )}

        {step}

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
          {currentStepIndex === 0 && (
            <DoneButton
              text="Proceed"
              onClick={formMethods.handleSubmit(onSubmit)}
            />
          )}
          {currentStepIndex === 1 && (
            <DoneButton
              text="Confirm"
              onClick={formMethods.handleSubmit(onSubmit)}
            />
          )}
        </div>

        {currentStepIndex === 2 && (
          <InitiateShippingAgreement
            back={back}
            next={formMethods.handleSubmit(onSubmit)}
          />
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

type InitiateShippingAgreement = { back: () => void; next: () => void };

export const InitiateShippingAgreement = ({
  back,
  next,
}: InitiateShippingAgreement) => {
  return (
    <div className="flex w-full flex-col gap-[10px]">
      <div className="flex w-full items-center gap-[10px] rounded-[20px] border-[1px] border-gray-200 px-[15px] py-[10px]">
        <input
          type="checkbox"
          name="checked-demo"
          className="h-[18px] w-[18px] rounded-[2px] accent-primary-600 hover:accent-primary-600"
          checked={undefined}
          onChange={() => {
            return;
          }}
        />
        <span className="body-md md:body-lg text-neutral-900">
          I agree to pay for the shipment cost upon arrival/clearing for my
          package
        </span>
      </div>

      <div className="flex flex-col gap-[10px] md:flex-row">
        <div className="w-full md:max-w-[141px]">
          <BackButton onClick={back} />
        </div>
        <div className="w-full md:max-w-[249px]">
          <InitiateShippingButton onClick={next} />
        </div>
      </div>

      <span className="body-md text-center md:text-start">
        Upon clicking &quot;initiate shipping&quot;, I confirm I have read and
        agreed to{" "}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600"
        >
          all terms and policies
        </a>
      </span>
    </div>
  );
};

export const PackageConfirmation = () => {
  const { orderPackages } = useShopContext();
  const { viewIndex } = useTabContext();

  if (viewIndex === null) return;

  const orderPackage = orderPackages?.[viewIndex];

  if (!orderPackage) return;

  return (
    <div className="flex flex-col gap-[10px]">
      <SectionHeader title="Package Details" />
      <PackageOrigin>
        <DetailSection
          label="Country of Purchase"
          value={orderPackage.originWarehouse}
        />
      </PackageOrigin>
      <hr className="block w-full border-dashed border-primary-900" />
      {orderPackage.items.map((item, i) => {
        return <ShopOrderItem key={i} item={item} index={i} />;
      })}
    </div>
  );
};

type ShopOrderItemProps = {
  item: ShopItemType;
  index: number;
};

export const ShopOrderItem = ({ item, index }: ShopOrderItemProps) => {
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
        {open && (
          <div className="grid w-full grid-cols-1 gap-[15px] md:grid-cols-10">
            <ShopOrderItemDetails item={item} />
            <ShopOrderItemRelatedCosts relatedCosts={item.relatedCosts} />
          </div>
        )}
      </div>
    </SectionContentLayout>
  );
};

type ShopOrderItemRelatedCostsProps = {
  relatedCosts: ShopItemType["relatedCosts"];
};

const ShopOrderItemRelatedCosts = ({
  relatedCosts,
}: ShopOrderItemRelatedCostsProps) => {
  return (
    <>
      <div className="col-span-full">
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center">
            <span className="title-md md:title-lg text-primary-900">
              Item Related Costs
            </span>
            <hr className="mx-[10px] flex-grow border-dashed border-primary-900" />
          </div>
        </div>
      </div>

      <PurpleDetailSection
        label="Urgent purchase fee"
        value={
          relatedCosts.urgentPurchaseFee
            ? formatCurrency(relatedCosts.urgentPurchaseFee)
            : ""
        }
        colSpanDesktop={4}
      />

      <PurpleDetailSection
        label="Processing Fee"
        value={
          relatedCosts.processingFee
            ? formatCurrency(relatedCosts.processingFee)
            : ""
        }
        colSpanDesktop={4}
      />

      <PurpleDetailSection
        label="Shipping to Origin Warehouse Cost"
        value={
          relatedCosts.shippingToOriginWarehouseCost
            ? formatCurrency(relatedCosts.shippingToOriginWarehouseCost)
            : ""
        }
        colSpanDesktop={4}
      />

      <PurpleDetailSection
        label="Shop For Me Cost"
        value={
          relatedCosts.shopForMeCost
            ? formatCurrency(relatedCosts.shopForMeCost)
            : ""
        }
        colSpanDesktop={4}
      />
    </>
  );
};

export type DetailSectionProps = {
  label: string;
  value: string | number | JSX.Element;
  colSpanMobile?: "full" | number;
  colSpanDesktop?: "full" | number;
  image?: boolean;
  tooltip?: ReactNode;
  labelMaxWidth?: string;
  labelHeight?: string;
};

export const DetailSection = ({
  label,
  value,
  colSpanMobile = "full",
  colSpanDesktop = "full",
  image,
  tooltip,
  labelMaxWidth = "max-w-[100px]",
  labelHeight: height = "h-[40px]",
}: DetailSectionProps) => {
  return (
    <div
      className={`col-span-${colSpanMobile} flex flex-col justify-between gap-[5px] text-gray-700 md:col-span-${colSpanDesktop}`}
    >
      {tooltip ? (
        <LabelWithTooltip label={label} tooltip={tooltip} />
      ) : (
        <span className={`body-md ${height} ${labelMaxWidth}`}>{label}:</span>
      )}
      {image ? (
        <img
          src={image && (value as string)}
          alt=""
          className="w-[220px] rounded-[20px] bg-center object-cover"
        />
      ) : (
        <span className="title-md md:title-lg break-words !font-medium text-neutral-900 md:!font-normal">
          {value}
        </span>
      )}
    </div>
  );
};

type ShopOrderItemDetailsProps = { item: ShopItemType };

const ShopOrderItemDetails = ({ item }: ShopOrderItemDetailsProps) => {
  return (
    <>
      <DetailSection label="Store" value={item.store} colSpanDesktop={4} />
      <DetailSection
        label="Urgent Purchase"
        value={item.urgent ? "Yes" : "No"}
        colSpanDesktop={4}
      />
      <DetailSection label="Item URL" value={item.url} />
      <DetailSection label="Item Name" value={item.name} colSpanDesktop={4} />
      <DetailSection
        label="Item Original Cost"
        value={item.originalCost ? formatCurrency(item.originalCost) : ""}
        colSpanDesktop={2}
      />
      <DetailSection
        label="Quantity"
        value={item.quantity ? item.quantity : ""}
        colSpanDesktop={3}
      />
      {/* <DetailSection
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
      /> */}
      <DetailSection
        label="Product/Item Picture"
        value={item.image as string}
        image
      />
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
    </>
  );
};

const BillingAddressStep = () => {
  const { orderPackages } = useShopContext();
  const { viewIndex } = useTabContext();

  if (viewIndex === null) return;

  const orderPackage = orderPackages?.[viewIndex];

  if (!orderPackage) return;

  return (
    <div className="flex flex-col gap-[30px]">
      <div className="flex flex-col gap-[10px]">
        <SectionHeader title="Provide your shipping address" hr />
        <div className="flex flex-col items-center gap-[30px] md:pl-[34px]">
          <ShippingImportantNotice />
          <SelectDestinationShippingAddress />
        </div>
      </div>

      <div className="flex flex-col gap-[10px]">
        <SectionHeader title="Confirm your Billing Information" />
        <BillingAddress billingDetails={orderPackage.billingDetails} />
      </div>
    </div>
  );
};

type BillingAddressProps = { billingDetails: BillingDetailsType };

export const BillingAddress = ({ billingDetails }: BillingAddressProps) => {
  const { open, toggle } = useAccordion(true);

  console.log("billingDetails", billingDetails);

  return (
    <SectionContentLayout>
      <div className="flex w-full flex-col gap-[20px] py-[10px]">
        <div className="flex w-full items-center gap-[30px]">
          <h4 className="title-md md:title-lg text-gray-700">
            Billing Address
          </h4>
          <div className="flex flex-grow justify-end">
            <AccordionButton {...{ open, toggle }} />
          </div>
        </div>

        {open && (
          <div className="grid w-full grid-cols-1 gap-[20px] md:grid-cols-10">
            <DetailSection
              label="First Name"
              value={billingDetails.firstName}
              colSpanDesktop={4}
            />
            <DetailSection
              label="Last Name"
              value={billingDetails.lastName}
              colSpanDesktop={4}
            />
            <DetailSection
              label="Contact Number"
              value={`${billingDetails.countryCode} ${billingDetails.phoneNumber}`}
              colSpanDesktop={4}
            />
            <DetailSection
              label="Email"
              value={billingDetails.email}
              colSpanDesktop={5}
            />
            <DetailSection
              label="Country"
              value={
                billingDetails.country
                  ? parseCountryCode(billingDetails.country)
                  : ""
              }
              colSpanMobile={1}
              colSpanDesktop={2}
            />
            <DetailSection
              label="State"
              value={
                billingDetails.state
                  ? parseStateCode(billingDetails.state, billingDetails.country)
                  : ""
              }
              colSpanMobile={1}
              colSpanDesktop={2}
            />
            <DetailSection
              label="City"
              value={billingDetails.city}
              colSpanMobile={1}
              colSpanDesktop={2}
            />
            <DetailSection
              label="Zip/postal Code"
              value={billingDetails.zipPostalCode}
              colSpanMobile={1}
              colSpanDesktop={2}
            />
            <DetailSection label="Address" value={billingDetails.address} />
          </div>
        )}
      </div>
    </SectionContentLayout>
  );
};

const SelectDestinationShippingAddress = () => {
  const { register } = useFormContext<InitiateShippingInputs>();

  return (
    <div className="flex w-full items-center gap-[10px]">
      <SelectInput
        id={"destinationShippingAddress"}
        label={"Destination/Shipping Address"}
        options={
          <>
            <option value="" disabled hidden>
              Select Destination
            </option>

            {DESTINATIONS.map((destination) => {
              return (
                <option key={destination} value={destination}>
                  {destination}
                </option>
              );
            })}
          </>
        }
        {...register("destinationWarehouse")}
      />
      <TooltipButton
        label="This is your shipping address, it is the location your package will be delivered to. You can then request for doorstep delivery upon arrival."
        position="left-start"
      />
    </div>
  );
};

export const ShippingImportantNotice = () => {
  return (
    <div className="flex flex-col gap-[20px] rounded-[20px] bg-error-200 px-[28px] py-[20px]">
      <span className="label-lg text-primary-900">IMPORTANT NOTICE:</span>
      <div>
        <p className="title-sm ml-6 list-item text-gray-700">
          The{" "}
          <b>
            &quot;Destination/Shipping Address&quot; (which is our available
            pickup office in Nigeria)
          </b>{" "}
          you will select below is where your package will be delivered to,
          kindly select the one nearest to you.
        </p>
        <p className="title-sm ml-6 list-item text-gray-700">
          And if you want doorstep delivery, we will help you make provisions
          for that when it arrives the
          <b>
            &quot;Destination/Shipping Address&quot; (which is our office in
            Nigeria)
          </b>
          you selected, just inform us.
        </p>
      </div>
    </div>
  );
};

const InitiateShippingStep = () => {
  const { register } = useFormContext<InitiateShippingInputs>();
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

      <SelectShippingMethod>
        <ShippingMethod
          {...register("shippingMethod")}
          value="basic"
          checked
          expanded
        />
      </SelectShippingMethod>

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
      />
    </div>
  );
};

export type ShipmentCostsSummaryProps = {
  footer: JSX.Element;
  payButton?: boolean;
};

export const ShipmentCostsSummary = ({
  footer,
  payButton = false,
}: ShipmentCostsSummaryProps) => {
  const { orderPackages, shopRequestTotalQuery } = useShopContext();
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
    +shopRequestTotalQuery?.data?.data?.totalUrgentPurchaseCost,
    +shopRequestTotalQuery?.data?.data?.totalItemCostFromStore,
    +shopRequestTotalQuery?.data?.data?.totalShippingToOriginWarehouse,
    +shopRequestTotalQuery?.data?.data?.totalProcessingFee,
    +shopRequestTotalQuery?.data?.data?.orderVat,
    +shopRequestTotalQuery?.data?.data?.orderPaymentMethodSurcharge,
    -+shopRequestTotalQuery?.data?.data?.orderDiscount,
  ].reduce((total, cost) => (total += cost || 0));

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

type SummaryProps = {
  children: ReactNode;
  title?: string;
};

export const Summary = ({
  children,
  title = "Shipment Cost Summary",
}: SummaryProps) => {
  return (
    <div className="flex flex-col gap-[20px] rounded-[20px] bg-primary-900 px-[14px] py-[20px] text-white md:px-[28px]">
      <span className="title-lg">{title}</span>
      <div className="flex flex-col gap-[10px]">{children}</div>
    </div>
  );
};

type SelectShippingMethodProps = { children: ReactNode };

export const SelectShippingMethod = ({
  children,
}: SelectShippingMethodProps) => {
  return (
    <div className="flex flex-col gap-[20px]">
      <SectionHeader title="Shipping Methods" />
      <div className="pl-[14px]">
        <SubSectionTitle title="Select Shipping Method" />
      </div>
      {children}
    </div>
  );
};

type ShippingMethodProps = {
  value: (typeof SHIPPING_METHODS)[number];
  checked?: boolean;
  disabled?: boolean;
  expanded?: boolean;
};

export const ShippingMethod = forwardRef(
  (
    {
      value,
      checked = false,
      disabled = false,
      expanded = false,
    }: ShippingMethodProps,
    ref: Ref<HTMLInputElement>,
  ) => {
    const { open, toggle } = useAccordion(expanded);

    const shippingMethodCosts = SHIPPING_METHOD_OPTIONS[value];

    return (
      <SectionContentLayout>
        <div className="flex w-full flex-col gap-[30px] py-[10px]">
          <div className="col-span-full flex items-center gap-[30px]">
            <fieldset id="shippingMethod" className="flex items-center">
              <input
                className="h-[18px] w-[18px] rounded-[2px] accent-primary-600 hover:accent-primary-600 ltr:mr-3 rtl:ml-3"
                name="shippingMethod"
                type="radio"
                value={value}
                aria-label="Shipping Method"
                defaultChecked={checked}
                disabled={disabled}
                readOnly={disabled}
                ref={ref}
              />
            </fieldset>
            <h4 className="title-md md:title-lg text-black">Basic</h4>
            <div className="flex flex-grow justify-end">
              <AccordionButton {...{ open, toggle }} />
            </div>
          </div>

          {open && (
            <div className="flex flex-col gap-[10px] px-[16px]">
              <div className="label-lg grid w-full grid-cols-2 gap-[20px] font-medium text-neutral-900 md:w-max">
                <span className="col-span-1">Shipping Cost:</span>
                <span className="col-span-1 place-self-end">
                  {formatCurrency(shippingMethodCosts?.shippingCost || 0)}
                </span>
                {shippingMethodCosts?.clearingPortHandlingCost && (
                  <>
                    <span className="col-span-1">Clearing, Port Handling:</span>
                    <span className="col-span-1 place-self-end">
                      {formatCurrency(
                        shippingMethodCosts?.clearingPortHandlingCost || 0,
                      )}
                    </span>
                  </>
                )}
              </div>
              <div className="body-md flex flex-col gap-[5px] text-gray-700">
                <p>
                  This shipping method takes your package 5 working days to
                  arrive your destination from the 1st Wednesday after your
                  payment, You can call us on +234 700 700 6000 or +1 888 567
                  8765 or{" "}
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 underline"
                  >
                    send us a dm
                  </a>{" "}
                  to get alternative shipping methods with different benefits.
                </p>
                <p>
                  The cost paid here covers clearing, documentation and delivery
                  to the destination.
                </p>
              </div>
            </div>
          )}
        </div>
      </SectionContentLayout>
    );
  },
);

export type ShippingMethodUsedProps = {
  value: (typeof SHIPPING_METHODS)[number];
};

export const ShippingMethodUsed = ({ value }: ShippingMethodUsedProps) => {
  return (
    <>
      <SectionHeader title="Shipping Methods" />
      <div className="pl-[14px]">
        <SubSectionTitle title="Shipping Method Used" />
      </div>
      <ShippingMethod value={value} checked disabled expanded />
    </>
  );
};

const Success = () => {
  return (
    <div className="flex flex-col gap-[20px]">
      <SuccessImportantNotice />

      <div className="flex flex-col gap-[10px]">
        <SectionHeader title="Track your package" />
        <SectionContentLayout>
          <div className="flex flex-col gap-[10px]">
            <span className="title-md md:title-lg font-medium text-neutral-700 md:pl-[14px] md:font-bold">
              Here are more information on how to track
            </span>
            <ul className="flex flex-col gap-[14px]">
              <li>
                <div className="flex items-center gap-[20px]">
                  <span
                    className={`title-lg rounded-[20px] bg-primary-600 p-[10px] text-white`}
                  >
                    1
                  </span>
                  <span className="body-lg md:title-lg text-neutral-900">
                    You can start tracking your package in the next 24 hrs using
                    the <b>Tracking ID</b> above or{" "}
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <span className="inline-flex items-center gap-[5px] font-bold text-primary-600">
                        this link
                        <ExportCircle color="#292D32" size={18} />
                      </span>
                    </a>
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </SectionContentLayout>
      </div>

      <AndLastly />
    </div>
  );
};

export default InitiateShipping;
