import dynamic from "next/dynamic";
import { useState } from "react";
import NoTabsContentLayout from "~/components/Layouts/NoTabsContentLayout";
import PageLayout from "~/components/Layouts/PageLayout";
import { LoadingSpinner } from "~/components/LoadingScreen";
import { useAuthContext } from "~/contexts/AuthContext";
import TabContextProvider, {
  loading,
  type TabType,
} from "~/contexts/TabContext";

const TopAppBar = dynamic(() => import("~/components/TopAppBar"), {
  loading: () => (
    <div className="h-screen">
      <LoadingSpinner />
    </div>
  ),
});

const ProfileInformation = dynamic(
  () => import("~/components/Settings/ProfileInformation"),
  { loading },
);

const CommunicationPreferences = dynamic(
  () => import("~/components/Settings/CommunicationPreferences"),
  { loading },
);

const Security = dynamic(() => import("~/components/Settings/Security"), {
  loading,
});

const SettingsContent = dynamic(
  () => import("~/components/Settings/SettingsContent"),
  {
    loading,
  },
);

const settings = () => {
  const { user } = useAuthContext();

  if (!user) return null;

  const [showTabs, setShowTabs] = useState(false);
  const [defaultTabId, setDefaultTabId] = useState<TabType["id"] | null>(null);

  const handleShowTabs = (tabId: TabType["id"]) => {
    setShowTabs(true);
    setDefaultTabId(tabId);
  };

  const handleHideTabs = () => {
    setShowTabs(false);
    setDefaultTabId(null);
  };

  const tabs: [TabType, ...TabType[]] = [
    {
      id: "profile information",
      title: "Profile information",
      content: <ProfileInformation handleHideTabs={handleHideTabs} />,
    },
    {
      id: "communication preferences",
      title: "Communication preferences",
      content: <CommunicationPreferences handleHideTabs={handleHideTabs} />,
    },
    {
      id: "security",
      title: "Security",
      content: <Security handleHideTabs={handleHideTabs} />,
    },
  ];

  return (
    <TabContextProvider tabs={tabs} defaultTabId={defaultTabId}>
      <PageLayout>
        <TopAppBar hasTabs={showTabs} />
        {!showTabs && (
          <NoTabsContentLayout>
            <SettingsContent handleShowTabs={handleShowTabs} />
          </NoTabsContentLayout>
        )}
      </PageLayout>
    </TabContextProvider>
  );
};

export default settings;
