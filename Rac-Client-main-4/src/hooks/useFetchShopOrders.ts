import { useQuery, type DefinedUseQueryResult } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import {
  type ShopItemType,
  type ShopOrderPackageType,
} from "~/contexts/ShopContext";
import { useTabContext } from "~/contexts/TabContext";

const useFetchShopOrders = (
  token: string,
): DefinedUseQueryResult<any[], AxiosError> => {
  const { activeTab } = useTabContext();

  const handleFetch = async () => {
    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    const reqOptions = {
      url: "https://rac-backend.onrender.com/api/sfmOrders",
      method: "GET",
      headers: headersList,
    };

    const response = await axios.request(reqOptions);

    const { sfmOrders } = response.data;

    console.log("sfmOrderssfmOrderssfmOrders", sfmOrders);

    const shopOrders: any[] = sfmOrders.map((order) => {
      const orderPackage: any = {
        id: order._id,
        orderId: order.orderId,
        orderStatus: order?.orderStatus?.toLowerCase(),
        orderLocalDate: new Date(order.createdAt).toLocaleString("en-US", {
          hour12: false,
        }),
        trackingId: order.trackingId,
        shippingStatus: order?.shippingStatus?.toLowerCase() || "",
        originWarehouse: order?.origin,
        destinationWarehouse: order.destinationWarehouse,
        totalUrgentPurchaseCost: order.totalUrgentPurchaseCost,
        totalItemCostFromStore: order.totalItemCostFromStore,
        totalShippingToOriginWarehouse: order.totalShippingToOriginWarehouse,
        totalProcessingFee: order.totalProcessingFee,
        orderVat: order.orderVat,
        orderPaymentMethodSurcharge: order.orderPaymentMethodSurcharge,
        orderDiscount: order.orderDiscount,
        items: order?.requestItems?.map((item) => {
          const requestItem = {
            store: item.store || "",
            urgent: item.urgent || "",
            url: item.url || "",
            name: item.itemName || "",
            originalCost: item.itemPrice || 0,
            quantity: item.quantity || 0,
            weight: item.weight || 0,
            height: item.height || 0,
            length: item.length || 0,
            width: item.width || 0,
            image: item.itemImage || "",
            description: item.description || "",
            relatedCosts: {
              urgentPurchaseFee: item?.relatedCosts?.urgentPurchaseFee || 0,
              processingFee: item?.relatedCosts?.processingFee || 0,
              shippingToOriginWarehouseCost:
                item?.relatedCosts?.shippingToOriginWarehouseCost || 0,
              shopForMeCost: item?.relatedCosts?.shopForMeCost || 0,
            },
          };

          return requestItem;
        }),
        billingDetails: {
          firstName:
            order.shippingAndBillingInfo.billingInformation[0]?.firstName ?? "",
          lastName:
            order.shippingAndBillingInfo.billingInformation[0]?.lastName ?? "",
          email:
            order.shippingAndBillingInfo.billingInformation[0]?.email ?? "",
          countryCode:
            order.shippingAndBillingInfo.billingInformation[0]?.countryCode ??
            "",
          phoneNumber:
            order.shippingAndBillingInfo.billingInformation[0]?.phoneNumber ??
            "",
          address:
            order.shippingAndBillingInfo.billingInformation[0]?.streetAddress ??
            "",
          country:
            order.shippingAndBillingInfo.billingInformation[0]?.country ?? "",
          state:
            order.shippingAndBillingInfo.billingInformation[0]?.state ?? "",
          city: order.shippingAndBillingInfo.billingInformation[0]?.city ?? "",
          zipPostalCode:
            order.shippingAndBillingInfo.billingInformation[0]?.zipCode ?? "",
        },
        totalShopForMeCost: order.shopForMeCost,
        shopForMeStatus: order.shopForMeStatus || 0,
        totalShippingCost: order?.totalShippingCost,
        shippingMethod: order.shippingMethod,
        shippingPaymentStatus: order.processingFeeStatus || 0,
        packageCosts: {
          shippingCost: order.shippingCost || 0,
          clearingPortHandlingCost: order.clearingPortHandling || 0,
          otherCharges: order.otherCharges || 0,
          storageCharge: order.storageCharges || 0,
          insurance: order.insurance || 0,
          valueAddedTax: order.vat || 0,
          paymentMethodSurcharge: order.paymentMethodSurcharge || 0,
          discount: order.discount || 0,
        },
      };

      return orderPackage;
    });

    return shopOrders;
  };

  const query = useQuery<any, AxiosError>({
    queryKey: ["shopOrders"],
    queryFn: async () => {
      try {
        const res = await handleFetch();
        const packages = res;
        if (packages.length > 0) {
          console.log("user order packages: ", packages);
          return packages;
        }

        return [];
      } catch (error) {
        console.log("error", error);
      }
    },
    initialData: [],
    enabled: activeTab === "orders",
  });

  return query;
};

export interface Root {
  success: boolean;
  totalOrders: number;
  sfmOrders: SfmOrder[];
}

export interface SfmOrder {
  shippingAndBillingInfo: ShippingAndBillingInfo;
  _id: string;
  user: string;
  origin: string;
  requestItems: RequestItem[];
  shippingAddress: [];
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
  requestApprovedAt: string;
  discount: number;
  paymentMethodSurcharge: number;
  totalItemCostFromStore: number;
  totalProcessingFee: number;
  totalShippingCost: number;
  totalUrgentPurchaseCost: number;
  vat: number;
  shopForMeCost: number;
  shopForMeCostPaidAt?: string;
  transactionDetails?: TransactionDetails;
  clearingPortHandling: number;
  insurance: number;
  otherCharges: number;
  shippingCost: number;
  shippingDiscount?: number;
  shippingPaymentMethodSurcharge?: number;
  shippingVat?: number;
  storageCharges: number;
  totalShippingCostPaidAt?: string;
  shopForMeFeeStatus: string;
  orderId: string;
  trackingId: string;
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
  itemImage: string;
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

export default useFetchShopOrders;
