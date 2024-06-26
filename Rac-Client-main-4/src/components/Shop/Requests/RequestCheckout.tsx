"use client";
/* eslint-disable @next/next/no-img-element */
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { ArrowRight3, ExportCircle, Receipt2, TickCircle } from "iconsax-react";
import {
  forwardRef,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
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
  formatWeight,
  limitChars,
  parseCountryCode,
  parseStateCode,
} from "~/Utils";
import { BackButton } from "~/components/Buttons/BackButton";
import { DoneButton } from "~/components/Buttons/DoneButton";
import { PayNowButton } from "~/components/Buttons/PayNowButton";
import CongratulationImage from "~/components/CongratulationImage";
import SelectCityInput from "~/components/Forms/Inputs/SelectCityInput";
import SelectCountryInput from "~/components/Forms/Inputs/SelectCountryInput";
import SelectCountryPhoneCodeInput from "~/components/Forms/Inputs/SelectCountryPhoneCodeInput";
import SelectStateInput from "~/components/Forms/Inputs/SelectStateInput";
import TextInput from "~/components/Forms/Inputs/TextInput";
import LabelId from "~/components/LabelId";
import OrderTrackingId from "~/components/OrderTrackingId";
import ShopPackageTable from "~/components/ShopPackageTable";
import SuccessImportantNotice from "~/components/SuccessImportantNotice";
import {
  BILLING_ADDRESS_OPTIONS,
  PAYMENT_METHODS,
  type PaymentMethodType,
} from "~/constants";
import { useAuthContext } from "~/contexts/AuthContext";
import { type BillingDetailsType } from "~/contexts/AutoImportContext";
import { useShopContext, type ShopItemType } from "~/contexts/ShopContext";
import { useTabContext } from "~/contexts/TabContext";
import useAccordion from "~/hooks/useAccordion";
import useMultiStepForm from "~/hooks/useMultistepForm";
import useStatesCities from "~/hooks/useStatesCities";
import AccordionButton from "../../Forms/AccordionButton";
import {
  DetailSection,
  Summary,
  type DetailSectionProps,
} from "../Orders/InitiateShipping";
import {
  HighlightedInfo,
  PackageOrigin,
  ShopRequestItem,
} from "./RequestDetails";
import {
  ChangeCurrencyButton,
  RequestFormHeader,
  SectionContentLayout,
  SectionHeader,
} from "./RequestOrder";
import { usePaystackPayment } from "react-paystack";
import { useFetchShopRequestPrice } from "~/hooks/useFetchShopRequestPrice";
import { useUpdatePaymentStatus } from "~/hooks/useUpdatePaymentStatus";

type RequestCheckoutInputs = {
  billingDetails: BillingDetailsType;
  paymentMethod: (typeof PAYMENT_METHODS)[number]["title"];
};

const emptyValue: RequestCheckoutInputs = {
  billingDetails: {
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "",
    phoneNumber: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zipPostalCode: "",
  },
  paymentMethod: "Paystack - Pay with Naira Card",
};

export type stepsContentType = { title: string; content: JSX.Element };

