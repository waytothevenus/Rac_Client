import { createContext, useContext, useState, type ReactNode } from "react";
import { useCookies } from "react-cookie";
import { useLocalStorage } from "usehooks-ts";
import { type AutoImportInputs } from "~/components/AutoImport/Requests/RequestOrder";
import {
  type CONDITIONS,
  type ORDER_STATUS,
  type ORIGINS,
  type PAYMENT_STATUS,
  type REQUEST_STATUS,
  type SHIPPING_METHODS,
  type SHIPPING_STATUS,
} from "~/constants";
import useFetchAutoImportOrders from "~/hooks/useFetchAutoImportOrders";
import useFetchAutoAutoImportRequests from "~/hooks/useFetchAutoImportRequests";
import { type DraftImageType } from "~/hooks/useImageHandler";
import { type PackageCostsType } from "./ShopContext";

export type AutoImportContextType = {
  draftPackage: AutoImportDraftPackageType | null;
  isFetchingOrderPackages: boolean;
  isFetchingRequestPackages: boolean;
  localDraft: AutoImportLocalDraftType;
  orderPackages: AutoImportOrderPackageType[];
  requestPackages: AutoImportRequestPackageType[];
  handleDraft: (draftPackage: AutoImportDraftPackageType | null) => void;
  handleLocalDraft: (localDraft: AutoImportLocalDraftType) => void;
  handleOrders: () => void;
  handleRequests: () => void;
};

export const AutoImportContext = createContext<AutoImportContextType>(
  {} as AutoImportContextType,
);

export const useAutoImportContext = () => useContext(AutoImportContext);

export type AutoImportItemType = {
  brand: string;
  model: string;
  productionYear: string;
  value: number;
  condition: (typeof CONDITIONS)[number];
  color: string;
  mileage: number;
  vin: string;
  url: string;
  image: string;
  carTitleCopy: string;
  description: string;
  properties?: {
    label: string;
    value: string;
  }[];
  pickupDetails?: PickupDetailsType;
  draftCarImage?: DraftImageType;
  draftCarTitleImage?: DraftImageType;
};

export type PickupDetailsType = BillingDetailsType & {
  pickUpDate: string;
  locationType: string;
  pickupCost: number;
};

export type BillingDetailsType = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipPostalCode: string;
};

export type AutoImportDraftPackageType = AutoImportInputs;

export type AutoImportOrderPackageType = {
  orderId: string;
  orderStatus: (typeof ORDER_STATUS)[number];
  orderLocalDate: string;
  trackingId: string;
  shippingStatus: (typeof SHIPPING_STATUS)[number];
  originWarehouse: (typeof ORIGINS)[number];
  items: AutoImportItemType[];
  destinationDetails: BillingDetailsType;
  billingDetails: BillingDetailsType;
  shippingMethod: (typeof SHIPPING_METHODS)[number];
  shippingPaymentStatus: (typeof PAYMENT_STATUS)[number];
  clearingPaymentStatus: (typeof PAYMENT_STATUS)[number];
  packageCosts: PackageCostsType;
};

export type AutoImportRequestPackageType = {
  requestId: string;
  requestStatus: (typeof REQUEST_STATUS)[number];
  requestLocalDate: string;
  originWarehouse: (typeof ORIGINS)[number];
  items: AutoImportItemType[];
  destinationDetails: BillingDetailsType;
  billingDetails: BillingDetailsType;
  shippingMethod: (typeof SHIPPING_METHODS)[number];
  shippingPaymentStatus: (typeof PAYMENT_STATUS)[number];
  clearingPaymentStatus: (typeof PAYMENT_STATUS)[number];
  packageCosts: PackageCostsType;
};

type AutoImportLocalDraftType = AutoImportDraftPackageType | null;

export type PropertyType = { label: string; value: string | undefined };

const AutoImportContextProvider = ({ children }: { children: ReactNode }) => {
  const [cookies] = useCookies(["jwt"]);
  const token = cookies.jwt as string;

  const [draftPackage, setDraftPackage] =
    useState<AutoImportDraftPackageType | null>(null);

  const [localDraft, setLocalDraft] = useLocalStorage<AutoImportLocalDraftType>(
    "AutoImport",
    draftPackage,
  );

  const {
    data: orderPackages,
    refetch: refetchOrderPackages,
    isFetching: isFetchingOrderPackages,
  } = useFetchAutoImportOrders(token);

  const {
    data: requestPackages,
    refetch: refetchRequestPackages,
    isFetching: isFetchingRequestPackages,
  } = useFetchAutoAutoImportRequests(token);

  const handleDraft = (draftPackage: AutoImportDraftPackageType | null) => {
    setDraftPackage(draftPackage);
  };

  const handleLocalDraft = (localDraft: AutoImportLocalDraftType) => {
    setLocalDraft(localDraft);
  };

  const handleOrders = () => {
    void refetchOrderPackages();
  };

  const handleRequests = () => {
    void refetchRequestPackages();
  };

  const value: AutoImportContextType = {
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
    <AutoImportContext.Provider value={value}>
      {children}
    </AutoImportContext.Provider>
  );
};

export default AutoImportContextProvider;
