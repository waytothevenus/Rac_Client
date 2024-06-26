/* eslint-disable @next/next/no-img-element */
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { BackSquare, More, TickSquare } from "iconsax-react";
import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Balancer from "react-wrap-balancer";
import { capitalizeWords, formatCurrency } from "~/Utils";
import { CancelButton } from "~/components/Buttons/CancelButton";
import { CloseModalButton } from "~/components/Buttons/CloseModalButton";
import { InitiateShippingButton } from "~/components/Buttons/InitiateShippingButton";
import { MoreButton } from "~/components/Buttons/MoreButton";
import NeedHelpFAB from "~/components/Buttons/NeedHelpFAB";
import RequestOrderButton from "~/components/Buttons/RequestOrderButton";
import TabContentLayout from "~/components/Layouts/TabContentLayout";
import { LoadingSpinner } from "~/components/LoadingScreen";
import MainTable from "~/components/MainTable";
import { type FilterCategoriesType } from "~/components/SearchBar";
import {
  ImageColumn,
  ShippingStatusModalLayout,
  TrackButton,
  type ShippingStatusModalProps,
  type ShippingStatusProps,
} from "~/components/Shop/Orders/OrdersPanel";
import { SHIPPING_STATUS } from "~/constants";
import {
  useExportContext,
  type ExportOrderPackageType,
} from "~/contexts/ExportContext";
import { useTabContext } from "~/contexts/TabContext";
import tailmater from "~/js/tailmater";
import InitiateShipping from "./InitiateShipping";
import OrderDetails from "./OrderDetails";

const ExportOrdersPanel = () => {
  const { orderPackages, isFetchingOrderPackages } = useExportContext();
  const { activeAction } = useTabContext();

  if (activeAction === "initiate shipping") {
    return (
      <TabContentLayout>
        <InitiateShipping />
      </TabContentLayout>
    );
  }

  if (activeAction === "order details") {
    return (
      <TabContentLayout>
        <OrderDetails />
      </TabContentLayout>
    );
  }

  if (isFetchingOrderPackages) {
    return (
      <TabContentLayout>
        <LoadingSpinner />
      </TabContentLayout>
    );
  }

  if (Array.isArray(orderPackages) && orderPackages.length > 0) {
    return (
      <TabContentLayout>
        <OrdersTable />
        <NeedHelpFAB />
      </TabContentLayout>
    );
  }

  return (
    <TabContentLayout>
      <div className="flex w-full flex-grow flex-col items-center justify-center gap-[30px]">
        <h2 className="title-md md:title-lg max-w-[462px] text-center">
          <Balancer>
            You have not placed any export order before, would you like to
            create a new order?
          </Balancer>
        </h2>
        <RequestOrderButton />
      </div>
    </TabContentLayout>
  );
};

