import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { type ReactNode } from "react";

interface ReactTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  tableFooter: ReactNode;
}

const PackageTable = <T extends object>({
  data,
  columns,
  tableFooter,
}: ReactTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex w-full flex-col gap-[10px] overflow-hidden overflow-x-auto rounded-[20px] border border-gray-200 bg-white">
        <div className="h-max w-max sm:w-full">
          <table className="w-full">
            <thead className="title-sm bg-neutral-50 px-[30px] py-[20px] font-medium text-secondary-900">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="label-lg border-0">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white px-[20px] [&>tr]:border-b-[1px] [&>tr]:border-gray-500 last:[&>tr]:border-b-0">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="label-lg bg-gray-10 px-[20px] py-[20px] !font-medium"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td className="border-0" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="grid grid-cols-4 place-items-center gap-[20px] bg-neutral-50 px-[30px] py-[10px] [&>tr>td]:border-0 [&>tr>td]:p-0">
            {tableFooter}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageTable;
