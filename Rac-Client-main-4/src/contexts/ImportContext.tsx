import { createContext, useContext, useState, type ReactNode } from "react";
import { useCookies } from "react-cookie";
import { useLocalStorage } from "usehooks-ts";
import { type ImportInputs } from "~/components/Import/Requests/RequestOrder";
import {
  type COURIERS,
  type ID_TYPE,
  type ITEM_DELIVERY_STATUS,
  type ORDER_STATUS,
  type ORIGINS,
  type PAYMENT_STATUS,
  type REQUEST_STATUS,
  type SHIPPING_METHODS,
  type SHIPPING_STATUS,
} from "~/constants";
import useFetchImportOrders from "~/hooks/useFetchImportOrders";
import useFetchImportRequests from "~/hooks/useFetchImportRequests";
import { type DraftImageType } from "~/hooks/useImageHandler";
import { type BillingDetailsType } from "./AutoImportContext";
import { type PackageCostsType } from "./ShopContext";

export type ImportContextType = {
  draftPackage: ImportDraftPackageType | null;
  isFetchingOrderPackages: boolean;
  isFetchingRequestPackages: boolean;
  localDraft: ImportLocalDraftType;
  orderPackages: ImportOrderPackageType[];
  requestPackages: ImportRequestPackageType[];
  handleDraft: (draftPackage: ImportDraftPackageType | null) => void;
  handleLocalDraft: (localDraft: ImportLocalDraftType) => void;
  handleOrders: () => void;
  handleRequests: () => void;
};

export const ImportContext = createContext<ImportContextType>(
  {} as ImportContextType,
);

export const useImportContext = () => useContext(ImportContext);

export type ImportItemType = {
  name: string;
  idType: (typeof ID_TYPE)[number];
  idNumber: string;
  deliveryStatus: (typeof ITEM_DELIVERY_STATUS)[number];
  deliveredBy: (typeof COURIERS)[number];
  originalCost: number;
  quantity: number;
  weight: number;
  height: number;
  length: number;
  width: number;
  image: string;
  description: string;
  properties?: {
    label: string;
    value: string;
  }[];
  draftImage?: DraftImageType;
};

export type ImportDraftPackageType = ImportInputs;

export type ImportOrderPackageType = {
  orderId: string;
  orderStatus: (typeof ORDER_STATUS)[number];
  orderLocalDate: string;
  trackingId: string;
  shippingStatus: (typeof SHIPPING_STATUS)[number];
  originWarehouse: (typeof ORIGINS)[number];
  destinationWarehouse: (typeof ORIGINS)[number];
  items: ImportItemType[];
  billingDetails: BillingDetailsType;
  shippingMethod: (typeof SHIPPING_METHODS)[number];
  shippingPaymentStatus: (typeof PAYMENT_STATUS)[number];
  packageCosts: PackageCostsType;
};

export type ImportRequestPackageType = {
  requestId: string;
  requestStatus: (typeof REQUEST_STATUS)[number];
  requestLocalDate: string;
  originWarehouse: (typeof ORIGINS)[number];
  items: ImportItemType[];
  packageCosts: PackageCostsType;
};

export type PropertyType = { label: string; value: string | undefined };

type ImportLocalDraftType = ImportDraftPackageType | null;

const ImportContextProvider = ({ children }: { children: ReactNode }) => {
  const [cookies] = useCookies(["jwt"]);
  const token = cookies.jwt as string;

  const [draftPackage, setDraftPackages] =
    useState<ImportDraftPackageType | null>(null);

  const [localDraft, setLocalDraft] = useLocalStorage<ImportLocalDraftType>(
    "Import",
    draftPackage,
  );

  const {
    data: orderPackages,
    refetch: refetchOrderPackages,
    isFetching: isFetchingOrderPackages,
  } = useFetchImportOrders(token);

  const {
    data: requestPackages,
    refetch: refetchRequestPackages,
    isFetching: isFetchingRequestPackages,
  } = useFetchImportRequests(token);

  const handleDraft = (draftPackage: ImportDraftPackageType | null) => {
    setDraftPackages(draftPackage);
  };

  const handleLocalDraft = (localDraft: ImportLocalDraftType) => {
    setLocalDraft(localDraft);
  };

  const handleOrders = () => {
    void refetchOrderPackages();
  };

  const handleRequests = () => {
    void refetchRequestPackages();
  };

  const value: ImportContextType = {
    draftPackage,
    isFetchingOrderPackages,
    isFetchingRequestPackages,
    localDraft,
    orderPackages,
    requestPackages,
    handleDraft,
    handleLocalDraft,
    handleOrders,
    handleRequests,
  };

  return (
    <ImportContext.Provider value={value}>{children}</ImportContext.Provider>
  );
};

export default ImportContextProvider;
