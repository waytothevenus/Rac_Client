import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ArrowRight } from "iconsax-react";
import { BACKEND_API } from "~/constants";

const TotalOrders = () => {
    const [cookies] = useCookies(["jwt"]);
    const token = cookies.jwt as string;

    const headersList = {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
    };

    const [shopOrders, setShopOrders] = useState<any[]>([]);
    const [importOrders, setImportOrders] = useState<any[]>([]);
    const [exportOrders, setExportOrders] = useState<any[]>([]);
    const [autoImportOrders, setAutoImportOrders] = useState<any[]>([]);

    useEffect(() => {
        axios
            .get(BACKEND_API + 'sfmOrders', {
                headers: headersList
            })
            .then(res => {
                setShopOrders([...res.data]);
            })
            .catch(err => {
                setShopOrders([]);
            });
        axios
            .get(BACKEND_API + 'import-orders', {
                headers: headersList
            })
            .then(res => {
                setImportOrders([...res.data]);
            })
            .catch(err => {
                setImportOrders([]);
            });
        axios
            .get(BACKEND_API + 'export-orders', {
                headers: headersList
            })
            .then(res => {
                setExportOrders([...res.data]);
            })
            .catch(err => {
                setExportOrders([]);
            });
        axios
            .get(BACKEND_API + 'AIO', {
                headers: headersList
            })
            .then(res => {
                setAutoImportOrders([...res.data]);
            })
            .catch(err => {
                setAutoImportOrders([]);
            });

    }, []);

    return (
        <>
            <div className="flex flex-col">
                <h2 className="font-bold text-gray-700 text-base">Total Orders</h2>
            </div>
            <div className="flex flex-row rounded-[20px] bg-white gap-[20px]">

                <div className="flex max-w-[293.33px] flex-col gap-[10px]">
                    <div className="gap-[30px]">
                        <div className="flex max-w-[202.33px] flex-row">
                            <div className="flex gap-[12px] text-[14px] leading-[20px] items-center">
                                <div className="flex flex-col border-[0.5px] border-[#B3261E] border-opacity-50 text-center text-[14px] text-[#B3261E] font-[500] rounded-[10px] w-[50px] px-[10px] py-[3px]">
                                    {shopOrders.length}
                                </div>
                                <div className="flex w-[80px] h-[20px] font-[400] text-[#79747E] tracking-[.25px]">
                                    Shop for me
                                </div>
                                <div className="flex text-[#79747E] rounded-[20px] w-[18px] h-[24px]">
                                    {<ArrowRight />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="gap-[30px]">
                        <div className="flex max-w-[202.33px] flex-row">
                            <div className="flex gap-[12px] text-[14px] leading-[20px] items-center">
                                <div className="flex flex-col border-[0.5px] border-[#4A4458] border-opacity-50 text-center text-[14px] text-[#4A4458] leading-[20px] font-[500] rounded-[10px] w-[50px] px-[10px] py-[3px]">
                                    {importOrders.length}
                                </div>
                                <div className="flex w-[80px] h-[20px] font-[400] text-[#79747E] tracking-[.25px]">
                                    Export
                                </div>
                                <div className="flex text-[#79747E] rounded-[20px] w-[18px] h-[24px]">
                                    {<ArrowRight />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="gap-[30px]">
                        <div className="flex max-w-[202.33px] flex-row">
                            <div className="flex gap-[12px] text-[14px] leading-[20px] items-center">
                                <div className="flex flex-col border-[0.5px] border-[#DF5000] border-opacity-50 text-center text-[14px] text-[#DF5000] font-[500] rounded-[10px] w-[50px] px-[10px] py-[3px]">
                                    {exportOrders.length}
                                </div>
                                <div className="flex w-[80px] h-[20px] font-[400] text-[#79747E] tracking-[.25px]">
                                    Import
                                </div>
                                <div className="flex text-[#79747E] rounded-[20px] w-[18px] h-[24px]">
                                    {<ArrowRight />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="gap-[30px]">
                        <div className="flex max-w-[202.33px] flex-row">
                            <div className="flex gap-[12px] text-[14px] leading-[20px] items-center">
                                <div className="flex flex-col border-[0.5px] border-[#6750A4] border-opacity-50 text-center text-[14px] text-[#6750A4] font-[500] rounded-[10px] w-[50px] px-[10px] py-[3px]">
                                    {autoImportOrders.length}
                                </div>
                                <div className="flex w-[80px] h-[20px] font-[400] text-[#79747E] tracking-[.25px]">
                                    Auto Import
                                </div>
                                <div className="flex text-[#79747E] rounded-[20px] w-[18px] h-[24px]">
                                    {<ArrowRight />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col font-[400] items-center justify-center rounded-[10px] px-[3px] py-[10px] gap-[3px] border-[0.5px] border-[#B3261E] border-opacity-30 w-[91px]">
                    <span className="text-[22px] text-[#B3261E]">{`${shopOrders.length + importOrders.length + exportOrders.length + autoImportOrders.length}`}</span>
                    <span className="text-[12px] text-[#625B71] tracking-[.4px]">Total Orders</span>
                </div>
            </div>
        </>
    )
}

export default TotalOrders;