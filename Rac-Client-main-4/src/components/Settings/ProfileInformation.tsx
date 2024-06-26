/* eslint-disable @next/next/no-img-element */
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowCircleRight2, Call, Edit, Google, Location } from "iconsax-react";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { parseCountryCode, parseStateCode } from "~/Utils";
import { useAuthContext } from "~/contexts/AuthContext";
import TabContextProvider, {
  useTabContext,
  type TabType,
} from "~/contexts/TabContext";
import useStatesCities from "~/hooks/useStatesCities";
import useSubmitNewProfile from "~/hooks/useSubmitNewProfile";
import { BackButton } from "../Buttons/BackButton";
import { CloseModalButton } from "../Buttons/CloseModalButton";
import ModalButton from "../Buttons/ModalButton";
import SelectCityInput from "../Forms/Inputs/SelectCityInput";
import SelectCountryInput from "../Forms/Inputs/SelectCountryInput";
import SelectCountryPhoneCodeInput from "../Forms/Inputs/SelectCountryPhoneCodeInput";
import SelectStateInput from "../Forms/Inputs/SelectStateInput";
import TextInput from "../Forms/Inputs/TextInput";
import LabelId from "../LabelId";
import TabContentLayout from "../Layouts/TabContentLayout";
import { LoadingSpinner } from "../LoadingScreen";
import { DetailSection } from "../Shop/Orders/InitiateShipping";
import {
  RequestFormHeader,
  SectionContentLayout,
} from "../Shop/Requests/RequestOrder";
import AccountInformation from "./SubTab/UserInfo/AccountInformation";
import Activities from "./SubTab/UserInfo/Activities";
import AdditionalInformation from "./SubTab/UserInfo/AdditionalInformation";

const schema = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name must be at least 3 characters" })
    .trim(),
  lastName: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters" })
    .trim(),
  country: z.string().min(1, { message: "Required" }),
  state: z.string().min(1, { message: "Required" }),
  city: z.string().min(1, { message: "Required" }),
  address: z.string().min(1, { message: "Required" }).trim(),
  zipPostalCode: z.string().min(1, { message: "Required" }).trim(),
});

export type ProfileInformationInputs = z.infer<typeof schema>;

const emptyValue: ProfileInformationInputs = {
  firstName: "",
  lastName: "",
  address: "",
  country: "",
  state: "",
  city: "",
  zipPostalCode: "",
};

export type SettingsTabContentProps = {
  handleHideTabs: () => void;
};

