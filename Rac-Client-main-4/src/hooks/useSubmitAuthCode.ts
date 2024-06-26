import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { type UserType } from "~/contexts/AuthContext";

type Props = {
  email: string;
  sixDigitCode: string;
};

const useSubmitAuthCode = () => {
  const handleSubmit = async (props: Props) => {
    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };

    const data = {
      email: props.email,
      otp: props.sixDigitCode,
    };

    const reqOptions = {
      url: "https://rac-backend.onrender.com/api/users/auth/otp",
      method: "POST",
      headers: headersList,
      data,
    };

    const response = await axios.request(reqOptions);
    const responseData = response.data as Main;

    const user: UserType = {
      firstName: responseData.user.firstName,
      lastName: responseData.user.lastName,
      email: responseData.user.email,
      jwt: responseData.jwt,
      racId: responseData.user.racId,
      billingDetails: {
        countryCode: responseData.user.contactAddress[0]?.countryCode ?? "",
        phoneNumber: responseData.user.contactAddress[0]?.phoneNumber ?? "",
        address: responseData.user.contactAddress[0]?.streetAddress ?? "",
        country: responseData.user.contactAddress[0]?.country ?? "",
        state: responseData.user.contactAddress[0]?.state ?? "",
        city: responseData.user.contactAddress[0]?.city ?? "",
        zipPostalCode: responseData.user.contactAddress[0]?.postalCode ?? "",
      },
      isEmailVerified: responseData.user.isEmailVerified,
      smsNotification: responseData.user.smsNotification,
      whatsAppNotification: responseData.user.whatsAppNotification,
      emailNotification: responseData.user.emailNotification,
      appAuthentication: responseData.user.appAuthentication,
      emailAuthentication: responseData.user.emailAuthentication,
    };

    return user;
  };

  return useMutation({
    mutationFn: handleSubmit,
  });
};

export interface Main {
  message: string;
  jwt: string;
  user: User;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  isEmailVerified: boolean;
  password: string;
  contactAddress: ContactAddress[];
  smsNotification: boolean;
  whatsAppNotification: boolean;
  emailNotification: boolean;
  appAuthentication: boolean;
  emailAuthentication: boolean;
  racId: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  lastLogin: Date;
}

export interface ContactAddress {
  country: string;
  state: string;
  city: string;
  streetAddress: string;
  countryCode: string;
  phoneNumber: string;
  postalCode: string;
  _id: string;
}

export default useSubmitAuthCode;
