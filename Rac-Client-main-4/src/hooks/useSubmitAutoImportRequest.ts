import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { type AutoImportInputs } from "~/components/AutoImport/Requests/RequestOrder";

const useSubmitAutoImportRequest = (token: string) => {
  const handleSubmit = async (
    requestPackage: AutoImportInputs["requestPackage"],
  ) => {
    const formData = new FormData();
    formData.append("origin", requestPackage.originWarehouse);
    requestPackage.items.forEach((item, i) => {
      formData.append(`requestItems[${i}][carBrand]`, item.brand);
      formData.append(`requestItems[${i}][model]`, item.model);
      formData.append(
        `requestItems[${i}][productionYear]`,
        item.productionYear,
      );
      formData.append(`requestItems[${i}][carValue]`, String(item.value));
      formData.append(`requestItems[${i}][carCondition]`, item.condition);
      formData.append(`requestItems[${i}][color]`, item.color);
      formData.append(`requestItems[${i}][mileage]`, String(item.mileage));
      formData.append(`requestItems[${i}][vehicleIdNumber]`, String(item.vin));
      formData.append(`requestItems[${i}][link]`, item.url);
      formData.append(`requestItems[carImage]`, item.image?.[0] as Blob);
      formData.append(`requestItems[carTitle]`, item.carTitleCopy?.[0] as Blob);
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
      url: "https://rac-backend.onrender.com/api/auto-import-requests/create",
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
  serviceType: string;
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

export interface ShippingAndBillingInfo {
  billingInformation: [];
}

export default useSubmitAutoImportRequest;
