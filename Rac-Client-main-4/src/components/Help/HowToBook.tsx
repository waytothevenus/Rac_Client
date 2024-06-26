import { Whatsapp, ArrowRight } from "iconsax-react";
import { RequestFormHeader } from "../Shop/Requests/RequestOrder";
import { StepDescription } from "../Shop/Orders/OrdersPanel";
import HelpShopForMe from "./HelpShopForMe";
import { useState } from "react";
import HelpImportOrder from "./Import/HelpImportOrder";
import HelpExportOrder from "./Export/HelpExportOrder";
import HelpAutoImport from "./AutoImport/HelpAutoImport";
import RacLogistics from "./RacLogistics/RacLogistics";

const HowToBook = () => {
    const [show, setShow] = useState(0);

    return (
        <div className="flex flex-col gap-[20px]">
            {
                show === 0 &&
                <>
                    <div className="flex flex-col gap-[12px]">
                        <h2 className="font-bold text-gray-700 text-base text-[24px]"><b>Dear Rex,</b> what do you need help with?</h2>
                        <span className="font-[400] text-[22px]">Use any of the options below to get guidance or help with your tasks on our platform.</span>
                    </div>
                    <div className="flex flex-row rounded-[20px] bg-white gap-[20px]">
                        <div className="flex flex-col w-full gap-[30px]">
                            <ul className="flex flex-col gap-[10px]">
                                <a href="#" className="flex gap-[10px] items-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM14.79 12.53L11.26 16.06C11.11 16.21 10.92 16.28 10.73 16.28C10.54 16.28 10.35 16.21 10.2 16.06C9.91 15.77 9.91 15.29 10.2 15L13.2 12L10.2 9C9.91 8.71 9.91 8.23 10.2 7.94C10.49 7.65 10.97 7.65 11.26 7.94L14.79 11.47C15.09 11.76 15.09 12.24 14.79 12.53Z" fill="#1D192B" />
                                    </svg>
                                    <span className="font-[500] text-[14px] tracking-[.1px]">Check Popular Topics</span>
                                </a>

                                <a href="#" onClick={e => { e.preventDefault(); setShow(1); }} className="flex w-full border border-[#CAC4D0] py-[6px] px-[20px] rounded-[20px]">
                                    <span className="font-[400] text-[16px] tracking-[.5px] whitespace-nowrap">How to book a <b>Shop for me</b> order</span>
                                    <span className="flex justify-end w-full">
                                        <ArrowRight />
                                    </span>
                                </a>
                                <a href="#" onClick={e => { e.preventDefault(); setShow(2); }} className="flex w-full border border-[#CAC4D0] py-[6px] px-[20px] rounded-[20px]">
                                    <span className="font-[400] text-[16px] tracking-[.5px] whitespace-nowrap">How to book an <b>Import</b> order</span>
                                    <span className="flex justify-end w-full">
                                        <ArrowRight />
                                    </span>
                                </a>
                                <a href="#" onClick={e => { e.preventDefault(); setShow(3); }} className="flex w-full border border-[#CAC4D0] py-[6px] px-[20px] rounded-[20px]">
                                    <span className="font-[400] text-[16px] tracking-[.5px] whitespace-nowrap">How to book a <b>Export</b> order</span>
                                    <span className="flex justify-end w-full">
                                        <ArrowRight />
                                    </span>
                                </a>
                                <a href="#" onClick={e => { e.preventDefault(); setShow(4); }} className="flex w-full border border-[#CAC4D0] py-[6px] px-[20px] rounded-[20px]">
                                    <span className="font-[400] text-[16px] tracking-[.5px] whitespace-nowrap">How to book an <b>Auto Import</b> order</span>
                                    <span className="flex justify-end w-full">
                                        <ArrowRight />
                                    </span>
                                </a>
                                <a href="#" onClick={e => { e.preventDefault(); setShow(5); }} className="flex w-full border border-[#CAC4D0] py-[6px] px-[20px] rounded-[20px] items-center">
                                    <span className="font-[400] text-[16px] tracking-[.5px]">Find out about your RAC Logistics <b>Warehouse Locations</b> in each country</span>
                                    <span className="flex justify-end ml-[auto] mr-0">
                                        <ArrowRight />
                                    </span>
                                </a>
                            </ul>
                            <ul className="flex flex-col gap-[10px]">
                                <li className="flex gap-[10px] items-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM14.79 12.53L11.26 16.06C11.11 16.21 10.92 16.28 10.73 16.28C10.54 16.28 10.35 16.21 10.2 16.06C9.91 15.77 9.91 15.29 10.2 15L13.2 12L10.2 9C9.91 8.71 9.91 8.23 10.2 7.94C10.49 7.65 10.97 7.65 11.26 7.94L14.79 11.47C15.09 11.76 15.09 12.24 14.79 12.53Z" fill="#1D192B" />
                                    </svg>
                                    <span className="font-[500] text-[14px] tracking-[.1px]">Have A Different Concern?</span>
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
                        </div>
                    </div>
                </>
            }
            {
                show === 1 &&
                <HelpShopForMe setShowState={setShow} />
            }
            {
                show === 2 &&
                <HelpImportOrder setShowState1={setShow} />
            }
            {
                show === 3 &&
                <HelpExportOrder setShowState2={setShow} />
            }
            {
                show === 4 &&
                <HelpAutoImport setShowState3={setShow} />
            }
            {
                show === 5 &&
                <RacLogistics setShowState4={setShow} />
            }
        </div>
    )
}

export default HowToBook;