const OrdersTable = () => {
  const { orderPackages } = useExportContext();
  const { handleActiveAction, handleViewIndex } = useTabContext();

  const onClick = (index: number) => {
    handleViewIndex(index);
    handleActiveAction("order details");
  };

  const defaultColumns = useMemo(() => {
    const columnHelper = createColumnHelper<ExportOrderPackageType>();

    return [
      columnHelper.display({
        id: "checkbox",
        header: ({ table }) => (
          <input
            type="checkbox"
            className="h-[18px] w-[18px] rounded-[2px] accent-primary-600 hover:accent-primary-600"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(e) => {
              table.toggleAllPageRowsSelected(!!e.target.checked);
            }}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            name={`check-${row.index}`}
            className="h-[18px] w-[18px] rounded-[2px] accent-primary-600 hover:accent-primary-600"
            checked={row.getIsSelected()}
            onChange={(e) => {
              row.toggleSelected(!!e.target.checked);
            }}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      }),
      columnHelper.display({
        id: "images",
        header: "Package(s) Image",
        cell: ({ row }) => (
          <ImageColumn images={row.original.items.map((item) => item.image)} />
        ),
      }),
      columnHelper.accessor("orderId", {
        header: "Order ID",
        cell: ({ row }) => (
          <span className="title-md font-medium">{row.original.orderId}</span>
        ),
      }),
      columnHelper.display({
        id: "orderStatus",
        header: "Order Status",
        cell: ({ row }) => (
          <span className="title-md font-medium">
            {capitalizeWords(row.original.orderStatus)}
          </span>
        ),
      }),
      columnHelper.accessor("orderLocalDate", {
        header: "Order Date",
        cell: ({ row }) => (
          <span className="title-md font-medium">
            {row.original.orderLocalDate.toLocaleString()}
          </span>
        ),
      }),
      columnHelper.accessor("trackingId", {
        header: "Tracking ID",
        cell: ({ row }) => (
          <span className="title-md font-medium text-primary-900">
            {row.original.trackingId}
          </span>
        ),
      }),
      columnHelper.display({
        id: "shippingStatus",
        header: "Shipping Status",
        cell: ({ row }) => (
          <ShippingStatus
            orderPackage={row.original}
            onClick={() => {
              handleViewIndex(Number(row.id));
            }}
          />
        ),
      }),
      columnHelper.accessor("packageCosts.shippingCost", {
        header: "Shipping Cost",
        cell: ({ row }) => (
          <span className="title-md flex gap-[5px] font-medium">
            <More size="20" variant="Bold" className="text-error-600" />$
            {formatCurrency(row.original.packageCosts.shippingCost ?? 0)}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <MoreButton onClick={() => onClick(Number(row.id))} />
        ),
        enableHiding: false,
      }),
    ] as Array<ColumnDef<ExportOrderPackageType, unknown>>;
  }, []);

  const filterCategories = useMemo<FilterCategoriesType[]>(
    () => [
      {
        category: "Order status",
        categoryFilters: [
          { label: "Processed" },
          { label: "Processing" },
          { label: "Unprocessed" },
        ],
      },
      {
        category: "Payment status",
        categoryFilters: [
          {
            label: (
              <span className="flex items-center gap-[10px]">
                Confirmed
                <TickSquare
                  size={18}
                  variant="Bold"
                  className="text-primary-900"
                />
              </span>
            ),
          },
          {
            label: (
              <span className="flex items-center gap-[5px]">
                Not yet confirmed
                <More size={18} variant="Bold" className="text-error-600" />
              </span>
            ),
          },
          {
            label: (
              <span className="flex items-center gap-[5px]">
                Reversed
                <BackSquare
                  size={18}
                  variant="Bold"
                  className="text-primary-600"
                />
              </span>
            ),
          },
        ],
      },
      {
        category: "Shipping cost",
        categoryFilters: [
          { label: "$0 - $20" },
          { label: "$20 - $50" },
          { label: "$50 - $100" },
          { label: "$100 - $500" },
          { label: "Above $500" },
        ],
      },
      {
        category: "Shipment status",
        categoryFilters: SHIPPING_STATUS.map((status) => {
          return { label: capitalizeWords(status) };
        }),
      },
    ],
    [],
  );

  return (
    <MainTable
      id="orders"
      columns={defaultColumns}
      data={orderPackages}
      filterCategories={filterCategories}
    />
  );
};

const ShippingStatus = ({ orderPackage, onClick }: ShippingStatusProps) => {
  useEffect(() => {
    tailmater();
  }, []);

  const modalId = `shipping-status-modal-${orderPackage.orderId}`;
  const dataTarget = `#${modalId}`;

  const buttonStyles = {
    "not started": "bg-gray-200 text-gray-700",
    "ready for shipping": "bg-brand-orange text-white",
    "arrived destination": "bg-primary-900 text-white",
    "in transit": "bg-primary-600 text-white",
    processing: "bg-gray-500 text-white",
    cleared: "bg-primary-900 text-white",
    delivered: "bg-primary-900 text-white",
    cancelled: "bg-error-600 text-white",
  };

  const status = orderPackage.shippingStatus;
  const buttonStyle = buttonStyles[status];

  return (
    <>
      <button
        onClick={onClick}
        data-type="dialogs"
        data-target={dataTarget}
        aria-label={capitalizeWords(status)}
        className={`btn title-sm relative w-[150px] rounded-[10px] px-[10px] py-[5px] text-center font-medium ${buttonStyle}`}
      >
        {capitalizeWords(status)}
      </button>
      {status !== "ready for shipping" &&
        createPortal(
          <ShippingStatusModal {...{ modalId, orderPackage }} />,
          document.body,
        )}
    </>
  );
};

const ShippingStatusModal = ({
  modalId,
  orderPackage,
}: ShippingStatusModalProps) => {
  const dataClose = `#${modalId}`;
  const status = orderPackage.shippingStatus;

  return (
    <ShippingStatusModalLayout
      modalId={modalId}
      dataClose={dataClose}
      orderPackage={orderPackage}
    >
      <div className="flex flex-row items-end justify-end">
        <div className="w-max whitespace-nowrap">
          {[
            "cancelled",
            "not started",
            "cleared",
            "delivered",
            "arrived destination",
          ].includes(status) && <CloseModalButton dataClose={dataClose} />}
          {status === "ready for shipping" && (
            <div className="flex gap-[8px]">
              <CancelButton dataClose={dataClose} />
              <InitiateShippingButton dataClose={dataClose} />
            </div>
          )}
          {(status === "processing" || status === "in transit") && (
            <div className="flex gap-[8px]">
              <CancelButton dataClose={dataClose} />
              <TrackButton dataClose={dataClose} />
            </div>
          )}
        </div>
      </div>
    </ShippingStatusModalLayout>
  );
};

export default ExportOrdersPanel;
