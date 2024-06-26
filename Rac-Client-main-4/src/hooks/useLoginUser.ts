import axios from "axios";
import { type LoginInputs } from "~/components/Forms/Login/LoginForm";

const useLoginUser = async (inputs: LoginInputs) => {
  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  const reqOptions = {
    url: "https://rac-backend.onrender.com/api/users/auth",
    method: "POST",
    headers: headersList,
    data: inputs,
  };

  const response = await axios.request(reqOptions);
  return response.data as Main;
};

export interface Main {
  message: string;
}

export default useLoginUser;