const ProfileInformation = ({ handleHideTabs }: SettingsTabContentProps) => {
  const { user, refetch } = useAuthContext();

  if (!user) return null;

  const token = user.jwt;

  const { isPending, error, mutateAsync } = useSubmitNewProfile(token); // todo: add snackbar for success and error

  const tabs: [TabType, ...TabType[]] = [
    {
      id: "account information",
      title: "Account information",
      content: <AccountInformation />,
    },
    {
      id: "additional information",
      title: "Additional information",
      content: <AdditionalInformation />,
    },
    { id: "activities", title: "Activities", content: <Activities /> },
  ];

  const { activeTab } = useTabContext();

  const {
    formState: { isValid },
    register,
    watch,
    handleSubmit,
    reset,
  } = useForm<ProfileInformationInputs>({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: emptyValue,
  });
  const { cities, states } = useStatesCities({ watch });

  const onSubmit: SubmitHandler<ProfileInformationInputs> = async (data) => {
    console.log(data);
    try {
      const res = await mutateAsync(data);
      console.log(res);
      await refetch();
    } catch (error) {
      console.log(error);
    } finally {
      reset();
    }
    // todo: add loading state to edit personal info button
  };

  const { address, city, state, country, zipPostalCode } = user.billingDetails;
  const location = `${address}, ${city}, ${parseStateCode(
    state,
    country,
  )}, ${parseCountryCode(country)}, ${zipPostalCode}`;

  return (
    <TabContentLayout>
      <div className="flex max-w-[1094px] flex-col gap-[20px] rounded-[20px] bg-white p-[20px] md:p-[30px]">
        <SectionContentLayout>
          <div className="-mx-[25px] flex w-full flex-grow flex-col gap-[20px] md:-mx-[35px]">
            <div className="-mt-[21px] w-full flex-grow">
              <SectionContentLayout>
                <div className="-m-[10px] w-full flex-grow">
                  <LabelId label="User ID" id={user.racId} center />
                </div>
              </SectionContentLayout>
            </div>

            <div className="grid w-full grid-cols-1 place-items-center items-center gap-[20px] px-[20px] md:grid-cols-12 md:place-items-start">
              <img
                src={`https://placehold.co/400x400/cac4d0/1d192b?text=${user.firstName[0]}&font=roboto`}
                alt="user image"
                className="col-span-full h-[138px] w-[138px] rounded-full border-[12px] border-surface-100 md:col-span-2"
              />

              <div className="col-span-full flex flex-col gap-[10px] text-center md:col-span-4 md:text-start">
                <DetailSection
                  label="First Name"
                  labelHeight="h-[20px]"
                  value={user.firstName}
                />
                <DetailSection
                  label="Last Name"
                  labelHeight="h-[20px]"
                  value={user.lastName}
                />
              </div>

              <div className="col-span-full flex flex-col md:col-span-6">
                <div className="flex flex-col items-center gap-[10px] md:flex-row">
                  <Call color="#292d32" className="m-[12px] flex-shrink-0" />
                  <span className="title-md md:title-lg break-words !font-medium text-neutral-900 md:!font-normal">
                    {`${user.billingDetails.countryCode} ${user.billingDetails.phoneNumber}`}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-[10px] md:flex-row">
                  <Google color="#292d32" className="m-[12px] flex-shrink-0" />
                  <span className="title-md md:title-lg break-words !font-medium text-neutral-900 md:!font-normal">
                    {user.email}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-[10px] md:flex-row">
                  <Location
                    color="#292d32"
                    className="m-[12px] flex-shrink-0"
                  />
                  <span className="title-md md:title-lg break-words !font-medium text-neutral-900 md:!font-normal">
                    {location}
                  </span>
                </div>
              </div>

              <div className="col-span-full w-full md:max-w-[302px]">
                <ModalButton
                  modalId="editPersonalInfo"
                  label="Edit Personal Information"
                  disabled={isPending}
                  buttonClassName="btn relative flex h-[40px] w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] bg-error-600 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white md:px-6"
                  buttonContent={
                    <>
                      {isPending ? (
                        <LoadingSpinner />
                      ) : (
                        <>
                          <Edit
                            size={18}
                            variant="Bold"
                            className="flex-shrink-0"
                          />
                          <span className="label-lg text-white">
                            Edit personal information
                          </span>
                        </>
                      )}
                    </>
                  }
                  footerContent={({ dataClose }) => {
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
                            disabled={!isValid}
                            primary
                          />
                        </div>
                      </div>
                    );
                  }}
                >
                  <RequestFormHeader title="Edit Personal Information" />

                  <div className="grid w-full grid-cols-1 gap-[20px] md:grid-cols-12 md:gap-[30px]">
                    <div className="col-span-full md:col-span-6">
                      <TextInput
                        id={"firstName"}
                        label={"First Name"}
                        bg="bg-surface-300"
                        {...register("firstName")}
                      />
                    </div>

                    <div className="col-span-full md:col-span-6">
                      <TextInput
                        id={"lastName"}
                        label={"Last Name"}
                        bg="bg-surface-300"
                        {...register("lastName")}
                      />
                    </div>

                    <div className="col-span-full opacity-40 md:col-span-5">
                      <TextInput
                        id="email"
                        label="Email"
                        type="email"
                        bg="bg-surface-300"
                        disabled
                      />
                    </div>

                    <div className="col-span-full opacity-40 md:col-span-3">
                      <SelectCountryPhoneCodeInput
                        bg={"bg-surface-300"}
                        disabled
                      />
                    </div>

                    <div className="col-span-full opacity-40 md:col-span-4">
                      <TextInput
                        id="phone-number"
                        label="Phone Number"
                        type="tel"
                        bg="bg-surface-300"
                        disabled
                      />
                    </div>

                    <div className="col-span-full md:col-span-4">
                      <SelectCountryInput
                        bg={"bg-surface-300"}
                        {...register("country")}
                      />
                    </div>

                    <div className="col-span-full md:col-span-4">
                      <SelectStateInput
                        states={states}
                        bg={"bg-surface-300"}
                        {...register("state")}
                      />
                    </div>

                    <div className="col-span-full md:col-span-4">
                      <SelectCityInput
                        cities={cities}
                        bg={"bg-surface-300"}
                        {...register("city")}
                      />
                    </div>

                    <div className="col-span-full">
                      <TextInput
                        id={"street-address"}
                        label={"Street Address"}
                        bg="bg-surface-300"
                        {...register("address")}
                      />
                    </div>

                    <div className="col-span-full">
                      <TextInput
                        id={"zipPostalCode"}
                        label={"Zip Postal Code"}
                        bg="bg-surface-300"
                        {...register("zipPostalCode")}
                      />
                    </div>
                  </div>
                </ModalButton>
              </div>
            </div>
          </div>
        </SectionContentLayout>

        <TabContextProvider tabs={tabs} defaultTabId={"account information"}>
          <SubTabs parentTabId={activeTab} defaultTabId="account information" />
        </TabContextProvider>

        <div className="w-full md:max-w-[169px]">
          <BackButton text="Back to settings" onClick={handleHideTabs} />
        </div>
      </div>
    </TabContentLayout>
  );
};

