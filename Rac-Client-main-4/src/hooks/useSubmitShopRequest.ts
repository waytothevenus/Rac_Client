import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { type ShopInputs } from "~/components/Shop/Requests/RequestOrder";

const useSubmitShopRequest = (token: string) => {
  const handleSubmit = async (requestPackage: ShopInputs["requestPackage"]) => {
    const formData = new FormData();
    formData.append("origin", requestPackage.originWarehouse);
    requestPackage.items.forEach((item, i) => {
      formData.append(`requestItems[${i}][store]`, item.store);
      formData.append(
        `requestItems[${i}][urgentPurchase]`,
        String(Boolean(item.urgent)),
      );
      formData.append(`requestItems[${i}][itemUrl]`, item.url);
      formData.append(`requestItems[${i}][itemName]`, item.name);
      formData.append(`requestItems[itemImage]`, item.image?.[0] as Blob);
      formData.append(
        `requestItems[${i}][originalCost]`,
        String(item.originalCost),
      );
      formData.append(`requestItems[${i}][qty]`, String(item.quantity));
      formData.append(
        `requestItems[${i}][shippingCost]`,
        String(item.relatedCosts.shippingToOriginWarehouseCost),
      );
      formData.append(
        `requestItems[${i}][additionalDescription]`,
        item.description,
      );

      // todo: first solution
      // item.properties?.forEach((property, j) => {
      //   console.log(j);
      //   formData.append(
      //     `requestItems[${i}][additionalProperties][${j}][label]`,
      //     property.label,
      //   );
      //   formData.append(
      //     `requestItems[${i}][additionalProperties][${j}][description]`,
      //     property.value,
      //   );
      // });
      // todo: second solution
      // if (Array.isArray(item.properties) && item.properties.length > 0) {
      //   formData.append(
      //     `additionalProperties[${i}][label]`,
      //     String(item.properties[0]?.label),
      //   );
      //   formData.append(
      //     `additionalProperties[${i}][description]`,
      //     String(item.properties[0]?.value),
      //   );
      // }
      // todo: remove
      formData.append(`requestItems[${i}][itemColor]`, "blue");
    });

    console.table([...formData]);

    const headersList = {
      Accept: "*/*",
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + token,
    };

    const reqOptions = {
      url: "https://rac-backend.onrender.com/api/sfmRequests/create",
      method: "POST",
      headers: headersList,
      data: formData,
    };

    const response = await axios.request(reqOptions);
    return response.data as Root;
  };

  return useMutation({
    mutationFn: handleSubmit,
  });
};

export interface Root {
  success: boolean;
  data: Data;
}

export interface Data {
  user: string;
  origin: string;
  requestItems: RequestItem[];
  shippingAndBillingInfo: ShippingAndBillingInfo;
  requestStatus: string;
  processingFeeStatus: string;
  orderStatus: string;
  ShippingStatus: string;
  shopForMeStatus: string;
  shopForMeFeeStatus: string;
  requestId: string;
  orderId: string;
  trackingId: string;
  _id: string;
  shipmentUpdates: [];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface RequestItem {
  store: string;
  urgentPurchase: boolean;
  itemUrl: string;
  itemName: string;
  itemImage: string;
  originalCost: number;
  qty: number;
  shippingCost: number;
  additionalDescription: string;
  itemColor: string;
  _id: string;
}

export interface ShippingAndBillingInfo {
  billingInformation: [];
}

export default useSubmitShopRequest;
