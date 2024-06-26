import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { ArrowRight, ArrowLeft } from "iconsax-react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { BACKEND_API } from "~/constants";

const OngoingShipments = () => {

    const [onShipments, setOnShipments] = useState<any[]>([]);
    const [cookies] = useCookies(["jwt"]);
    const token = cookies.jwt as string;
    const headersList = {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
    };

    const [reqOptions, setReqOptions] = useState({
        url: BACKEND_API + "export/mine",
        method: "GET",
        headers: headersList
    });

    useEffect(() => {
        axios
            .request(reqOptions)
            .then(res => {
                console.log('res data', res.data)
                setOnShipments([...res.data.exportRequests]);
                // res.data.exportRequests.map(item => {
                //     console.log('item is', item)
                //     // if (item.shippingStatus === "In transit") {
                //     setOnShipments([...onShipments, item]);
                //     // }
                // })
            })
    }, [token]);

    return (
        <>
            <div className="flex flex-col gap-[20px]">
                <div className="flex">
                    <h2 className="font-bold text-gray-700 text-base">Ongoing Shipments</h2>
                    <div className="flex flex-row min-w-[125px] font-[400] rounded-[10px] px-3 py-[10px] gap-[12px] border-[0.5px] border-[#B3261E] border-opacity-30 justify-center items-center">
                        <div className="text-[22px] text-[#B3261E]">{onShipments.length}</div>
                        <div className="text-[12px] text-[#625B71] tracking-[.4px]">Ongoing Shipments</div>
                    </div>

                </div>
                <div className="flex">
                    <button className="flex text-[#79747E] rounded-[20px] w-[18px] h-[24px] prev-button">
                        {<ArrowLeft />}
                    </button>
                    <button className="flex text-[#79747E] rounded-[20px] w-[18px] h-[24px] next-button ml-[auto] mr-0">
                        {<ArrowRight />}
                    </button>
                </div>
            </div>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={10}
                slidesPerView={1}
                navigation={{
                    nextEl: '.next-button',
                    prevEl: '.prev-button',
                }}
                pagination={{ clickable: true }}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
                className="w-full"
            >
                {
                    onShipments.map(item => (
                        <SwiperSlide key={item._id}>
                            <div className="flex rounded-[20px] bg-white gap-[20px]">
                                <div className="flex max-w-[293.33px] flex-col gap-[10px]">
                                    <div className="gap-[30px]">
                                        <div className="flex">
                                            <div className="flex gap-[8px] items-center">
                                                <div className="flex flex-row min-w-[290.67px] border-[0.5px] border-[#B3261E] border-opacity-50 text-[14px] text-[#79747E] font-[400] rounded-[10px] px-[10px] py-[3px] gap-[12px] items-center justify-center">
                                                    <span className="flex w-fulltracking-[.25px] text-[14px]">Tracking ID:</span>
                                                    <span className="flex border-[.5px] h-[10px]"></span>
                                                    <span className="text-[12px] font-[500] tracking-[.5px]">{item.trackingId}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="gap-[30px]">
                                        <div className="gap-[4px] items-center grid grid-cols-2">
                                            <div className="flex flex-row max-w-[143.33px] border-[0.5px] border-[#21BCAA] border-opacity-50 text-[14px] text-[#79747E] font-[400] rounded-tr-[10px] rounded-tl-[10px] rounded-bl-[10px] px-[10px] py-[3px] gap-[12px] items-center justify-end">
                                                <span className="flex tracking-[.25px] text-[14px]">Order ID:</span>
                                            </div>
                                            <div className="flex flex-row max-w-[143.33px] border-[0.5px] border-[#21BCAA] bg-[#21BCAA] border-opacity-50 text-[14px] text-[#FFFFFF] font-[400] rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px] px-[10px] py-[3px] gap-[12px] items-center justify-start">
                                                <span className="flex tracking-[.25px] text-[14px]">{item.orderId} </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="gap-[30px]">
                                        <div className="gap-[4px] items-center grid grid-cols-2">
                                            <div className="flex flex-row w-[143.33px] border-[0.5px] border-[#21005D] border-opacity-50 text-[14px] text-[#79747E] font-[400] rounded-tr-[10px] rounded-tl-[10px] rounded-bl-[10px] px-[10px] py-[3px] gap-[12px] items-center justify-end">
                                                <span className="flex tracking-[.25px] text-[14px] text-[#21005D]">Shipping status:</span>
                                            </div>
                                            <div className="flex flex-row w-[143.33px] border-[0.5px] border-[#21005D] bg-[#21005D] border-opacity-50 text-[14px] text-[#FFFFFF] font-[400] rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px] px-[10px] py-[3px] gap-[12px] items-center justify-start">
                                                <span className="flex tracking-[.25px] text-[14px]">In transit</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex rounded-[20px] bg-primary-900 px-[20px] py-[10px] text-white h-[180px]">
                                        <hr className="h-[65px] border-r border-solid border-white" />
                                        <div className="flex flex-col">
                                            <div className="flex flex-col gap-[1px] pl-[10px]">
                                                <span className="title-md font-bold">Origin:</span>
                                                <span className="label-lg">Lagos, Nigeria</span>
                                            </div>
                                            <svg width="251" height="70" viewBox="0 0 251 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M122.726 39.4678C122.726 39.4678 118.438 47.5566 122.726 52.3469C136.126 67.3166 190.276 52.3469 235.309 52.3469" stroke="#625B71" strokeWidth="2" />
                                                <ellipse cx="235.159" cy="53.9764" rx="5.84616" ry="6.02332" fill="#625B71" />
                                                <ellipse cx="125.518" cy="34.9999" rx="5.84616" ry="6.02332" fill="white" />
                                                <path d="M139.57 30.4688V39H138.439V30.4688H139.57ZM142.947 34.0137V39H141.863V32.6602H142.888L142.947 34.0137ZM142.689 35.5898L142.238 35.5723C142.242 35.1387 142.306 34.7383 142.431 34.3711C142.556 34 142.732 33.6777 142.959 33.4043C143.185 33.1309 143.455 32.9199 143.767 32.7715C144.084 32.6191 144.433 32.543 144.816 32.543C145.129 32.543 145.41 32.5859 145.66 32.6719C145.91 32.7539 146.123 32.8867 146.298 33.0703C146.478 33.2539 146.615 33.4922 146.709 33.7852C146.802 34.0742 146.849 34.4277 146.849 34.8457V39H145.759V34.834C145.759 34.502 145.711 34.2363 145.613 34.0371C145.515 33.834 145.373 33.6875 145.185 33.5977C144.998 33.5039 144.767 33.457 144.494 33.457C144.224 33.457 143.978 33.5137 143.755 33.627C143.537 33.7402 143.347 33.8965 143.187 34.0957C143.031 34.2949 142.908 34.5234 142.818 34.7812C142.732 35.0352 142.689 35.3047 142.689 35.5898ZM155.354 30.4688V39H154.241V30.4688H155.354ZM158.096 30.4688V31.3945H151.505V30.4688H158.096ZM160.237 33.6562V39H159.153V32.6602H160.207L160.237 33.6562ZM162.217 32.625L162.211 33.6328C162.121 33.6133 162.036 33.6016 161.954 33.5977C161.875 33.5898 161.786 33.5859 161.684 33.5859C161.434 33.5859 161.213 33.625 161.022 33.7031C160.83 33.7812 160.668 33.8906 160.536 34.0312C160.403 34.1719 160.297 34.3398 160.219 34.5352C160.145 34.7266 160.096 34.9375 160.073 35.168L159.768 35.3438C159.768 34.9609 159.805 34.6016 159.879 34.2656C159.957 33.9297 160.077 33.6328 160.237 33.375C160.397 33.1133 160.6 32.9102 160.846 32.7656C161.096 32.6172 161.393 32.543 161.737 32.543C161.815 32.543 161.905 32.5527 162.006 32.5723C162.108 32.5879 162.178 32.6055 162.217 32.625ZM167.123 37.916V34.6523C167.123 34.4023 167.072 34.1855 166.971 34.002C166.873 33.8145 166.725 33.6699 166.525 33.5684C166.326 33.4668 166.08 33.416 165.787 33.416C165.514 33.416 165.273 33.4629 165.066 33.5566C164.863 33.6504 164.703 33.7734 164.586 33.9258C164.473 34.0781 164.416 34.2422 164.416 34.418H163.332C163.332 34.1914 163.391 33.9668 163.508 33.7441C163.625 33.5215 163.793 33.3203 164.012 33.1406C164.234 32.957 164.5 32.8125 164.809 32.707C165.121 32.5977 165.469 32.543 165.852 32.543C166.312 32.543 166.719 32.6211 167.07 32.7773C167.426 32.9336 167.703 33.1699 167.902 33.4863C168.105 33.7988 168.207 34.1914 168.207 34.6641V37.6172C168.207 37.8281 168.225 38.0527 168.26 38.291C168.299 38.5293 168.355 38.7344 168.43 38.9062V39H167.299C167.244 38.875 167.201 38.709 167.17 38.502C167.139 38.291 167.123 38.0957 167.123 37.916ZM167.311 35.1562L167.322 35.918H166.227C165.918 35.918 165.643 35.9434 165.4 35.9941C165.158 36.041 164.955 36.1133 164.791 36.2109C164.627 36.3086 164.502 36.4316 164.416 36.5801C164.33 36.7246 164.287 36.8945 164.287 37.0898C164.287 37.2891 164.332 37.4707 164.422 37.6348C164.512 37.7988 164.646 37.9297 164.826 38.0273C165.01 38.1211 165.234 38.168 165.5 38.168C165.832 38.168 166.125 38.0977 166.379 37.957C166.633 37.8164 166.834 37.6445 166.982 37.4414C167.135 37.2383 167.217 37.041 167.229 36.8496L167.691 37.3711C167.664 37.5352 167.59 37.7168 167.469 37.916C167.348 38.1152 167.186 38.3066 166.982 38.4902C166.783 38.6699 166.545 38.8203 166.268 38.9414C165.994 39.0586 165.686 39.1172 165.342 39.1172C164.912 39.1172 164.535 39.0332 164.211 38.8652C163.891 38.6973 163.641 38.4727 163.461 38.1914C163.285 37.9062 163.197 37.5879 163.197 37.2363C163.197 36.8965 163.264 36.5977 163.396 36.3398C163.529 36.0781 163.721 35.8613 163.971 35.6895C164.221 35.5137 164.521 35.3809 164.873 35.291C165.225 35.2012 165.617 35.1562 166.051 35.1562H167.311ZM171.396 34.0137V39H170.312V32.6602H171.338L171.396 34.0137ZM171.138 35.5898L170.687 35.5723C170.691 35.1387 170.755 34.7383 170.88 34.3711C171.005 34 171.181 33.6777 171.408 33.4043C171.634 33.1309 171.904 32.9199 172.216 32.7715C172.533 32.6191 172.882 32.543 173.265 32.543C173.578 32.543 173.859 32.5859 174.109 32.6719C174.359 32.7539 174.572 32.8867 174.748 33.0703C174.927 33.2539 175.064 33.4922 175.158 33.7852C175.252 34.0742 175.298 34.4277 175.298 34.8457V39H174.209V34.834C174.209 34.502 174.16 34.2363 174.062 34.0371C173.964 33.834 173.822 33.6875 173.634 33.5977C173.447 33.5039 173.216 33.457 172.943 33.457C172.673 33.457 172.427 33.5137 172.205 33.627C171.986 33.7402 171.796 33.8965 171.636 34.0957C171.48 34.2949 171.357 34.5234 171.267 34.7812C171.181 35.0352 171.138 35.3047 171.138 35.5898ZM181.036 37.3184C181.036 37.1621 181.001 37.0176 180.931 36.8848C180.864 36.748 180.726 36.625 180.515 36.5156C180.308 36.4023 179.995 36.3047 179.577 36.2227C179.226 36.1484 178.907 36.0605 178.622 35.959C178.341 35.8574 178.101 35.7344 177.902 35.5898C177.706 35.4453 177.556 35.2754 177.45 35.0801C177.345 34.8848 177.292 34.6562 177.292 34.3945C177.292 34.1445 177.347 33.9082 177.456 33.6855C177.57 33.4629 177.728 33.2656 177.931 33.0938C178.138 32.9219 178.386 32.7871 178.675 32.6895C178.964 32.5918 179.286 32.543 179.642 32.543C180.15 32.543 180.583 32.6328 180.943 32.8125C181.302 32.9922 181.577 33.2324 181.769 33.5332C181.96 33.8301 182.056 34.1602 182.056 34.5234H180.972C180.972 34.3477 180.919 34.1777 180.814 34.0137C180.712 33.8457 180.562 33.707 180.362 33.5977C180.167 33.4883 179.927 33.4336 179.642 33.4336C179.341 33.4336 179.097 33.4805 178.909 33.5742C178.726 33.6641 178.591 33.7793 178.505 33.9199C178.423 34.0605 178.382 34.209 178.382 34.3652C178.382 34.4824 178.402 34.5879 178.441 34.6816C178.484 34.7715 178.558 34.8555 178.663 34.9336C178.769 35.0078 178.917 35.0781 179.109 35.1445C179.3 35.2109 179.544 35.2773 179.841 35.3438C180.361 35.4609 180.788 35.6016 181.124 35.7656C181.46 35.9297 181.71 36.1309 181.874 36.3691C182.038 36.6074 182.12 36.8965 182.12 37.2363C182.12 37.5137 182.062 37.7676 181.945 37.998C181.831 38.2285 181.665 38.4277 181.446 38.5957C181.232 38.7598 180.974 38.8887 180.673 38.9824C180.376 39.0723 180.042 39.1172 179.671 39.1172C179.112 39.1172 178.64 39.0176 178.253 38.8184C177.866 38.6191 177.573 38.3613 177.374 38.0449C177.175 37.7285 177.075 37.3945 177.075 37.043H178.165C178.181 37.3398 178.267 37.5762 178.423 37.752C178.579 37.9238 178.771 38.0469 178.997 38.1211C179.224 38.1914 179.448 38.2266 179.671 38.2266C179.968 38.2266 180.216 38.1875 180.415 38.1094C180.618 38.0312 180.773 37.9238 180.878 37.7871C180.984 37.6504 181.036 37.4941 181.036 37.3184ZM185.122 32.6602V39H184.032V32.6602H185.122ZM183.95 30.9785C183.95 30.8027 184.003 30.6543 184.108 30.5332C184.218 30.4121 184.378 30.3516 184.589 30.3516C184.796 30.3516 184.954 30.4121 185.063 30.5332C185.177 30.6543 185.233 30.8027 185.233 30.9785C185.233 31.1465 185.177 31.291 185.063 31.4121C184.954 31.5293 184.796 31.5879 184.589 31.5879C184.378 31.5879 184.218 31.5293 184.108 31.4121C184.003 31.291 183.95 31.1465 183.95 30.9785ZM189.916 32.6602V33.4922H186.489V32.6602H189.916ZM187.649 31.1191H188.733V37.4297C188.733 37.6445 188.766 37.8066 188.832 37.916C188.899 38.0254 188.985 38.0977 189.09 38.1328C189.196 38.168 189.309 38.1855 189.43 38.1855C189.52 38.1855 189.614 38.1777 189.711 38.1621C189.813 38.1426 189.889 38.127 189.94 38.1152L189.946 39C189.86 39.0273 189.746 39.0527 189.606 39.0762C189.469 39.1035 189.303 39.1172 189.108 39.1172C188.842 39.1172 188.598 39.0645 188.375 38.959C188.153 38.8535 187.975 38.6777 187.842 38.4316C187.713 38.1816 187.649 37.8457 187.649 37.4238V31.1191Z" fill="white" />
                                                <ellipse cx="16.1821" cy="16.0233" rx="5.84615" ry="6.02333" fill="white" />
                                                <path d="M16.0312 17.6199C60.6015 17.62 115.111 2.72507 128.59 17.6199C132.932 22.4183 128.59 30.5287 128.59 30.5287" stroke="white" strokeWidth="2" />
                                            </svg>

                                            <div className="flex flex-col gap-[1px] self-end pr-[10px]">
                                                <span className="title-md font-bold self-end">Destination:</span>
                                                <span className="label-lg">Atlanta, Texas, USA</span>
                                            </div>
                                        </div>
                                        <hr className="h-[65px] self-end border-r border-solid border-secondary-600" />
                                    </div>

                                    <div className="flex flex-col">
                                        <h3 className="font-[500] text-[14px] tracking-[.1px]">Most Recent Update</h3>
                                        <h2 className="font-[500] text-[16px] text-[#49454F] tracking-[.1px] pb-[5px]">
                                            Processed at London - Heathrow - UK
                                        </h2>
                                        <span className="pb-[13px] border-b border-dashed">April, 05 2023 09:53 AM local time, London-Heathrow-UK</span>
                                    </div>

                                    <div className="flex flex-col">
                                        <h3 className="font-[500] text-[14px] tracking-[.1px]">Estimated Delivery Date</h3>
                                        <h2 className="font-[500] text-[16px] text-[#49454F] tracking-[.1px] pb-[5px]">
                                            April, 10 2023 - By End of Day
                                        </h2>
                                        <span className="pb-[15px]">12 days remaining to arrive destination </span>

                                    </div>

                                    <div className="flex flex-col justify-center items-center pb-[20px]">
                                        <img src="images/Rectangle 9130.png" className="rounded-[10px]" />
                                        <button className="flex flex-row w-[242px] border-[0.5px] border-[#21005D] border-opacity-50 text-[14px] text-[#79747E] leading-[20px] font-[500] rounded-[10px] px-[10px] py-[3px] gap-[12px] bg-white -mt-[50px] items-center justify-center">
                                            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.49449 3.45004C6.89449 0.85504 2.98699 0.84754 2.38699 3.45004C2.03449 4.97254 3.00199 6.26254 3.84199 7.06504C4.45699 7.64254 5.42449 7.64254 6.03949 7.06504C6.87949 6.26254 7.83949 4.97254 7.49449 3.45004ZM4.96699 4.65004C4.55449 4.65004 4.21699 4.31254 4.21699 3.90004C4.21699 3.48754 4.54699 3.15004 4.95949 3.15004H4.96699C5.38699 3.15004 5.71699 3.48754 5.71699 3.90004C5.71699 4.31254 5.38699 4.65004 4.96699 4.65004Z" fill="#6750A4" />
                                                <path d="M17.267 12.45C16.667 9.85504 12.7445 9.84754 12.137 12.45C11.7845 13.9725 12.752 15.2625 13.5995 16.065C14.2145 16.6425 15.1895 16.6425 15.8045 16.065C16.652 15.2625 17.6195 13.9725 17.267 12.45ZM14.732 13.65C14.3195 13.65 13.982 13.3125 13.982 12.9C13.982 12.4875 14.312 12.15 14.7245 12.15H14.732C15.1445 12.15 15.482 12.4875 15.482 12.9C15.482 13.3125 15.1445 13.65 14.732 13.65Z" fill="#6750A4" />
                                                <path d="M9.83894 14.8125H7.82894C6.95894 14.8125 6.20144 14.2875 5.90144 13.4775C5.59394 12.6675 5.81894 11.775 6.47144 11.1975L12.4639 5.955C12.8239 5.64 12.8314 5.2125 12.7264 4.92C12.6139 4.6275 12.3289 4.3125 11.8489 4.3125H9.83894C9.53144 4.3125 9.27644 4.0575 9.27644 3.75C9.27644 3.4425 9.53144 3.1875 9.83894 3.1875H11.8489C12.7189 3.1875 13.4764 3.7125 13.7764 4.5225C14.0839 5.3325 13.8589 6.225 13.2064 6.8025L7.21394 12.045C6.85394 12.36 6.84644 12.7875 6.95144 13.08C7.06394 13.3725 7.34894 13.6875 7.82894 13.6875H9.83894C10.1464 13.6875 10.4014 13.9425 10.4014 14.25C10.4014 14.5575 10.1464 14.8125 9.83894 14.8125Z" fill="#6750A4" />
                                            </svg>

                                            <span className="flex tracking-[.25px] text-[14px] text-[#21005D]">
                                                More tracking details
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </>
    )
}

export default OngoingShipments;