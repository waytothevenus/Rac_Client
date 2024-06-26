import { useQuery, type DefinedUseQueryResult } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import {
  type ExportItemType,
  type ExportRequestPackageType,
} from "~/contexts/ExportContext";
import { useTabContext } from "~/contexts/TabContext";

const useFetchExportRequests = (
  token: string,
): DefinedUseQueryResult<ExportRequestPackageType[], AxiosError> => {
  const { activeTab } = useTabContext();

  const handleFetch = async () => {
    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    const reqOptions = {
      url: "https://rac-backend.onrender.com/api/export/mine",
      method: "GET",
      headers: headersList,
    };

    const response = await axios.request(reqOptions);
    console.log(response);
    const { exportRequests: exportRequestsResponse } = response.data as Root;
    const exportRequests: ExportRequestPackageType[] =
      exportRequestsResponse.map((request) => {
        const requestPackage: ExportRequestPackageType = {
          requestId: request.requestId,
          requestStatus:
            request.requestStatus as ExportRequestPackageType["requestStatus"],
          requestLocalDate: new Date(request.createdAt).toLocaleString(
            "en-US",
            {
              hour12: false,
            },
          ),
          originWarehouse:
            request.origin as ExportRequestPackageType["originWarehouse"],
          items: request.requestItems.map((item) => {
            const requestItem: ExportItemType = {
              name: item.itemName,
              idType: item.idType as ExportItemType["idType"],
              idNumber: item.idNumber,
              deliveryStatus:
                item.itemDeliveryStatus as ExportItemType["deliveryStatus"],
              deliveredBy: item.deliveredBy as ExportItemType["deliveredBy"],
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

    return exportRequests;
  };

  const query = useQuery<ExportRequestPackageType[], AxiosError>({
    queryKey: ["exportRequests"],
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
  exportRequests: ExportRequest[];
}

export interface ExportRequest {
  shippingAndBillingInfo: ShippingAndBillingInfo;
  _id: string;
  user: string;
  origin: string;
  requestItems: RequestItem[];
  requestStatus: string;
  processingFeeStatus: string;
  orderStatus: string;
  ShippingStatus: string;
  shopForMeStatus: string;
  requestId: string;
  orderId: string;
  trackingId: string;
  shipmentUpdates: [];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ShippingAndBillingInfo {
  billingInformation: [];
}

export interface RequestItem {
  itemName: string;
  idType: string;
  idNumber: string;
  itemDeliveryStatus: string;
  deliveredBy: string;
  itemOriginalCost: number;
  itemImage: string;
  itemDescription: string;
  _id: string;
}

export default useFetchExportRequests;
