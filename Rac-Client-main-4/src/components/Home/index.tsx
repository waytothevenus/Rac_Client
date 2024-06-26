/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import TotalOrders from "./TotalOrders";
import PendingTransactions from "./PendingTransactions";
import RacLogistics from "./RacLogistics";
import RecentRequest from "./RecentRequest";
import RecentRequestDetails from "./RecentRequestDetails";
import OngoingShipments from "./OngoingShipments";
import { useAuthContext } from "~/contexts/AuthContext";

const HomePanel = () => {

  const { user } = useAuthContext();

  const [requestShow, setRequestShow] = useState('shop');

  return (
    <div className="md:flex max-[1196px]:flex-col px-[20px] mt-[20px]">
      <div className="flex flex-col">
        <div className="md:flex">
          <div className="flex flex-col">
            <div className="flex flex-col overflow-y-auto px-[10px]">
              <div className="flex flex-col max-w-[333.33px] gap-[10px] rounded-[20px] bg-white p-[20px] md:p-[20px]">
                <TotalOrders />
              </div>
            </div>
            <div className="flex flex-col overflow-y-auto pt-[20px] px-[10px]">
              <div className="flex flex-col max-w-[333.33px] gap-[10px] rounded-[20px] bg-white p-[20px] md:p-[20px]">
                <PendingTransactions />
              </div>
            </div>
          </div>
          <div className="flex flex-col overflow-y-auto px-[10px] max-[904px]:mt-[20px]">
            <div className="flex max-w-[390px] max-[904px]:max-w-[333.33px] flex-col gap-[10px] rounded-[20px] bg-white p-[20px] md:p-[20px]">
              <RacLogistics />
            </div>
          </div>
        </div>
        <div className="flex flex-col overflow-y-auto pt-[20px] px-[10px] gap-[3px]">
          <div className="flex max-w-[743px] max-[425px]:max-w-[333.33px] flex-col gap-[10px] rounded-[20px] bg-white p-[20px] md:p-[20px]">
            <RecentRequest requestShow={requestShow} setRequestShow={setRequestShow} />
          </div>

          <div className="flex max-w-[743px] max-[425px]:max-w-[333.33px] flex-col gap-[10px] rounded-[20px] bg-white p-[20px] md:p-[20px]">
            <RecentRequestDetails requestShow={requestShow} setRequestShow={setRequestShow} user={user} />
          </div>
        </div>
      </div>
      <div className="flex max-[1196px]:mt-[20px]">
        <div className="flex flex-col overflow-y-auto px-[10px]">
          <div className="flex max-w-[333.33px] flex-col gap-[10px] rounded-[20px] bg-white p-[20px] md:p-[20px]">
            <OngoingShipments />
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePanel;