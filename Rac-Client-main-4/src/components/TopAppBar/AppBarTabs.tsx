import { useTabContext } from "~/contexts/TabContext";
import TabContentPanels from "./TabContentPanels";
import { useEffect } from "react";
import tailmater from "~/js/tailmater";

const AppBarTabs = () => {
  const { activeTab, tabsRef, handleTabChange, tabs } = useTabContext();

  if (!tabs) return;

  const handleRef = (el: HTMLButtonElement) => {
    if (!el) return;
    if (tabsRef.current.length >= 3) tabsRef.current.shift();
    tabsRef.current.push(el);
  };

  useEffect(() => {
    tailmater();
  }, []);

  return (
    <div className="tabs relative flex w-full flex-col">
      <div className="absolute -z-10 h-[50px] w-full rounded-b-[20px] border-b-[1px] border-t-[0.5px] border-b-gray-200 border-t-gray-500 bg-white"></div>
      <div className="px-[30px] overflow-x-auto overflow-y-hidden rounded-b-[20px]">
        <div className="relative grid h-[50px] w-full min-w-max grid-cols-3 items-center md:w-max">
          {tabs.map(({ id, title }) => {
            return (
              <button
                ref={handleRef}
                key={`tab-${id.replace(" ", "-")}`}
                data-type="tabs"
                data-target={`#panel-${id.replace(" ", "-")}`}
                className={`flex h-[49px] flex-col items-center justify-center gap-1 whitespace-nowrap px-4 py-2 ${
                  activeTab === id && "active text-primary-600"
                }`}
                onClick={() => handleTabChange(id)}
              >
                <p className="text-sm font-medium tracking-[.00714em]">
                  {title}
                </p>
              </button>
            );
          })}

          <div
            role="indicator"
            className="absolute bottom-0 left-0 ml-[calc(33.3%-25%)] h-0.5 w-[17%] rounded-t-full bg-primary-600 transition-all duration-200 ease-in-out"
          ></div>
        </div>
      </div>

      <div className="relative flex min-h-[calc(100vh-201px)] bg-neutral-50 md:min-h-[calc(100vh-170px)]">
        <TabContentPanels />
      </div>
    </div>
  );
};

export default AppBarTabs;
