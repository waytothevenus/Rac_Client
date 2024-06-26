import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import ActivitiesTable from "~/components/ActivitiesTable";
import { Pinned } from "./AccountInformation";

type ActivityType = {
  event: string;
  localDateTime: string;
};

const Activities = () => {
  const activities: ActivityType[] = Array<ActivityType>(6).fill({
    event: "Sent a payment claim",
    localDateTime: "22-03-2023 13:05",
  });

  const defaultColumns = useMemo(() => {
    const columnHelper = createColumnHelper<ActivityType>();

    return [
      columnHelper.display({
        id: "event",
        header: "Event",
        cell: ({ row }) => (
          <span className="label-lg font-medium">{row.original.event}</span>
        ),
      }),
      columnHelper.accessor("localDateTime", {
        header: "Date & Time",
        cell: ({ row }) => (
          <span className="label-lg font-medium">
            {row.original.localDateTime}
          </span>
        ),
      }),
    ] as Array<ColumnDef<ActivityType, unknown>>;
  }, []);

  return (
    <div className="grid grid-cols-1 gap-[15px] md:grid-cols-12">
      <div className="col-span-full h-[262px] md:col-span-8">
        <ActivitiesTable columns={defaultColumns} data={activities} />
      </div>

      <div className="col-span-full h-[262px] md:col-span-4">
        <Pinned />
      </div>
    </div>
  );
};

export default Activities;
