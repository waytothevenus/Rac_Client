import Balancer from "react-wrap-balancer";
import NeedHelpFAB from "~/components/Buttons/NeedHelpFAB";
import RequestOrderButton from "~/components/Buttons/RequestOrderButton";
import TabContentLayout from "~/components/Layouts/TabContentLayout";
import { useExportContext } from "~/contexts/ExportContext";
import DraftDetails from "./DraftDetails";

const ExportDraftsPanel = () => {
  const { localDraft } = useExportContext();

  if (localDraft) {
    return (
      <TabContentLayout>
        <DraftDetails />
        <NeedHelpFAB />
      </TabContentLayout>
    );
  }

  return (
    <TabContentLayout>
      <div className="flex w-full flex-grow flex-col items-center justify-center gap-[30px]">
        <h2 className="title-md md:title-lg max-w-[462px] text-center">
          <Balancer>
            You don&apos;t have any export request in your draft folder yet,
            would you like to request for a new order?
          </Balancer>
        </h2>
        <RequestOrderButton />
      </div>
    </TabContentLayout>
  );
};

export default ExportDraftsPanel;
