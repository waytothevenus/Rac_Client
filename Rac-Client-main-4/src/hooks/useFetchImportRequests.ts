import { useQuery, type DefinedUseQueryResult } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import {
  type ImportItemType,
  type ImportRequestPackageType,
} from "~/contexts/ImportContext";
import { useTabContext } from "~/contexts/TabContext";

const useFetchImportRequests = (
  token: string,
): DefinedUseQueryResult<ImportRequestPackageType[], AxiosError> => {
  const { activeTab } = useTabContext();

  const handleFetch = async () => {
    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    const reqOptions = {
      url: "https://rac-backend.onrender.com/api/import/mine",
      method: "GET",
      headers: headersList,
    };

    const response = await axios.request(reqOptions);
    console.log(response);
    const { importRequests: importRequestsResponse } = response.data as Root;
    const importRequests: ImportRequestPackageType[] =
      importRequestsResponse.map((request) => {
        const requestPackage: ImportRequestPackageType = {
          requestId: request.requestId,
          requestStatus:
            request.requestStatus as ImportRequestPackageType["requestStatus"],
          requestLocalDate: new Date(request.createdAt).toLocaleString(
            "en-US",
            {
              hour12: false,
            },
          ),
          originWarehouse:
            request.origin as ImportRequestPackageType["originWarehouse"],
          items: request.requestItems.map((item) => {
            const requestItem: ImportItemType = {
              name: item.itemName,
              idType: item.idType as ImportItemType["idType"],
              idNumber: item.idNumber,
              deliveryStatus:
                item.itemDeliveryStatus as ImportItemType["deliveryStatus"],
              deliveredBy: item.deliveredBy as ImportItemType["deliveredBy"],
              originalCost: item.itemOriginalCost,
              quantity: 0, // todo: missing
              weight: 0, // todo: missing
              height: 0, // todo: missing
              length: 0, // todo: missing
              width: 0, // todo: missing
              image:
                item.itemImage ??
                "https://placehold.co/500x500/cac4d0/1d192b?text=No%20Image",
              description: item.itemDescription,
            };

            return requestItem;
          }),
          packageCosts: {
            shippingCost: 0, // todo: missing
            clearingPortHandlingCost: 0, // todo: missing
            otherCharges: 0, // todo: missing
            storageCharge: 0, // todo: missing
            insurance: 0, // todo: missing
            valueAddedTax: 0, // todo: missing
            paymentMethodSurcharge: 0, // todo: missing
            discount: 0, // todo: missing
          },
        };

        return requestPackage;
      });

    return importRequests;
  };

  const query = useQuery<ImportRequestPackageType[], AxiosError>({
    queryKey: ["importRequests"],
    queryFn: async () => {
      console.log("fetching user request packages");
      const res = await handleFetch();
      const packages = res;
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
  importRequests: ImportRequest[];
}

export interface ImportRequest {
  shippingAndBillingInfo: ShippingAndBillingInfo;
  _id: string;
  user: string;
  origin: string;
  packageDeliveryStatus: string;
  requestItems: RequestItem[];
  requestStatus: string;
  processingFeeStatus: string;
  orderStatus: string;
  shippingStatus: string;
  shopForMeStatus: string;
  totalShippingCostFeeStatus: string;
  requestId: string;
  orderId: string;
  trackingId: string;
  shipmentUpdates: [];
  createdAt: string;
  updatedAt: string;
  __v: number;
  destination?: string;
  transactionDetails?: TransactionDetails;
  requestApprovedAt?: string;
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
  _id: string;
}

export interface RequestItem {
  itemName: string;
  idType: string;
  idNumber: string;
  itemDeliveryStatus: string;
  deliveredBy: string;
  itemOriginalCost: number;
  itemImage?: string;
  itemDescription: string;
  _id: string;
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

export default useFetchImportRequests;
