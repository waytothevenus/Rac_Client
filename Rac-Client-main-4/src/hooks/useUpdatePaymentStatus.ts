import { useCookies } from "react-cookie";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useUpdatePaymentStatus = () => {
  const [cookies] = useCookies(["jwt"]);
  const token = cookies.jwt as string;
  const headersList = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };

  const updatePaymentApi = (data) => {
    const reqOptions = {
      url: "https://rac-backend.onrender.com/api/sfmRequests/paystack-payment-for-procurement",
      method: "PUT",
      headers: headersList,
      data: {
        orderId: data.orderId,
        refId: data.refId,
      },
    };

    return axios.request(reqOptions);
  };

  const updatePaymentStatus = useMutation({
    mutationFn: updatePaymentApi,
  });

  return { updatePaymentStatus };
};
