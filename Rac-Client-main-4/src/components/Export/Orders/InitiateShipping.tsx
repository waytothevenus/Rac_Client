import { ArrowRight3, ExportCircle } from "iconsax-react";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
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
import SelectCityInput from "~/components/Forms/Inputs/SelectCityInput";
import SelectCountryInput from "~/components/Forms/Inputs/SelectCountryInput";
import SelectCountryPhoneCodeInput from "~/components/Forms/Inputs/SelectCountryPhoneCodeInput";
import SelectStateInput from "~/components/Forms/Inputs/SelectStateInput";
import TextInput from "~/components/Forms/Inputs/TextInput";
import { ImportOrderItem } from "~/components/Import/Orders/ClearPackage";
import {
  ImportPackageTableFooter,
  importPackageItemColumns,
} from "~/components/Import/Orders/InitiateShipping";
import LabelId from "~/components/LabelId";
import OrderTrackingId from "~/components/OrderTrackingId";
import PackageTable from "~/components/PackageTable";
import {
  DetailSection,
  SelectShippingMethod,
  ShippingMethod,
  Summary,
  type ShipmentCostsSummaryProps,
} from "~/components/Shop/Orders/InitiateShipping";
import {
  AndLastly,
  CostDetailSection,
  CustomBillingAddressRadio,
  DefaultBillingAddressRadio,
  PaymentMethod,
  PaymentMethods,
  StepIndex,
  SubSectionTitle,
  TotalCost,
  type BillingAddressChoicesType,
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
import {
  BILLING_ADDRESS_OPTIONS,
  PAYMENT_METHODS,
  type SHIPPING_METHODS,
} from "~/constants";
import { useAuthContext } from "~/contexts/AuthContext";
import { type BillingDetailsType } from "~/contexts/AutoImportContext";
import { useExportContext } from "~/contexts/ExportContext";
import { useTabContext } from "~/contexts/TabContext";
import useMultiStepForm from "~/hooks/useMultistepForm";
import useStatesCities from "~/hooks/useStatesCities";

type InitiateShippingInputs = {
  destinationDetails: BillingDetailsType;
  billingDetails: BillingDetailsType;
  shippingMethod: (typeof SHIPPING_METHODS)[number];
  paymentMethod: (typeof PAYMENT_METHODS)[number]["title"];
};

const emptyValue: InitiateShippingInputs = {
  destinationDetails: {
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
  shippingMethod: "basic",
  paymentMethod: "Paystack - Pay with Naira Card",
};

const InitiateShipping = () => {
  const [portal, setPortal] = useState<Element | DocumentFragment | null>(null);
  const { requestPackages } = useExportContext();
  const { viewIndex, handleActiveAction, handleTabChange } = useTabContext();

  if (viewIndex === null) return;

  const requestPackage = requestPackages?.[viewIndex];

  if (!requestPackage) return;

  const steps: [stepsContentType, ...stepsContentType[]] = [
    { title: "Package Confirmation", content: <PackageConfirmation /> },
    {
      title: "Shipping & Billing Address",
      content: <BillingAddressStep />,
    },
    { title: "Place Order", content: <InitiateShippingStep /> },
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
            <LabelId label="Request ID" id={requestPackage.requestId} />
          </div>
        ) : (
          // todo: fetch orderPackage of the requestPackage.requestId to get orderId and trackingId
          <>
            <SectionContentLayout>
              <OrderTrackingId orderId="OD78667" trackingId="SH78667" center />
            </SectionContentLayout>
            <CongratulationImage description="You have just successfully iInitiated shipment of your items" />
          </>
        )}

        {step}

        {!isSecondToLastStep && (
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
  const { requestPackages } = useExportContext();
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
        return <ImportOrderItem key={i} item={item} index={i} />;
      })}
    </div>
  );
};

const BillingAddressStep = () => {
  const { user } = useAuthContext();
  if (!user) return;

  const defaultBillingAddress = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    ...user.billingDetails,
  };

  const [radio, setRadio] = useState<BillingAddressChoicesType>("default");
  const { register, setValue, watch } =
    useFormContext<InitiateShippingInputs>();
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
    <div className="flex flex-col gap-[30px]">
      <div className="flex flex-col gap-[10px]">
        <SectionHeader title="Fill in the Shipment Address" hr />
        <div className="flex flex-col items-center gap-[30px] md:pl-[34px]">
          <FillInShippingAddress />
        </div>
      </div>

      <div className="flex flex-col gap-[10px]">
        <SectionHeader title="Confirm your Billing Information" />
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
    </div>
  );
};

