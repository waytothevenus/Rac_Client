import { type TabType } from "~/contexts/TabContext";
import { PrimaryButton } from "../Buttons/PrimaryButton";
import {
  RequestFormHeader,
  SectionContentLayout,
} from "../Shop/Requests/RequestOrder";

type SettingItemsType = {
  title: string;
  description: string;
  button: { label: string; onClick: () => void };
};

type SettingContentsProps = {
  handleShowTabs: (tabId: TabType["id"]) => void;
};

const SettingsContent = ({ handleShowTabs }: SettingContentsProps) => {
  const settingItems: SettingItemsType[] = [
    {
      title: "Profile Information",
      description:
        "We know you through your profile information and it reflects on your invoices",
      button: {
        label: "View Profile",
        onClick: () => handleShowTabs("profile information"),
      },
    },
    {
      title: "Communication preferences",
      description:
        "You can customize your notification preferences for order or shipping updates, promotions, etc.",
      button: {
        label: "Modify permissions",
        onClick: () => handleShowTabs("communication preferences"),
      },
    },
    {
      title: "Security",
      description: "You can update your security settings easily here.",
      button: {
        label: "Modify security settings",
        onClick: () => handleShowTabs("security"),
      },
    },
  ];

  return (
    <div className="flex max-w-[1094px] flex-col gap-[30px] rounded-[20px] bg-white p-[20px] md:p-[30px]">
      <RequestFormHeader title="My Account" />
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-3">
        {settingItems.map((item) => {
          return (
            <SectionContentLayout key={item.title}>
              <div className="col-span-1 flex h-full w-full flex-col gap-[10px] md:-mx-[14px] flex-grow">
                <h4 className="title-md md:title-lg text-gray-700">
                  {item.title}
                </h4>
                <p className="body-lg h-full">{item.description}</p>
                <hr className="border-t-[1px] border-dashed border-t-gray-500" />
                <PrimaryButton
                  text={item.button.label}
                  onClick={item.button.onClick}
                />
              </div>
            </SectionContentLayout>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsContent;
