import axios from "axios";
import { type ResetChangePassType } from "~/contexts/AuthContext";

const useResetChangePassword = async (inputs: ResetChangePassType) => {
  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  console.log(inputs)
  const reqOptions = {
    url: "https://rac-backend.onrender.com/api/users/verify-otp-update-password",
    method: "PUT",
    headers: headersList,
    data: inputs,
  };

  const response = await axios.request(reqOptions);
  return response.data as Root;
};

export interface Root {
  message: string;
}

export default useResetChangePassword;
