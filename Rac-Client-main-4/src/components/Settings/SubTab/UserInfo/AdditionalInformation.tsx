import { ArrowCircleRight2, Edit } from "iconsax-react";
import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  type SubmitHandler,
} from "react-hook-form";
import { parseCountryCode, parseStateCode } from "~/Utils";
import { CloseModalButton } from "~/components/Buttons/CloseModalButton";
import ModalButton from "~/components/Buttons/ModalButton";
import AccordionButton from "~/components/Forms/AccordionButton";
import SelectCityInput from "~/components/Forms/Inputs/SelectCityInput";
import SelectCountryInput from "~/components/Forms/Inputs/SelectCountryInput";
import SelectCountryPhoneCodeInput from "~/components/Forms/Inputs/SelectCountryPhoneCodeInput";
import SelectStateInput from "~/components/Forms/Inputs/SelectStateInput";
import TextInput from "~/components/Forms/Inputs/TextInput";
import { type BillingAddressChoicesType } from "~/components/Shop/Requests/RequestCheckout";
import {
  RequestFormHeader,
  SectionContentLayout,
} from "~/components/Shop/Requests/RequestOrder";
import { BILLING_ADDRESS_OPTIONS } from "~/constants";
import { useAuthContext } from "~/contexts/AuthContext";
import { type BillingDetailsType } from "~/contexts/AutoImportContext";
import useAccordion from "~/hooks/useAccordion";
import useStatesCities from "~/hooks/useStatesCities";

type BusinessDetailsType = {
  businessCompanyName: string;
  businessAddress: Omit<
    BillingDetailsType,
    keyof Pick<BillingDetailsType, "firstName" | "lastName">
  >;
};

const emptyValue: BusinessDetailsType = {
  businessCompanyName: "",
  businessAddress: {
    email: "",
    countryCode: "",
    phoneNumber: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zipPostalCode: "",
  },
};

type AdditionalInformationInputs = typeof emptyValue;

const AdditionalInformation = () => {
  const { user } = useAuthContext();

  if (!user) return;

  const formMethods = useForm<AdditionalInformationInputs>({
    defaultValues: emptyValue,
  });

  // todo: replace values
  return (
    <div className="flex flex-col items-center gap-[15px] md:flex-row">
      <SectionContentLayout>
        <div className="flex w-full flex-col gap-[20px] break-words">
          <span className="title-md md:title-lg text-gray-700">
            Business Information
          </span>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-12">
            <div className="col-span-full flex flex-col gap-[5px] md:col-span-4">
              <span className="body-md text-gray-700">
                Business/Company Name:
              </span>
              <span className="title-md text-gray-900">N/A</span>
            </div>

            <div className="col-span-full flex flex-col gap-[5px] md:col-span-2">
              <span className="body-md text-gray-700">Country:</span>
              <span className="title-md text-gray-900">N/A</span>
            </div>

            <div className="col-span-full flex flex-col gap-[5px] md:col-span-2">
              <span className="body-md text-gray-700">State:</span>
              <span className="title-md text-gray-900">N/A</span>
            </div>

            <div className="col-span-full flex flex-col gap-[5px] md:col-span-2">
              <span className="body-md text-gray-700">City:</span>
              <span className="title-md text-gray-900">N/A</span>
            </div>

            <div className="col-span-full flex flex-col gap-[5px] md:col-span-2">
              <span className="body-md text-gray-700">City:</span>
              <span className="title-md text-gray-900">N/A</span>
            </div>

            <div className="col-span-full flex flex-col gap-[5px] md:col-span-4">
              <span className="body-md text-gray-700">Phone Number:</span>
              <span className="title-md text-gray-900">N/A</span>
            </div>

            <div className="col-span-full flex flex-col gap-[5px] md:col-span-4">
              <span className="body-md text-gray-700">Email:</span>
              <span className="title-md text-gray-900">N/A</span>
            </div>

            <div className="col-span-full flex flex-col gap-[5px] md:col-span-4">
              <span className="body-md text-gray-700">Zip/postal Code:</span>
              <span className="title-md text-gray-900">N/A</span>
            </div>

            <div className="col-span-full flex flex-col gap-[5px]">
              <span className="body-md text-gray-700">Address:</span>
              <span className="title-md text-gray-900">N/A</span>
            </div>
          </div>
        </div>
      </SectionContentLayout>

      <FormProvider {...formMethods}>
        <div className="hidden md:block">
          <ModalButton
            modalId="editBusinessInformation"
            label="Edit Business Information"
            buttonClassName="btn relative flex h-[48px] w-[48px] flex-row items-center justify-center gap-x-2 rounded-[6.25rem] px-4 py-2.5 text-sm font-medium tracking-[.00714em] md:px-6"
            buttonContent={<Edit className="flex-shrink-0 text-error-600" />}
            footerContent={({ dataClose }) => (
              <FooterContent dataClose={dataClose} />
            )}
          >
            <ModalContent idPrefix="desktop" />
          </ModalButton>
        </div>
        {/* mobile version */}
        <div className="w-full gap-[10px] border-t-[0.5px] border-dashed border-t-gray-500 p-[10px] md:hidden">
          <ModalButton
            modalId="editBusinessInformation"
            label="Edit Business Information"
            buttonClassName="btn w-full relative flex flex-row items-center justify-center gap-x-2 rounded-[6.25rem] border border-gray-500 bg-white px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-error-600 md:px-6"
            buttonContent={
              <>
                <Edit
                  size={18}
                  variant="Bold"
                  className="flex-shrink-0 text-error-600"
                />
                <span>Edit</span>
              </>
            }
            footerContent={({ dataClose }) => (
              <FooterContent dataClose={dataClose} />
            )}
          >
            <ModalContent idPrefix="mobile" />
          </ModalButton>
        </div>
      </FormProvider>
    </div>
  );
};

