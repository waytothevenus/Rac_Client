import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Balancer from "react-wrap-balancer";
import { capitalizeWords } from "~/Utils";
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
import { ImageColumn } from "~/components/Shop/Orders/OrdersPanel";
import {
  RequestStatusModalLayout,
  type RequestStatusContentMapProps,
  type RequestStatusModalProps,
  type RequestStatusProps,
} from "~/components/Shop/Requests/RequestsPanel";
import {
  useImportContext,
  type ImportRequestPackageType,
} from "~/contexts/ImportContext";
import { useTabContext } from "~/contexts/TabContext";
import tailmater from "~/js/tailmater";
import RequestDetails from "./RequestDetails";
import RequestOrder from "./RequestOrder";

const ImportRequestsPanel = () => {
  const { requestPackages, isFetchingRequestPackages } = useImportContext();
  const { activeAction } = useTabContext();

  if (activeAction === "request new order") {
    return (
      <TabContentLayout>
        <RequestOrder />
      </TabContentLayout>
    );
  }

  if (activeAction === "request details") {
    return (
      <TabContentLayout>
        <RequestDetails />
      </TabContentLayout>
    );
  }

  if (isFetchingRequestPackages) {
    return (
      <TabContentLayout>
        <LoadingSpinner />
      </TabContentLayout>
    );
  }

  if (Array.isArray(requestPackages) && requestPackages.length > 0) {
    return (
      <TabContentLayout>
        <RequestsTable />
        <NeedHelpFAB />
      </TabContentLayout>
    );
  }

  return (
    <TabContentLayout>
      <div className="flex w-full flex-grow flex-col items-center justify-center gap-[30px]">
        <h2 className="title-md md:title-lg max-w-[462px] text-center">
          <Balancer>
            You have not requested for any import order before, would you like
            to request for a new order?
          </Balancer>
        </h2>
        <RequestOrderButton />
      </div>
    </TabContentLayout>
  );
};

const RequestsTable = () => {
  const { requestPackages } = useImportContext();
  const { handleActiveAction, handleViewIndex } = useTabContext();

  const onClick = (index: number) => {
    handleViewIndex(index);
    handleActiveAction("request details");
  };

  const defaultColumns = useMemo(() => {
    const columnHelper = createColumnHelper<ImportRequestPackageType>();

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
      columnHelper.accessor("requestId", {
        header: "Request ID",
        cell: ({ row }) => (
          <span className="title-md font-medium">{row.original.requestId}</span>
        ),
      }),
      columnHelper.display({
        id: "requestStatus",
        header: "Request Status",
        cell: ({ row }) => (
          <RequestStatus
            requestPackage={row.original}
            onClick={() => handleViewIndex(Number(row.id))}
          />
        ),
      }),
      columnHelper.accessor("requestLocalDate", {
        header: "Request Date",
        cell: ({ row }) => (
          <span className="title-md font-medium">
            {row.original.requestLocalDate.toLocaleString()}
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
    ] as Array<ColumnDef<ImportRequestPackageType, unknown>>;
  }, []);

  const filterCategories = useMemo<FilterCategoriesType[]>(
    () => [
      {
        category: "Order request status",
        categoryFilters: [{ label: "Responded" }, { label: "Not responded" }],
      },
    ],
    [],
  );

  return (
    <MainTable
      id="requests"
      columns={defaultColumns}
      data={requestPackages}
      filterCategories={filterCategories}
    />
  );
};

export const RequestStatus = ({
  requestPackage,
  onClick,
}: RequestStatusProps) => {
  useEffect(() => {
    tailmater();
  }, []);

  const modalId = `request-status-modal-${requestPackage.requestId}`;
  const dataTarget = `#${modalId}`;

  const buttonStyles = {
    "not responded": "bg-gray-200 text-gray-700",
    responded: "bg-brand-orange text-white",
  };

  const status = requestPackage.requestStatus;
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
      {createPortal(
        <RequestStatusModal {...{ modalId, requestPackage }} />,
        document.body,
      )}
    </>
  );
};

const RequestStatusModal = ({
  modalId,
  requestPackage,
}: RequestStatusModalProps) => {
  const dataClose = `#${modalId}`;
  const requestStatus = requestPackage.requestStatus;

  return (
    <RequestStatusModalLayout
      modalId={modalId}
      dataClose={dataClose}
      requestPackage={requestPackage}
    >
      <RequestStatusContentMap requestStatus={requestStatus} />

      <div className="flex flex-row items-end justify-end">
        <div className="w-max whitespace-nowrap">
          {requestStatus === "Not Responded" && (
            <CloseModalButton dataClose={dataClose} />
          )}
          {requestStatus === "Responded" && (
            <div className="flex gap-[8px]">
              <CancelButton dataClose={dataClose} />
              <InitiateShippingButton dataClose={dataClose} />
            </div>
          )}
        </div>
      </div>
    </RequestStatusModalLayout>
  );
};

export const RequestStatusContentMap = ({
  requestStatus,
}: RequestStatusContentMapProps) => {
  const content = {
    "Not Responded":
      "Your request has not be responded to yet. Kindly check back later.",
    Responded:
      "Your request has been responded to. Kindly proceed to initiate shipping.",
  };

  return <p className="title-lg text-neutral-900">{content[requestStatus]}</p>;
};

export default ImportRequestsPanel;
