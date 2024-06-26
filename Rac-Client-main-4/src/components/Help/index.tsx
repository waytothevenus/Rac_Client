/* eslint-disable @next/next/no-img-element */
import HowToBook from "./HowToBook";

const Help = () => {
  return (
    <div className="flex flex-col overflow-y-auto px-[20px] mt-[20px]">
      <div className="flex flex-col max-w-[1094px] gap-[10px] px-4 rounded-[20px] bg-white p-[20px] md:p-[20px]">
        <HowToBook />
      </div>
    </div>
  );
};

export default Help;