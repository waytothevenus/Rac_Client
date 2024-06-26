import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type HandleSubmitProps = { oldPassword: string; newPassword: string };

const useSubmitNewPassword = (token: string) => {
  const handleSubmit = async ({
    oldPassword,
    newPassword,
  }: HandleSubmitProps) => {
    const data = { oldPassword, newPassword };

    console.table(data);

    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    const reqOptions = {
      url: "https://rac-backend.onrender.com/api/users/profile/password",
      method: "PUT",
      headers: headersList,
      data,
    };

    const response = await axios.request(reqOptions);
    console.log(response);
    return response.data as Root;
  };

  return useMutation({
    mutationFn: handleSubmit,
  });
};

export interface Root {
  message: string;
}

export default useSubmitNewPassword;
