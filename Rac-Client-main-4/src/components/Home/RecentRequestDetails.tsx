import { useEffect, useState } from "react";
import axios, { type AxiosError } from "axios";
import { AutoImportRequestPackageType } from "~/contexts/AutoImportContext";
import { ExportRequestPackageType } from "~/contexts/ExportContext";
import { ImportRequestPackageType } from "~/contexts/ImportContext";
import Balancer from "react-wrap-balancer";
import RequestOrderButton from "~/components/Buttons/RequestOrderButton";
import {
  type ShopItemType,
  type ShopRequestPackageType,
} from "~/contexts/ShopContext";
import { useCookies } from "react-cookie";
import { Shop } from "iconsax-react";
import { BACKEND_API } from "~/constants";

const RecentRequestDetails = (props: any) => {
  const { requestShow, setRequestShow, user } = props;
  const [cookies] = useCookies(["jwt"]);
  const token = cookies.jwt as string;
  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };

  const [reqOptions, setReqOptions] = useState({
    url: BACKEND_API + "sfmRequests/mine",
    method: "GET",
    headers: headersList,
  });

  const getUrl = (item: String) => {
    if (item === "shop") return BACKEND_API + "sfmRequests/mine";
    if (item === "import") return BACKEND_API + "import/mine";
    if (item === "export") return BACKEND_API + "export/mine";
    return BACKEND_API + "auto-import-requests";
  };

  const [showData, setShowData] = useState<
    | ShopRequestPackageType[]
    | ImportRequestPackageType[]
    | ExportRequestPackageType[]
    | AutoImportRequestPackageType[]
  >([]);

  useEffect(() => {
    setReqOptions({
      ...reqOptions,
      url: getUrl(requestShow),
    });
  }, [requestShow]);

  useEffect(() => {
    axios
      .request(reqOptions)
      .then((response) => {
        if (requestShow === "shop") {
          const { sfmRequests } = response.data as Main;

          const shopRequests: ShopRequestPackageType[] = sfmRequests.map(
            (request) => {
              const requestPackage: ShopRequestPackageType = {
                requestId: request.requestId,
                requestStatus:
                  request.requestStatus as ShopRequestPackageType["requestStatus"],
                requestLocalDate: new Date(request.createdAt).toLocaleString(),
                items: request.requestItems.map((item) => {
                  const requestItem: ShopItemType = {
                    store: item.store as ShopItemType["store"],
                    urgent: item.urgent,
                    url: item.itemUrl,
                    name: item.itemName,
                    originalCost: item.cost,
                    quantity: item.qty,
                    shippingCost: item.shippingCost,
                    image: item.itemImage,
                    description: item.description,
                    weight: 0,
                    height: 0,
                    length: 0,
                    width: 0,
                    relatedCosts: {
                      urgentPurchaseFee: 0,
                      processingFee: 0,
                      shippingToOriginWarehouseCost: 0,
                      shopForMeCost: 0,
                    },
                  };

                  return requestItem;
                }),
                originWarehouse: "Nigeria Warehouse (Lagos)",
                packageCosts: undefined,
              };
              return requestPackage;
            },
          );
          setShowData([...shopRequests]);
        } else if (requestShow === "import" || requestShow == "autoImport") {
          const { importRequests } = response.data as Main;
          const shopRequests: ShopRequestPackageType[] = importRequests.map(
            (request) => {
              const requestPackage: ShopRequestPackageType = {
                requestId: request.requestId,
                requestStatus:
                  request.requestStatus as ShopRequestPackageType["requestStatus"],
                requestLocalDate: new Date(request.createdAt).toLocaleString(),
                items: request.requestItems.map((item) => {
                  const requestItem: ShopItemType = {
                    store: item.store as ShopItemType["store"],
                    urgent: item.urgent,
                    url: item.itemUrl,
                    name: item.itemName,
                    originalCost: item.cost,
                    quantity: item.qty,
                    shippingCost: item.shippingCost,
                    image: item.itemImage,
                    description: item.description,
                    weight: 0,
                    height: 0,
                    length: 0,
                    width: 0,
                    relatedCosts: {
                      urgentPurchaseFee: 0,
                      processingFee: 0,
                      shippingToOriginWarehouseCost: 0,
                      shopForMeCost: 0,
                    },
                  };

                  return requestItem;
                }),
                originWarehouse: "Nigeria Warehouse (Lagos)",
              };
              return requestPackage;
            },
          );
          setShowData([...shopRequests]);
        } else if (requestShow === "export") {
          const { exportRequests } = response.data as Main;
          const shopRequests: ShopRequestPackageType[] = exportRequests.map(
            (request) => {
              const requestPackage: ShopRequestPackageType = {
                requestId: request.requestId,
                requestStatus:
                  request.requestStatus as ShopRequestPackageType["requestStatus"],
                requestLocalDate: new Date(request.createdAt).toLocaleString(),
                items: request.requestItems.map((item) => {
                  const requestItem: ShopItemType = {
                    store: item.store as ShopItemType["store"],
                    urgent: item.urgent,
                    url: item.itemUrl,
                    name: item.itemName,
                    originalCost: item.cost,
                    quantity: item.qty,
                    shippingCost: item.shippingCost,
                    image: item.itemImage,
                    description: item.description,
                    weight: 0,
                    height: 0,
                    length: 0,
                    width: 0,
                    relatedCosts: {
                      urgentPurchaseFee: 0,
                      processingFee: 0,
                      shippingToOriginWarehouseCost: 0,
                      shopForMeCost: 0,
                    },
                  };

                  return requestItem;
                }),
                originWarehouse: "Nigeria Warehouse (Lagos)",
              };
              return requestPackage;
            },
          );
          setShowData([...shopRequests]);
        }
      })
      .catch((err) => {
        setShowData([]);
      });
  }, [reqOptions]);

  const getColor = (status: any) => {
    if (status === "Not Responded") return { bg: "#CAC4D0", txt: "#49454F" };
    if (status === "Responded") return { bg: "#DF5000", txt: "#FFFFFF" };
  };

  return (
    <div className="flex w-full flex-col gap-[10px] rounded-[20px] bg-white">
      <div className="h-full overflow-auto">
        {showData.length ? (
          <table className="relative w-max min-w-full md:table">
            <thead className="title-sm sticky top-0 z-10 bg-white font-medium text-neutral-900">
              <tr className="gap-[10px]">
                <th className="border-0  pl-0">
                  <div className="flex items-center">Package(s) Image</div>
                </th>
                <th className="border-0">
                  <div className="flex cursor-pointer select-none">
                    Request ID
                    <svg
                      className="self-end text-neutral-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeMiterlimit="10"
                        strokeWidth="1.5"
                        d="M9.01 20.5l-5.02-5.01M9.01 3.5v17M14.99 3.5l5.02 5.01M14.99 20.5v-17"
                      ></path>
                    </svg>
                  </div>
                </th>
                <th className="border-0">
                  <div className="flex items-center">Request Status</div>
                </th>
                <th className="border-0">
                  <div className="flex cursor-pointer select-none">
                    Request Date
                    <svg
                      className="self-end text-neutral-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeMiterlimit="10"
                        strokeWidth="1.5"
                        d="M9.01 20.5l-5.02-5.01M9.01 3.5v17M14.99 3.5l5.02 5.01M14.99 20.5v-17"
                      ></path>
                    </svg>
                  </div>
                </th>
                <th className="border-0">
                  <div className="flex items-center">Actions</div>
                </th>
              </tr>
            </thead>

            <tbody className="border-y-[1px] border-gray-500 [&>tr]:border-b-[1px] [&>tr]:border-gray-500 last:[&>tr]:border-b-0">
              {showData.map((request, index) => (
                <tr
                  className="bg-gray-10 py-[20px] pr-[20px]"
                  key={"req-" + index}
                >
                  <td className="border-0 pl-[0px]">
                    <div className="w-full max-w-[130px] overflow-hidden rounded-[10px] border-0 bg-surface-100 p-0">
                      <div className="m-[5px] grid h-full max-h-[50px] max-w-[150px] grid-cols-2 grid-rows-2 place-items-center gap-x-[10px] gap-y-[5px]">
                        {request.items.map((item, index) => (
                          <div
                            className={
                              "flex items-center justify-center overflow-hidden rounded-[10px] " +
                              `grid-rows-[${request.items.length}] grid-flow-row`
                            }
                            key={index}
                          >
                            <img
                              src={
                                item.image
                                  ? (item.image as string)
                                  : "https://placehold.co/500x500/cac4d0/1d192b?text=Image"
                              }
                              alt="package image"
                              data-xblocker="passed"
                              style={{ visibility: "visible" }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="border-0">
                    <span className="text-[14px]">{request.requestId}</span>
                  </td>
                  <td className="border-0">
                    <button
                      data-type="dialogs"
                      data-target="#request-status-modal-0"
                      aria-label="Not Responded"
                      className={
                        "btn title-sm relative w-[150px] rounded-[10px] px-[10px] py-[5px] text-center font-medium " +
                        `text-[${getColor(request.requestStatus)?.txt}]` +
                        ` bg-[${getColor(request.requestStatus)?.bg}]`
                      }
                    >
                      {request.requestStatus}
                    </button>
                  </td>
                  <td className="border-0">
                    <span className="text-[14px]">
                      {request.requestLocalDate}
                    </span>
                  </td>
                  <td className="border-0">
                    <div className="group relative inline-block">
                      <button className="peer flex h-12 w-12 items-center justify-center rounded-[6.25rem] hover:bg-surface-300 focus:bg-surface-400">
                        <svg
                          className="text-error-600"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M5 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM19 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </button>
                      <ul className="absolute right-0 top-10 z-50 hidden min-w-[200px] flex-col items-center justify-center rounded-[10px] bg-surface-200 shadow-md group-focus-within:inline-flex peer-focus:inline-flex">
                        <li className="w-full">
                          <button className="relative w-full rounded-[10px] px-4 py-2 hover:bg-secondary-100 hover:bg-opacity-30">
                            View Details
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex w-full flex-grow flex-col items-center justify-center gap-[30px]">
            <h2 className="max-w-[462px] text-center text-[14px] font-[400] leading-[20px] tracking-[.25px]">
              <Balancer>
                You have no recent requests that need attention, would you like
                to make a new shop for me request?
              </Balancer>
            </h2>
            <RequestOrderButton />
          </div>
        )}
      </div>
    </div>
  );
};

export interface Main {
  success: boolean;
  totalrequests: number;
  sfmRequests: SfmRequest[];
  importRequests: importRequest[];
  exportRequests: exportRequest[];
  autoImportRequests: autoImportRequest[];
}

export interface SfmRequest {
  requestStatus: string;
  orderStatus: string;
  ShippingStatus: string;
  shopForMeStatus: string;
  _id: string;
  user: string;
  sfmType?: string;
  origin: string;
  requestItems: RequestItem[];
  contactAddress?: unknown[];
  sfmRequestApproved?: boolean;
  sfmPaymentPaid: boolean;
  processingFeePaid: boolean;
  requestId: string;
  orderId: string;
  trackingId: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  shippingAddress: unknown[];
}

export interface importRequest {
  requestStatus: string;
  orderStatus: string;
  ShippingStatus: string;
  shopForMeStatus: string;
  _id: string;
  user: string;
  sfmType?: string;
  origin: string;
  requestItems: RequestItem[];
  contactAddress?: unknown[];
  sfmRequestApproved?: boolean;
  sfmPaymentPaid: boolean;
  processingFeePaid: boolean;
  requestId: string;
  orderId: string;
  trackingId: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  shippingAddress: unknown[];
}

export interface exportRequest {
  requestStatus: string;
  orderStatus: string;
  ShippingStatus: string;
  shopForMeStatus: string;
  _id: string;
  user: string;
  sfmType?: string;
  origin: string;
  requestItems: RequestItem[];
  contactAddress?: unknown[];
  sfmRequestApproved?: boolean;
  sfmPaymentPaid: boolean;
  processingFeePaid: boolean;
  requestId: string;
  orderId: string;
  trackingId: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  shippingAddress: unknown[];
}

export interface autoImportRequest {
  requestStatus: string;
  orderStatus: string;
  ShippingStatus: string;
  shopForMeStatus: string;
  _id: string;
  user: string;
  sfmType?: string;
  origin: string;
  requestItems: RequestItem[];
  contactAddress?: unknown[];
  sfmRequestApproved?: boolean;
  sfmPaymentPaid: boolean;
  processingFeePaid: boolean;
  requestId: string;
  orderId: string;
  trackingId: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  shippingAddress: unknown[];
}

export interface RequestItem {
  store: string;
  itemUrl: string;
  itemName: string;
  urgent: boolean;
  itemImage: string;
  itemPrice: number;
  cost: number;
  qty: number;
  shippingCost: number;
  description: string;
  _id: string;
}

export default RecentRequestDetails;
