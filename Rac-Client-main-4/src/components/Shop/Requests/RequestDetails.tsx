import { ConvertCard, Security, Wallet } from "iconsax-react";
import { type ReactNode } from "react";
import { formatCurrency, formatDimension, formatWeight } from "~/Utils";
import { PaymentsInformation } from "~/components/AutoImport/Requests/RequestDetails";
import { BackButton } from "~/components/Buttons/BackButton";
import LabelId from "~/components/LabelId";
import { type REQUEST_STATUS } from "~/constants";
import { useShopContext, type ShopItemType } from "~/contexts/ShopContext";
import { useTabContext } from "~/contexts/TabContext";
import useAccordion from "~/hooks/useAccordion";
import AccordionButton from "../../Forms/AccordionButton";
import { NotRespondedStatus, RespondedStatus } from "../Orders";
import { PurpleDetailSection } from "../Orders/ClearPackage";
import { DetailSection } from "../Orders/InitiateShipping";
import {
  RequestFormHeader,
  SectionContentLayout,
  SectionHeader,
  TooltipButton,
} from "./RequestOrder";

const RequestDetails = () => {
  const { requestPackages, shopRequestTotalQuery } = useShopContext();
  const { viewIndex, handleActiveAction } = useTabContext();

  if (viewIndex === null) return;

  const requestPackage = requestPackages?.[viewIndex];

  if (!requestPackage) return;

  const status = requestPackage.requestStatus;

  const handleBack = () => {
    handleActiveAction(null);
  };

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
    <div className="flex flex-col gap-[30px] rounded-[20px] bg-white p-[20px] md:p-[30px]">
      <RequestFormHeader title="Shop For Me Order Request Details" />

      <LabelId label="Request ID" id={requestPackage.requestId} />

      <RequestInformation
        info={{
          date: requestPackage.requestLocalDate.toLocaleString(),
          status,
        }}
      />

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
            <ShopRequestItem key={i} item={item} index={i} status={status} />
          );
        })}
      </div>

      <div className="flex flex-col gap-[10px]">
        <SectionHeader title="Billing Details" />
        <PaymentsInformation>
          <div className="col-span-full">
            <HighlightedInfo
              text={
                status === "Responded" ? (
                  <>
                    The <b className="text-neutral-900">shop for me cost</b>{" "}
                    could have been changed/updated by our staff if they
                    observed differences between the details you provided and
                    the ones we verify from the store. However, we will inform
                    you about it.
                  </>
                ) : (
                  <>
                    The <b className="text-neutral-900">shop for me cost</b>{" "}
                    could be changed/updated by our staff if they observe
                    differences between the details you provided and the ones we
                    verify from the store. However, we will inform you about it.
                  </>
                )
              }
            />
          </div>
          <DetailSection
            label="Total Shipment Cost"
            value="Not yet allocated"
            colSpanDesktop={4}
          />
          <DetailSection
            label="Payment Status"
            value="Unpaid"
            colSpanDesktop={4}
          />
          <DetailSection
            label="Total Shop For Me Cost"
            value={total ? formatCurrency(total) : ""}
            colSpanDesktop={4}
            tooltip={requestPackage.requestStatus === "Responded" ? "" : null}
          />
          <DetailSection
            label="Payment Status"
            value="Unpaid"
            colSpanDesktop={4}
          />
        </PaymentsInformation>
      </div>

      <div className="flex w-max gap-[10px] whitespace-nowrap">
        <BackButton onClick={handleBack} />
        {status === "Responded" && <RedProceedToCheckoutButton />}
      </div>
    </div>
  );
};

export const RedProceedToCheckoutButton = () => {
  const { handleActiveAction, handleTabChange } = useTabContext();

  const handleClick = () => {
    handleTabChange("requests");
    handleActiveAction("proceed to checkout");
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Proceed"
      className="btn relative flex h-[40px] w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] bg-error-600 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white md:px-6"
    >
      <Wallet size={18} variant="Bold" />
      <span className="label-lg text-white">Proceed to checkout</span>
    </button>
  );
};

type ShopRequestItemProps = {
  item: ShopItemType;
  index: number;
  status: (typeof REQUEST_STATUS)[number];
};

export const ShopRequestItem = ({
  item,
  index,
  status,
}: ShopRequestItemProps) => {
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
          <>
            <HighlightedInfo
              text={
                status === "Responded"
                  ? "These details could have been changed/updated by our staffs if they observed differences between the ones you provided and the ones we verified from the store, however we will inform you about it."
                  : "These details could be changed/updated by our staffs if they observe differences between the ones you provided and the ones we verified from the store, however we will inform you about it."
              }
            />
            <div className="grid w-full grid-cols-1 gap-[15px] md:grid-cols-10">
              <ShopRequestItemDetails item={item} status={status} />
              <ShopRequestItemRelatedCosts
                relatedCosts={item.relatedCosts}
                status={status}
              />
            </div>
          </>
        )}
      </div>
    </SectionContentLayout>
  );
};

