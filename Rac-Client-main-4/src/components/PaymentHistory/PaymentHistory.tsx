/* eslint-disable @next/next/no-img-element */
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { BackSquare, More, TickSquare, CloseSquare } from "iconsax-react";
import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Balancer from "react-wrap-balancer";
import { capitalizeWords } from "~/Utils";
import { CancelButton } from "~/components/Buttons/CancelButton";
import { CloseModalButton } from "~/components/Buttons/CloseModalButton";
import { MoreButton } from "~/components/Buttons/MoreButton";
import NeedHelpFAB from "~/components/Buttons/NeedHelpFAB";
import RequestOrderButton from "~/components/Buttons/RequestOrderButton";
import CongratulationImage from "~/components/CongratulationImage";
import TabContentLayout from "~/components/Layouts/TabContentLayout";
import MainTable from "~/components/MainTable";
import OrderTrackingId from "~/components/OrderTrackingId";
import InitiateShippingButton, {
  DetailSection,
} from "~/components/Shop/Orders/InitiateShipping";
import { ClearPackageButton } from "~/components/Buttons/ClearPackageButton";
import {
  ImageColumn,
  PickUpInstructions,
  TrackButton,
  excluded,
  type ShippingStatusModalProps,
  type ShippingStatusProps,
  type SomeStatusType,
} from "~/components/Shop/Orders/OrdersPanel";
import {
  RequestFormHeader,
  SectionHeader,
} from "~/components/Shop/Requests/RequestOrder";
import { type FilterCategoriesType } from "~/components/SearchBar";
import { SHIPPING_STATUS } from "~/constants";
import {
  useAutoImportContext,
  type AutoImportOrderPackageType,
} from "~/contexts/AutoImportContext";
import { useTabContext } from "~/contexts/TabContext";
import tailmater from "~/js/tailmater";
import ReturnToButton from "../Buttons/ReturnToButton";
import { EyeButton } from "../Buttons/EyeButton";
import Link from "next/link";
import ShopHistory from "./ShopHistory";
import { usePayments } from "~/hooks/usePayments";

const paymentData = [
  {
    invoiceID: "IN6123578",
    orderId: "OD08756",
    service: "shop for me",
    paymentFor: "Shipping Cost",
    totalCost: 107.76,
    createdAt: new Date().toLocaleString(),
    paidAt: new Date().toLocaleString(),
  },
  {
    invoiceID: "IN6123578",
    orderId: "OD08756",
    service: "import",
    paymentFor: "Shipping Cost",
    totalCost: 107.76,
    createdAt: new Date().toLocaleString(),
    paidAt: new Date().toLocaleString(),
  },
  {
    invoiceID: "IN6123578",
    orderId: "OD08756",
    service: "auto import",
    paymentFor: "Shipping Cost",
    totalCost: 107.76,
    createdAt: new Date().toLocaleString(),
    paidAt: new Date().toLocaleString(),
  },
  {
    invoiceID: "IN6123578",
    orderId: "OD08756",
    service: "export",
    paymentFor: "Shipping Cost",
    totalCost: 107.76,
    createdAt: new Date().toLocaleString(),
    paidAt: new Date().toLocaleString(),
  },
  {
    invoiceID: "IN6123578",
    orderId: "OD08756",
    service: "shop for me",
    paymentFor: "Shipping Cost",
    totalCost: 107.76,
    createdAt: new Date().toLocaleString(),
    paidAt: new Date().toLocaleString(),
  },
  {
    invoiceID: "IN6123578",
    orderId: "OD08756",
    service: "import",
    paymentFor: "Shipping Cost",
    totalCost: 107.76,
    createdAt: new Date().toLocaleString(),
    paidAt: new Date().toLocaleString(),
  },
  {
    invoiceID: "IN6123578",
    orderId: "OD08756",
    service: "auto import",
    paymentFor: "Shipping Cost",
    totalCost: 107.76,
    createdAt: new Date().toLocaleString(),
    paidAt: new Date().toLocaleString(),
  },
  {
    invoiceID: "IN6123578",
    orderId: "OD08756",
    service: "export",
    paymentFor: "Shipping Cost",
    totalCost: 107.76,
    createdAt: new Date().toLocaleString(),
    paidAt: new Date().toLocaleString(),
  },
];
const PaymentHistory = () => {
  // const { orderPackages } = useAutoImportContext();
  const { paymentQuery } = usePayments();

  if (
    Array.isArray(paymentQuery.data?.data?.data) &&
    paymentQuery.data?.data?.data.length > 0
  ) {
  }
  return <OrdersTable paymentData={paymentData} />;

  // return (
  //   <div className="flex w-full flex-grow flex-col items-center justify-center gap-[30px]">
  //     <h2 className="title-lg max-w-[462px] text-center">
  //       <Balancer>You have no payment history here at the moment yet.</Balancer>
  //     </h2>
  //     <ReturnToButton />
  //   </div>
  // );
};

