import { StepDescription } from "~/components/Shop/Orders/OrdersPanel"

const SomeDelivered = () => {
    return (
        <div className="flex flex-col">
            <div className="flex gap-[12px] items-center pb-4 max-[560px]:flex-col">
                <span className="px-[14px] py-[5px] rounded-[20px] gap-[10px] bg-[#21BCAA] text-[#FFFFFF] text-[22px] font-[700] whitespace-nowrap max-[560px]:w-full">Condition 2 </span>
                <span className="font-[500] text-[22px] text-[#49454F] leading-[28px]">
                    <span className="font-[700]">Follow the steps below If just </span> “Some of the items in the package you want to ship has arrived the RAC Logistics warehouse you choose to ship from”
                </span>
            </div>
            <div className="flex flex-col gap-[10px]">
                <hr className="w-full border-gray-500 md:hidden" />
                <StepDescription
                    stepNumber={1}
                    description={
                    <>
                        Click the Request new order button and provide all the details required for the items that have arrived the warehouse location you choose to ship from.
                    </>
                    }
                />
                <hr className="w-full border-gray-500 md:hidden" />
                <StepDescription
                    stepNumber={2}
                    description={
                    <>
                        Your order request would automatically be saved as draft which you can come back to complete when the other items have arrived.
                    </>
                    }
                />
                <hr className="w-full border-gray-500 md:hidden" />
                <StepDescription
                    stepNumber={3}
                    description={
                    <>
                        Once you are sure that all the items yet to be delivered in your package have gotten to the warehouse you choose to ship from, come to the ‘Draft’ folder to update the ‘Item Delivery Status’ of these items and submit your request for a new import order 
                    </>
                    }
                />
                <hr className="w-full border-gray-500 md:hidden" />
                <StepDescription
                    stepNumber={4}
                    description={
                    <>
                        Here are some tips to help us quickly identify your package
                        <ul className="list-disc">
                            <li className="ml-[20px]">Attach your USER ID on the Package if you can.</li>
                            <li className="ml-[20px]">If you are purchasing the package directly from the seller, provide us the TRACKING ID or any other related ID on the package that is Unique to your order from the seller.</li>
                            <li className="ml-[20px]">If you have the actual picture of the package, provide it while requesting for the Import order on our website</li>
                        </ul>
                    </>
                    }
                />
            </div>
        </div>
    )
}

export default SomeDelivered;