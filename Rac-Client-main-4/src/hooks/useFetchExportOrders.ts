import { useQuery, type DefinedUseQueryResult } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import {
  type ExportItemType,
  type ExportOrderPackageType,
} from "~/contexts/ExportContext";
import { useTabContext } from "~/contexts/TabContext";

const useFetchExportOrders = (
  token: string,
): DefinedUseQueryResult<ExportOrderPackageType[], AxiosError> => {
  const { activeTab } = useTabContext();

  const handleFetch = async () => {
    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    const reqOptions = {
      url: "https://rac-backend.onrender.com/api/export-orders",
      method: "GET",
      headers: headersList,
    };

    const response = await axios.request(reqOptions);
    const { exportOrders } = response.data as Root;
    const exportOrderPackages: ExportOrderPackageType[] = exportOrders.map(
      (order) => {
        const orderPackage: ExportOrderPackageType = {
          orderId: order.orderId,
          orderStatus:
            order.orderStatus.toLowerCase() as ExportOrderPackageType["orderStatus"],
          orderLocalDate: new Date(order.createdAt).toLocaleString("en-US", {
            hour12: false,
          }),
          trackingId: order.trackingId,
          shippingStatus:
            order.ShippingStatus.toLowerCase() as ExportOrderPackageType["shippingStatus"],
          originWarehouse:
            order.origin as ExportOrderPackageType["originWarehouse"],
          destinationDetails: {
            firstName:
              order.shippingAndBillingInfo.shipmentAddress.receiverFirstName,
            lastName:
              order.shippingAndBillingInfo.shipmentAddress.receiverLastName,
            email: order.shippingAndBillingInfo.shipmentAddress.receiverEmail,
            countryCode:
              order.shippingAndBillingInfo.shipmentAddress.receiverCountryCode,
            phoneNumber:
              order.shippingAndBillingInfo.shipmentAddress.receiverPhone,
            address:
              order.shippingAndBillingInfo.shipmentAddress.receiverHouseAddress,
            country:
              order.shippingAndBillingInfo.shipmentAddress.receiverCountry,
            state: order.shippingAndBillingInfo.shipmentAddress.receiverState,
            city: order.shippingAndBillingInfo.shipmentAddress.receiverCity,
            zipPostalCode:
              order.shippingAndBillingInfo.shipmentAddress.receiverZipCode,
          },
          items: order.requestItems.map((item) => {
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
              image: item.itemImage,
              description: item.itemDescription,
            };

            return requestItem;
          }),
          billingDetails: {
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
          shippingMethod: "basic", // todo: missing
          shippingPaymentStatus:
            order.processingFeeStatus as ExportOrderPackageType["shippingPaymentStatus"],
          packageCosts: {
            shippingCost: order.shippingCost,
            clearingPortHandlingCost: order.portHandling,
            otherCharges: order.otherCharges,
            storageCharge: 0, // todo: missing
            insurance: order.insurance,
            valueAddedTax: order.vat,
            paymentMethodSurcharge: order.paymentMethodSurcharge,
            discount: order.discount,
          },
        };

        return orderPackage;
      },
    );

    return exportOrderPackages;
  };

  const query = useQuery<ExportOrderPackageType[], AxiosError>({
    queryKey: ["exportOrders"],
    queryFn: async () => {
      console.log("fetching user order packages");
      const res = await handleFetch();
      const packages = res;
      if (packages.length > 0) {
        console.log("user order packages: ", packages);
        return packages;
      }

      console.log("user order packages empty");
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
  exportOrders: ExportOrder[];
}

export interface ExportOrder {
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
  transactionDetails: TransactionDetails;
  requestApprovedAt: string;
  discount: number;
  insurance: number;
  otherCharges: number;
  paymentMethodSurcharge: number;
  portHandling: number;
  shippingCost: number;
  totalFee: number;
  vat: number;
}

export interface ShippingAndBillingInfo {
  billingInformation: BillingInformation[];
  shipmentAddress: ShipmentAddress;
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
  receiverFirstName: string;
  receiverLastName: string;
  receiverEmail: string;
  receiverCountryCode: string;
  receiverPhone: string;
  receiverHouseAddress: string;
  receiverCountry: string;
  receiverState: string;
  receiverCity: string;
  receiverZipCode: string;
  _id: string;
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

export interface TransactionDetails {
  bankType: string;
  transactionDate: string;
  transactionTime: string;
  phoneNumber: string;
  paymentReceipt: string;
  additionalNote: string;
  _id: string;
}

export default useFetchExportOrders;
