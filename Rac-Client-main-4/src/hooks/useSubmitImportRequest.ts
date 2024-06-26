import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { type ImportInputs } from "~/components/Import/Requests/RequestOrder";

const useSubmitImportRequest = (token: string) => {
  const handleSubmit = async (
    requestPackage: ImportInputs["requestPackage"],
  ) => {
    const formData = new FormData();
    formData.append("origin", requestPackage.originWarehouse);
    formData.append("packageDeliveryStatus", requestPackage.deliveryStatus);
    requestPackage.items.forEach((item, i) => {
      formData.append(`requestItems[${i}][itemName]`, item.name);
      formData.append(`requestItems[${i}][idType]`, item.idType);
      formData.append(`requestItems[${i}][idNumber]`, item.idNumber);
      formData.append(
        `requestItems[${i}][itemDeliveryStatus]`,
        item.deliveryStatus,
      );
      formData.append(`requestItems[${i}][deliveredBy]`, item.deliveredBy);
      formData.append(
        `requestItems[${i}][itemOriginalCost]`,
        String(item.originalCost),
      );
      formData.append(`requestItems[${i}][qty]`, String(item.quantity));
      formData.append(`requestItems[itemImage]`, item.image?.[0] as Blob);
      formData.append(`requestItems[${i}][itemDescription]`, item.description);

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
      url: "https://rac-backend.onrender.com/api/import/create",
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
  packageDeliveryStatus: string;
  requestItems: RequestItem[];
  shippingAndBillingInfo: ShippingAndBillingInfo;
  requestStatus: string;
  processingFeeStatus: string;
  orderStatus: string;
  shippingStatus: string;
  shopForMeStatus: string;
  totalShippingCostFeeStatus: string;
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
  itemName: string;
  idType: string;
  idNumber: string;
  itemDeliveryStatus: string;
  deliveredBy: string;
  itemOriginalCost: number;
  itemDescription: string;
  _id: string;
}

export interface ShippingAndBillingInfo {
  billingInformation: [];
}

export default useSubmitImportRequest;
