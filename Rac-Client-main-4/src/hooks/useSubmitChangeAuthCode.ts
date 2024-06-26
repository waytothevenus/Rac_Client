import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { type OTPEmailChange } from "~/contexts/AuthContext";


const useSubmitChangeAuthCode = async (email: string) => {
  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  // Đảm bảo email được truyền trong một đối tượng JavaScript
  const requestData = { email };

  const reqOptions = {
    url: "https://rac-backend.onrender.com/api/users/send-password-reset-otp",
    method: "POST",
    headers: headersList,
    // Truyền requestData vào data thay vì email trực tiếp
    data: requestData,
  };

  const response = await axios.request(reqOptions);
  return response.data as Main;
};

export interface Main {
  message: string;
}


// export interface User {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   isAdmin: boolean;
//   isEmailVerified: boolean;
//   password: string;
//   contactAddress: ContactAddress[];
//   smsNotification: boolean;
//   whatsAppNotification: boolean;
//   emailNotification: boolean;
//   appAuthentication: boolean;
//   emailAuthentication: boolean;
//   racId: string;
//   createdAt: Date;
//   updatedAt: Date;
//   __v: number;
//   lastLogin: Date;
// }

// export interface ContactAddress {
//   country: string;
//   state: string;
//   city: string;
//   streetAddress: string;
//   countryCode: string;
//   phoneNumber: string;
//   postalCode: string;
//   _id: string;
// }

export default useSubmitChangeAuthCode;
