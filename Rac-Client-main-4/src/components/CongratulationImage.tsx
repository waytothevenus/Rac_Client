/* eslint-disable @next/next/no-img-element */
type CongratulationImageProps = {
  title?: string;
  description: string | JSX.Element;
};

const CongratulationImage = ({
  title = "Congratulations!",
  description,
}: CongratulationImageProps) => {
  return (
    <div className="flex flex-col-reverse gap-[10px] rounded-[20px] bg-primary-600 px-[21px] py-[15px] md:flex-row md:px-[14px] md:py-[10px]">
      <img
        src="/images/drone_flying_with_package.png"
        alt="drone flying with package"
        className="md:w-1/2"
      />
      <div className="flex flex-col justify-center gap-[10px] text-white">
        <span className="title-lg md:headline-md !font-bold">{title}</span>
        <span className="title-lg md:headline-md">{description}</span>
      </div>
    </div>
  );
};

export default CongratulationImage;
