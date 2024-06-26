import { Whatsapp, ArrowCircleLeft2 } from "iconsax-react";
import { RequestFormHeader } from "../Shop/Requests/RequestOrder";
import { StepDescription } from "../Shop/Orders/OrdersPanel";

const HelpShopForMe = ( props:any ) => {
    const { setShowState } = props;

    return (
        <>
        <RequestFormHeader title="How to book a Shop For Me Order"/>
            <p className="text-[24px] text-[#49454F] font-[400]">If you want us help you buy and import from your favorite online stores down to Nigeria, you would be booking a shop for me order.</p>
            <div className="flex w-full flex-col gap-[20px] rounded-[20px] border border-gray-200 px-[14px] py-[20px]">
                <span className="title-md md:title-lg pl-[11px] font-medium md:pl-[14px] md:font-bold">
                    Here is how to pick your package up from our office
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
                        Kindly note that we will review the details of the items that you provided and make changes to the them if they don’t tally with the ones we verify from the store you want to purchase from.
                    </>
                    }
                />
                <hr className="w-full border-gray-500 md:hidden" />
                <StepDescription
                    stepNumber={3}
                    description={
                    <>
                        You will then be requested to confirm and pay for the procurement cost only, to place an order.
                    </>
                    }
                />
                <hr className="w-full border-gray-500 md:hidden" />
                <StepDescription
                    stepNumber={4}
                    description={
                    <>
                        To begin import processing for your procured items, you will be sent a quote containing the shipping cost to Nigeria only when we have purchased and brought the procured items to the <span className="text-[#21005D]">Origin warehouse</span> you selected. 
                    </>
                    }
                />
                <hr className="w-full border-gray-500 md:hidden" />
                <StepDescription
                    stepNumber={5}
                    description={
                    <>
                        And finally, you will be paying for the shipping cost when the package gets to our office in Nigeria (you could inform us about the one closest to you)
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
                    onClick={ e => setShowState(0) }
                    className="btn relative bg-primary-600 max-w-[300px] flex h-[40px] w-full flex-row items-center justify-center gap-x-2 rounded-[6.25rem] border border-gray-500 px-4 py-2.5 text-sm font-medium tracking-[.00714em] text-white md:px-6"
                    >
                    <ArrowCircleLeft2 size={18} variant="Bold" className="text-white" />
                    <span className="body-lg bg-primary-600">Back</span>
                </button>
            </div>
        </>
    )
}

export default HelpShopForMe;