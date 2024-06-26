import { Country } from "country-state-city";
import { forwardRef, type Ref } from "react";
import SelectInput from "./SelectInput";

const SelectCountryPhoneCodeInput = (
  { ...props },
  ref: Ref<HTMLSelectElement>,
) => {
  return (
    <SelectInput
      ref={ref}
      label="Country Code"
      options={
        <>
          <option value="" disabled hidden>
            Country code
          </option>
          {Country.getAllCountries().map(({ name, phonecode }) => {
            const value = phonecode.startsWith("+")
              ? phonecode
              : "+" + phonecode;

            return (
              <option key={`country-code-${name}`} value={value}>
                {`${name} ${value}`}
              </option>
            );
          })}
        </>
      }
      {...props}
    />
  );
};

export default forwardRef(SelectCountryPhoneCodeInput);
