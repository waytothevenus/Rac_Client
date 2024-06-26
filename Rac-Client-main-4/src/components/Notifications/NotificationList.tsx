import dayjs from "dayjs";
import { useEffect } from "react";
import { PrimaryBackButton } from "~/components/Buttons/PrimaryBackButton";
import { type NOTIFICATION_TYPES } from "~/constants";
import { type AutoImportOrderPackageType } from "~/contexts/AutoImportContext";
import { type ExportOrderPackageType } from "~/contexts/ExportContext";
import { type ImportOrderPackageType } from "~/contexts/ImportContext";
import { useNavContext } from "~/contexts/NavigationContext";
import {
  useNotificationContext,
  type NotificationItemType,
} from "~/contexts/NotificationContext";
import { type ShopOrderPackageType } from "~/contexts/ShopContext";
import { useTabContext } from "~/contexts/TabContext";
import useAccordion from "~/hooks/useAccordion";
import { DeleteButtonIcon } from "../Buttons/DeleteButtonIcon";
import { DeleteItemButton } from "../Buttons/DeleteItemButton";
import AccordionButton from "../Forms/AccordionButton";
import { PaymentConfirmedContent } from "../Shop/Modals/PaymentConfirmed";
import { SectionHeader } from "../Shop/Requests/RequestOrder";
import { PreviewNotificationButton } from "../TopAppBar";

const NotificationList = () => {
  const { handleCustomText } = useTabContext();
  const { notifications, selectedNotification, handleSelectedNotification } =
    useNotificationContext();
  const { activeNav } = useNavContext();

  useEffect(() => {
    if (selectedNotification) {
      handleCustomText(
        notificationMessages[selectedNotification.type].getCustomText(
          selectedNotification.order,
        ),
      );
    } else {
      handleCustomText(null);
    }
  }, [selectedNotification, activeNav]);

  if (selectedNotification) {
    const handleBack = () => {
      handleCustomText(null);
      handleSelectedNotification(null);
    };

    // todo: make notification preview/modal folder and data structure
    return (
      <div className="flex max-w-[1094px] flex-col gap-[20px] rounded-[20px] bg-white p-[20px] md:p-[30px]">
        <PaymentConfirmedContent order={selectedNotification.order} />

        <div className="w-full md:w-[200px]">
          <PrimaryBackButton onClick={handleBack} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-[1094px] flex-col gap-[20px] rounded-[20px] bg-white p-[20px] md:p-[30px]">
      <div className="flex flex-col gap-[10px]">
        <SectionHeader title="Most Recent" />
        <div className="rounded-[20px] border border-gray-200 bg-neutral-50 px-[20px] py-[10px]">
          <span className="title-lg text-neutral-900">
            You don&apos;t have any new notifications
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        <SectionHeader title="Earlier" />
        {notifications.map((notification, i) => {
          return (
            <NotificationListItem
              key={i}
              index={i}
              notification={notification}
            />
          );
        })}
      </div>
    </div>
  );
};

export type NotificationListItemProps = {
  index: number;
  notification: NotificationItemType;
};

type OrderType =
  | ShopOrderPackageType
  | ImportOrderPackageType
  | ExportOrderPackageType
  | AutoImportOrderPackageType;

type NotificationMessagesType = Record<
  (typeof NOTIFICATION_TYPES)[number],
  {
    getMessage: (order: OrderType) => JSX.Element;
    getCustomText: (order: OrderType) => string;
  }
>;

export const notificationMessages: NotificationMessagesType = {
  "payment confirmation": {
    getMessage: (order) => (
      <>
        Your payment for the Order <b>{order.orderId}</b> has been confirmed
      </>
    ),
    getCustomText: (order) => `payment confirmation - ${order.orderId}`,
  },
  "payment rejection": {
    getMessage: (order) => (
      <>
        Your payment for the Order <b>{order.orderId}</b> has been rejected
      </>
    ),
    getCustomText: (order) => `payment confirmation - ${order.orderId}`,
  },
  "shipment arrival": {
    getMessage: (order) => (
      <>
        Your shipment <b>{order.trackingId}</b> has just arrived at its
        destination address
      </>
    ),
    getCustomText: (order) => `shipment arrival - ${order.trackingId}`,
  },
};

const NotificationListItem = ({
  index,
  notification,
}: NotificationListItemProps) => {
  const { open, toggle } = useAccordion(false);
  const { handleDelete } = useNotificationContext();

  const currentYear = new Date().getFullYear();
  const notifcationYear = new Date(notification.localDate).getFullYear();
  const format = currentYear === notifcationYear ? "MMM D" : "MMM D YYYY";

  return (
    <div className="flex items-center gap-[20px]">
      <div className="flex flex-grow flex-col gap-[10px] rounded-[20px] border border-gray-200 bg-white p-[20px] md:flex-row md:items-center md:gap-[20px]">
        <span className="body-lg flex-grow text-start">
          {notificationMessages[notification.type].getMessage(
            notification.order,
          )}
        </span>
        <span className="title-sm flex justify-between font-medium text-black">
          {dayjs(notification.localDate).format(format)}
          <div className="md:hidden">
            <AccordionButton {...{ open, toggle }} />
          </div>
        </span>
        <div className="hidden md:block">
          <PreviewNotificationButton notification={notification} />
        </div>
        {/* for mobile */}
        {open && (
          <div className="flex flex-col gap-[10px] border-t-[0.5px] border-dashed border-t-gray-500 pt-[10px] md:hidden">
            <PreviewNotificationButton notification={notification} />
            <DeleteItemButton onClick={() => handleDelete(index)} />
          </div>
        )}
      </div>
      <div className="hidden md:block">
        <DeleteButtonIcon onClick={() => handleDelete(index)} />
      </div>
    </div>
  );
};

export default NotificationList;
