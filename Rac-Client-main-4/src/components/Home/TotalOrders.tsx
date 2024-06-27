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
    const init = async () => {
      try {
        await axios
          .get(BACKEND_API + "sfmOrders", {
            headers: headersList,
          })
          .then((res) => {
            setShopOrders([...res.data]);
          })
          .catch((err) => {
            setShopOrders([]);
          });
        await axios
          .get(BACKEND_API + "import-orders", {
            headers: headersList,
          })
          .then((res) => {
            setImportOrders([...res.data]);
          })
          .catch((err) => {
            setImportOrders([]);
          });
        await axios
          .get(BACKEND_API + "export-orders", {
            headers: headersList,
          })
          .then((res) => {
            setExportOrders([...res.data]);
          })
          .catch((err) => {
            setExportOrders([]);
          });
        await axios
          .get(BACKEND_API + "AIO", {
            headers: headersList,
          })
          .then((res) => {
            setAutoImportOrders([...res.data]);
          })
          .catch((err) => {
            setAutoImportOrders([]);
          });
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  return (
    <>
      <div className="flex flex-col">
        <h2 className="text-base font-bold text-gray-700">Total Orders</h2>
      </div>
      <div className="flex flex-row gap-[20px] rounded-[20px] bg-white">
        <div className="flex max-w-[293.33px] flex-col gap-[10px]">
          <div className="gap-[30px]">
            <div className="flex max-w-[202.33px] flex-row">
              <div className="flex items-center gap-[12px] text-[14px] leading-[20px]">
                <div className="flex w-[50px] flex-col rounded-[10px] border-[0.5px] border-[#B3261E] border-opacity-50 px-[10px] py-[3px] text-center text-[14px] font-[500] text-[#B3261E]">
                  {shopOrders.length}
                </div>
                <div className="flex h-[20px] w-[80px] font-[400] tracking-[.25px] text-[#79747E]">
                  Shop for me
                </div>
                <div className="flex h-[24px] w-[18px] rounded-[20px] text-[#79747E]">
                  {<ArrowRight />}
                </div>
              </div>
            </div>
          </div>
          <div className="gap-[30px]">
            <div className="flex max-w-[202.33px] flex-row">
              <div className="flex items-center gap-[12px] text-[14px] leading-[20px]">
                <div className="flex w-[50px] flex-col rounded-[10px] border-[0.5px] border-[#4A4458] border-opacity-50 px-[10px] py-[3px] text-center text-[14px] font-[500] leading-[20px] text-[#4A4458]">
                  {importOrders.length}
                </div>
                <div className="flex h-[20px] w-[80px] font-[400] tracking-[.25px] text-[#79747E]">
                  Export
                </div>
                <div className="flex h-[24px] w-[18px] rounded-[20px] text-[#79747E]">
                  {<ArrowRight />}
                </div>
              </div>
            </div>
          </div>
          <div className="gap-[30px]">
            <div className="flex max-w-[202.33px] flex-row">
              <div className="flex items-center gap-[12px] text-[14px] leading-[20px]">
                <div className="flex w-[50px] flex-col rounded-[10px] border-[0.5px] border-[#DF5000] border-opacity-50 px-[10px] py-[3px] text-center text-[14px] font-[500] text-[#DF5000]">
                  {exportOrders.length}
                </div>
                <div className="flex h-[20px] w-[80px] font-[400] tracking-[.25px] text-[#79747E]">
                  Import
                </div>
                <div className="flex h-[24px] w-[18px] rounded-[20px] text-[#79747E]">
                  {<ArrowRight />}
                </div>
              </div>
            </div>
          </div>
          <div className="gap-[30px]">
            <div className="flex max-w-[202.33px] flex-row">
              <div className="flex items-center gap-[12px] text-[14px] leading-[20px]">
                <div className="flex w-[50px] flex-col rounded-[10px] border-[0.5px] border-[#6750A4] border-opacity-50 px-[10px] py-[3px] text-center text-[14px] font-[500] text-[#6750A4]">
                  {autoImportOrders.length}
                </div>
                <div className="flex h-[20px] w-[80px] font-[400] tracking-[.25px] text-[#79747E]">
                  Auto Import
                </div>
                <div className="flex h-[24px] w-[18px] rounded-[20px] text-[#79747E]">
                  {<ArrowRight />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-[91px] flex-col items-center justify-center gap-[3px] rounded-[10px] border-[0.5px] border-[#B3261E] border-opacity-30 px-[3px] py-[10px] font-[400]">
          <span className="text-[22px] text-[#B3261E]">{`${shopOrders.length + importOrders.length + exportOrders.length + autoImportOrders.length}`}</span>
          <span className="text-[12px] tracking-[.4px] text-[#625B71]">
            Total Orders
          </span>
        </div>
      </div>
    </>
  );
};

export default TotalOrders;
