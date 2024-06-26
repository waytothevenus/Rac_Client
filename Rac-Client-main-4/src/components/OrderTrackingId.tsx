import { ArrowCircleDown2, ArrowCircleRight2 } from "iconsax-react";
import LabelId from "./LabelId";

type OrderTrackingIdProps = {
  orderId: string;
  trackingId: string;
  center?: boolean;
};

const OrderTrackingId = ({
  orderId,
  trackingId,
  center = false,
}: OrderTrackingIdProps) => {
  return (
    <div
      className={`flex w-full flex-col items-center gap-[10px] md:flex-row ${
        center ? "justify-center" : ""
      }`}
    >
      <div className="flex w-max gap-[10px] whitespace-nowrap">
        <LabelId label="Order ID" id={orderId} />
        <ArrowCircleDown2
          variant="Bold"
          className="flex-shrink-0 text-gray-500 md:hidden"
        />
      </div>
      <ArrowCircleRight2
        variant="Bold"
        className="hidden flex-shrink-0 text-gray-500 md:block"
      />
      <div className="w-max">
        <LabelId label="Tracking ID" id={trackingId} />
      </div>
    </div>
  );
};

export default OrderTrackingId;
