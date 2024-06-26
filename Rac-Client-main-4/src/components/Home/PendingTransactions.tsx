import { ArrowRight } from "iconsax-react";
import Link from "next/link";

const PendingTransactions = () => {

    return (
        <>
            <div className="flex gap-[20px]">
                <h2 className="font-bold text-gray-700 text-base">Pending Transactions</h2>
                <div className="flex flex-row w-[125px] font-[400] rounded-[10px] px-3 py-[10px] gap-[12px] border-[0.5px] border-[#B3261E] border-opacity-30 justify-center items-center">
                    <div className="text-[22px] text-[#B3261E]">9</div>
                    <div className="text-[12px] text-[#625B71] tracking-[.4px]">Pending transactions</div>
                </div>
            </div>
            <div className="flex rounded-[20px] bg-white gap-[20px]">
                <div className="flex max-w-[293.33px] flex-col gap-[10px]">
                    <div className="gap-[30px]">
                        <div className="flex">
                            <div className="flex gap-[8px] items-center">
                                <div className="flex flex-row w-[266.33px] border-[0.5px] border-[#B3261E] border-opacity-50 text-[14px] text-[#79747E] font-[400] rounded-[10px] px-[10px] py-[3px] gap-[12px] items-center">
                                    <span className="flex tracking-[.25px]">IN6123578</span>
                                    <span className="flex border-[.5px] h-[10px]"></span>
                                    <span className="text-[12px] font-[500] tracking-[.5px]">Shop for me</span>
                                </div>

                                <div className="flex text-[#79747E] rounded-[20px] w-[18px] h-[24px]">
                                    {<ArrowRight />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="gap-[30px]">
                        <div className="flex">
                            <div className="flex gap-[8px] items-center">
                                <div className="flex flex-row w-[266.33px] border-[0.5px] border-[#B3261E] border-opacity-50 text-[14px] text-[#79747E] font-[400] rounded-[10px] px-[10px] py-[3px] gap-[12px] items-center">
                                    <span className="flex tracking-[.25px]">IN6123578</span>
                                    <span className="flex border-[.5px] h-[10px]"></span>
                                    <span className="text-[12px] font-[500] tracking-[.5px]">Clearing & port handling</span>
                                </div>

                                <div className="flex text-[#79747E] rounded-[20px] w-[18px] h-[24px]">
                                    {<ArrowRight />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="gap-[30px]">
                        <div className="flex">
                            <div className="flex gap-[8px] items-center">
                                <div className="flex flex-row w-[266.33px] border-[0.5px] border-[#B3261E] border-opacity-50 text-[14px] text-[#79747E] font-[400] rounded-[10px] px-[10px] py-[3px] gap-[12px] items-center">
                                    <span className="flex tracking-[.25px]">IN6123578</span>
                                    <span className="flex border-[.5px] h-[10px]"></span>
                                    <span className="text-[12px] font-[500] tracking-[.5px]">Shipping</span>
                                </div>

                                <div className="flex text-[#79747E] rounded-[20px] w-[18px] h-[24px]">
                                    {<ArrowRight />}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link href="#" className="flex font-[400] text-[14px] tracking-[.25px] text-[#6750A4] items-center gap-[12px]">
                        <span>View all</span>
                        <span className="flex w-[18px] h-[24px]">
                            <ArrowRight />
                        </span>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default PendingTransactions;