const FillInShippingAddress = () => {
  const { register, watch } = useFormContext<InitiateShippingInputs>();
  const { states, cities } = useStatesCities({
    path: "destinationDetails",
    watch,
  });

  return (
    <div className="flex w-full flex-col gap-[40px] py-[10px]">
      <div className="grid w-full grid-cols-1 gap-[20px] md:grid-cols-12 md:gap-[30px]">
        <div className="col-span-6">
          <TextInput
            id={"receiverFirstName"}
            label={"Receiver's First Name"}
            {...register("destinationDetails.firstName")}
          />
        </div>

        <div className="col-span-6">
          <TextInput
            id={"receiverLastName"}
            label={"Receiver's Last Name"}
            {...register("destinationDetails.lastName")}
          />
        </div>

        <div className="col-span-full md:col-span-5">
          <TextInput
            id="receiverEmail"
            label="Receiver's Email"
            type="email"
            {...register("destinationDetails.email")}
          />
        </div>

        <div className="col-span-full md:col-span-3">
          <SelectCountryPhoneCodeInput
            {...register("destinationDetails.countryCode")}
          />
        </div>

        <div className="col-span-full md:col-span-4">
          <TextInput
            id="receiverPhoneNumber"
            label="Receiver's Phone Number"
            type="tel"
            {...register("destinationDetails.phoneNumber")}
          />
        </div>

        <div className="col-span-full">
          <TextInput
            id={"receiverAddress"}
            label={"Receiver's Address"}
            {...register("destinationDetails.address")}
          />
        </div>

        <div className="col-span-4">
          <SelectCountryInput {...register("destinationDetails.country")} />
        </div>

        <div className="col-span-4">
          <SelectStateInput
            states={states}
            {...register("destinationDetails.state")}
          />
        </div>

        <div className="col-span-4">
          <SelectCityInput
            cities={cities}
            {...register("destinationDetails.city")}
          />
        </div>

        <div className="col-span-full">
          <TextInput
            id={"receiverZipPostalCode"}
            label={"Zip Postal Code"}
            {...register("destinationDetails.zipPostalCode")}
          />
        </div>
      </div>
    </div>
  );
};

const InitiateShippingStep = () => {
  const { register } = useFormContext<InitiateShippingInputs>();
  const { requestPackages } = useExportContext();
  const { viewIndex } = useTabContext();

  if (viewIndex === null) return;

  const requestPackage = requestPackages?.[viewIndex];

  if (!requestPackage) return;

  const defaultColumns = useMemo(importPackageItemColumns, []);

  const totals = {
    numberOfItems: requestPackage.items.length,
    grossWeight: requestPackage.items.reduce(
      (acc, item) => (acc += item.weight),
      0,
    ),
    declaredValue: requestPackage.items.reduce(
      (acc, item) => (acc += item.originalCost),
      0,
    ),
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <SectionHeader title="Package details Summary" />
      <PackageTable
        columns={defaultColumns}
        data={requestPackage.items}
        tableFooter={<ImportPackageTableFooter totals={totals} />}
      />

      <SelectShippingMethod>
        <ShippingMethod
          {...register("shippingMethod")}
          value="basic"
          checked
          expanded
        />
      </SelectShippingMethod>

      <SectionHeader title="Shipping Methods" />
      <div className="pl-[14px]">
        <SubSectionTitle title="Select The Payment Method You Wish to Use" />
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

const ShipmentCostsSummary = ({
  footer,
  payButton = false,
}: ShipmentCostsSummaryProps) => {
  const { requestPackages } = useExportContext();
  const { viewIndex } = useTabContext();

  if (viewIndex === null) return;

  const requestPackage = requestPackages?.[viewIndex];

  if (!requestPackage) return;

  const {
    shippingCost = 0,
    clearingPortHandlingCost = 0,
    otherCharges = 0,
    storageCharge = 0,
    insurance = 0,
    valueAddedTax,
    paymentMethodSurcharge,
    discount,
  } = requestPackage.packageCosts;

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

const Success = () => {
  return (
    <div className="flex flex-col gap-[20px]">
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
