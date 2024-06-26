import { type ReactNode } from "react";

type NoTabsContentLayoutProps = { children: ReactNode };

const NoTabsContentLayout = ({ children }: NoTabsContentLayoutProps) => {
  return (
    <div className="relative flex min-h-[calc(100vh-152px)] w-full flex-col overflow-y-auto bg-neutral-50 p-[20px] md:min-h-[calc(100vh-140px)] md:max-w-[calc(100vw-286px)] md:px-[40px] md:py-[30px]">
      {children}
    </div>
  );
};

export default NoTabsContentLayout;
