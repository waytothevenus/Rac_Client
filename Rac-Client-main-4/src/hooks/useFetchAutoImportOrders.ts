import { useQuery, type DefinedUseQueryResult } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import {
  type AutoImportItemType,
  type AutoImportOrderPackageType,
} from "~/contexts/AutoImportContext";
import { useTabContext } from "~/contexts/TabContext";

const useFetchAutoImportOrders = (
  token: string,
): DefinedUseQueryResult<AutoImportOrderPackageType[], AxiosError> => {
  const { activeTab } = useTabContext();

  const handleFetch = async () => {
    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    const reqOptions = {
      url: "https://rac-backend.onrender.com/api/auto-import-orders/",
      method: "GET",
      headers: headersList,
    };

    const response = await axios.request(reqOptions);
    const { autoImportOrders } = response.data as Root;
    const autoImportOrderPackages: AutoImportOrderPackageType[] =
      autoImportOrders.map((order) => {
        const orderPackage: AutoImportOrderPackageType = {
          orderId: order.orderId,
          orderStatus:
            order.orderStatus.toLowerCase() as AutoImportOrderPackageType["orderStatus"],
          orderLocalDate: new Date(order.createdAt).toLocaleString("en-US", {
            hour12: false,
          }),
          trackingId: order.trackingId,
          shippingStatus:
            order.shippingStatus.toLowerCase() as AutoImportOrderPackageType["shippingStatus"],
          originWarehouse:
            order.origin as AutoImportOrderPackageType["originWarehouse"],
          destinationDetails: {
            firstName:
              order.shippingAndBillingInfo.billingInformation[0]?.firstName ??
              "",
            lastName:
              order.shippingAndBillingInfo.billingInformation[0]?.lastName ??
              "",
            email:
              order.shippingAndBillingInfo.billingInformation[0]?.email ?? "",
            countryCode:
              order.shippingAndBillingInfo.billingInformation[0]?.countryCode ??
              "",
            phoneNumber:
              order.shippingAndBillingInfo.billingInformation[0]?.phoneNumber ??
              "",
            address:
              order.shippingAndBillingInfo.billingInformation[0]
                ?.streetAddress ?? "",
            country:
              order.shippingAndBillingInfo.billingInformation[0]?.country ?? "",
            state:
              order.shippingAndBillingInfo.billingInformation[0]?.state ?? "",
            city:
              order.shippingAndBillingInfo.billingInformation[0]?.city ?? "",
            zipPostalCode:
              order.shippingAndBillingInfo.billingInformation[0]?.zipCode ?? "",
          },
          items: order.requestItems.map((item) => {
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
          billingDetails: {
            firstName:
              order.shippingAndBillingInfo.billingInformation[1]?.firstName ??
              "",
            lastName:
              order.shippingAndBillingInfo.billingInformation[1]?.lastName ??
              "",
            email:
              order.shippingAndBillingInfo.billingInformation[1]?.email ?? "",
            countryCode:
              order.shippingAndBillingInfo.billingInformation[1]?.countryCode ??
              "",
            phoneNumber:
              order.shippingAndBillingInfo.billingInformation[1]?.phoneNumber ??
              "",
            address:
              order.shippingAndBillingInfo.billingInformation[1]
                ?.streetAddress ?? "",
            country:
              order.shippingAndBillingInfo.billingInformation[1]?.country ?? "",
            state:
              order.shippingAndBillingInfo.billingInformation[1]?.state ?? "",
            city:
              order.shippingAndBillingInfo.billingInformation[1]?.city ?? "",
            zipPostalCode:
              order.shippingAndBillingInfo.billingInformation[1]?.zipCode ?? "",
          },
          shippingMethod: "basic", // todo: missing
          shippingPaymentStatus:
            order.processingFeeStatus as AutoImportOrderPackageType["shippingPaymentStatus"],
          clearingPaymentStatus:
            order.processingFeeStatus as AutoImportOrderPackageType["clearingPaymentStatus"],
          packageCosts: {
            shippingCost: order.shippingCost,
            clearingPortHandlingCost: 0, // todo: missing
            otherCharges: order.otherCharges,
            storageCharge: 0, // todo: missing
            insurance: order.insurance,
            valueAddedTax: order.vat,
            paymentMethodSurcharge: order.paymentMethodSurcharge,
            discount: order.discount,
          },
        };

        return orderPackage;
      });

    return autoImportOrderPackages;
  };

  const query = useQuery<AutoImportOrderPackageType[], AxiosError>({
    queryKey: ["autoImportOrders"],
    queryFn: async () => {
      console.log("fetching user order packages");
      const res = await handleFetch();
      const packages = res;
      if (packages.length > 0) {
        console.log("user order packages: ", packages);
        return packages;
      }

      return [];
    },
    initialData: [],
    enabled: activeTab === "orders",
  });

  return query;
};

export interface Root {
  success: boolean;
  totalOrders: number;
  autoImportOrders: AutoImportOrder[];
}

export interface AutoImportOrder {
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
  processingFeeStatusPaidAt: string;
  totalShippingCostFeeStatusPaidAt: string;
  transactionDetails: TransactionDetails;
  requestApprovedAt: string;
  discount: number;
  insurance: number;
  otherCharges: number;
  paymentMethodSurcharge: number;
  pickupCost: number;
  shippingCost: number;
  totalShippingCost: number;
  vat: number;
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

export interface TransactionDetails {
  bankType: string;
  transactionDate: string;
  transactionTime: string;
  phoneNumber: string;
  paymentReceipt: string;
  additionalNote: string;
  _id: string;
}

export default useFetchAutoImportOrders;
