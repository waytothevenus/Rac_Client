import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactNode } from "react";
import {
  FieldError,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  type SubmitHandler,
} from "react-hook-form";
import { z } from "zod";
import { parseCountryCode, parseStateCode } from "~/Utils";
import { BackButton } from "~/components/Buttons/BackButton";
import { DeleteButtonIcon } from "~/components/Buttons/DeleteButtonIcon";
import { DeleteItemButton } from "~/components/Buttons/DeleteItemButton";
import { DoneButton } from "~/components/Buttons/DoneButton";
import NeedHelpFAB from "~/components/Buttons/NeedHelpFAB";
import { ProceedButton } from "~/components/Buttons/ProceedButton";
import { SaveAsDraftButton } from "~/components/Buttons/SaveAsDraftButton";
import CongratulationImage from "~/components/CongratulationImage";
import AccordionButton from "~/components/Forms/AccordionButton";
import CurrencyInput from "~/components/Forms/Inputs/CurrencyInput";
import FileInput from "~/components/Forms/Inputs/FileInput";
import QuantityInput from "~/components/Forms/Inputs/QuantityInput";
import SelectInput from "~/components/Forms/Inputs/SelectInput";
import TextAreaInput from "~/components/Forms/Inputs/TextAreaInput";
import TextInput from "~/components/Forms/Inputs/TextInput";
import LabelId from "~/components/LabelId";
import { DetailSection } from "~/components/Shop/Orders/InitiateShipping";
import { StepDescription } from "~/components/Shop/Orders/OrdersPanel";
import { HighlightedInfo } from "~/components/Shop/Requests/RequestDetails";
import {
  AddButton,
  RequestFormHeader,
  SectionContentLayout,
  SectionHeader,
  TooltipButton,
  type ItemDetailsSectionProps,
} from "~/components/Shop/Requests/RequestOrder";
import {
  ACCEPTED_IMAGE_TYPES,
  COURIERS,
  ID_TYPE,
  ITEM_DELIVERY_STATUS,
  MAX_FILE_SIZE,
  ORIGINS,
  PACKAGE_DELIVERY_STATUS,
  WAREHOUSE_LOCATIONS,
} from "~/constants";
import { useAuthContext } from "~/contexts/AuthContext";
import { useImportContext } from "~/contexts/ImportContext";
import { useTabContext } from "~/contexts/TabContext";
import useAccordion from "~/hooks/useAccordion";
import useImageHandler from "~/hooks/useImageHandler";
import useMultiStepForm from "~/hooks/useMultistepForm";
import useSubmitImportRequest from "~/hooks/useSubmitImportRequest";

export const schema = z
  .object({
    requestPackage: z
      .object({
        originWarehouse: z.string().min(1, "Required").default(""),
        deliveryStatus: z.string().min(1, "Required").default(""),
        items: z
          .array(
            z.object({
              name: z.string().min(1, { message: "Required" }).default(""),
              idType: z.string().min(1, { message: "Required" }).default(""),
              idNumber: z.string().min(1, { message: "Required" }).default(""),
              deliveryStatus: z.string().min(1, "Required").default(""),
              deliveredBy: z
                .string()
                .min(1, { message: "Required" })
                .default(""),
              originalCost: z.number().default(1),
              quantity: z.number().default(1),
              image: z
                .custom<FileList>()
                .nullable()
                .default(null)
                .refine(
                  (files) => files instanceof FileList && files.length > 0,
                  "Image is required.",
                )
                .refine(
                  (files) =>
                    files instanceof FileList &&
                    files[0] !== undefined &&
                    files[0].size <= MAX_FILE_SIZE,
                  `Max file size is ${new Intl.NumberFormat("en", {
                    style: "unit",
                    unit: "megabyte",
                  }).format(MAX_FILE_SIZE / 1024 / 1024)}.`,
                )
                .refine(
                  (files) =>
                    files instanceof FileList &&
                    files[0] !== undefined &&
                    ACCEPTED_IMAGE_TYPES.includes(files[0].type),
                  "only .jpg, .jpeg, .png and .webp files are accepted.",
                ),
              description: z
                .string()
                .min(1, { message: "Required" })
                .default(""),
              // properties: z.array(
              //   z.object({
              //     label: z.string().min(1, "Required"),
              //     value: z.string().min(1, "Required"),
              //   }),
              // ),
            }),
          )
          .default([]),
      })
      .default({}),
  })
  .default({});

export type ImportInputs = z.infer<typeof schema>;

