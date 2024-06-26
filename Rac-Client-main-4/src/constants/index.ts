export const ORDER_STATUS = ["processed"] as const;

export const SHIPPING_STATUS = [
  "ready for shipping",
  "not started",
  "processing",
  "cancelled",
  "in transit",
  "arrived destination",
  "cleared",
  "delivered",
] as const;

export const REQUEST_STATUS = ["Responded", "Not Responded"] as const;

export const ID_TYPE = [
  "Tracking ID",
  "Order ID",
  "Shipping ID",
  "Other",
] as const;

export const SHOP_FOR_ME_STATUS = [
  "Purchase not started",
  "Purchase in progress",
  "Purchase completed",
] as const;

export const ACTION_CONST = [
  "proceed to checkout",
  "order details",
  "request details",
  "draft details",
  "request new order",
  "initiate shipping",
  "clear package",
  "track",
] as const;

export const TAB_IDS = [
  "home",
  "help",
  "orders",
  "requests",
  "drafts",
  "profile information",
  "communication preferences",
  "security",
  "account information",
  "additional information",
  "activities",
] as const;

export const ORIGINS = [
  "Nigeria Warehouse (Lagos)",
  "US Warehouse (Richmond Texas)",
  "UK Warehouse (London)",
  "Dubai Warehouse",
  "China Warehouse (Guangzhou city)",
] as const;

export const DESTINATIONS: (typeof ORIGINS)[number][] = [
  "Nigeria Warehouse (Lagos)",
] as const;

export const STORES = [
  "Amazon",
  "Ebay",
  "Aliexpress",
  "Walmart",
  "Others",
] as const;

export const CONDITIONS = ["Drivable", "Not Drivable"] as const;

export const SERVICES = [
  "export",
  "import",
  "auto import",
  "shop for me",
] as const;

export const NAV_TITLES = [
  "Home",
  "Shop For Me",
  "Export",
  "Import",
  "Auto Import",
  "Tracking",
  "Billing",
  "Get a Quote",
  "Help",
  "Settings",
  "Logout",
  "Notifications",
] as const;

export const NOTIFICATION_TYPES = [
  "payment confirmation",
  "payment rejection",
  "shipment arrival",
] as const;

export const CAR_CONDITIONS = ["Drivable", "Not Drivable"] as const;

export const PACKAGE_DELIVERY_STATUS = [
  "Some delivered",
  "All delivered",
  "None delivered",
] as const;

export const ITEM_DELIVERY_STATUS = ["Delivered", "Not yet delivered"] as const;

export const COURIERS = ["Seller", "Someone else"] as const;

export const PAYMENT_STATUS = ["Paid", "Unpaid"] as const;

export type WarehouseLocationType = Record<
  (typeof ORIGINS)[number],
  {
    address: string;
    country: string;
    state: string;
    city: string;
    zipPostalCode: string;
  }
>;

export const WAREHOUSE_LOCATIONS: WarehouseLocationType = {
  "China Warehouse (Guangzhou city)": {
    address:
      "Guangyuan West Road, Yuexiu District, Guangzhou City, Tongtong Commercial Trade City A Block AB03",
    country: "CN",
    state: "GD",
    city: "Guangzhou",
    zipPostalCode: "628017",
  },
  "Dubai Warehouse": {
    address: "Al Rolla Rd, Al Khaleej Center, Dubai, 6th floor, 616",
    country: "AE",
    state: "DU",
    city: "Dubai",
    zipPostalCode: "00000",
  },
  "Nigeria Warehouse (Lagos)": {
    address: "29b Osolo Way Ajao Estate, Isolo",
    country: "NG",
    state: "LA",
    city: "Ikeja",
    zipPostalCode: "10011",
  },
  "UK Warehouse (London)": {
    address: "Unit 1, Loughborough Centre, 105 Angell Road",
    country: "GB",
    state: "ENG",
    city: "Brixton",
    zipPostalCode: "SW9 7PD",
  },
  "US Warehouse (Richmond Texas)": {
    address: "13107 Orchard Mill Drive",
    country: "US",
    state: "TX",
    city: "Richmond",
    zipPostalCode: "77407",
  },
} as const;

export const BILLING_ADDRESS_OPTIONS = ["default", "custom"] as const;

export const SHIPPING_METHODS = ["basic", "custom"] as const;

type ShippingMethodOptions = Record<
  (typeof SHIPPING_METHODS)[number],
  {
    shippingCost: number;
    clearingPortHandlingCost?: number;
  }
>;

export const SHIPPING_METHOD_OPTIONS: ShippingMethodOptions = {
  basic: {
    shippingCost: 126.66,
    clearingPortHandlingCost: 126.66,
  },
  custom: {
    shippingCost: 126.66,
    clearingPortHandlingCost: 126.66,
  },
};

export const PAYMENT_METHOD_OPTIONS = [
  // "Credit/Debit Cards - Pay with Dollar/US Cards",
  "Paystack - Pay with Naira Card",
  // "Pay At Bank in $ - Nigeria",
  // "Pay At Bank in Naira - Nigeria",
  // "Pay Via PayPal",
] as const;

export type PaymentMethodType = {
  title: (typeof PAYMENT_METHOD_OPTIONS)[number];
  description?: string;
};

export const PAYMENT_METHODS: PaymentMethodType[] = [
  // {
  //   title: "Credit/Debit Cards - Pay with Dollar/US Cards",
  //   description:
  //     "Valid for MasterCard and Visa Cards. Maximum allowed is $1,500",
  // },
  {
    title: "Paystack - Pay with Naira Card",
    description: "Pay with Your Naira Card",
  },
  // {
  //   title: "Pay At Bank in $ - Nigeria",
  // },
  // {
  //   title: "Pay At Bank in Naira - Nigeria",
  // },
  // {
  //   title: "Pay Via PayPal",
  // },
] as const;

export const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5mb;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const BACKEND_API = "https://rac-backend.onrender.com/api/";

export const warehouseAddresses = (country: any) => {
  if (country === 'NG') {
    return {
      phone: "08096663337",
      street: "29b Osolo way ajao estate",
      city: "Isolo",
      state: "Lagos",
      country: "Nigeria",
      code: "10011"
    }
  } else if (country === "US") {
    return {
      street: "13107 orchard mill drive",
      city: "Richmond",
      state: "TEXAS",
      country: "United State",
      code: "12815919189"
    }
  } else if (country === "GB") {
    return {
      street: "Unit 1, Loughborough Centre, 105 Angell Road",
      city: "Brixton",
      state: "London",
      country: "United Kingdom",
      code: "SW9 7PD"

    }
  } else if (country === "CN") {
    return {
      street: "Jiusheng International Logistics Africa Line Jing: Guangyuan West Road,",
      city: "Yuexiu District",
      state: "Guangzhou",
      country: "China",
      code: "12815919189"

    }
  } else {
    return {
      street: "RAC LOGISTICS LTD",
      city: "C/O Anthony Ezeobiora",
      state: "Binthani building Room 229",
      country: "Back of tala supermarket after zaggy hotel deira",
      code: "12815919189"
    }
  }
}