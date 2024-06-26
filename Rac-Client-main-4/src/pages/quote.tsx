import dynamic from "next/dynamic";
import NoTabsContentLayout from "~/components/Layouts/NoTabsContentLayout";
import PageLayout from "~/components/Layouts/PageLayout";
import { LoadingSpinner } from "~/components/LoadingScreen";
import { useAuthContext } from "~/contexts/AuthContext";
import TabContextProvider from "~/contexts/TabContext";

const TopAppBar = dynamic(() => import("~/components/TopAppBar"), {
  loading: () => (
    <div className="h-screen">
      <LoadingSpinner />
    </div>
  ),
});

const WelcomeChamp = dynamic(() => import("~/components/Quote/WelcomeChamp"));

const quote = () => {
  const { user } = useAuthContext();

  if (!user) return null;

  return (
    <TabContextProvider>
      <PageLayout>
        <TopAppBar hasTabs={false} />
        <NoTabsContentLayout>
          <WelcomeChamp />
        </NoTabsContentLayout>
      </PageLayout>
    </TabContextProvider>
  );
};

export default quote;
