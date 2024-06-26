import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCookies } from "react-cookie";

export const useFetchShopRequestPrice = (orderId: string) => {
  const [cookies] = useCookies(["jwt"]);
  const token = cookies.jwt as string;

  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };

  const reqOptions = {
    url: `https://rac-backend.onrender.com/api/sfmRequests/mine/${orderId}`,
    method: "GET",
    headers: headersList,
  };

  const paymentApi = () => {
    return axios.request(reqOptions);
  };

  const shopRequestTotalQuery = useQuery({
    queryKey: ["fetch-shop-request-price"],
    queryFn: () => paymentApi(),
    enabled: orderId ? true : false,
  });

  return { shopRequestTotalQuery };
};
