import { Country, State } from "country-state-city";

export const capitalizeWords = (words: string) => {
  return words
    .split(" ")
    .map((word) => {
      return word.slice(0, 1).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const formatCurrency = (amount: number) => {
  const locales = navigator.languages as string | string[] | undefined;
  return new Intl.NumberFormat(locales, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const limitChars = (text: string, limit: number) => {
  return `${text.slice(0, limit - 3)}${limit - 3 < 10 ? "..." : ""}`;
};

export const shortenFileName = (filename: string, length: number) => {
  if (filename.length <= length + 10) return filename;

  return `${filename.slice(0, length)}...${filename.slice(
    filename.length - length,
  )}`;
};

export const formatWeight = (amount: number) => {
  return `${amount}kg`;
};

export const formatDimension = (amount: number) => {
  return `${amount} inches`;
};

export const parseCountryCode = (countryCode: string) => {
  return String(Country.getCountryByCode(countryCode)?.name);
};

export const parseStateCode = (stateCode: string, countryCode: string) => {
  return String(State.getStateByCodeAndCountry(stateCode, countryCode)?.name);
};
