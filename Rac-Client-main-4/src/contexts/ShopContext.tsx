import { createContext, useContext, useState, type ReactNode } from "react";
import { useCookies } from "react-cookie";
import { useLocalStorage } from "usehooks-ts";
import { type ShopInputs } from "~/components/Shop/Requests/RequestOrder";
import {
  type ORDER_STATUS,
  type ORIGINS,
  type PAYMENT_STATUS,
  type REQUEST_STATUS,
  type SHIPPING_METHODS,
  type SHIPPING_STATUS,
  type SHOP_FOR_ME_STATUS,
  type STORES,
} from "~/constants";
import useFetchShopOrders from "~/hooks/useFetchShopOrders";
import useFetchShopRequests from "~/hooks/useFetchShopRequests";
import { type DraftImageType } from "~/hooks/useImageHandler";
import { type BillingDetailsType } from "./AutoImportContext";
import { useFetchShopRequestPrice } from "~/hooks/useFetchShopRequestPrice";
import { useTabContext } from "./TabContext";

export type ShopContextType = {
  draftPackage: ShopDraftPackageType | null;
  isFetchingOrderPackages: boolean;
  isFetchingRequestPackages: boolean;
  localDraft: ShopLocalDraftType;
  orderPackages: ShopOrderPackageType[];
  requestPackages: ShopRequestPackageType[];
  shopRequestTotalQuery: any;
  handleDraft: (draftPackage: ShopDraftPackageType | null) => void;
  handleLocalDraft: (localDraft: ShopLocalDraftType) => void;
  handleOrders: () => void;
  handleRequests: () => void;
};

export const ShopContext = createContext<ShopContextType>(
  {} as ShopContextType,
);

export const useShopContext = () => useContext(ShopContext);

export type ShopItemType = {
  store: (typeof STORES)[number];
  urgent: boolean;
  url: string;
  name: string;
  originalCost: number;
  quantity: number;
  weight: number;
  height: number;
  length: number;
  width: number;
  image: string | FileList;
  description: string;
  properties?: {
    label: string;
    value: string;
  }[];
  shippingCost?: number;
  relatedCosts: {
    urgentPurchaseFee: number;
    processingFee: number;
    shippingToOriginWarehouseCost: number;
    shopForMeCost: number;
  };
  draftImage?: DraftImageType;
};

export type PackageCostsType = {
  shippingCost?: number;
  clearingPortHandlingCost?: number;
  otherCharges?: number;
  storageCharge?: number;
  insurance?: number;
  valueAddedTax: number;
  paymentMethodSurcharge: number;
  discount: number;
};

export type ShopDraftPackageType = ShopInputs;

export type ShopOrderPackageType = {
  orderId: string;
  orderStatus: any;
  orderLocalDate: string;
  trackingId: string;
  shippingStatus: any;
  originWarehouse: (typeof ORIGINS)[number];
  destinationWarehouse: (typeof ORIGINS)[number];
  items: ShopItemType[];
  billingDetails: BillingDetailsType;
  shippingMethod: (typeof SHIPPING_METHODS)[number];
  totalShopForMeCost: number; // aggregated data for table sorting
  shopForMeStatus: (typeof SHOP_FOR_ME_STATUS)[number];
  totalShippingCost: number; // aggregated data for table sorting
  shippingPaymentStatus: (typeof PAYMENT_STATUS)[number];
  packageCosts: PackageCostsType;
};

export type ShopRequestPackageType = {
  id: string;
  orderId: string;
  requestId: string;
  requestStatus: (typeof REQUEST_STATUS)[number];
  requestLocalDate: string;
  originWarehouse: (typeof ORIGINS)[number];
  items: ShopItemType[];
  packageCosts?: PackageCostsType;
};

type ShopLocalDraftType = ShopInputs | null;

const ShopContextProvider = ({ children }: { children: ReactNode }) => {
  const [cookies] = useCookies(["jwt"]);
  const { viewIndex } = useTabContext();

  const token = cookies.jwt as string;

  const [draftPackage, setDraftPackage] = useState<ShopDraftPackageType | null>(
    null,
  );

  const [localDraft, setLocalDraft] = useLocalStorage<ShopLocalDraftType>(
    "Shop",
    draftPackage,
  );

  const {
    data: orderPackages,
    refetch: refetchOrderPackages,
    isFetching: isFetchingOrderPackages,
  } = useFetchShopOrders(token);

  const {
    data: requestPackages,
    refetch: refetchRequestPackages,
    isFetching: isFetchingRequestPackages,
  } = useFetchShopRequests(token);

  const requestPackage = requestPackages?.[viewIndex];
  const orderPackage = orderPackages?.[viewIndex];

  const { shopRequestTotalQuery } = useFetchShopRequestPrice(
    requestPackage?.id || orderPackage?.id,
  );

  const handleDraft = (draftPackage: ShopInputs | null) => {
    setDraftPackage(draftPackage);
  };

  const handleLocalDraft = (localDraft: ShopLocalDraftType) => {
    setLocalDraft(localDraft);
  };

  const handleOrders = () => {
    void refetchOrderPackages();
  };

  const handleRequests = () => {
    void refetchRequestPackages();
  };

  const value: ShopContextType = {
    draftPackage,
    isFetchingOrderPackages,
    isFetchingRequestPackages,
    localDraft,
    orderPackages,
    requestPackages,
    shopRequestTotalQuery,
    handleDraft,
    handleLocalDraft,
    handleOrders,
    handleRequests,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
