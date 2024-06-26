import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { warehouseAddresses } from "~/constants";
import { BACKEND_API } from "~/constants";

type AddressDetail = {
  label: string;
  value: string;
  colSpanMobile?: "full" | number;
  colSpanDesktop?: "full" | number;
};

export const AddressDetail = ({
  label,
  value,
  colSpanMobile = "full",
  colSpanDesktop = "full",
}: AddressDetail) => {
  return (
    <div
      className={`col-span-${colSpanMobile} flex flex-col gap-[5px] md:col-span-${colSpanDesktop}`}
    >
      <span className="body-md h-[40px] max-w-[100px] text-primary-600">
        {label}:
      </span>
      <span className="title-md md:title-lg font-medium text-primary-900">
        {value}
      </span>
    </div>
  );
};

export const WarehouseAddress = (props: any) => {
  const { country } = props;
  const [short, setShort] = useState('NG');

  useEffect(() => {
    if (country === 'Nigeria') setShort("NG");
    else if (country === 'UK') setShort("BG");
    else if (country === 'US') setShort("US");
    else if (country === 'China') setShort("CN");
    else setShort("AE");
  }, [country]);

  const [warehouseLocation, setWarehouseLocation] = useState('Nigria');
  const [warehouseAddress, setWarehouseAddress] = useState<{
    street: String,
    city: String,
    state: String,
    country: String,
    code: String,
  }>({
    street: "29b Osolo way ajao estate",
    city: "Isolo",
    state: "Lagos",
    country: "Nigeria",
    code: "",
  });

  const [cookies] = useCookies(["jwt"]);
  const token = cookies.jwt as string;
  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };

  const [user, setUser] = useState<{
    email: string,
    firstName: string,
    lastName: string,
    phone: string
  }>({
    email: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const [reqOptions, setReqOptions] = useState({
    url: BACKEND_API + "users/profile",
    method: "GET",
    headers: headersList
  });

  useEffect(() => {
    axios
      .request(reqOptions)
      .then(res => {
        const contactInfo = res.data.user.contactAddress[0];
        setUser({
          email: res.data.user.email,
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
          phone: contactInfo.phoneNumber
        })
      })
  }, [token]);

  return (
    <>
      <div className="flex items-center">
        <span className="title-md md:title-lg text-primary-900">
          Warehouse Address
        </span>

        <hr className="mx-[10px] flex-grow border-dashed border-primary-900" />
      </div>
      <div className="grid w-full grid-cols-1 gap-[20px] md:grid-cols-10">
        <AddressDetail label="First Name" value={user.firstName} colSpanDesktop={4} />
        <AddressDetail label="Last Name" value={user.lastName} colSpanDesktop={4} />
        <AddressDetail label="Phone Number" value={user.phone} colSpanDesktop={4} />
        <AddressDetail label="Email" value={user.email} colSpanDesktop={4} />
        <AddressDetail
          label="Street Address"
          value={warehouseAddresses(short).street}
        />
        <AddressDetail
          label="State"
          value={warehouseAddresses(short).state}
          colSpanMobile={1}
          colSpanDesktop={2}
        />
        <AddressDetail
          label="City"
          value={warehouseAddresses(short).city}
          colSpanMobile={1}
          colSpanDesktop={2}
        />
        <AddressDetail
          label="Zip/postal Code"
          value={warehouseAddresses(short).code}
          colSpanMobile={1}
          colSpanDesktop={2}
        />
      </div>
    </>
  );
}
