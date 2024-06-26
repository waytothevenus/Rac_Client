import { useEffect, useState } from "react";
import { Country } from "country-state-city";
import { useCookies } from "react-cookie";
import axios from "axios";
import SelectInput from "../Forms/Inputs/SelectInput";
import CopyAddressButton from "../Buttons/CopyAddressButton";
import { warehouseAddresses } from "~/constants";
import { BACKEND_API } from "~/constants";

const RacLogistics = () => {
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

    useEffect(() => {
        setWarehouseAddress({
            street: warehouseAddresses(warehouseLocation).street,
            city: warehouseAddresses(warehouseLocation).city,
            state: warehouseAddresses(warehouseLocation).state,
            country: warehouseAddresses(warehouseLocation).country,
            code: warehouseAddresses(warehouseLocation).code,
        });
        console.log(warehouseLocation)
    }, [warehouseLocation]);

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
    }>({ email: '', firstName: '', lastName: '', phone: '' });

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
            <div className="flex gap-[20px]">
                <h2 className="font-bold text-gray-700 text-base">My RAC Logistics Warehouse locations</h2>
            </div>
            <div className="rounded-[20px] bg-white gap-[20px] font-[400] text-[14px] text-[#79747E] tracking-[.25px]">
                Our warehouses are in
                <span className="text-[#6750A4]"> Nigeria, the U.S., the U.K., China, and Dubai. </span>
                Use our addresses for international online store purchases or sending items to Nigeria for export. We promptly assist with imports/exports upon arrival. Contact us for shipping to/from other countries aside the ones mentioned above. Choose your preferred country below for warehouse locations.
            </div>
            <div className="py-[10px]">
                <SelectInput
                    id="originCountry"
                    label="Select Country"
                    onChange={e => setWarehouseLocation(e.target.value)}
                    options={
                        <>
                            <option value="" disabled hidden>
                                Enter the origin country
                            </option>
                            {Country.getAllCountries().map(({ name, isoCode }) => {
                                if (isoCode === 'NG' || isoCode === 'GB' || isoCode === 'US' || isoCode === 'CN' || isoCode === 'AE') {
                                    return (
                                        <option key={`country-${name}`} value={isoCode}>
                                            {name}
                                        </option>
                                    );
                                }
                            })}
                        </>
                    }
                />
            </div>
            <div className="flex flex-col px-[10px] gap-[10px]">
                <div className="flex flex-col border-t border-dashed border-t-[#49454F] max-h-[330px]">
                    <div className="font-[700] gap-[5px] pt-[10px]">
                        {user.firstName} {user.lastName}
                    </div>
                    <span className="font-[400] text-[14px] text-[#49454F] tracking-[.25px]">
                        {user.phone}
                    </span>
                    <span className="font-[400] text-[14px] text-[#49454F] tracking-[.25px]">
                        {user.email}
                    </span>
                    <span className="font-[400] text-[14px] text-[#49454F] tracking-[.25px] overflow-auto max-h-[42px]">
                        {warehouseAddress.street}, {warehouseAddress.city}, {warehouseAddress.state}, {warehouseAddress.country}, {warehouseAddress.code}
                    </span>
                </div>
                <CopyAddressButton address={warehouseAddress} />

            </div>
        </>
    )
}

export default RacLogistics;