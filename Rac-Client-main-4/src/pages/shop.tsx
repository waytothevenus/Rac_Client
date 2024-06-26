import dynamic from "next/dynamic";
import PageLayout from "~/components/Layouts/PageLayout";
import { LoadingSpinner } from "~/components/LoadingScreen";
import { useAuthContext } from "~/contexts/AuthContext";
import ShopContextProvider from "~/contexts/ShopContext";
import TabContextProvider, { loading } from "~/contexts/TabContext";

const TopAppBar = dynamic(() => import("~/components/TopAppBar"), {
  loading: () => (
    <div className="h-screen">
      <LoadingSpinner />
    </div>
  ),
});

const ShopDraftsPanel = dynamic(
  () => import("~/components/Shop/Drafts/DraftsPanel"),
  { loading },
);
const ShopOrdersPanel = dynamic(
  () => import("~/components/Shop/Orders/OrdersPanel"),
  { loading },
);
const ShopRequestsPanel = dynamic(
  () => import("~/components/Shop/Requests/RequestsPanel"),
  { loading },
);

const shop = () => {
  const { user } = useAuthContext();

  if (!user) return null;

  return (
    <TabContextProvider
      tabs={[
        { id: "orders", title: "Orders", content: <ShopOrdersPanel /> },
        { id: "requests", title: "Requests", content: <ShopRequestsPanel /> },
        { id: "drafts", title: "Drafts", content: <ShopDraftsPanel /> },
      ]}
    >
      <PageLayout>
        <ShopContextProvider>
          <TopAppBar />
        </ShopContextProvider>
      </PageLayout>
    </TabContextProvider>
  );
};

export default shop;
