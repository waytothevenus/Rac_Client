/* eslint-disable @next/next/no-img-element */
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Add,
  ArrowCircleLeft2,
  ArrowCircleRight,
  ArrowCircleRight2,
  ConvertCard,
  Eye,
  InfoCircle,
} from "iconsax-react";
import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  type SubmitHandler,
  FieldError,
} from "react-hook-form";
import { Tooltip } from "react-tooltip";
import { z } from "zod";
import { formatCurrency } from "~/Utils";
import { BackButton } from "~/components/Buttons/BackButton";
import { DeleteButtonIcon } from "~/components/Buttons/DeleteButtonIcon";
import { DeleteItemButton } from "~/components/Buttons/DeleteItemButton";
import { DoneButton } from "~/components/Buttons/DoneButton";
import { ProceedButton } from "~/components/Buttons/ProceedButton";
import { SaveAsDraftButton } from "~/components/Buttons/SaveAsDraftButton";
import LabelId from "~/components/LabelId";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  ORIGINS,
  STORES,
} from "~/constants";
import { useAuthContext } from "~/contexts/AuthContext";
import { useNavContext } from "~/contexts/NavigationContext";
import { useShopContext } from "~/contexts/ShopContext";
import { useTabContext } from "~/contexts/TabContext";
import useAccordion from "~/hooks/useAccordion";
import useImageHandler from "~/hooks/useImageHandler";
import useMultiStepForm from "~/hooks/useMultistepForm";
import useSubmitShopRequest from "~/hooks/useSubmitShopRequest";
import tailmater from "~/js/tailmater";
import { CancelButton } from "../../Buttons/CancelButton";
import NeedHelpFAB from "../../Buttons/NeedHelpFAB";
import AccordionButton from "../../Forms/AccordionButton";
import CurrencyInput from "../../Forms/Inputs/CurrencyInput";
import FileInput from "../../Forms/Inputs/FileInput";
import QuantityInput from "../../Forms/Inputs/QuantityInput";
import SelectInput from "../../Forms/Inputs/SelectInput";
import TextAreaInput from "../../Forms/Inputs/TextAreaInput";
import TextInput from "../../Forms/Inputs/TextInput";
import { DetailSection } from "../Orders/InitiateShipping";
import { TotalCost } from "./RequestCheckout";
import { type ModalCloseType } from "./RequestsPanel";

