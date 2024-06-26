import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useCookies } from "react-cookie";
import { useTabContext } from "~/contexts/TabContext";

export const usePayments = () => {
  const [cookies] = useCookies(["jwt"]);
  const token = cookies.jwt as string;

  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };

  const reqOptions = {
    url: "https://rac-backend.onrender.com/api/payments",
    method: "GET",
    headers: headersList,
  };

  const paymentApi = () => {
    return axios.request(reqOptions);
  };

  const paymentQuery = useQuery({
    queryKey: ["fetch-payments"],
    queryFn: () => paymentApi(),
  });
  const paymentByIdQuery = useQuery({
    queryKey: ["fetch-payment-by-id"],
    queryFn: () => paymentApi(),
  });

  return { paymentQuery, paymentByIdQuery };
};
