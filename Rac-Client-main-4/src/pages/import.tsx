import dynamic from "next/dynamic";
import PageLayout from "~/components/Layouts/PageLayout";
import { LoadingSpinner } from "~/components/LoadingScreen";
import { useAuthContext } from "~/contexts/AuthContext";
import ImportContextProvider from "~/contexts/ImportContext";
import TabContextProvider, { loading } from "~/contexts/TabContext";

const TopAppBar = dynamic(() => import("~/components/TopAppBar"), {
  loading: () => (
    <div className="h-screen">
      <LoadingSpinner />
    </div>
  ),
});

const ImportDraftsPanel = dynamic(
  () => import("~/components/Import/Drafts/DraftsPanel"),
  { loading },
);
const ImportOrdersPanel = dynamic(
  () => import("~/components/Import/Orders/OrdersPanel"),
  { loading },
);
const ImportRequestsPanel = dynamic(
  () => import("~/components/Import/Requests/RequestsPanel"),
  { loading },
);

const importPage = () => {
  const { user } = useAuthContext();

  if (!user) return null;

  return (
    <TabContextProvider
      tabs={[
        { id: "orders", title: "Orders", content: <ImportOrdersPanel /> },
        { id: "requests", title: "Requests", content: <ImportRequestsPanel /> },
        { id: "drafts", title: "Drafts", content: <ImportDraftsPanel /> },
      ]}
    >
      <PageLayout>
        <ImportContextProvider>
          <TopAppBar />
        </ImportContextProvider>
      </PageLayout>
    </TabContextProvider>
  );
};

export default importPage;
