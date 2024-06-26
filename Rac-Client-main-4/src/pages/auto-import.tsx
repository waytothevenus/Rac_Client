import dynamic from "next/dynamic";
import PageLayout from "~/components/Layouts/PageLayout";
import { LoadingSpinner } from "~/components/LoadingScreen";
import { useAuthContext } from "~/contexts/AuthContext";
import AutoImportContextProvider from "~/contexts/AutoImportContext";
import TabContextProvider, { loading } from "~/contexts/TabContext";

const TopAppBar = dynamic(() => import("~/components/TopAppBar"), {
  loading: () => (
    <div className="h-screen">
      <LoadingSpinner />
    </div>
  ),
});

const AutoImportDraftsPanel = dynamic(
  () => import("~/components/AutoImport/Drafts/DraftsPanel"),
  { loading },
);
const AutoImportOrdersPanel = dynamic(
  () => import("~/components/AutoImport/Orders/OrdersPanel"),
  { loading },
);
const AutoImportRequestsPanel = dynamic(
  () => import("~/components/AutoImport/Requests/RequestsPanel"),
  { loading },
);

const autoImport = () => {
  const { user } = useAuthContext();

  if (!user) return null;

  return (
    <TabContextProvider
      tabs={[
        { id: "orders", title: "Orders", content: <AutoImportOrdersPanel /> },
        {
          id: "requests",
          title: "Requests",
          content: <AutoImportRequestsPanel />,
        },
        { id: "drafts", title: "Drafts", content: <AutoImportDraftsPanel /> },
      ]}
    >
      <PageLayout>
        <AutoImportContextProvider>
          <TopAppBar />
        </AutoImportContextProvider>
      </PageLayout>
    </TabContextProvider>
  );
};

export default autoImport;