export const emptyValue: ImportInputs = {
  requestPackage: {
    originWarehouse: "",
    deliveryStatus: "",
    items: [
      {
        name: "",
        idType: "",
        idNumber: "",
        deliveryStatus: "",
        deliveredBy: "",
        originalCost: 1,
        quantity: 1,
        image: null,
        description: "",
      },
    ],
  },
};

const RequestOrder = () => {
  const { user } = useAuthContext();

  if (!user) return;

  const { isPending, error, mutateAsync } = useSubmitImportRequest(user.jwt); // todo: add snackbar for success and error

  const { step, next, isFirstStep, isLastStep, isSecondToLastStep, goTo } =
    useMultiStepForm([<Step1 />, <Step2 />, <Step3 />]);

  const { handleRequests, handleLocalDraft } = useImportContext();
  const { handleActiveAction, handleTabChange } = useTabContext();

  const formMethods = useForm<ImportInputs>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: emptyValue,
  });

  const [requestId, setRequestId] = useState("");

  const onSubmit: SubmitHandler<ImportInputs> = async (data) => {
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
        <RequestFormHeader title="Requesting For New Import Order" />

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
          <>
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
          </>
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
                  <ProceedButton
                    onClick={formMethods.handleSubmit(onSubmit)}
                    disabled={!formMethods.formState.isValid}
                  />
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

export const Step1 = () => {
  return (
    <>
      <SectionHeader
        title="Tell us where your package will be shipped from"
        hr
      />
      <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 md:pl-[34px]">
        <SelectOrigin />
        <SelectPackageDeliveryStatus />
      </div>
    </>
  );
};

export const Step2 = () => {
  const { control } = useFormContext<ImportInputs>();
  const { fields, append, remove } = useFieldArray<ImportInputs>({
    control,
    name: "requestPackage.items",
  });

  const handleAddMore = () => {
    append(emptyValue.requestPackage.items);
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <>
      <Step1 />

      <SectionHeader title="describe your package" />
      <div className="flex flex-col gap-[20px]">
        {fields.map((field, i) => {
          return (
            <ItemDetailsSection
              key={field.id}
              index={i}
              handleRemoveItem={() => handleRemove(i)}
              expanded
            />
          );
        })}
      </div>
      <div className="w-max">
        <AddButton title="Add Item" onClick={handleAddMore} />
      </div>
    </>
  );
};

const ItemDetailsSection = ({
  index,
  expanded = false,
  handleRemoveItem,
}: ItemDetailsSectionProps) => {
  const {
    formState: { errors },
    register,
    getValues,
    setValue,
  } = useFormContext<ImportInputs>();
  const { open, toggle } = useAccordion(expanded);

  const emptyImage = {
    name: "No file chosen",
    base64: "https://placehold.co/500x500/cac4d0/1d192b?text=Image",
  };

  const { image, handleImageChange } = useImageHandler(emptyImage);

  const imageError = errors.requestPackage?.items?.[index]?.image as
    | (FieldError & { message: string })
    | undefined;

  return (
    <>
      <div className="flex items-center gap-[10px]">
        <SectionContentLayout>
          <div className="flex w-full flex-col gap-[30px]">
            <div className="col-span-full flex items-center gap-[30px]">
              <h4 className="title-md md:title-lg text-gray-700">
                Item - <span className="text-primary-600">#{index + 1}</span>
              </h4>
              <div className="flex flex-grow justify-end">
                <AccordionButton {...{ open, toggle }} />
              </div>
            </div>

            {open && (
              <div className="grid w-full grid-cols-1 gap-[30px] md:grid-cols-12">
                <div className="col-span-full">
                  <TextInput
                    id={`itemName-${index}`}
                    label={"Item Name"}
                    {...register(`requestPackage.items.${index}.name`)}
                  />
                </div>

                <div className="col-span-full flex items-center gap-[10px] md:col-span-6">
                  <SelectInput
                    id={`idType-${index}`}
                    label={"ID Type"}
                    options={
                      <>
                        <option value="" disabled hidden>
                          Select type of ID
                        </option>

                        {ID_TYPE.map((idType) => {
                          return (
                            <option key={idType} value={idType}>
                              {idType}
                            </option>
                          );
                        })}
                      </>
                    }
                    {...register(`requestPackage.items.${index}.idType`)}
                  />
                  <TooltipButton
                    label="What ID Type can we see attached to the package for easy recoginition"
                    position="left-start"
                  />
                </div>

                <div className="col-span-full flex items-center gap-[10px] md:col-span-6 ">
                  <TextInput
                    id={`idNumber-${index}`}
                    label={"ID Number"}
                    {...register(`requestPackage.items.${index}.idNumber`)}
                  />
                  <TooltipButton
                    label="The ID Number that Corresponds to the one you selected"
                    position="left-start"
                  />
                </div>

                <div className="col-span-full flex items-center gap-[10px]">
                  <SelectInput
                    id={`itemDeliveryStatus-${index}`}
                    label={"Item Delivery Status"}
                    options={
                      <>
                        <option value="" disabled hidden>
                          Select delivery status
                        </option>

                        {ITEM_DELIVERY_STATUS.map((itemDeliveryStatus) => {
                          return (
                            <option
                              key={itemDeliveryStatus}
                              value={itemDeliveryStatus}
                            >
                              {itemDeliveryStatus}
                            </option>
                          );
                        })}
                      </>
                    }
                    {...register(
                      `requestPackage.items.${index}.deliveryStatus`,
                    )}
                  />
                  <TooltipButton
                    label="Let us know if you have dropped this particular items at the Package Origin you selected"
                    position="left-start"
                  />
                </div>

                <div className="col-span-full flex items-center gap-[10px]">
                  <SelectInput
                    id={`deliveredBy-${index}`}
                    label={"Delivered By"}
                    options={
                      <>
                        <option value="" disabled hidden>
                          Select Courier
                        </option>

                        {COURIERS.map((courier) => {
                          return (
                            <option key={courier} value={courier}>
                              {courier}
                            </option>
                          );
                        })}
                      </>
                    }
                    {...register(`requestPackage.items.${index}.deliveredBy`)}
                  />
                  <TooltipButton
                    label="Let us know who delivered this item to the Package Origin you selected above"
                    position="left-start"
                  />
                </div>

                <div className="col-span-full md:col-span-8">
                  <CurrencyInput
                    id={`itemOriginalCost-${index}`}
                    label={"Item Original Cost"}
                    {...register(`requestPackage.items.${index}.originalCost`, {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <div className="col-span-full md:col-span-4">
                  <QuantityInput
                    id={`quantity-${index}`}
                    label={"Quantity"}
                    {...register(`requestPackage.items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    handleAdd={() => {
                      const prev =
                        getValues(`requestPackage.items.${index}.quantity`) ??
                        0;
                      const value = prev + 1;
                      setValue(`requestPackage.items.${index}.quantity`, value);
                    }}
                    handleSubtract={() => {
                      const prev =
                        getValues(`requestPackage.items.${index}.quantity`) ??
                        0;
                      if (prev <= 1) return;
                      const value = prev - 1;
                      setValue(`requestPackage.items.${index}.quantity`, value);
                    }}
                  />
                </div>

                <div className="col-span-full">
                  <FileInput
                    id={`itemPicture-${index}`}
                    label={"Upload Item Picture"}
                    fileName={image.name}
                    {...register(`requestPackage.items.${index}.image`, {
                      onChange: handleImageChange,
                    })}
                    errorMessage={imageError?.message}
                  />
                </div>

                <div className="col-span-full">
                  <TextAreaInput
                    id={`additionalItemDescription-${index}`}
                    label={"Additional Item Description"}
                    {...register(`requestPackage.items.${index}.description`)}
                  />
                </div>

                {/* <div className="col-span-full flex flex-col gap-[30px]">
                  <SectionHeader
                    title="Describe the item you wish to purchase with further custom properties"
                    hr
                  />
                  <div className="flex flex-col flex-wrap items-center gap-[30px] px-[10px] md:flex-row md:pl-[34px]">
                    <AddPropertiesSection index={index} />
                  </div>
                </div> */}
              </div>
            )}

            <div className="flex flex-col gap-[10px] border-t-[0.5px] border-dashed border-t-gray-500 p-[10px] md:hidden">
              <DeleteItemButton onClick={handleRemoveItem} />
            </div>
          </div>
        </SectionContentLayout>
        <div className="hidden md:block">
          <DeleteButtonIcon onClick={handleRemoveItem} />
        </div>
      </div>
    </>
  );
};

export type DeliveryStatusMapType = Record<
  (typeof PACKAGE_DELIVERY_STATUS)[number],
  { imageText: JSX.Element; whatNext: JSX.Element }
>;

export const Step3 = () => {
  const { getValues } = useFormContext<ImportInputs>();

  const deliveryStatusMap: DeliveryStatusMapType = {
    "None delivered": {
      imageText: (
        <CongratulationImage
          title="OOPS... You can't request for an Import order yet"
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
            description="Once you are sure that this package has gotten to the warehouse address above, attempt requesting for a new import order and provide us information we need to Identify the package as yours."
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
                    while requesting for the Import order on our website
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
        <CongratulationImage description="You have just successfully requested for Import service." />
      ),
      whatNext: <Instructions />,
    },
    "Some delivered": {
      imageText: (
        <CongratulationImage
          title="OOPS... You can't request for an Import order yet"
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
                these items and submit your request for a new import order
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
                    while requesting for the Import order on our website
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

type OfficeDeliverAddressProps = {
  officeLocation: (typeof WAREHOUSE_LOCATIONS)[(typeof ORIGINS)[number]];
};

export const OfficeDeliverAddress = ({
  officeLocation,
}: OfficeDeliverAddressProps) => {
  const { open, toggle } = useAccordion(true);
  const { address, country, state, city, zipPostalCode } = officeLocation;

  return (
    <SectionContentLayout>
      <div className="flex w-full flex-col gap-[20px] py-[10px]">
        <div className="flex w-full items-center gap-[30px]">
          <h4 className="title-md md:title-lg text-gray-700">
            Our office address to deliver your package
          </h4>
          <div className="flex flex-grow justify-end">
            <AccordionButton {...{ open, toggle }} />
          </div>
        </div>

        {open && (
          <div className="grid w-full grid-cols-1 gap-[20px] md:grid-cols-10">
            <DetailSection label="Address" value={address} />
            <DetailSection
              label="Country"
              value={parseCountryCode(country)}
              colSpanMobile={1}
              colSpanDesktop={2}
            />
            <DetailSection
              label="State"
              value={parseStateCode(state, country)}
              colSpanMobile={1}
              colSpanDesktop={2}
            />
            <DetailSection
              label="City"
              value={city}
              colSpanMobile={1}
              colSpanDesktop={2}
            />
            <DetailSection
              label="Zip/postal Code"
              value={zipPostalCode}
              colSpanMobile={1}
              colSpanDesktop={2}
            />
          </div>
        )}
      </div>
    </SectionContentLayout>
  );
};

export type InstructionsMapType = { content: string | JSX.Element };

const Instructions = () => {
  const instructionsMap: InstructionsMapType[] = [
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
        "Additionally, you will just agree with the shipping cost to allow us process your Order, You will be paying for the shipment Cost when upon arrival/clearing of your package.",
    },
    {
      content:
        "And finally, you will be paying for the shipping cost when the package gets to our office in Nigeria (you would inform us about the one closest to you in the coming shipping stages",
    },
  ];

  return (
    <div className="flex flex-col gap-[20px]">
      <span className="title-md md:title-lg pl-[11px] font-medium text-neutral-700 md:pl-[14px] md:font-bold">
        Here is how to pick your package up from our office
      </span>
      <ul className="flex flex-col gap-[14px]">
        {instructionsMap.map((item, i) => (
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

type GuidelinesProps = { children: ReactNode };

export const Guidelines = ({ children }: GuidelinesProps) => {
  return (
    <div className="flex flex-col gap-[20px]">
      <span className="title-md md:title-lg pl-[11px] font-medium text-neutral-700 md:pl-[14px] md:font-bold">
        Here are some guidelines for you
      </span>
      <ul className="flex flex-col gap-[14px]">{children}</ul>
    </div>
  );
};

const SelectOrigin = () => {
  const { register } = useFormContext<ImportInputs>();

  return (
    <div className="flex items-center gap-[10px]">
      <SelectInput
        id={"origin"}
        label={"Origin"}
        options={
          <>
            <option value="" disabled hidden>
              Select Origin
            </option>

            {ORIGINS.map((origin) => {
              return (
                <option key={origin} value={origin}>
                  {origin}
                </option>
              );
            })}
          </>
        }
        {...register("requestPackage.originWarehouse")}
      />
      <TooltipButton
        label="This is the location you want your package to be imported from."
        position="left-start"
      />
    </div>
  );
};

const SelectPackageDeliveryStatus = () => {
  const { register } = useFormContext<ImportInputs>();

  return (
    <div className="flex items-center gap-[10px]">
      <SelectInput
        id={"packageDeliveryStatus"}
        label={"Package Delivery Status"}
        options={
          <>
            <option value="" disabled hidden>
              Select a Delivery Status
            </option>

            {PACKAGE_DELIVERY_STATUS.map((deliveryStatus) => {
              return (
                <option key={deliveryStatus} value={deliveryStatus}>
                  {deliveryStatus}
                </option>
              );
            })}
          </>
        }
        {...register("requestPackage.deliveryStatus")}
      />
      <TooltipButton
        label="Let us know if you have dropped Some/All/None of your package items at the Package Origin you selected"
        position="left-start"
      />
    </div>
  );
};

export default RequestOrder;
