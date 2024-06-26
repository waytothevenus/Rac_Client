import { useQuery, type DefinedUseQueryResult } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import {
  type ShopItemType,
  type ShopRequestPackageType,
} from "~/contexts/ShopContext";
import { useTabContext } from "~/contexts/TabContext";

const useFetchShopRequests = (
  token: string,
): DefinedUseQueryResult<ShopRequestPackageType[], AxiosError> => {
  const { activeTab } = useTabContext();

  const handleFetch = async () => {
    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    const reqOptions = {
      url: "https://rac-backend.onrender.com/api/sfmRequests/mine/",
      method: "GET",
      headers: headersList,
    };

    const response = await axios.request(reqOptions);
    console.log(response);
    const { sfmRequests } = response.data as Root;
    const shopRequests: ShopRequestPackageType[] = sfmRequests.map(
      (request) => {
        const requestPackage: ShopRequestPackageType = {
          requestId: request.requestId,
          orderId: request.orderId,
          id: request._id,
          requestStatus:
            request.requestStatus.toLowerCase() as ShopRequestPackageType["requestStatus"],
          requestLocalDate: new Date(request.createdAt).toLocaleString(
            "en-US",
            {
              hour12: false,
            },
          ),
          originWarehouse:
            request.origin as ShopRequestPackageType["originWarehouse"],
          items: request.requestItems.map((item) => {
            const requestItem = {
              store: item.store as ShopItemType["store"],
              urgent: item.urgent,
              url: item.itemUrl, // todo: missing
              name: item.itemName,
              originalCost: item.itemPrice,
              quantity: item.qty,
              weight: 0, // todo: missing
              height: 0, // todo: missing
              length: 0, // todo: missing
              width: 0, // todo: missing
              image:
                item.itemImage ??
                "https://placehold.co/500x500/cac4d0/1d192b?text=No%20Image",
              description: item.additionalDescription,
              relatedCosts: {
                urgentPurchaseFee: 0,
                processingFee: 0, // todo: missing
                shippingToOriginWarehouseCost: 0, // todo: missing
                shopForMeCost: 0, // todo: missing
              },
            };

            return requestItem;
          }),
          packageCosts: {
            valueAddedTax: request.vat,
            paymentMethodSurcharge: request.paymentMethodSurcharge,
            discount: request.discount,
          },
        };

        return requestPackage;
      },
    );

    return shopRequests;
  };

  const query = useQuery<ShopRequestPackageType[], AxiosError>({
    queryKey: ["shopRequests"],
    queryFn: async () => {
      console.log("fetching user request packages");
      const res = await handleFetch();
      const packages = res;
      // const packages = shopRequests;
      if (packages.length > 0) {
        console.log("user request packages: ", packages);
        return packages;
      }

      console.log("user request packages empty");
      return [];
    },
    initialData: [],
    enabled: activeTab === "requests",
  });

  return query;
};

export interface Root {
  success: boolean;
  totalrequests: number;
  sfmRequests: SfmRequest[];
}

export interface SfmRequest {
  shippingAndBillingInfo: ShippingAndBillingInfo;
  _id: string;
  user: string;
  origin: string;
  requestItems: RequestItem[];
  shippingAddress?: [];
  requestStatus: string;
  processingFeeStatus: string;
  orderStatus: string;
  ShippingStatus: string;
  shopForMeStatus: string;
  requestId: string;
  shipmentUpdates: [];
  createdAt: string;
  updatedAt: string;
  __v: number;
  requestApprovedAt?: string;
  discount: number;
  paymentMethodSurcharge: number;
  totalItemCostFromStore?: number;
  totalProcessingFee?: number;
  totalShippingCost?: number;
  totalUrgentPurchaseCost?: number;
  vat: number;
  shopForMeCost?: number;
  shopForMeCostPaidAt?: string;
  transactionDetails?: TransactionDetails;
  clearingPortHandling?: number;
  insurance?: number;
  otherCharges?: number;
  shippingCost?: number;
  shippingDiscount?: number;
  shippingPaymentMethodSurcharge?: number;
  shippingVat?: number;
  storageCharges?: number;
  totalShippingCostPaidAt?: string;
  shopForMeFeeStatus: string;
  orderId?: string;
  trackingId?: string;
}

export interface ShippingAndBillingInfo {
  billingInformation: BillingInformation[];
  shipmentAddress?: ShipmentAddress;
}

export interface BillingInformation {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  countryCode: string;
  phoneNumber: string;
  streetAddress: string;
  state: string;
  city: string;
  zipCode: string;
  _id: string;
}

export interface ShipmentAddress {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  _id: string;
}

export interface RequestItem {
  store: string;
  itemName: string;
  urgent: boolean;
  itemImage?: string;
  itemPrice: number;
  qty: number;
  description: string;
  itemColor: string;
  _id: string;
  additionalProperties: [];
}

export interface TransactionDetails {
  bankType: string;
  transactionDate: string;
  transactionTime: string;
  phoneNumber: string;
  paymentReceipt: string;
  additionalNote: string;
  _id: string;
}

export default useFetchShopRequests;
