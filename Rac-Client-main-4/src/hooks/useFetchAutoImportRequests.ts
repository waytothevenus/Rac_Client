import { useQuery, type DefinedUseQueryResult } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import {
  type AutoImportItemType,
  type AutoImportRequestPackageType,
} from "~/contexts/AutoImportContext";
import { useTabContext } from "~/contexts/TabContext";

const useFetchAutoAutoImportRequests = (
  token: string,
): DefinedUseQueryResult<AutoImportRequestPackageType[], AxiosError> => {
  const { activeTab } = useTabContext();

  const handleFetch = async () => {
    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    const reqOptions = {
      url: "https://rac-backend.onrender.com/api/auto-import-requests",
      method: "GET",
      headers: headersList,
    };

    const response = await axios.request(reqOptions);
    console.log(response);
    const { importRequests } = response.data as Root;
    const autoImportRequestsPackages: AutoImportRequestPackageType[] =
      importRequests.map((request) => {
        const requestPackage: AutoImportRequestPackageType = {
          requestId: request.requestId,
          requestStatus:
            request.requestStatus as AutoImportRequestPackageType["requestStatus"],
          requestLocalDate: new Date(request.createdAt).toLocaleString(
            "en-US",
            {
              hour12: false,
            },
          ),
          originWarehouse:
            request.origin as AutoImportRequestPackageType["originWarehouse"],
          items: request.requestItems.map((item) => {
            const requestItem: AutoImportItemType = {
              brand: item.carBrand,
              model: item.model,
              productionYear: item.productionYear,
              value: item.carValue,
              condition: item.carCondition as AutoImportItemType["condition"],
              color: item.color,
              mileage: item.mileage,
              vin: String(item.vehicleIdNumber),
              url: item.link,
              image: item.carImage,
              carTitleCopy: item.carTitle,
              description: item.additionalDescription,
              // todo: missing
              // pickupDetails: {
              //   firstName: "",
              //   lastName: "",
              //   email: "",
              //   countryCode: "",
              //   phoneNumber: "",
              //   address: "",
              //   country: "",
              //   state: "",
              //   city: "",
              //   zipPostalCode: "",
              //   pickUpDate: "",
              //   locationType: "",
              //   pickupCost: 0,
              // },
            };

            return requestItem;
          }),
          destinationDetails: {
            firstName: "", // todo: missing
            lastName: "", // todo: missing
            email: "", // todo: missing
            countryCode: "", // todo: missing
            phoneNumber: "", // todo: missing
            address: "", // todo: missing
            country: "", // todo: missing
            state: "", // todo: missing
            city: "", // todo: missing
            zipPostalCode: "", // todo: missing
          },
          billingDetails: {
            firstName:
              request.shippingAndBillingInfo.billingInformation[0]?.firstName ??
              "",
            lastName:
              request.shippingAndBillingInfo.billingInformation[0]?.lastName ??
              "",
            email:
              request.shippingAndBillingInfo.billingInformation[0]?.email ?? "",
            countryCode:
              request.shippingAndBillingInfo.billingInformation[0]
                ?.countryCode ?? "",
            phoneNumber:
              request.shippingAndBillingInfo.billingInformation[0]
                ?.phoneNumber ?? "",
            address:
              request.shippingAndBillingInfo.billingInformation[0]
                ?.streetAddress ?? "",
            country:
              request.shippingAndBillingInfo.billingInformation[0]?.country ??
              "",
            state:
              request.shippingAndBillingInfo.billingInformation[0]?.state ?? "",
            city:
              request.shippingAndBillingInfo.billingInformation[0]?.city ?? "",
            zipPostalCode:
              request.shippingAndBillingInfo.billingInformation[0]?.zipCode ??
              "",
          },
          shippingMethod: "basic", // todo: missing

          shippingPaymentStatus:
            request.processingFeeStatus as AutoImportRequestPackageType["shippingPaymentStatus"],
          clearingPaymentStatus:
            request.processingFeeStatus as AutoImportRequestPackageType["clearingPaymentStatus"],
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

    return autoImportRequestsPackages;
  };

  const query = useQuery<AutoImportRequestPackageType[], AxiosError>({
    queryKey: ["autoAutoImportRequests"],
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
  serviceType: string;
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
}

export interface ShippingAndBillingInfo {
  billingInformation: BillingInformation[];
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

export interface RequestItem {
  carBrand: string;
  model: string;
  productionYear: string;
  carValue: number;
  carCondition: string;
  color: string;
  mileage: number;
  vehicleIdNumber: number;
  link: string;
  carImage: string;
  carTitle: string;
  additionalDescription: string;
  _id: string;
  additionalProperties: [];
}

export default useFetchAutoAutoImportRequests;
