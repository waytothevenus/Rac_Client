import { ExportCircle } from "iconsax-react";
import { CloseModalButton } from "~/components/Buttons/CloseModalButton";
import CongratulationImage from "~/components/CongratulationImage";
import OrderTrackingId from "~/components/OrderTrackingId";
import SuccessImportantNotice from "~/components/SuccessImportantNotice";
import { type OrderPackageType } from "~/contexts/NotificationContext";
import { StepDescription } from "../Orders/OrdersPanel";
import { AndLastly } from "../Requests/RequestCheckout";
import {
  RequestFormHeader,
  SectionContentLayout,
  SectionHeader,
} from "../Requests/RequestOrder";

type PaymentConfirmedProps = { order: OrderPackageType };

const PaymentConfirmed = ({ order }: PaymentConfirmedProps) => {
  return (
    <div className="flex w-[997px] flex-col gap-[30px] bg-surface-300 p-[30px]">
      <RequestFormHeader title="Confirm and Place your Order" />
      <PaymentConfirmedContent order={order} />
      <div className="w-full md:max-w-[200px]">
        <CloseModalButton />
      </div>
    </div>
  );
};

type PaymentConfirmedContentProps = PaymentConfirmedProps;

export const PaymentConfirmedContent = ({
  order,
}: PaymentConfirmedContentProps) => {
  return (
    <>
      <SectionContentLayout>
        <OrderTrackingId
          orderId={order.orderId}
          trackingId={order.trackingId}
          center
        />
      </SectionContentLayout>

      <CongratulationImage
        description={
          <>
            We have confirmed your payment. You have just successfully placed a{" "}
            <b>shop for me</b> order by paying for only your shop for me cost.
          </>
        }
      />

      <SuccessImportantNotice />

      <div className="flex flex-col gap-[10px]">
        <SectionHeader title="Track your package" />
        <SectionContentLayout>
          <div className="flex flex-col gap-[10px]">
            <h3 className="title-lg font-bold text-neutral-900">
              Here are more information on how to track
            </h3>
            <ul className="flex flex-col gap-[14px]">
              <StepDescription
                stepNumber={1}
                description={
                  <span className="title-lg text-neutral-900">
                    You can start tracking your package in the next 24 hrs using
                    the Tracking ID above or{" "}
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <span className="inline-flex items-center gap-[5px] font-bold text-primary-600">
                        this link
                        <ExportCircle color="#292D32" size={18} />
                      </span>
                    </a>
                  </span>
                }
              />
            </ul>
          </div>
        </SectionContentLayout>
      </div>

      <AndLastly />
    </>
  );
};

export default PaymentConfirmed;
