import { formatCurrency, formatDimension, formatWeight } from "~/Utils";
import { BackButton } from "~/components/Buttons/BackButton";
import { InitiateShippingButton } from "~/components/Buttons/InitiateShippingButton";
import AccordionButton from "~/components/Forms/AccordionButton";
import LabelId from "~/components/LabelId";
import { DetailsInitiateShippingButton } from "~/components/Shop/Orders";
import { DetailSection } from "~/components/Shop/Orders/InitiateShipping";
import {
  HighlightedInfo,
  PackageOrigin,
  requestStatuses,
  type RequestInformationProps,
} from "~/components/Shop/Requests/RequestDetails";
import {
  RequestFormHeader,
  SectionContentLayout,
  SectionHeader,
} from "~/components/Shop/Requests/RequestOrder";
import {
  useImportContext,
  type ImportItemType,
} from "~/contexts/ImportContext";
import { useTabContext } from "~/contexts/TabContext";
import useAccordion from "~/hooks/useAccordion";

const RequestDetails = () => {
  const { requestPackages } = useImportContext();
  const { viewIndex, handleActiveAction } = useTabContext();

  if (viewIndex === null) return;

  const requestPackage = requestPackages?.[viewIndex];

  if (!requestPackage) return;

  const status = requestPackage.requestStatus;

  const handleBack = () => {
    handleActiveAction(null);
  };

  return (
    <div className="flex max-w-[1032px] flex-col gap-[30px] rounded-[20px] bg-white p-[20px] md:p-[30px]">
      <RequestFormHeader title="Import Order Request Details" />
      <LabelId label="Request ID" id={requestPackage.requestId} />
      <OrderInformation
        info={{
          date: requestPackage.requestLocalDate.toLocaleString(),
          status,
        }}
      />
      <div className="flex flex-col gap-[10px]">
        <SectionHeader title="Package Details" />
        <PackageOrigin>
          <HighlightedInfo text="This is RAC Facility you claim to have dropped the package to" />
          <div className="flex flex-col gap-[5px]">
            <DetailSection
              label="Origin warehouse"
              value={requestPackage.originWarehouse}
            />
          </div>
        </PackageOrigin>
        <hr className="block w-full border-dashed border-primary-900" />
        {requestPackage.items.map((item, i) => {
          return <ImportRequestItem key={i} item={item} index={i} />;
        })}
      </div>
      <div className="flex w-max gap-[10px] whitespace-nowrap">
        <BackButton onClick={handleBack} />
        {status === "Responded" && <InitiateShippingButton />}
      </div>
    </div>
  );
};

type ImportRequestItemProps = {
  index: number;
  item: ImportItemType;
};

const ImportRequestItem = ({ index, item }: ImportRequestItemProps) => {
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
        {open && <ImportRequestItemDetails item={item} />}
      </div>
    </SectionContentLayout>
  );
};

type ImportRequestItemDetailsProps = {
  item: ImportItemType;
};

const ImportRequestItemDetails = ({ item }: ImportRequestItemDetailsProps) => {
  return (
    <div className="grid w-full grid-cols-1 gap-[15px] md:grid-cols-10">
      <DetailSection label="Item Name" value={item.name} colSpanDesktop={4} />
      <DetailSection
        label="Item Original Cost"
        value={formatCurrency(item.originalCost)}
        colSpanDesktop={2}
      />
      <DetailSection
        label="Quantity"
        value={item.quantity}
        colSpanDesktop={3}
      />
      <DetailSection
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
      />
      <DetailSection label="Product/Item Picture" value={item.image} image />
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
    </div>
  );
};

export const OrderInformation = ({ info }: RequestInformationProps) => {
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
                  label="Request Status"
                  value={requestStatuses[info.status]}
                />
              </div>
              <div className="flex w-max items-center md:col-span-4">
                {info.status === "Responded" && (
                  <DetailsInitiateShippingButton />
                )}
              </div>
            </div>
          )}
        </div>
      </SectionContentLayout>
    </div>
  );
};

export default RequestDetails;
