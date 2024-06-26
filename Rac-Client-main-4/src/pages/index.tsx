import dynamic from "next/dynamic";
import PageLayout from "~/components/Layouts/PageLayout";
import { LoadingSpinner } from "~/components/LoadingScreen";
import { useAuthContext } from "~/contexts/AuthContext";
import HomeContextProvider from "~/contexts/HomeContext";
import TabContextProvider, { loading } from "~/contexts/TabContext";

const TopAppBar = dynamic(() => import("~/components/TopAppBar"), {
  loading: () => (
    <div className="h-screen">
      <LoadingSpinner />
    </div>
  ),
});

const HomePanel = dynamic(
  () => import("~/components/Home"),
  { loading },
);

const home = () => {
  const { user } = useAuthContext();

  if (!user) return null;

  return (
    <TabContextProvider>
      <PageLayout>
        <HomeContextProvider>
          <TopAppBar />
          <HomePanel />
        </HomeContextProvider>
      </PageLayout>
    </TabContextProvider>
  );
};

export default home;