const OrdersTable = ({ paymentData }) => {
  // let { orderPackages } = usePaymentContext();

  const { handleActiveAction, handleViewIndex, activeAction, viewIndex } =
    useTabContext();

  const onClick = (index: number) => {
    handleViewIndex(index);
    handleActiveAction("order details");
  };

  const defaultColumns = useMemo(() => {
    const columnHelper = createColumnHelper<any>();

    return [
      columnHelper.display({
        id: "invoiceID",
        header: "Invoice ID",
        cell: ({ row }) => (
          <span className="title-md font-medium">{row.original.invoiceID}</span>
        ),
      }),
      columnHelper.accessor("orderId", {
        header: "Request/Order ID",
        cell: ({ row }) => (
          <Link
            href={`/billing/${row.original.service + row.original.paymentFor}`}
          >
            <span className="title-md font-medium">{row.original.orderId}</span>
          </Link>
        ),
      }),
      columnHelper.display({
        id: "service",
        header: "Service",
        cell: ({ row }) => (
          <span className="title-md font-medium">
            {capitalizeWords(row.original.service)}
          </span>
        ),
      }),
      columnHelper.accessor("paymentFor", {
        header: "Payment For",
        cell: ({ row }) => (
          <span className="title-md font-medium text-primary-900">
            {row.original.paymentFor}
          </span>
        ),
      }),
      columnHelper.accessor("totalCost", {
        header: "Total Cost",
        cell: ({ row }) => (
          <span className="title-md flex gap-[5px] font-medium">
            <More size="20" variant="Bold" className="text-error-600" />$
            {row.original.totalCost}
          </span>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: "Created At",
        cell: ({ row }) => (
          <span className="title-md font-medium">{row.original.createdAt}</span>
        ),
      }),
      columnHelper.accessor("paidAt", {
        header: "Paid At",
        cell: ({ row }) => (
          <span className="title-md font-medium">{row.original.paidAt}</span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <EyeButton onClick={() => onClick(Number(row.original.invoiceID))} />
        ),
      }),
    ] as Array<ColumnDef<any>>;
  }, []);

  const filterCategories = useMemo<FilterCategoriesType[]>(
    () => [
      {
        category: "Payment status",
        categoryFilters: [
          {
            label: (
              <span className="flex items-center gap-[10px]">
                <TickSquare
                  size={18}
                  variant="Bold"
                  className="text-primary-900"
                />
                Paid
              </span>
            ),
          },
          {
            label: (
              <span className="flex items-center gap-[5px]">
                <More size={18} variant="Bold" className="text-error-600" />
                To be paid up on clearing
              </span>
            ),
          },
          {
            label: (
              <span className="flex items-center gap-[5px]">
                <More size={18} variant="Bold" className="text-error-600" />
                Unpaid
              </span>
            ),
          },
          {
            label: (
              <span className="flex items-center gap-[5px]">
                <BackSquare
                  size={18}
                  variant="Bold"
                  className="text-primary-600"
                />
                Reversed
              </span>
            ),
          },
          {
            label: (
              <span className="flex items-center gap-[5px]">
                <CloseSquare
                  size={18}
                  variant="Bold"
                  className="text-error-600"
                />
                Cancelled
              </span>
            ),
          },
          {
            label: (
              <span className="flex items-center gap-[5px]">
                <More size={18} variant="Bold" className="text-gray-300" />
                Processing
              </span>
            ),
          },
        ],
      },
      {
        category: "Service",
        categoryFilters: [
          {
            label: (
              <span className="flex items-center gap-[10px]">Shop for me</span>
            ),
          },
          {
            label: <span className="flex items-center gap-[5px]">Export</span>,
          },
          {
            label: <span className="flex items-center gap-[5px]">Import</span>,
          },
          {
            label: (
              <span className="flex items-center gap-[5px]">Auto Import</span>
            ),
          },
        ],
      },
      {
        category: "Total cost",
        categoryFilters: [
          { label: "$0 - $20" },
          { label: "$20 - $50" },
          { label: "$50 - $100" },
          { label: "$100 - $500" },
          { label: "Above $500" },
        ],
      },
    ],
    [],
  );

  return (
    <>
      {activeAction === "order details" ? (
        <ShopHistory />
      ) : (
        <MainTable
          id="payment"
          columns={defaultColumns}
          data={paymentData}
          filterCategories={filterCategories}
        />
      )}
    </>
  );
};

export default PaymentHistory;