export const schema = z
  .object({
    requestPackage: z
      .object({
        originWarehouse: z
          .string()
          .min(1, { message: "Origin is required" })
          .default(""),
        items: z
          .array(
            z.object({
              store: z
                .string()
                .min(1, { message: "Store is required" })
                .default(""),
              urgent: z.coerce.number().default(0),
              url: z
                .string()
                .min(1, { message: "URL is required" })
                .default(""),
              name: z
                .string()
                .min(1, { message: "Name is required" })
                .default(""),
              originalCost: z.number(),
              quantity: z.number(),
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
                .min(1, { message: "Description is required" })
                .default(""),
              relatedCosts: z.object({
                shippingToOriginWarehouseCost: z.number().default(1),
              }),
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

export type ShopInputs = z.infer<typeof schema>;

const emptyValue: ShopInputs = {
  requestPackage: {
    originWarehouse: "",
    items: [
      {
        store: "",
        urgent: 0,
        url: "",
        name: "",
        originalCost: 1,
        quantity: 1,
        relatedCosts: {
          shippingToOriginWarehouseCost: 1,
        },
        image: null,
        description: "",
      },
    ],
  },
};

const RequestOrderForm = () => {
  const { user } = useAuthContext();

  if (!user) return;

  const { isPending, error, mutateAsync } = useSubmitShopRequest(user.jwt); // todo: add snackbar for success and error

  const { step, next, isFirstStep, isLastStep, isSecondToLastStep } =
    useMultiStepForm([<RequestOrderStep1 />, <RequestOrderStep2 />]);

  const { handleRequests, handleLocalDraft } = useShopContext();
  const { handleTabChange, handleActiveAction } = useTabContext();

  const formMethods = useForm<ShopInputs>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: emptyValue,
  });

  const [requestId, setRequestId] = useState("");

  const onSubmit: SubmitHandler<ShopInputs> = async (data) => {
    console.log("onSubmit", data);
    if (isSecondToLastStep) {
      console.log("submitting user package...");
      try {
        const res = await mutateAsync(data.requestPackage);
        console.log(res);
        setRequestId(res.data.requestId);
      } catch (err) {
        console.log(err);
        return;
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
    console.log(formMethods.getValues());
    handleLocalDraft(formMethods.getValues());
  };

  return (
    <FormProvider {...formMethods}>
      <div className="flex flex-col gap-[30px] rounded-[20px] bg-white p-[20px] md:p-[30px]">
        <RequestFormHeader title="Requesting For New Shop For Me Service" />

        {isLastStep && (
          <SectionContentLayout>
            <LabelId label="Request ID" id={requestId} center />
          </SectionContentLayout>
        )}

        {step}

        {isFirstStep &&
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
                    onClick={() => {
                      console.log(
                        "hello cona",
                        // formMethods.handleSubmit(onSubmit),
                      );
                    }}
                  />
                  bhlkahflkajd;lkfja;lkdjf;alkjf;la
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

export const RequestOrderStep1 = () => {
  const { control } = useFormContext<ShopInputs>();
  const { fields, append, remove } = useFieldArray<ShopInputs>({
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
      <ImportantNotice />
      <SelectWarehouseOriginSection />
      <SectionHeader title="Fill in the Items details" />
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

export const RequestOrderStep2 = () => {
  return (
    <>
      <div className="flex flex-col-reverse gap-[10px] rounded-[20px] bg-primary-600 px-[14px] py-[10px] md:flex-row">
        <img
          src="/images/drone_flying_with_package.png"
          alt="drone flying with package"
        />
        <div className="flex flex-col justify-center gap-[10px] text-white">
          <span className="headline-md font-bold">Congratulations!</span>
          <span className="headline-md">
            You have just successfully requested for shop for me service.
          </span>
        </div>
      </div>
      <SectionHeader title="What next?" />
      <SectionContentLayout>
        <div className="flex flex-col gap-[10px]">
          <h3 className="title-lg font-bold text-neutral-900">
            Do the following to process your Order
          </h3>
          <ul className="flex flex-col gap-[13px]">
            <li className="flex items-center gap-[26px]">
              <span className="rounded-[20px] bg-primary-600 p-[10px] text-white">
                1
              </span>
              <span className="title-lg text-neutral-900">
                Kindly note that we will review the details of the items that
                you provided and make changes to the them if they don&apos;t
                tally with the ones we verify from store.
              </span>
            </li>
            <hr className="block w-full border-gray-500 md:hidden" />
            <li className="flex items-center gap-[26px]">
              <span className="rounded-[20px] bg-primary-600 p-[10px] text-white">
                2
              </span>
              <span className="title-lg text-neutral-900">
                You will then be requested to confirm and pay for the
                procurement cost only to place an order.
              </span>
            </li>
            <hr className="block w-full border-gray-500 md:hidden" />
            <li className="flex items-center gap-[26px]">
              <span className="rounded-[20px] bg-primary-600 p-[10px] text-white">
                3
              </span>
              <span className="title-lg text-neutral-900">
                To begin import processing for your procured items, you will be
                sent a quote containing the shipping cost to Nigeria only when
                we have purchased and brought the procured items to the Origin
                warehouse You selected.
              </span>
            </li>
            <hr className="block w-full border-gray-500 md:hidden" />
            <li className="flex items-center gap-[26px]">
              <span className="rounded-[20px] bg-primary-600 p-[10px] text-white">
                4
              </span>
              <span className="title-lg text-neutral-900">
                And finally, you will be paying for the shipping cost when the
                package gets to our office in Nigeria (you could inform us about
                the one closest to you)
              </span>
            </li>
          </ul>
        </div>
      </SectionContentLayout>
    </>
  );
};

type RequestFormHeaderProps = { title: string; draft?: boolean };

export const RequestFormHeader = ({
  title,
  draft = false,
}: RequestFormHeaderProps) => {
  return (
    <div className="rounded-[20px] border-[1px] border-dashed border-primary-600 px-[30px] py-[20px] text-primary-600">
      <h2 className="headline-md">
        {draft && <span className="text-error-600">Draft - </span>}
        {title}
      </h2>
    </div>
  );
};

const ImportantNotice = () => {
  return (
    <div className="flex flex-col gap-[20px] rounded-[20px] bg-error-200 px-[28px] py-[20px]">
      <span className="label-lg text-primary-900">IMPORTANT NOTICE:</span>
      <p className="body-md ml-6 list-item text-gray-700">
        Even though you will be paying for your <b>shipping cost</b> when your
        items arrive our office in Nigeria, you will be required to pay for the{" "}
        <b>procurement/shop for me cost</b> for your items before we process
        your order.
      </p>
    </div>
  );
};

type SectionHeaderProps = { title: string; hr?: boolean };

export const SectionHeader = ({ title, hr = false }: SectionHeaderProps) => {
  return (
    <div className="flex items-start gap-[10px] md:items-center">
      <ArrowCircleRight variant="Bold" className="text-secondary-900" />
      <div className="flex h-full w-full flex-col justify-center gap-[10px]">
        <h3 className="label-lg font-medium text-secondary-900">{title}</h3>
        {hr && <hr className="hidden w-full border-gray-500 md:block" />}
      </div>
    </div>
  );
};

export const SelectWarehouseOriginSection = () => {
  const { register } = useFormContext<ShopInputs>();

  return (
    <>
      <SectionHeader
        title="Tell us where your package will be shipped from"
        hr
      />
      <div className="flex items-center gap-[10px] md:pl-[34px]">
        <SelectInput
          id={"originWarehouse"}
          label={"Origin Warehouse"}
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
        <TooltipButton label="" position="left-start" />
      </div>
    </>
  );
};

type TooltipButtonProps = {
  label: ReactNode;
  position: "right-start" | "left-start";
};

export const TooltipButton = ({ label, position }: TooltipButtonProps) => {
  const id = useId();

  return (
    <>
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        <div
          role="tooltip"
          data-tooltip-id={id}
          data-tooltip-place={position}
          className="flex h-[24px] w-[24px] items-center justify-center rounded-[6.25rem] hover:bg-surface-300 focus:bg-surface-400"
        >
          <InfoCircle className="text-neutral-500" />
        </div>
      }

      <Tooltip id={id} children={label} noArrow />
    </>
  );
};

export type ItemDetailsSectionProps = {
  index: number;
  expanded?: boolean;
  handleRemoveItem: () => void;
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
  } = useFormContext<ShopInputs>();
  const { open, toggle } = useAccordion(expanded);

  const emptyImage = {
    name: "No file chosen",
    base64: "https://placehold.co/500x500/cac4d0/1d192b?text=No%20Image",
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
              <div className="hidden md:block">
                <PreviewItemButton index={index} image={image.base64} />
              </div>
              <div className="flex flex-grow justify-end">
                <AccordionButton {...{ open, toggle }} />
              </div>
            </div>

            {open && (
              <div className="grid w-full grid-cols-1 gap-[30px] md:grid-cols-12">
                <div className="col-span-full flex items-center gap-[10px] md:col-span-8">
                  <SelectInput
                    id={`store-${index}`}
                    label={"Store"}
                    options={
                      <>
                        <option value="" disabled hidden>
                          Select a Store
                        </option>
                        {STORES.map((store) => {
                          return (
                            <option key={store} value={store}>
                              {store}
                            </option>
                          );
                        })}
                      </>
                    }
                    {...register(`requestPackage.items.${index}.store`)}
                  />
                  <TooltipButton label="" position="left-start" />
                </div>

                <div className="col-span-full flex items-center gap-[10px] md:col-span-4">
                  <SelectInput
                    id={`urgentPurchase-${index}`}
                    label={"Urgent Purchase"}
                    options={
                      <>
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </>
                    }
                    {...register(`requestPackage.items.${index}.urgent`, {
                      valueAsNumber: true,
                    })}
                  />
                  <TooltipButton label="" position="left-start" />
                </div>

                <div className="col-span-full">
                  <TextInput
                    id={`itemUrl-${index}`}
                    label={"Item URL"}
                    {...register(`requestPackage.items.${index}.url`)}
                  />
                </div>

                <div className="col-span-full">
                  <TextInput
                    id={`itemName-${index}`}
                    label={"Item Name"}
                    {...register(`requestPackage.items.${index}.name`)}
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
                  <CurrencyInput
                    id={`shippingCost-${index}`}
                    label={"Total shipping cost to your warehouse & Sales Tax"}
                    {...register(
                      `requestPackage.items.${index}.relatedCosts.shippingToOriginWarehouseCost`,
                      { valueAsNumber: true },
                    )}
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

            {/* mobile version */}
            <div className="flex flex-col gap-[10px] border-t-[0.5px] border-dashed border-t-gray-500 p-[10px] md:hidden">
              <PreviewItemButton index={index} image={image.base64} />
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

type PropertyType = { label: string; value: string };

type AddPropertiesSectionProps = { index: number };

export const AddPropertiesSection = ({
  index = 0,
}: AddPropertiesSectionProps) => {
  // const { setValue } = useFormContext<OrderPackageType>();
  const [properties, setProperties] = useState<PropertyType[]>([]);

  const handleProperties = (newProperties: PropertyType[]) => {
    setProperties((prev) => [...prev, ...newProperties]);
  };

  useEffect(() => {
    // setValue(`requestPackage.items.${index}.properties`, properties);
  }, [properties]);

  return (
    <>
      {properties && <PropertyFields properties={properties} />}
      <AddCustomPropertyButton
        id={`${index + 1}`}
        handleProperties={handleProperties}
        disabled={properties.length >= 1}
      />
    </>
  );
};

type PropertyFieldsProps = { properties: PropertyType[] };

const PropertyFields = ({ properties }: PropertyFieldsProps) => {
  return (
    <>
      {properties.map((property, i) => {
        return (
          <div key={`${property.label}-${i}`} className="w-full md:w-[230px]">
            <TextInput
              key={`property-${i}`}
              id={`property-${i}`}
              label={property.label}
              defaultValue={property.value}
            />
          </div>
        );
      })}
    </>
  );
};

type AddCustomPropertyButtonProps = {
  id: string;
  disabled?: boolean;
  handleProperties: (p: PropertyType[]) => void;
};

const AddCustomPropertyButton = ({
  id,
  disabled,
  handleProperties,
}: AddCustomPropertyButtonProps) => {
  const { activeNav } = useNavContext();
  const nav = activeNav.split(" ").join("-").toLowerCase();
  const modalId = `${nav}-request-order-item-${id}`;
  const dataTarget = `#${modalId}`;

  useEffect(() => {
    tailmater();
  }, []);

  return (
    <div className="w-full md:w-max">
      <AddButton
        title="Add properties"
        dataTarget={dataTarget}
        disabled={disabled}
      />
      <AddPropertiesModal
        modalId={modalId}
        handleProperties={handleProperties}
      />
    </div>
  );
};

type AddPropertiesModalProps = {
  modalId: string;
  handleProperties: AddCustomPropertyButtonProps["handleProperties"];
};

const AddPropertiesModal = ({
  modalId,
  handleProperties,
}: AddPropertiesModalProps) => {
  const dataClose = `#${modalId}`;
  const maxWidth = "max-w-[456px]";

  const { handleSubmit, control } = useForm<{
    properties: PropertyType[];
  }>({
    defaultValues: {
      properties: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "properties",
  });

  const handleAddMore = () => {
    append({ label: "", value: "" });
  };

  const onSubmit: SubmitHandler<{
    properties: PropertyType[];
  }> = async (data) => {
    const filtered = data.properties.filter(
      (property) => property.label.length !== 0,
    );
    handleProperties(filtered);
    remove();
  };

  return (
    <div
      id={modalId}
      className={
        "ease-[cubic-bezier(0, 0, 0, 1)] fixed left-0 top-0 z-50 flex h-0 w-full items-center justify-center overflow-auto p-4 opacity-0 duration-[400ms] md:items-center [&.show]:inset-0 [&.show]:h-full [&.show]:opacity-100"
      }
    >
      <div
        data-close={dataClose}
        className="backDialog fixed z-40 hidden overflow-auto bg-black opacity-50"
      ></div>
      <div
        className={`z-50 flex h-max w-full flex-col gap-[30px] rounded-[20px] bg-surface-300 p-[20px] md:p-[30px] ${maxWidth}`}
      >
        <div className="flex flex-col gap-[16px]">
          <span className="headline-sm">Add properties</span>
          <span className="body-md">
            You want more properties for the products to be procured, give it a
            label (name of the property) like size, color, e.t.c, and optionally
            the description of the property.
          </span>
        </div>

        <div className="flex flex-col gap-[10px]">
          {fields.map((_, i) => {
            return (
              <div key={i} className="flex flex-col gap-[30px]">
                {i !== 0 && <hr className="mt-[20px]" />}

                <Controller
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      id={field.name}
                      label="Property Label"
                      bg="bg-surface-300"
                    />
                  )}
                  name={`properties.${i}.label`}
                  control={control}
                />
                <Controller
                  render={({ field }) => (
                    <TextAreaInput
                      {...field}
                      id={field.name}
                      label="Property Description"
                      bg="bg-surface-300"
                    />
                  )}
                  name={`properties.${i}.value`}
                  control={control}
                />
              </div>
            );
          })}

          {fields.length === 0 && <AddMoreProperties onClick={handleAddMore} />}
        </div>

        <div className="flex flex-row items-end justify-end">
          <div className="flex gap-[8px]">
            <CancelButton dataClose={dataClose} onClick={remove} />
            <AddPropertyButton
              dataClose={dataClose}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

type AddMorePropertiesProps = { onClick: () => void };

const AddMoreProperties = ({ onClick }: AddMorePropertiesProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="title}"
      className="btn relative flex h-[40px] w-max flex-row items-center justify-center gap-x-2 whitespace-nowrap rounded-[20px] px-[16px] py-2.5 text-sm font-medium tracking-[.00714em]"
    >
      <Add variant="Outline" className="text-primary-600" />
      <span className="body-lg text-primary-600">Add more properties</span>
    </button>
  );
};

type AddPropertyButtonProps = ModalCloseType & { onClick: () => void };

const AddPropertyButton = ({ dataClose, onClick }: AddPropertyButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      data-close={dataClose}
      className="btn relative flex w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] bg-primary-600 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white md:px-6"
    >
      <ArrowCircleRight2 size={18} variant="Bold" />
      <span className="label-lg text-white">Proceed</span>
    </button>
  );
};

type SectionContentLayoutProps = { children: ReactNode };

export const SectionContentLayout = ({
  children,
}: SectionContentLayoutProps) => {
  return (
    <div className="flex h-full w-full items-center gap-[20px] rounded-[20px] border-[1px] border-gray-200 px-[24px] py-[20px] md:px-[34px]">
      {children}
    </div>
  );
};

type PreviewItemButtonProps = { index: number; image: string };

const PreviewItemButton = ({ index, image }: PreviewItemButtonProps) => {
  const id = useId().replaceAll(":", "");
  const modalId = `preview-item-${id}`;
  const dataTarget = `#${modalId}`;

  useEffect(() => {
    tailmater();
  }, []);

  return (
    <>
      <button
        aria-label="Preview Item"
        data-type="dialogs"
        data-target={dataTarget}
        className="btn relative flex flex-row items-center justify-center gap-x-2 rounded-[6.25rem] bg-primary-600 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white md:px-6"
      >
        <Eye size={18} variant="Bold" />
        <span>Preview Item</span>
      </button>
      {createPortal(
        <ItemPreview index={index} image={image} modalId={modalId} />,
        document.body,
      )}
    </>
  );
};

type ItemPreviewProps = PreviewItemButtonProps & {
  modalId: string;
};

const ItemPreview = ({ index, image, modalId }: ItemPreviewProps) => {
  const { watch } = useFormContext<ShopInputs>();

  const dataClose = `#${modalId}`;
  // select input can only return string/number
  // urgent returns 0 or 1 that needs to be parsed to boolean
  const urgent = Boolean(watch(`requestPackage.items.${index}.urgent`));

  const urgentPurchaseCost = urgent ? 999 : 0; // todo: get this from server
  const processingFee = 999; // todo: get this from server

  return (
    <div
      id={modalId}
      className="ease-[cubic-bezier(0, 0, 0, 1)] fixed left-0 top-0 z-50 flex h-0 w-full justify-center overflow-auto p-4 opacity-0 duration-[400ms] md:items-center  [&.show]:inset-0 [&.show]:h-full [&.show]:opacity-100"
    >
      <div
        data-close={dataClose}
        className="backDialog fixed z-40 hidden overflow-auto bg-black opacity-50"
      ></div>
      <div className="z-50 flex h-max w-full max-w-[900px] flex-col gap-[30px] rounded-[20px] bg-surface-300 p-[20px] md:p-[30px]">
        <RequestFormHeader title="Item Preview" />
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2">
          <div className="col-span-1 flex flex-col gap-[30px] text-2xl font-normal text-gray-900">
            <img
              src={image}
              alt="preview image"
              className="aspect-square rounded-[20px] bg-center object-cover"
            />
            <div className="flex flex-col px-[14px]">
              <label htmlFor="item-name" className="body-md text-neutral-700">
                Item Name:
              </label>
              <span id="item-name" className="title-lg text-neutral-900">
                {watch(`requestPackage.items.${index}.name`)}
              </span>
            </div>
          </div>

          <div className="col-span-1 flex flex-col gap-[10px] text-sm leading-5 tracking-[0.25px]">
            <ItemPreviewDetails index={index} />

            <div className="flex flex-col gap-[20px] rounded-[20px] bg-secondary-600 px-[24px] py-[20px] text-primary-10">
              <span className="title-lg">Shop For Me Costs</span>
              <div className="flex flex-col gap-[10px]">
                <div className="flex justify-between">
                  <span>Urgent Purchase Cost:</span>
                  <span>{formatCurrency(urgentPurchaseCost)}</span>
                </div>
                <hr className="bg-gray-200" />
                <div className="flex justify-between">
                  <span>Cost of Item from Store</span>
                  <span>
                    {formatCurrency(
                      watch(`requestPackage.items.${index}.originalCost`),
                    )}
                  </span>
                </div>
                <hr className="bg-gray-200" />
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span>{formatCurrency(processingFee)}</span>
                </div>
                <hr className="bg-gray-200" />
              </div>
              <TotalCost
                total={
                  urgentPurchaseCost +
                  watch(`requestPackage.items.${index}.originalCost`) +
                  processingFee
                }
              />
            </div>
          </div>

          <div className="col-span-1 md:col-start-2">
            <button
              aria-label="Back"
              data-close={dataClose}
              className="btn relative flex h-[40px] w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] bg-primary-600 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white md:px-6"
            >
              <ArrowCircleLeft2 variant="Bold" />
              <span className="label-lg text-white">Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

type ItemPreviewDetailsProps = { index: number };

const ItemPreviewDetails = ({ index }: ItemPreviewDetailsProps) => {
  const { watch } = useFormContext<ShopInputs>();

  return (
    <div className="flex flex-col gap-[10px] overflow-y-auto rounded-[10px] bg-surface-500 px-[20px] py-[20px] md:max-h-[250px] md:gap-[20px] md:px-[24px] ">
      <DetailSection
        label="Item Quantity"
        value={watch(`requestPackage.items.${index}.quantity`)}
      />
      <DetailSection
        label="Country Of Purchase"
        value={watch(`requestPackage.originWarehouse`)}
      />
      <DetailSection
        label="Item Link"
        value={
          <span className="title-md md:title-lg text-error-600 underline">
            {watch(`requestPackage.items.${index}.url`)}
          </span>
        }
      />
      <DetailSection
        label="Cost of item from Store"
        value={formatCurrency(
          watch(`requestPackage.items.${index}.originalCost`),
        )}
      />
      <DetailSection
        label="Store"
        value={watch(`requestPackage.items.${index}.store`)}
      />
      {/* <DetailSection label="Length" value="76in" />
      <DetailSection label="Width" value="89in" />
      <DetailSection label="Height" value="89in" /> */}
      <DetailSection
        label="Total Shipping Cost to your Warehouse & Sales Tax"
        labelMaxWidth="max-w-[210px]"
        value={formatCurrency(
          watch(
            `requestPackage.items.${index}.relatedCosts.shippingToOriginWarehouseCost`,
          ),
        )}
      />
      <DetailSection
        label="Additional Item Description"
        value={watch(`requestPackage.items.${index}.description`)}
      />
    </div>
  );
};

// todo:
export const ChangeCurrencyButton = () => {
  return (
    <button
      aria-label="change currency"
      className="btn relative flex w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] border border-gray-400 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-primary-100 md:px-6"
    >
      <ConvertCard size={16} variant="Bold" />
      <span className="label-lg">Change Currency</span>
    </button>
  );
};

type AddButtonProps = {
  title: string;
  dataTarget?: string;
  disabled?: boolean;
  onClick?: () => void;
};

export const AddButton = ({
  title,
  dataTarget,
  disabled = false,
  onClick,
}: AddButtonProps) => {
  return (
    <button
      onClick={onClick}
      data-type="dialogs"
      data-target={dataTarget}
      aria-label={title}
      disabled={disabled}
      className="btn relative flex h-14 w-full flex-row items-center justify-center gap-x-2 rounded-[20px] bg-gray-700 px-8 py-2.5 text-sm font-medium tracking-[.00714em] text-white"
    >
      <Add variant="Outline" className="text-gray-200" />
      <span className="body-lg text-neutral-100">{title}</span>
    </button>
  );
};

export default RequestOrderForm;
