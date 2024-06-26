import dynamic from "next/dynamic";
import PageLayout from "~/components/Layouts/PageLayout";
import { LoadingSpinner } from "~/components/LoadingScreen";
import { useAuthContext } from "~/contexts/AuthContext";
import ExportContextProvider from "~/contexts/ExportContext";
import TabContextProvider, { loading } from "~/contexts/TabContext";

const TopAppBar = dynamic(() => import("~/components/TopAppBar"), {
  loading: () => (
    <div className="h-screen">
      <LoadingSpinner />
    </div>
  ),
});

const ExportDraftsPanel = dynamic(
  () => import("~/components/Export/Drafts/DraftsPanel"),
  { loading },
);
const ExportOrdersPanel = dynamic(
  () => import("~/components/Export/Orders/OrdersPanel"),
  { loading },
);
const ExportRequestsPanel = dynamic(
  () => import("~/components/Export/Requests/RequestsPanel"),
  { loading },
);

const exportPage = () => {
  const { user } = useAuthContext();

  if (!user) return null;

  return (
    <TabContextProvider
      tabs={[
        { id: "orders", title: "Orders", content: <ExportOrdersPanel /> },
        { id: "requests", title: "Requests", content: <ExportRequestsPanel /> },
        { id: "drafts", title: "Drafts", content: <ExportDraftsPanel /> },
      ]}
    >
      <PageLayout>
        <ExportContextProvider>
          <TopAppBar />
        </ExportContextProvider>
      </PageLayout>
    </TabContextProvider>
  );
};

export default exportPage;