const FooterContent = ({ dataClose }: { dataClose: string }) => {
  const { handleSubmit } = useFormContext<AdditionalInformationInputs>();

  const onSubmit: SubmitHandler<AdditionalInformationInputs> = async (data) => {
    console.log(data);
    // todo: add loading state to edit business info button
  };

  return (
    <div className="flex gap-[10px]">
      <div className="w-full md:max-w-[100px]">
        <CloseModalButton dataClose={dataClose} />
      </div>
      <div className="w-full md:max-w-[172px]">
        <CloseModalButton
          icon={
            <ArrowCircleRight2
              size={18}
              variant="Bold"
              className="flex-shrink-0"
            />
          }
          label="Update"
          dataClose={dataClose}
          onClick={handleSubmit(onSubmit)}
          primary
        />
      </div>
    </div>
  );
};

type ModalContentProps = { idPrefix: string };

const ModalContent = ({ idPrefix }: ModalContentProps) => {
  const { user } = useAuthContext();

  if (!user) return;

  const { register, watch, setValue } =
    useFormContext<AdditionalInformationInputs>();
  const { cities, states } = useStatesCities({
    path: "businessAddress",
    watch,
  });

  // todo: replace values
  const defaultBusinessAddress = {
    email: user.email,
    ...user.billingDetails,
  };

  const [radio, setRadio] = useState<BillingAddressChoicesType>("default");

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRadio(e.target.value as BillingAddressChoicesType);
  };

  useEffect(() => {
    if (radio === BILLING_ADDRESS_OPTIONS[0]) {
      setValue("businessAddress", defaultBusinessAddress);
    }
  }, [radio]);

  return (
    <>
      <RequestFormHeader title="Edit your business information" />

      <TextInput
        id={`${idPrefix}-businessCompanyName`}
        label="Business/Company Name"
        bg="bg-surface-300"
        {...register("businessCompanyName")}
      />

      <DefaultBusinessAddressRadio
        {...{
          radio,
          handleRadioChange,
          defaultBusinessAddress,
        }}
      />

      <CustomBusinessAddressRadio {...{ radio, handleRadioChange }}>
        <div className="col-span-full md:col-span-5">
          <TextInput
            id={`${idPrefix}-email`}
            label="Email"
            type="email"
            bg="bg-surface-100"
            {...register("businessAddress.email")}
          />
        </div>

        <div className="col-span-full md:col-span-3">
          <SelectCountryPhoneCodeInput
            bg="bg-surface-100"
            {...register("businessAddress.countryCode")}
          />
        </div>

        <div className="col-span-full md:col-span-4">
          <TextInput
            id="`hone`number"
            label="Phone Number"
            type="tel"
            bg="bg-surface-100"
            {...register("businessAddress.phoneNumber")}
          />
        </div>

        <div className="col-span-full">
          <TextInput
            id={`${idPrefix}-streetAddress`}
            label={"Street Address"}
            bg="bg-surface-100"
            {...register("businessAddress.address")}
          />
        </div>

        <div className="col-span-full md:col-span-4">
          <SelectCountryInput
            bg="bg-surface-100"
            {...register("businessAddress.country")}
          />
        </div>

        <div className="col-span-full md:col-span-4">
          <SelectStateInput
            states={states}
            bg="bg-surface-100"
            {...register("businessAddress.state")}
          />
        </div>

        <div className="col-span-full md:col-span-4">
          <SelectCityInput
            cities={cities}
            bg="bg-surface-100"
            {...register("businessAddress.city")}
          />
        </div>

        <div className="col-span-full">
          <TextInput
            id={`${idPrefix}-zipPostalCode`}
            label={"Zip Postal Code"}
            bg="bg-surface-100"
            {...register("businessAddress.zipPostalCode")}
          />
        </div>
      </CustomBusinessAddressRadio>
    </>
  );
};