type ShopRequestItemDetailsProps = {
  item: ShopItemType;
  status: (typeof REQUEST_STATUS)[number];
};

const ShopRequestItemDetails = ({
  item,
  status,
}: ShopRequestItemDetailsProps) => {
  return (
    <>
      <DetailSection label="Store" value={item.store} colSpanDesktop={4} />
      <DetailSection
        label="Urgent Purchase"
        value={item.urgent ? "Yes" : "No"}
        colSpanDesktop={4}
      />
      <DetailSection label="Item URL" value={item.url} />
      <DetailSection
        label="Item Name"
        value={item.name}
        tooltip={
          status === "Responded" ? (
            // todo: refactor to reusable component
            <div className="flex flex-col">
              <span>You provided: xxx</span>
              <span>We verified: xxx</span>
            </div>
          ) : null
        }
        colSpanDesktop={4}
      />
      <DetailSection
        label="Item Cost from Store"
        value={item.originalCost ? formatCurrency(item.originalCost) : ""}
        colSpanDesktop={2}
      />
      <DetailSection
        label="Quantity"
        value={item.quantity}
        colSpanDesktop={3}
      />
      {/* <DetailSection
        label="Weight"
        value={formatWeight(item.weight)}
        tooltip={status === "Responded" ? "" : null}
        colSpanDesktop={2}
      />
      <DetailSection
        label="Height"
        value={formatDimension(item.height)}
        tooltip={status === "Responded" ? "" : null}
        colSpanDesktop={2}
      />
      <DetailSection
        label="Length"
        value={formatDimension(item.length)}
        tooltip={status === "Responded" ? "" : null}
        colSpanDesktop={2}
      />
      <DetailSection
        label="Width"
        value={formatDimension(item.width)}
        tooltip={status === "Responded" ? "" : null}
        colSpanDesktop={2}
      /> */}
      <DetailSection
        label="Product/Item Picture"
        value={item.image as string}
        image
        tooltip={status === "Responded" ? "" : null}
      />
      <DetailSection label="Product Description" value={item.description} />

      {item.properties?.map((property, i) => {
        return (
          <DetailSection
            key={`property-${i}`}
            label={property.label}
            value={property.value}
            colSpanDesktop={3}
            tooltip={status === "Responded" ? "" : null}
          />
        );
      })}
    </>
  );
};

type ShopRequestItemRelatedCostsProps = {
  relatedCosts: ShopItemType["relatedCosts"];
  status: (typeof REQUEST_STATUS)[number];
};

const ShopRequestItemRelatedCosts = ({
  relatedCosts,
  status,
}: ShopRequestItemRelatedCostsProps) => {
  return (
    <>
      <div className="col-span-full">
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center">
            <span className="title-md md:title-lg text-primary-900">
              Item Related Costs
            </span>

            <hr className="mx-[10px] flex-grow border-dashed border-primary-900" />

            <div className="hidden md:block">
              <div className="flex flex-col items-center gap-[10px] md:flex-row md:gap-[20px]">
                <span className="body-md">
                  Default Currency: <span className="title-sm">USD</span>
                </span>
                <div className="w-max">
                  <ChangeCurrencyButton />
                </div>
              </div>
            </div>
          </div>

          <HighlightedInfo
            text={
              status === "Responded"
                ? "These costs could have been changed/updated by our staffs if they observed differences between the details you provided and the ones we verified from the store."
                : "These costs could be changed/updated by our staffs if they observe differences between the details you provided and the ones we verify from the store, however we will inform you about it."
            }
          />
          {/* for mobile screen */}
          <div className="block md:hidden">
            <div className="flex flex-col items-center gap-[10px] md:flex-row md:gap-[20px]">
              <span className="body-md">
                Default Currency: <span className="title-sm">USD</span>
              </span>
              <div className="w-full md:w-max">
                <ChangeCurrencyButton />
              </div>
            </div>
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
        tooltip={status === "Responded" ? "" : null} // todo: add tooltip
        colSpanDesktop={4}
      />

      {status === "Responded" && (
        <PurpleDetailSection
          label="Shipping to Origin Warehouse Cost"
          value={
            relatedCosts.shippingToOriginWarehouseCost
              ? formatCurrency(relatedCosts.shippingToOriginWarehouseCost)
              : ""
          }
          colSpanDesktop={4}
        />
      )}

      <PurpleDetailSection
        label="Shop For Me Cost"
        value={
          relatedCosts.shopForMeCost
            ? formatCurrency(relatedCosts.shopForMeCost)
            : ""
        }
        tooltip={status === "Responded" ? "" : null} // todo: add tooltip
        colSpanDesktop={4}
      />
    </>
  );
};

