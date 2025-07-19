"use client";

import { HistoryBooking } from "@/app/(protected)/history-booking/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import type { DataTableRowAction } from "@/types/data-table";
import React, { useTransition } from "react";
import ViewDetailDialog from "../dialog/view-detail-dialog";
import ViewInvoiceDialog from "../dialog/view-invoice-dialog";
import ViewNotesDialog from "../dialog/view-notes-dialog";
import ViewReceiptDialog from "../dialog/view-receipt-dialog";
import { getHistoryBookingTableColumns } from "./history-booking-columns";

interface HistoryBookingTableProps {
  promises: Promise<
    [
      Awaited<
        ReturnType<
          typeof import("@/app/(protected)/history-booking/fetch").getData
        >
      >
    ]
  >;
}

const HistoryBookingTable = ({ promises }: HistoryBookingTableProps) => {
  const [isPending, startTransition] = useTransition();
  const [{ data, pageCount }] = React.use(promises);
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<HistoryBooking> | null>(null);

  const columns = React.useMemo(
    () =>
      getHistoryBookingTableColumns({
        setRowAction,
      }),
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
    startTransition,
  });

  return (
    <>
      <div className="relative">
        <DataTable table={table} isPending={isPending}>
          <DataTableToolbar table={table} isPending={isPending} />
        </DataTable>
      </div>
      <ViewInvoiceDialog
        open={rowAction?.variant === "invoice"}
        onOpenChange={() => setRowAction(null)}
        booking={rowAction?.row.original ?? null}
      />
      <ViewReceiptDialog
        open={rowAction?.variant === "receipt"}
        onOpenChange={() => setRowAction(null)}
        booking={rowAction?.row.original ?? null}
      />
      <ViewNotesDialog
        open={rowAction?.variant === "notes"}
        onOpenChange={() => setRowAction(null)}
        booking={rowAction?.row.original ?? null}
      />
      <ViewDetailDialog
        open={rowAction?.variant === "detail"}
        onOpenChange={() => setRowAction(null)}
        booking={rowAction?.row.original ?? null}
      />
    </>
  );
};

export default HistoryBookingTable;
