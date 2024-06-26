import { StepDescription } from "~/components/Shop/Orders/OrdersPanel"

const AllDelivered = () => {
    return (
        <div className="flex flex-col">
            <div className="flex gap-[12px] items-center pb-4 max-[560px]:flex-col">
                <span className="px-[14px] py-[5px] rounded-[20px] gap-[10px] bg-[#DF5000] text-[#FFFFFF] text-[22px] font-[700] whitespace-nowrap max-[560px]:w-full">Condition 1</span>
                <span className="font-[500] text-[22px] text-[#49454F] leading-[28px]">
                    <span className="font-[700]">Follow the steps below If</span> “All of the items in the package you want to ship has arrived the RAC Logistics warehouse you choose to ship from”
                </span>
            </div>
            <div className="flex flex-col gap-[10px]">
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
                        Kindly note that we use the package descriptions you provided in step 1to identify the package you claim to have been delivered to our Warehouse (<a href="#" className="text-[#21005D]">Origin warehouse</a> you selected) for shipping.
                    </>
                    }
                />
                <hr className="w-full border-gray-500 md:hidden" />
                <StepDescription
                    stepNumber={3}
                    description={
                    <>
                        After we have been able to Identify your package, you will be notified so you can proceed to Initiate shipping processes for your package.
                    </>
                    }
                />
                <hr className="w-full border-gray-500 md:hidden" />
                <StepDescription
                    stepNumber={4}
                    description={
                    <>
                        Additionally, you will just agree with the shipping cost to allow us process your Order, You will be paying for the shipment Cost when upon arrival/clearing of your package.
                    </>
                    }
                />
                <hr className="w-full border-gray-500 md:hidden" />
                <StepDescription
                    stepNumber={5}
                    description={
                    <>
                        And finally, you will be paying for the shipping cost when the package gets to our office in Nigeria (you would inform us about the one closest to you in the coming shipping stages)
                    </>
                    }
                />
            </div>
        </div>
    )
}

export default AllDelivered;