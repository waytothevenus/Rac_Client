import { useTabContext } from "~/contexts/TabContext";

const TabContentPanels = () => {
  const { activeTab, tabs } = useTabContext();

  if (!tabs) return;

  return (
    <div className="flex w-full flex-col items-center justify-center">
      {tabs.map(({ id, content }) => {
        return (
          <div
            key={`panel-${id.replace(" ", "-")}`}
            id={`panel-${id.replace(" ", "-")}`}
            role="tabpanel"
            className={`duration-400 hidden w-full transition ease-in-out [&.active]:block ${
              id === activeTab && "active"
            }`}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
};

export default TabContentPanels;
