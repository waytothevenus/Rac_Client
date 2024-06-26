import { useToggle } from "usehooks-ts";
import { useAuthContext } from "~/contexts/AuthContext";
import { BackButton } from "../Buttons/BackButton";
import TabContentLayout from "../Layouts/TabContentLayout";
import { SubSectionTitle } from "../Shop/Requests/RequestCheckout";
import { SectionContentLayout } from "../Shop/Requests/RequestOrder";
import { type SettingsTabContentProps } from "./ProfileInformation";

export type PreferenceType = {
  title: string;
  description: string | JSX.Element;
  disabled?: boolean;
  onClick: () => void;
};

const CommunicationPreferences = ({
  handleHideTabs,
}: SettingsTabContentProps) => {
  const { user } = useAuthContext();

  if (!user) return;

  const contactNumber = `${user.billingDetails.countryCode} ${user.billingDetails.phoneNumber}`;

  const preferences: PreferenceType[] = [
    {
      title: "Notifications via SMS",
      description: (
        <>
          Opt to receive important updates and alert via SMS through your phone
          number <span className="text-gray-700">{contactNumber}</span>. Keep
          your contact number updated for timely notification
        </>
      ),
      onClick: () => undefined,
    },
    {
      title: "Notifications via WhatsApp",
      description: (
        <>
          Receive timely updates and alert via WhatsApp through your phone
          number <span className="text-gray-700">{contactNumber}</span> for a
          convenient and instant communication experience.
        </>
      ),
      onClick: () => undefined,
    },
    {
      title:
        "Receive latest information on our exclusive deals and offerings via Email",
      description: (
        <>
          Stay informed about exclusive offers and offerings by opting to
          receive updates via your email{" "}
          <span className="text-gray-700">{user.email}</span>
        </>
      ),
      onClick: () => undefined,
    },
  ];

  return (
    <TabContentLayout>
      <div className="flex max-w-[1094px] flex-col gap-[30px] rounded-[20px] bg-white p-[20px] md:p-[30px]">
        <div className="flex flex-col gap-[20px]">
          {preferences.map((item, i) => {
            return (
              <PreferenceItem
                key={i}
                id={`communication-preferences-${i}`}
                title={item.title}
                description={item.description}
                onClick={item.onClick}
              />
            );
          })}
        </div>

        <div className="w-full md:max-w-[169px]">
          <BackButton text="Back to settings" onClick={handleHideTabs} />
        </div>
      </div>
    </TabContentLayout>
  );
};

type PreferenceItemProps = {
  id: string;
  title: string;
  description: string | JSX.Element;
  disabled?: boolean;
  onClick: ({ isToggled }: { isToggled: boolean }) => void;
};

export const PreferenceItem = ({
  id,
  title,
  description,
  disabled = false,
  onClick,
}: PreferenceItemProps) => {
  const [isToggled, toggle] = useToggle();

  const handleClick = () => {
    toggle();
    onClick({ isToggled });
  };

  return (
    <SectionContentLayout>
      <div
        className={`flex w-full flex-col gap-[20px] ${
          disabled ? "opacity-40" : ""
        }`}
      >
        <div className="flex justify-between">
          <SubSectionTitle title={title} />
          <div className="toggle-switch relative inline-flex w-[52px]">
            <input
              id={id}
              className="toggle-checkbox hidden"
              type="checkbox"
              disabled={disabled}
              onClick={handleClick}
            />
            <label
              htmlFor={id}
              className="toggle-default transition-color relative block h-8 w-12 rounded-full duration-150 ease-out"
            ></label>
          </div>
        </div>
        <div className="body-lg text-gray-900">{description}</div>
      </div>
    </SectionContentLayout>
  );
};

export default CommunicationPreferences;
