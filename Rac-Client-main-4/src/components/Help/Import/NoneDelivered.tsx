import { StepDescription } from "~/components/Shop/Orders/OrdersPanel"

const NoneDelivered = () => {
    return (
        <div className="flex flex-col">
            <div className="flex gap-[12px] items-center pb-4 max-[560px]:flex-col">
                <span className="px-[14px] py-[5px] rounded-[20px] gap-[10px] bg-[#060C2C] text-[#FFFFFF] text-[22px] font-[700] whitespace-nowrap max-[560px]:w-full">Condition 3</span>
                <span className="font-[500] text-[22px] text-[#49454F] leading-[28px]">
                    <span className="font-[700]">Follow the steps below If</span> “None of the items in the package you want to ship has arrived the RAC Logistics warehouse you choose to ship from yet”
                </span>
            </div>
            <div className="flex flex-col gap-[10px]">
                <hr className="w-full border-gray-500 md:hidden" />
                <StepDescription
                    stepNumber={1}
                    description={
                    <>
                        Click the Request new order button, select the Origin warehouse you want to ship from and Package delivery status as ‘None delivered’ 
                    </>
                    }
                />
                <hr className="w-full border-gray-500 md:hidden" />
                <StepDescription
                    stepNumber={2}
                    description={
                    <>
                        The next thing that will come up will show yuou the location of the Origin warehouse you chooses (this is the location you are required to send your items to initiate shipping)
                    </>
                    }
                />
                <hr className="w-full border-gray-500 md:hidden" />
                <StepDescription
                    stepNumber={3}
                    description={
                    <>
                        Once you are sure that this package has gotten to the warehouse address above, attempt requesting for a new import order and provide us information we need to Identify the package as yours.
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

export default NoneDelivered;