type SubTabsProps = {
  parentTabId: TabType["id"] | null;
  defaultTabId: TabType["id"];
};

const SubTabs = ({ parentTabId, defaultTabId }: SubTabsProps) => {
  const { activeTab, tabsRef, handleTabChange, tabs } = useTabContext();

  if (!tabs) return;

  const handleRef = (el: HTMLButtonElement) => {
    if (!el) return;
    if (tabsRef.current.length >= 3) tabsRef.current.shift();
    tabsRef.current.push(el);
  };

  useEffect(() => {
    handleTabChange(defaultTabId);
  }, [parentTabId]);

  return (
    <SectionContentLayout>
      <div className="flex w-full flex-grow flex-col gap-[20px]">
        <div className="tabs relative -mx-[25px] -mt-[20px] flex flex-col md:-mx-[34px]">
          <div className="absolute h-[50px] w-full overflow-x-auto overflow-y-hidden rounded-b-[20px] border-b border-b-gray-200 "></div>
          <div className="overflow-x-auto overflow-y-hidden rounded-b-[20px] px-[30px]">
            <div className="relative grid h-[50px] w-full min-w-max grid-cols-3 items-center md:w-max">
              {tabs.map(({ id, title }) => {
                return (
                  <button
                    ref={handleRef}
                    key={`sub-tab-${id.replace(" ", "-")}`}
                    data-type="tabs"
                    data-target={`#sub-panel-${id.replace(" ", "-")}`}
                    className={`flex h-[49px] flex-col items-center justify-center gap-1 whitespace-nowrap px-4 py-2 ${
                      activeTab === id && "active text-primary-600"
                    }`}
                    onClick={() => handleTabChange(id)}
                  >
                    <p className="text-sm font-medium tracking-[.00714em]">
                      {title}
                    </p>
                  </button>
                );
              })}

              <div
                role="indicator"
                className="absolute bottom-0 left-0 ml-[calc(33.3%-25%)] h-0.5 w-[17%] rounded-t-full bg-primary-600 transition-all duration-200 ease-in-out"
              ></div>
            </div>
          </div>
          <SubTabContentPanels />
        </div>
      </div>
    </SectionContentLayout>
  );
};

const SubTabContentPanels = () => {
  const { activeTab, tabs } = useTabContext();

  if (!tabs) return;

  return (
    <div className="-mb-[20px] flex w-full flex-col items-center justify-center p-[10px] md:p-[15px]">
      {tabs.map(({ id, content }) => {
        return (
          <div
            key={`sub-panel-${id.replace(" ", "-")}`}
            id={`sub-panel-${id.replace(" ", "-")}`}
            role="tabpanel"
            className={`duration-400 hidden w-full transition ease-in-out [&.active]:block ${
              id === activeTab && "active"
            }`}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
};

export default ProfileInformation;
