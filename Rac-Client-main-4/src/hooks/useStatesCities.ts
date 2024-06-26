import { City, State } from "country-state-city";
import { useMemo } from "react";
import {
  type FieldValues,
  type Path,
  type UseFormWatch,
} from "react-hook-form";

type UseStatesCitiesType<T extends FieldValues> = {
  path?: keyof T | string;
  watch: UseFormWatch<T>;
};

const useStatesCities = <T extends FieldValues>({
  path = "",
  watch,
}: UseStatesCitiesType<T>) => {
  const country = watch(
    (path ? `${String(path)}.country` : "country") as Path<T>,
  );
  const state = watch((path ? `${String(path)}.state` : "state") as Path<T>);

  const states = useMemo(() => State.getStatesOfCountry(country), [country]);

  const cities = useMemo(
    () => City.getCitiesOfState(country, state),
    [country, state],
  );

  return { states, cities };
};

export default useStatesCities;
