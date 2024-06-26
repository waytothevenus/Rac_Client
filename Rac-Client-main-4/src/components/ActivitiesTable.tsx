import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowSquareLeft,
  ArrowSquareRight,
  ArrowSwapVertical,
} from "iconsax-react";
import { useMemo, useState } from "react";
import Balancer from "react-wrap-balancer";
import { type SelectNumberProps } from "./MainTable";

interface ReactTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
}

const ActivitiesTable = <T extends object>({
  data,
  columns,
}: ReactTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  // todo: move pagination state to context close to useQuery if going with server side pagination
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    pageCount: Math.ceil(data.length / pagination.pageSize),
    manualPagination: true,
  });

  const firstRow =
    table.getState().pagination.pageSize *
    table.getState().pagination.pageIndex;
  const lastRow = firstRow + table.getState().pagination.pageSize;

  const startRowIndex = pageIndex * pageSize;
  const endRowIndex = Math.min(
    (pageIndex + 1) * pageSize,
    table.getRowModel().rows.length,
  );

  return (
    <div className="flex h-full w-full flex-col gap-[10px] rounded-[20px] border border-gray-200 bg-white px-[15px]">
      {table.getRowModel().rows.length > 0 ? (
        <>
          <div className="h-full overflow-auto">
            <table className="relative w-max min-w-full">
              <thead className="title-sm sticky top-0 z-10 bg-white px-[30px] py-[20px] !font-medium text-secondary-900">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="label-lg border-0">
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none flex gap-[10px]"
                                : "flex items-center",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {header.column.getCanSort() && (
                              <ArrowSwapVertical
                                className="self-end text-neutral-500"
                                size="20"
                              />
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white px-[20px] [&>tr]:border-b-[1px] [&>tr]:border-gray-500 last:[&>tr]:border-b-0">
                {table
                  .getRowModel()
                  .rows.slice(startRowIndex, endRowIndex)
                  .map((row) => (
                    <tr
                      key={row.id}
                      className="label-lg bg-gray-10 py-[5px] !font-medium"
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
          </div>

          <div className="body-lg flex flex-col items-center gap-[20px] px-[10px] py-[10px] md:flex-row">
            <div className="flex w-full items-center gap-[12px] md:w-max">
              <span className="whitespace-nowrap">Items per page:</span>
              <div className="w-[150px] md:w-[100px]">
                <SelectNumber
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                />
              </div>
            </div>
            <div className="flex w-full gap-[20px]">
              <span>
                {firstRow + 1}-
                {lastRow > table.getRowModel().rows.length
                  ? table.getRowModel().rows.length
                  : lastRow}{" "}
                of {table.getRowModel().rows.length}
              </span>
              <div className="flex gap-[10px]">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="btn relative flex h-fit w-fit items-center justify-center rounded-[6.25rem] hover:bg-surface-300 focus:bg-surface-400"
                >
                  <ArrowSquareLeft
                    className={
                      table.getCanPreviousPage()
                        ? "text-primary-600"
                        : "text-gray-200"
                    }
                  />
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="btn relative flex h-fit w-fit items-center justify-center rounded-[6.25rem] hover:bg-surface-300 focus:bg-surface-400"
                >
                  <ArrowSquareRight
                    className={
                      table.getCanNextPage()
                        ? "text-primary-600"
                        : "text-gray-200"
                    }
                  />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="title-lg md:title-lg flex h-full w-[1040px] items-center justify-center gap-[10px] break-words">
          <Balancer>Empty</Balancer>
        </div>
      )}
    </div>
  );
};

const SelectNumber = ({ value, onChange }: SelectNumberProps) => {
  const values = useMemo(() => [5, 10, 20, 30], []);

  return (
    <div className="relative z-0 w-full">
      <select
        name="pageNumber"
        id="pageNumber"
        value={value}
        onChange={onChange}
        className="peer relative block h-[40px] w-full overflow-x-auto rounded-[20px] border border-gray-500 bg-neutral-10 px-4 py-2 leading-5 focus:border-2 focus:border-primary-600 focus:outline-none focus:ring-0"
      >
        {values.map((value) => {
          return (
            <option key={value} value={value}>
              {value}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default ActivitiesTable;