type DefaultBusinessAddressRadioProps = {
  radio: BillingAddressChoicesType;
  handleRadioChange: (e: ChangeEvent<HTMLInputElement>) => void;
  defaultBusinessAddress: BusinessDetailsType["businessAddress"];
};

const DefaultBusinessAddressRadio = ({
  radio,
  handleRadioChange,
  defaultBusinessAddress,
}: DefaultBusinessAddressRadioProps) => {
  const checked = radio === BILLING_ADDRESS_OPTIONS[0];
  const { open, toggle } = useAccordion(checked);

  const {
    email,
    countryCode,
    phoneNumber,
    address,
    country,
    state,
    city,
    zipPostalCode,
  } = defaultBusinessAddress;

  useEffect(() => {
    if (checked && !open) toggle();
    if (!checked && open) toggle();
  }, [radio]);

  return (
    <div className="rounded-[20px] bg-surface-100">
      <SectionContentLayout>
        <div className="flex w-full flex-col gap-[20px] py-[10px]">
          <div className="col-span-full flex items-center gap-[10px] md:gap-[30px]">
            <input
              className="h-[18px] w-[18px] flex-shrink-0 rounded-[2px] accent-primary-600 hover:accent-primary-600 ltr:mr-3 rtl:ml-3"
              name="businessAddress"
              type="radio"
              value={BILLING_ADDRESS_OPTIONS[0]}
              aria-label="Default Billing Address"
              checked={checked}
              onChange={handleRadioChange}
            />
            <h4 className="title-md md:title-lg text-gray-700">
              Default Business Address
            </h4>
            <div className="flex flex-grow justify-end">
              <AccordionButton {...{ open, toggle }} />
            </div>
          </div>
          {open && (
            <div className="flex w-full flex-col gap-[1px]">
              <span className="body-lg text-neutral-700">
                {`${countryCode} ${phoneNumber}`}
              </span>
              <span className="body-lg text-neutral-700">{email}</span>
              <span className="body-lg text-neutral-700">
                {address} <br />
                {`${city}, ${parseStateCode(
                  state,
                  country,
                )}, ${parseCountryCode(country)}, ${zipPostalCode}`}
              </span>
            </div>
          )}
        </div>
      </SectionContentLayout>
    </div>
  );
};

type CustomBusinessAddressRadioProps = {
  radio: BillingAddressChoicesType;
  handleRadioChange: (e: ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
};

const CustomBusinessAddressRadio = ({
  radio,
  handleRadioChange,
  children,
}: CustomBusinessAddressRadioProps) => {
  const checked = radio === BILLING_ADDRESS_OPTIONS[1];
  const { open, toggle } = useAccordion(checked);

  useEffect(() => {
    if (checked && !open) toggle();
    if (!checked && open) toggle();
  }, [radio]);

  return (
    <div className="rounded-[20px] bg-surface-100">
      <SectionContentLayout>
        <div className="flex w-full flex-col gap-[40px] py-[10px]">
          <div className="col-span-full flex items-center gap-[10px] md:gap-[30px]">
            <input
              className="h-[18px] w-[18px] flex-shrink-0 rounded-[2px] accent-primary-600 hover:accent-primary-600 ltr:mr-3 rtl:ml-3"
              name="businessAddress"
              type="radio"
              value={BILLING_ADDRESS_OPTIONS[1]}
              aria-label="Custom Business Address"
              checked={checked}
              onChange={handleRadioChange}
            />
            <h4 className="title-md md:title-lg text-gray-700">
              Custom Business Address
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
    </div>
  );
};

export default AdditionalInformation;
