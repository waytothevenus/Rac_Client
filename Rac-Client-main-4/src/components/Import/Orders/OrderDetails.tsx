import { formatCurrency } from "~/Utils";
import { PaymentsInformation } from "~/components/AutoImport/Requests/RequestDetails";
import { BackButton } from "~/components/Buttons/BackButton";
import AccordionButton from "~/components/Forms/AccordionButton";
import OrderTrackingId from "~/components/OrderTrackingId";
import {
  ArrivedClearStatus,
  ArrivedClearedDeliveredStatus,
  CancelledStatus,
  DetailsClearPackageButton,
  DetailsClearedButton,
  DetailsDeliveredButton,
  DetailsInitiateShippingButton,
  ProcessedStatus,
  ShipmentNotStartedStatus,
  ShipmentProcessingStatus,
} from "~/components/Shop/Orders";
import { DestinationShippingAddress } from "~/components/Shop/Orders/ClearPackage";
import {
  BillingAddress,
  DetailSection,
} from "~/components/Shop/Orders/InitiateShipping";
import {
  HighlightedInfo,
  PackageOrigin,
} from "~/components/Shop/Requests/RequestDetails";
import {
  RequestFormHeader,
  SectionContentLayout,
  SectionHeader,
} from "~/components/Shop/Requests/RequestOrder";
import { type SHIPPING_STATUS } from "~/constants";
import { useImportContext } from "~/contexts/ImportContext";
import { useTabContext } from "~/contexts/TabContext";
import useAccordion from "~/hooks/useAccordion";
import { ImportOrderItem } from "./ClearPackage";

const OrderDetails = () => {
  const { orderPackages } = useImportContext();
  const { viewIndex, handleActiveAction } = useTabContext();

  if (viewIndex === null) return;

  const orderPackage = orderPackages?.[viewIndex];

  if (!orderPackage) return;

  const handleBack = () => {
    handleActiveAction(null);
  };

  return (
    <div className="flex max-w-[1032px] flex-col gap-[30px] rounded-[20px] bg-white p-[20px] md:p-[30px]">
      <RequestFormHeader title="Import Order Details" />

      <div className="w-full md:w-max">
        <OrderTrackingId
          orderId={orderPackage.orderId}
          trackingId={orderPackage.trackingId}
        />
      </div>

      <OrderInformation
        info={{
          date: orderPackage.orderLocalDate.toLocaleString(),
          status: orderPackage.shippingStatus,
        }}
      />

      <div className="flex flex-col gap-[10px]">
        <SectionHeader title="Package Details" />
        <PackageOrigin>
          <DetailSection
            label="Origin warehouse"
            value={orderPackage.originWarehouse}
          />
        </PackageOrigin>
        <hr className="block w-full border-dashed border-primary-900" />
        {orderPackage.items.map((item, i) => {
          return <ImportOrderItem key={i} item={item} index={i} />;
        })}
      </div>

      <div className="flex flex-col gap-[10px]">
        <SectionHeader title="Shipping Details" />
        <DestinationShippingAddress
          destinationWarehouse={orderPackage.destinationWarehouse}
        />
      </div>

      <div className="flex flex-col gap-[10px]">
        <SectionHeader title="Billing Details" />
        <BillingAddress billingDetails={orderPackage.billingDetails} />
        <PaymentsInformation>
          <div className="col-span-full">
            <HighlightedInfo text="This Shipment Cost is subjected to increase to any Valid reason like delayed clearing and co. Also, you shall be paying the dollar equivalent in any of your chosen currency at the time of Clearing." />
          </div>
          <DetailSection
            label="Total Shipment Cost"
            value={
              orderPackage.packageCosts.shippingCost
                ? formatCurrency(orderPackage.packageCosts.shippingCost)
                : "Not allocated yet"
            }
            colSpanDesktop={4}
          />
          <DetailSection
            label="Payment Status"
            value={orderPackage.shippingPaymentStatus}
            colSpanDesktop={4}
          />
        </PaymentsInformation>
      </div>

      <div className="flex w-max gap-[10px] whitespace-nowrap">
        <BackButton onClick={handleBack} />
      </div>
    </div>
  );
};

export type OrderInformationProps = {
  info: { date: string; status: (typeof SHIPPING_STATUS)[number] };
};

const OrderInformation = ({ info }: OrderInformationProps) => {
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
                <DetailSection label="Order Request Date" value={info.date} />
              </div>
              <div className="md:col-span-2">
                <DetailSection
                  label="Order Status"
                  value={<ProcessedStatus />}
                />
              </div>
              <div className="md:col-span-2">
                <DetailSection
                  label="Shipping Status"
                  value={shippingStatuses[info.status]}
                />
              </div>
              <div className="flex w-max items-center md:col-span-4">
                {info.status === "ready for shipping" && (
                  <DetailsInitiateShippingButton />
                )}
                {info.status === "arrived destination" && (
                  <DetailsClearPackageButton />
                )}
                {info.status === "cleared" && <DetailsClearedButton />}
                {info.status === "delivered" && <DetailsDeliveredButton />}
              </div>
            </div>
          )}
        </div>
      </SectionContentLayout>
    </div>
  );
};

export const shippingStatuses = {
  "ready for shipping": <ShipmentNotStartedStatus />,
  "not started": <ShipmentNotStartedStatus />,
  processing: <ShipmentProcessingStatus />,
  cancelled: <CancelledStatus />,
  "in transit": <ShipmentProcessingStatus />,
  "arrived destination": <ArrivedClearStatus />,
  cleared: <ArrivedClearedDeliveredStatus />,
  delivered: <ArrivedClearedDeliveredStatus />,
};

export default OrderDetails;