const RequestCheckout = () => {
  const [portal, setPortal] = useState<Element | DocumentFragment | null>(null);
  const {
    requestPackages,
    handleRequests,
    orderPackages,
    shopRequestTotalQuery,
  } = useShopContext();
  const { handleActiveAction, handleTabChange } = useTabContext();

  const { viewIndex } = useTabContext();

  if (viewIndex === null) return;

  const requestPackage = requestPackages?.[viewIndex];

  if (!requestPackage) return;

  const total = [
    +shopRequestTotalQuery?.data?.data?.totalUrgentPurchaseCost,
    +shopRequestTotalQuery?.data?.data?.totalItemCostFromStore,
    +shopRequestTotalQuery?.data?.data?.totalShippingToOriginWarehouse,
    +shopRequestTotalQuery?.data?.data?.totalProcessingFee,
    +shopRequestTotalQuery?.data?.data?.orderVat,
    +shopRequestTotalQuery?.data?.data?.orderPaymentMethodSurcharge,
    -+shopRequestTotalQuery?.data?.data?.orderDiscount,
  ].reduce((total, cost) => (total += cost || 0));

  const steps: [stepsContentType, ...stepsContentType[]] = [
    { title: "Package Confirmation", content: <PackageConfirmation /> },
    {
      title: "Shipping & Billing Details Confirmation",
      content: <BillingAddress />,
    },
    { title: "Place Order", content: <PlaceOrder /> },
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

  const formMethods = useForm<RequestCheckoutInputs>({
    defaultValues: emptyValue,
  });

  const initializePayment = usePaystackPayment({
    reference: new Date().getTime().toString(),
    publicKey: "pk_test_deebbde4eab19e1f1dd98af8f68c04553d379249",
  });
  const { updatePaymentStatus } = useUpdatePaymentStatus();

  const successPayment = (transaction) => {
    updatePaymentStatus.mutate(
      {
        refId: transaction.reference,
        orderId: requestPackage.id,
      },
      {
        onSuccess: () => {
          next();
        },
        onError: () => {
          alert("An error occurred while updating payment status");
        },
      },
    );
  };

  const cancelPayment = () => {
    alert("Are your sure you want payment cancel");
  };

  const onSubmit: SubmitHandler<RequestCheckoutInputs> = async (data) => {
    if (isSecondToLastStep) {
      const config = {
        reference: new Date().getTime().toString(),
        amount: total * 120000,
        email: data.billingDetails.email,
        firstname: data.billingDetails.firstName,
        lastname: data.billingDetails.lastName,
        publicKey: "pk_test_deebbde4eab19e1f1dd98af8f68c04553d379249",
      };

      initializePayment({
        onSuccess: successPayment,
        onClose: cancelPayment,
        config: config,
      });
    } else {
      next();
    }
  };

  const handleBack = () => {
    handleActiveAction(null);
  };

  const handleFinish = () => {
    handleRequests();
    handleTabChange("orders");
  };

  useEffect(() => {
    setPortal(document.getElementById("payNowButton"));
  }, [step]);

  return (
    <FormProvider {...formMethods}>
      <div className="flex max-w-[1032px] flex-col gap-[30px] rounded-[20px] bg-white p-[20px] md:p-[30px]">
        <RequestFormHeader title="Confirm and Place your Order" />

        <StepIndex
          currentIndex={currentStepIndex}
          length={steps.length}
          title={currentTitle}
        />

        {!isLastStep ? (
          <LabelId label="Request ID" id={requestPackage.requestId} />
        ) : (
          // todo: fetch orderPackage of the requestPackage.requestId to get orderId and trackingId
          <SectionContentLayout>
            <OrderTrackingId orderId="OD78667" trackingId="SH78667" center />
          </SectionContentLayout>
        )}

        {step}

        <div className="flex w-full flex-col items-center justify-center gap-[10px] md:w-max md:flex-row">
          {isFirstStep && (
            <div className="w-full md:max-w-[210px]">
              <BackButton onClick={handleBack} />
            </div>
          )}
          {!isFirstStep && !isLastStep && (
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
          {currentStepIndex === 3 && (
            <div className="w-full">
              <DoneButton text="Done" onClick={handleFinish} />
            </div>
          )}
        </div>

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
  const { requestPackages } = useShopContext();
  const { viewIndex } = useTabContext();

  if (viewIndex === null) return;

  const requestPackage = requestPackages?.[viewIndex];

  if (!requestPackage) return;

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
          value={requestPackage.originWarehouse}
        />
      </PackageOrigin>
      <hr className="block w-full border-dashed border-primary-900" />
      {requestPackage.items.map((item, i) => {
        return (
          <ShopRequestItem
            key={i}
            item={item}
            index={i}
            status={requestPackage.requestStatus}
          />
        );
      })}
    </div>
  );
};

export type BillingAddressChoicesType =
  (typeof BILLING_ADDRESS_OPTIONS)[number];

const BillingAddress = () => {
  const { user } = useAuthContext();
  if (!user) return;

  const defaultBillingAddress = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    ...user.billingDetails,
  };

  const [radio, setRadio] = useState<BillingAddressChoicesType>("default");
  const { register, setValue, watch } = useFormContext<RequestCheckoutInputs>();
  const { states, cities } = useStatesCities({
    path: "billingDetails",
    watch,
  });

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRadio(e.target.value as BillingAddressChoicesType);
  };

  useEffect(() => {
    if (radio === BILLING_ADDRESS_OPTIONS[0]) {
      setValue("billingDetails", defaultBillingAddress);
    }
  }, [radio]);

  return (
    <div className="flex flex-col gap-[10px]">
      <SectionHeader title="Provide your billing address" hr />
      <DefaultBillingAddressRadio
        {...{ radio, handleRadioChange, defaultBillingAddress }}
      />
      <CustomBillingAddressRadio {...{ radio, handleRadioChange }}>
        <div className="col-span-6">
          <TextInput
            id={"firstName"}
            label={"First Name"}
            {...register("billingDetails.firstName")}
          />
        </div>

        <div className="col-span-6">
          <TextInput
            id={"lastName"}
            label={"Last Name"}
            {...register("billingDetails.lastName")}
          />
        </div>

        <div className="col-span-full md:col-span-5">
          <TextInput
            id="email"
            label="Email"
            type="email"
            {...register("billingDetails.email")}
          />
        </div>

        <div className="col-span-full md:col-span-3">
          <SelectCountryPhoneCodeInput
            {...register("billingDetails.countryCode")}
          />
        </div>

        <div className="col-span-full md:col-span-4">
          <TextInput
            id="phone-number"
            label="Phone Number"
            type="tel"
            {...register("billingDetails.phoneNumber")}
          />
        </div>

        <div className="col-span-full">
          <TextInput
            id={"street-address"}
            label={"Street Address"}
            {...register("billingDetails.address")}
          />
        </div>

        <div className="col-span-4">
          <SelectCountryInput {...register("billingDetails.country")} />
        </div>

        <div className="col-span-4">
          <SelectStateInput
            states={states}
            {...register("billingDetails.state")}
          />
        </div>

        <div className="col-span-4">
          <SelectCityInput
            cities={cities}
            {...register("billingDetails.city")}
          />
        </div>

        <div className="col-span-full">
          <TextInput
            id={"zipPostalCode"}
            label={"Zip Postal Code"}
            {...register("billingDetails.zipPostalCode")}
          />
        </div>
      </CustomBillingAddressRadio>
    </div>
  );
};

type DefaultBillingAddressRadioProps = {
  radio: BillingAddressChoicesType;
  handleRadioChange: (e: ChangeEvent<HTMLInputElement>) => void;
  defaultBillingAddress: BillingDetailsType;
};

export const DefaultBillingAddressRadio = ({
  radio,
  handleRadioChange,
  defaultBillingAddress,
}: DefaultBillingAddressRadioProps) => {
  const checked = radio === BILLING_ADDRESS_OPTIONS[0];
  const { open, toggle } = useAccordion(checked);

  const {
    firstName,
    lastName,
    email,
    countryCode,
    phoneNumber,
    address,
    country,
    state,
    city,
    zipPostalCode,
  } = defaultBillingAddress;

  useEffect(() => {
    if (checked && !open) toggle();
    if (!checked && open) toggle();
  }, [radio]);

  return (
    <SectionContentLayout>
      <div className="flex w-full flex-col gap-[20px] py-[10px]">
        <div className="col-span-full flex items-center gap-[10px] md:gap-[30px]">
          <input
            className="h-[18px] w-[18px] rounded-[2px] accent-primary-600 hover:accent-primary-600 ltr:mr-3 rtl:ml-3"
            name="billingAddress"
            type="radio"
            value={BILLING_ADDRESS_OPTIONS[0]}
            aria-label="Default Billing Address"
            checked={checked}
            onChange={handleRadioChange}
          />
          <h4 className="title-md md:title-lg text-gray-700">
            Default Billing Address
          </h4>
          <div className="flex flex-grow justify-end">
            <AccordionButton {...{ open, toggle }} />
          </div>
        </div>

        {open && (
          <div className="flex w-full flex-col gap-[1px]">
            <span className="title-md font-medium text-neutral-900">
              {`${firstName} ${lastName}`}
            </span>
            <span className="body-lg text-neutral-700">
              {`${countryCode} ${phoneNumber}`}
            </span>
            <span className="body-lg text-neutral-700">{email}</span>
            <span className="body-lg text-neutral-700">
              {`${address}, ${city}, ${parseStateCode(
                state,
                country,
              )}, ${parseCountryCode(country)}, ${zipPostalCode}`}
            </span>
          </div>
        )}
      </div>
    </SectionContentLayout>
  );
};

type CustomBillingAddressRadioProps = {
  radio: BillingAddressChoicesType;
  handleRadioChange: (e: ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
};

export const CustomBillingAddressRadio = ({
  radio,
  handleRadioChange,
  children,
}: CustomBillingAddressRadioProps) => {
  const checked = radio === BILLING_ADDRESS_OPTIONS[1];
  const { open, toggle } = useAccordion(checked);

  useEffect(() => {
    if (checked && !open) toggle();
    if (!checked && open) toggle();
  }, [radio]);

  return (
    <SectionContentLayout>
      <div className="flex w-full flex-col gap-[40px] py-[10px]">
        <div className="col-span-full flex items-center gap-[10px] md:gap-[30px]">
          <input
            className="h-[18px] w-[18px] rounded-[2px] accent-primary-600 hover:accent-primary-600 ltr:mr-3 rtl:ml-3"
            name="billingAddress"
            type="radio"
            value={BILLING_ADDRESS_OPTIONS[1]}
            aria-label="Custom Billing Address"
            checked={checked}
            onChange={handleRadioChange}
          />
          <h4 className="title-md md:title-lg text-gray-700">
            Custom Billing Address
          </h4>
          <div className="flex flex-grow justify-end">
            <AccordionButton {...{ open, toggle }} />
          </div>
        </div>

        {open && (
          <div className="grid w-full grid-cols-1 gap-[20px] md:grid-cols-12 md:gap-[30px]">
            {children}
          </div>
        )}
      </div>
    </SectionContentLayout>
  );
};

const PlaceOrder = () => {
  const { register } = useFormContext<RequestCheckoutInputs>();
  const { requestPackages, shopRequestTotalQuery } = useShopContext();
  const { viewIndex } = useTabContext();

  if (viewIndex === null) return;

  const requestPackage = requestPackages?.[viewIndex];

  if (!requestPackage) return;

  const defaultColumns = useMemo(shopPackageItemColumns, []);

  const total = [
    +shopRequestTotalQuery?.data?.data?.totalUrgentPurchaseCost,
    +shopRequestTotalQuery?.data?.data?.totalItemCostFromStore,
    +shopRequestTotalQuery?.data?.data?.totalShippingToOriginWarehouse,
    +shopRequestTotalQuery?.data?.data?.totalProcessingFee,
    +shopRequestTotalQuery?.data?.data?.orderVat,
    +shopRequestTotalQuery?.data?.data?.orderPaymentMethodSurcharge,
    -+shopRequestTotalQuery?.data?.data?.orderDiscount,
  ].reduce((total, cost) => (total += cost || 0));

  const totals = {
    numberOfItems: requestPackage.items.length,
    grossWeight: requestPackage.items.reduce(
      (acc, item) => (acc += item.weight),
      0,
    ),
    itemsCostFromStore:
      +shopRequestTotalQuery?.data?.data?.totalItemCostFromStore,
    processingFee: +shopRequestTotalQuery?.data?.data?.totalProcessingFee,
    urgentPurchaseFee:
      +shopRequestTotalQuery?.data?.data?.totalUrgentPurchaseCost,
    shippingToOriginWarehouseCost:
      +shopRequestTotalQuery?.data?.data?.totalShippingToOriginWarehouse,
    shopForMeCost: total,
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <SectionHeader title="Package details" />
      <ShopPackageTable
        columns={defaultColumns}
        data={requestPackage.items}
        tableFooter={<ShopPackageTableFooter totals={totals} />}
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

type PaymentMethodsProps = { children: ReactNode };

export const PaymentMethods = ({ children }: PaymentMethodsProps) => {
  return (
    <fieldset
      id="paymentMethods"
      className="flex flex-col gap-[10px] md:pb-[40px]"
    >
      {children}
    </fieldset>
  );
};

export const ImportantNotice = () => {
  return (
    <div className="flex flex-col gap-[30px] rounded-[20px] bg-error-200 px-[28px] py-[20px]">
      <span className="label-lg text-primary-900">IMPORTANT NOTICE:</span>
      <p className="label-lg font-medium text-gray-700">
        We do not ship or return any fraudulent purchased items. You are advised
        to only pay to ship items that uou can provide valid evidence of proof
        of purchase when and if requested. Items for which valid proof of
        purchase can be provided will be handed over to the CUSTOMS. In addition
        any shipping cost paid will be forfeited and billed to you as cost of
        verification.
      </p>
    </div>
  );
};

export const CostDetailSection = ({ label, value }: DetailSectionProps) => {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="label-lg flex items-center justify-between gap-[10px] font-medium">
        <span>{label}:</span>
        <span>{value}</span>
      </div>
      <hr className="w-full border-gray-200" />
    </div>
  );
};

type TotalCostProps = { total: number };

export const TotalCost = ({ total }: TotalCostProps) => {
  return (
    <div className="mt-[10px] flex flex-col items-start justify-between gap-[20px] md:flex-row md:items-end">
      <div className="flex flex-col gap-[5px]">
        <span className="label-lg">Total:</span>
        <span className="title-lg">{formatCurrency(total)}</span>
      </div>
      <div className="flex flex-col items-start justify-center gap-[10px] md:items-center">
        <span className="body-md text-primary-100">
          Default Currency: <b>USD</b>
        </span>
        <ChangeCurrencyButton />
      </div>
    </div>
  );
};

const CostsSummary = () => {
  const { requestPackages, shopRequestTotalQuery } = useShopContext();
  const { viewIndex } = useTabContext();

  if (viewIndex === null) return;

  const requestPackage = requestPackages?.[viewIndex];

  if (!requestPackage) return;

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
      <Summary title="Order Costs Summary klk">
        <CostDetailSection
          label="Total Urgent Purchase Cost"
          value={
            +shopRequestTotalQuery?.data?.data?.totalUrgentPurchaseCost
              ? formatCurrency(
                  +shopRequestTotalQuery?.data?.data?.totalUrgentPurchaseCost,
                )
              : ""
          }
        />
        <CostDetailSection
          label="Total Cost of Items from Store"
          value={
            +shopRequestTotalQuery?.data?.data?.totalItemCostFromStore
              ? formatCurrency(
                  +shopRequestTotalQuery?.data?.data?.totalItemCostFromStore,
                )
              : ""
          }
        />
        <CostDetailSection
          label="Total Shipping to Origin Warehouse Cost"
          value={
            +shopRequestTotalQuery?.data?.data?.totalShippingToOriginWarehouse
              ? formatCurrency(
                  +shopRequestTotalQuery?.data?.data
                    ?.totalShippingToOriginWarehouse,
                )
              : ""
          }
        />
        <CostDetailSection
          label="Total Processing fee "
          value={
            +shopRequestTotalQuery?.data?.data?.totalProcessingFee
              ? formatCurrency(
                  +shopRequestTotalQuery?.data?.data?.totalProcessingFee,
                )
              : ""
          }
        />
        <CostDetailSection
          label="VAT"
          value={
            +shopRequestTotalQuery?.data?.data?.orderVat
              ? formatCurrency(+shopRequestTotalQuery?.data?.data?.orderVat)
              : ""
          }
        />
        <CostDetailSection
          label="Payment Method Surcharge"
          value={
            +shopRequestTotalQuery?.data?.data?.orderPaymentMethodSurcharge
              ? formatCurrency(
                  +shopRequestTotalQuery?.data?.data
                    ?.orderPaymentMethodSurcharge,
                )
              : ""
          }
        />
        <CostDetailSection
          label="Discount"
          value={`- ${
            +shopRequestTotalQuery?.data?.data?.orderDiscount
              ? formatCurrency(
                  +shopRequestTotalQuery?.data?.data?.orderDiscount,
                )
              : ""
          }`}
        />
        <TotalCost total={total} />
      </Summary>
      <div className="flex flex-col items-center justify-center gap-[20px] p-[20px]">
        <div className="flex flex-col gap-[5px]">
          <div className="flex items-center gap-[10px]">
            <ArrowRight3 className="text-error-600" variant="Bold" />
            <span className="label-md w-fit font-medium text-secondary-900">
              The total you are paying now includes only the shop-for-me cost
              and excludes Shipment Cost which you are to pay upon
              arrival/clearing of your package
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
        <div className="w-[168px]" id="payNowButton">
          {/* portal for pay now button */}
        </div>
      </div>
    </div>
  );
};

type PaymentMethodProps = {
  paymentMethod: PaymentMethodType;
  expanded?: boolean;
};

export const PaymentMethod = forwardRef(
  (
    { paymentMethod, expanded = false }: PaymentMethodProps,
    ref: Ref<HTMLInputElement>,
  ) => {
    const { open, toggle } = useAccordion(expanded);

    const { title, description } = paymentMethod;

    return (
      <SectionContentLayout>
        <div className="flex w-full flex-col gap-[20px] py-[10px] md:gap-[34px]">
          <div className="col-span-full flex items-center gap-[10px] md:gap-[14px]">
            <input
              ref={ref}
              className="h-[18px] w-[18px] rounded-[2px] accent-primary-600 hover:accent-primary-600"
              type="radio"
              value={title}
              aria-label={title}
            />
            <h4 className="title-md md:title-sm font-medium text-black">
              {title}
            </h4>
            <div className="flex flex-grow justify-end">
              <AccordionButton {...{ open, toggle }} />
            </div>
          </div>

          {open && (
            <span className="body-md pl-[10px] text-neutral-700">
              {description}
            </span>
          )}
        </div>
      </SectionContentLayout>
    );
  },
);

type SubSectionTitleProps = { title: string | JSX.Element };

export const SubSectionTitle = ({ title }: SubSectionTitleProps) => {
  return <h4 className="title-md md:title-lg text-gray-700">{title}</h4>;
};

export const shopPackageItemColumns = () => {
  const columnHelper = createColumnHelper<ShopItemType>();

  return [
    columnHelper.display({
      id: "item",
      header: "Item",
      cell: ({ row }) => (
        <div className="flex items-center gap-[10px]">
          <div className="w-[62px] items-center overflow-hidden rounded-[10px]">
            <img src={row.original.image as string} alt="item image" />
          </div>
          <div className="w-[160px] text-secondary-900">
            {limitChars(row.original.name, 80)}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("url", {
      header: "Item URL",
      cell: ({ row }) => (
        <a href={row.original.url} target="_blank" rel="noopener noreferrer">
          {limitChars(row.original.url, 25)}
        </a>
      ),
    }),
    columnHelper.accessor("originalCost", {
      header: "Item Cost from Store",
      cell: ({ row }) =>
        row.original.originalCost
          ? formatCurrency(row.original.originalCost)
          : "",
    }),
    columnHelper.accessor("relatedCosts.urgentPurchaseFee", {
      header: "Urgent Purchase",
      cell: ({ row }) =>
        row.original.relatedCosts.urgentPurchaseFee
          ? formatCurrency(row.original.relatedCosts.urgentPurchaseFee)
          : "",
    }),
    columnHelper.accessor("quantity", {
      header: "Quantity of items",
      cell: ({ row }) => row.original.quantity,
    }),
    columnHelper.display({
      id: "itemTotalValue",
      header: "Total value of item",
      cell: ({ row }) =>
        row.original.quantity * row.original.originalCost
          ? formatCurrency(row.original.quantity * row.original.originalCost)
          : "",
    }),
  ] as Array<ColumnDef<ShopItemType, unknown>>;
};

type ShopPackageTableFooterProps = {
  totals: {
    numberOfItems: number;
    grossWeight: number;
    itemsCostFromStore: number;
    processingFee: number;
    urgentPurchaseFee: number;
    shippingToOriginWarehouseCost: number;
    shopForMeCost: number;
  };
};

export const ShopPackageTableFooter = ({
  totals,
}: ShopPackageTableFooterProps) => {
  const {
    numberOfItems,
    grossWeight,
    itemsCostFromStore,
    processingFee,
    urgentPurchaseFee,
    shippingToOriginWarehouseCost,
    shopForMeCost,
  } = totals;

  return (
    <>
      <div className="col-span-1">
        <DetailSection label="Total number of items" value={numberOfItems} />
      </div>
      <div className="col-span-1">
        <DetailSection
          label="Total Gross weight"
          value={grossWeight ? formatWeight(grossWeight) : ""}
        />
      </div>
      <div className="col-span-2">
        <DetailSection
          label="Total Items Cost from Store"
          labelMaxWidth="max-w-[125px]"
          value={itemsCostFromStore ? formatCurrency(itemsCostFromStore) : ""}
        />
      </div>
      <div className="col-span-1">
        <DetailSection
          label="Processing fee"
          value={processingFee ? formatCurrency(processingFee) : ""}
        />
      </div>
      <div className="col-span-1">
        <DetailSection
          label="Urgent Purchase fee"
          value={urgentPurchaseFee ? formatCurrency(urgentPurchaseFee) : ""}
        />
      </div>
      <div className="col-span-1">
        <DetailSection
          label="Total Shipping to Origin Warehouse Cost"
          labelMaxWidth="max-w-[182px]"
          value={
            shippingToOriginWarehouseCost
              ? formatCurrency(shippingToOriginWarehouseCost)
              : ""
          }
        />
      </div>
      <div className="col-span-1 flex flex-col gap-[5px]">
        <span className="title-lg max-w-[162px] text-gray-700">
          Total Shop For Me Cost:
        </span>
        <span className="title-lg md:headline-sm text-neutral-900">
          {shopForMeCost ? formatCurrency(shopForMeCost) : ""}
        </span>
      </div>
    </>
  );
};

const Success = () => {
  return (
    <div className="flex flex-col gap-[30px]">
      <CongratulationImage description="You have just successfully placed a shop for me order by paying for your shop for me cost." />
      <SuccessImportantNotice />
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
                  the Tracking ID above or{" "}
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

export const AndLastly = () => {
  return (
    <div className="flex flex-col">
      <SectionHeader title="And lastly..." />
      <div className="flex flex-col gap-[10px] px-[10px] py-[10px] md:px-[34px]">
        <p className="body-md">
          We have sent you details about your Order to your email address{" "}
          <span className="text-primary-900">rexofforex@gmail.com</span>
        </p>
        <div className="w-max">
          <button
            aria-label="View Receipt"
            className="btn relative flex w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] border border-gray-500 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white md:px-6"
          >
            <Receipt2 size={18} className="text-primary-900" />
            <span className="body-lg whitespace-nowrap text-primary-600">
              View Receipt
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

type StepIndexProps = { currentIndex: number; length: number; title: string };

export const StepIndex = ({ currentIndex, length, title }: StepIndexProps) => {
  return (
    <>
      <div className="hidden gap-[39px] md:flex">
        {Array(length)
          .fill(null)
          .map((_, i) => {
            if (currentIndex + 1 === length && i === currentIndex) {
              return (
                <div
                  key={`checkout-step-${i}`}
                  className="flex items-center gap-[10px]"
                >
                  <span className="title-lg h-full rounded-[20px] bg-primary-900 px-[10px] py-[12px] text-white">
                    <TickCircle variant="Bold" />
                  </span>
                  <span className="headline-md">{title}</span>
                </div>
              );
            }

            if (i + 1 === length) {
              return (
                <div
                  key={`checkout-step-${i}`}
                  className="flex items-center gap-[10px] rounded-[20px] bg-gray-200 px-[10px] py-[12px] text-white"
                >
                  <TickCircle variant="Bold" />
                </div>
              );
            }

            if (i === currentIndex) {
              return (
                <div
                  key={`checkout-step-${i}`}
                  className="flex items-center gap-[10px]"
                >
                  <span className="title-lg rounded-[20px] bg-primary-900 p-[10px] text-white">
                    {currentIndex + 1}
                  </span>
                  <span className="headline-md">{title}</span>
                </div>
              );
            }

            if (i !== currentIndex) {
              return (
                <div
                  key={`checkout-step-${i}`}
                  className="flex items-center gap-[10px]"
                >
                  <span className="title-lg rounded-[20px] bg-gray-200 p-[10px] text-white">
                    {i + 1}
                  </span>
                </div>
              );
            }
          })}
      </div>

      {/* for mobile screen */}
      <div className="flex flex-col gap-[10px] md:hidden">
        <div className="flex justify-between">
          {Array(length)
            .fill(null)
            .map((_, i) => {
              if (currentIndex + 1 === length && i === currentIndex) {
                return (
                  <div
                    key={`checkout-step-${i}`}
                    className="flex flex-shrink-0 items-center gap-[10px] rounded-[20px] bg-primary-900 px-[10px] py-[12px] text-white"
                  >
                    <TickCircle variant="Bold" />
                  </div>
                );
              }

              if (i + 1 === length) {
                return (
                  <div
                    key={`checkout-step-${i}`}
                    className="flex flex-shrink-0 items-center gap-[10px] rounded-[20px] bg-gray-200 px-[10px] py-[12px] text-white"
                  >
                    <TickCircle variant="Bold" />
                  </div>
                );
              }

              if (i === currentIndex) {
                return (
                  <div
                    key={`checkout-step-${i}`}
                    className="flex items-center gap-[10px]"
                  >
                    <span className="title-lg rounded-[20px] bg-primary-900 p-[10px] text-white">
                      {currentIndex + 1}
                    </span>
                  </div>
                );
              }

              if (i !== currentIndex) {
                return (
                  <div
                    key={`checkout-step-${i}`}
                    className="flex items-center gap-[10px]"
                  >
                    <span className="title-lg rounded-[20px] bg-gray-200 p-[10px] text-white">
                      {i + 1}
                    </span>
                  </div>
                );
              }
            })}
        </div>
        <span className="title-lg">{title}</span>
      </div>
    </>
  );
};

export default RequestCheckout;