// todo:
export const ChangeCurrencyButton = () => {
  return (
    <button
      aria-label="change currency"
      className="btn relative flex w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] border border-gray-400 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-primary-600 md:px-6"
    >
      <ConvertCard size={16} color="#292d32" variant="Bold" />
      <span className="label-lg">Change Currency</span>
    </button>
  );
};

type LabelWithTooltipProps = { label: string; tooltip: ReactNode };

export const LabelWithTooltip = ({ label, tooltip }: LabelWithTooltipProps) => {
  return (
    <div className="flex w-fit items-start gap-[10px]">
      <TooltipButton label={tooltip} position="right-start" />
      <span className="body-md h-[40px] max-w-[100px]">{label}</span>
    </div>
  );
};

type PackageOriginProps = { children: ReactNode };

export const PackageOrigin = ({ children }: PackageOriginProps) => {
  const { open, toggle } = useAccordion(true);

  return (
    <SectionContentLayout>
      <div className="flex w-full flex-col gap-[30px]">
        <div className="flex w-full items-center justify-between">
          <h4 className="title-md md:title-lg text-gray-700">Package Origin</h4>
          <AccordionButton {...{ open, toggle }} />
        </div>
        {open && <>{children}</>}
      </div>
    </SectionContentLayout>
  );
};

type HighlightedInfoProps = { text: string | JSX.Element };

export const HighlightedInfo = ({ text }: HighlightedInfoProps) => {
  return (
    <div className="flex flex-col gap-[20px] rounded-[20px] bg-error-200 px-[14px] py-[10px]">
      <p className="body-md md:label-lg text-gray-700">{text}</p>
    </div>
  );
};

export const requestStatuses = {
  Responded: <RespondedStatus />,
  "Not Responded": <NotRespondedStatus />,
};

export type RequestInformationProps = {
  info: { date: string; status: (typeof REQUEST_STATUS)[number] };
};

export const RequestInformation = ({ info }: RequestInformationProps) => {
  const { open, toggle } = useAccordion(true);

  return (
    <div className="flex flex-col gap-[10px]">
      <SectionHeader title="Order Information" />
      <SectionContentLayout>
        <div className="flex w-full flex-col gap-[30px]">
          <div className="flex w-full items-center justify-between">
            <h4 className="title-md md:title-lg text-gray-700">
              Order Information
            </h4>
            <AccordionButton {...{ open, toggle }} />
          </div>
          {open && (
            <div className="grid w-full grid-cols-1 gap-[15px] md:grid-cols-10">
              <div className="md:col-span-2">
                <DetailSection label="Request Date" value={info.date} />
              </div>
              <div className="md:col-span-2">
                <DetailSection
                  label="Request Status"
                  value={requestStatuses[info.status]}
                />
              </div>
              <div className="flex w-max items-center md:col-span-4">
                {info.status === "Responded" && <ProceedToCheckoutButton />}
              </div>
            </div>
          )}
        </div>
      </SectionContentLayout>
    </div>
  );
};

export const ProceedToCheckoutButton = ({
  onClick,
}: ProceedToCheckoutButtonProps) => {
  const { handleActiveAction, handleTabChange } = useTabContext();

  const handleClick = () => {
    handleTabChange("requests");
    handleActiveAction("proceed to checkout");
  };

  return (
    <button
      onClick={onClick ?? handleClick}
      aria-label="Take Action Now"
      className="btn relative flex h-[40px] w-full flex-row items-center justify-center gap-x-2 rounded-[88px] border border-gray-500 bg-white px-[14px] py-[10px] text-sm font-medium tracking-[.00714em] text-white"
    >
      <Security size={18} className="text-primary-900" />
      <span className="label-lg whitespace-nowrap text-primary-600">
        Proceed to Checkout
      </span>
    </button>
  );
};

type ProceedToCheckoutButtonProps = { onClick?: () => void };

export const ModalProceedToCheckoutButton = ({
  onClick,
}: ProceedToCheckoutButtonProps) => {
  return (
    <button
      onClick={onClick}
      aria-label="Take Action Now"
      className="btn relative flex h-[40px] w-full flex-row items-center justify-center gap-x-2 rounded-[88px] border border-gray-500 bg-white px-[14px] py-[10px] text-sm font-medium tracking-[.00714em] text-white"
    >
      <Security size={18} variant="Bold" />
      <span className="label-lg whitespace-nowrap text-primary-600">
        Proceed to Checkout
      </span>
    </button>
  );
};

export default RequestDetails;
