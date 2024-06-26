import { useState } from "react";
import { Whatsapp, ArrowCircleLeft2 } from "iconsax-react";
import { RequestFormHeader } from "../../Shop/Requests/RequestOrder";
import Countries from "./Countries";
import { WarehouseAddress } from "./WarehouseAddress";

const RacLogistics = (props: any) => {
    const { setShowState4 } = props;
    const [country, setCountry] = useState('Nigeria');

    return (
        <>
            <RequestFormHeader title="Your RAC Logistics Warehouse Locations " />
            <p className="font-[400] text-[24px] text-[#49454F] leading-[32px]">While our reach continues to expand, our current warehouse and office locations include Nigeria, the United States, the United Kingdom, China and Dubai. Feel free to use the addresses of our warehouse/offices as your shipping address/destination when making purchases from online stores outside Nigeria, or even when you want to send items from your city to our warehouse in Nigeria for Export. This way, we can promptly assist you in importing your items to Nigeria or exporting them from Nigeria as soon as they arrive at our warehouse.</p>
            <p className="font-[400] text-[24px] text-[#49454F] leading-[32px]">For exporting items from Nigeria to any of these countries or importing from them to Nigeria, our website provides the necessary tools. If you wish to import or export from countries beyond these mentioned above, feel free to reach out to us via email or WhatsApp.</p>
            <p className="font-[400] text-[24px] text-[#49454F] leading-[32px]">To get a warehouse location that you can use as your shipping address/destination in any of the listed countries, please select your preferred country below.</p>

            <Countries setCountry={setCountry} />

            <WarehouseAddress country={country} />

            <div>
                <hr className="w-full border-gray-500 md:hidden" />

                <ul className="flex flex-col gap-[10px] pb-[30px]">
                    <li className="flex gap-[10px] items-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM14.79 12.53L11.26 16.06C11.11 16.21 10.92 16.28 10.73 16.28C10.54 16.28 10.35 16.21 10.2 16.06C9.91 15.77 9.91 15.29 10.2 15L13.2 12L10.2 9C9.91 8.71 9.91 8.23 10.2 7.94C10.49 7.65 10.97 7.65 11.26 7.94L14.79 11.47C15.09 11.76 15.09 12.24 14.79 12.53Z" fill="#1D192B" />
                        </svg>
                        <span className="font-[500] text-[14px] tracking-[.1px]">Want More Clarifications?</span>
                    </li>

                    <li className="flex flex-col w-full border border-[#CAC4D0] p-[20px] rounded-[20px] gap-[10px]">
                        <span className="font-[400] text-[16px] tracking-[.5px]">
                            If you would prefer to speak to a live support agent about your concern, please use the button below to chat with us on whatsapp
                        </span>
                        <a href="#" rel="noopener noreferrer">
                            <span className="inline-flex items-center gap-[8px] font-[500] text-[#ffffff] bg-[#6750A4] px-[24px] py-[10px] rounded-full">
                                <Whatsapp />
                                send us a dm
                            </span>
                        </a>
                    </li>
                </ul>
                <button
                    type="button"
                    aria-label="Back"
                    onClick={e => setShowState4(0)}
                    className="btn relative bg-primary-600 max-w-[300px] flex h-[40px] w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] border border-gray-500 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white md:px-6"
                >
                    <ArrowCircleLeft2 size={18} variant="Bold" className="text-white" />
                    <span className="body-lg bg-primary-600">Back</span>
                </button>
            </div>

        </>
    )
}

export default RacLogistics;