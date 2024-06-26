import { Whatsapp, ArrowCircleLeft2 } from "iconsax-react";
import { RequestFormHeader } from "../../Shop/Requests/RequestOrder";
import { StepDescription } from "../../Shop/Orders/OrdersPanel";

const HelpAutoImport = ( props:any ) => {
    const { setShowState3 } = props;

    return (
        <>
        <RequestFormHeader title="How to book an Auto Import Order"/>
            <p className="text-[24px] text-[#49454F] font-[400]">If you want to import cars/vehicles from the US to Nigeria, you would be booking an auto import order.</p>
            <div className="flex w-full flex-col gap-[20px] rounded-[20px] border border-gray-200 px-[14px] py-[20px]">
                <span className="title-md md:title-lg pl-[11px] font-medium md:pl-[14px] md:font-bold">
                    The following are the things you should know about booking an Auto Import Order
                </span>
                <hr className="w-full border-gray-500 md:hidden" />
                <StepDescription
                    stepNumber={1}
                    description={
                    <>
                        Click the Request new order button and provide all the details required.
                    </>
                    }
                />
                <hr className="w-full border-gray-500 md:hidden" />
                <StepDescription
                    stepNumber={2}
                    description={
                    <>
                        We will review the details in your request and get back to you with the shipping quote
                    </>
                    }
                />
                <hr className="w-full border-gray-500 md:hidden" />
                <StepDescription
                    stepNumber={3}
                    description={
                    <>
                        To complete your order and initiate shipment of your car(s), you are required to make payment for shipping and/or pick up only immediately we send you the shipping quote, while you delay the payment for port handling & clearing fees upon their arrival to the port in Nigeria.
                    </>
                    }
                />
                <hr className="w-full border-gray-500 md:hidden" />
                <StepDescription
                    stepNumber={4}
                    description={
                    <>
                        If your shipping address is Lagos, you will come to pick it up in our office otherwise we send it to your city
                    </>
                    }
                />
                <hr className="w-full border-gray-500 md:hidden" />
                <ul className="flex flex-col gap-[10px]">
                    <li className="flex gap-[10px] items-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM14.79 12.53L11.26 16.06C11.11 16.21 10.92 16.28 10.73 16.28C10.54 16.28 10.35 16.21 10.2 16.06C9.91 15.77 9.91 15.29 10.2 15L13.2 12L10.2 9C9.91 8.71 9.91 8.23 10.2 7.94C10.49 7.65 10.97 7.65 11.26 7.94L14.79 11.47C15.09 11.76 15.09 12.24 14.79 12.53Z" fill="#1D192B"/>
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
                    onClick={ e => setShowState3(0) }
                    className="btn relative bg-primary-600 max-w-[300px] flex h-[40px] w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] border border-gray-500 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white md:px-6"
                    >
                    <ArrowCircleLeft2 size={18} variant="Bold" className="text-white" />
                    <span className="body-lg bg-primary-600">Back</span>
                </button>
            </div>
        </>
    )
}

export default HelpAutoImport;