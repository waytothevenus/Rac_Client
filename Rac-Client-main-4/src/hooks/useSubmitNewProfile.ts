import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { capitalizeWords } from "~/Utils";
import { type ProfileInformationInputs } from "~/components/Settings/ProfileInformation";

const useSubmitNewProfile = (token: string) => {
  const handleSubmit = async (newProfile: ProfileInformationInputs) => {
    const data = {
      firstName: capitalizeWords(newProfile.firstName),
      lastName: capitalizeWords(newProfile.lastName),
      country: newProfile.country,
      state: newProfile.state,
      city: newProfile.city,
      address: newProfile.address,
      zipCode: newProfile.zipPostalCode,
    };
    console.table(data);

    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    const reqOptions = {
      url: "https://rac-backend.onrender.com/api/users/profile",
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

export default useSubmitNewProfile;
