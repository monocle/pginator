import type { ServerRows, ServerRow, ServerTable, RowId } from "../interface";
import { useGetRequest, useApiMutation } from "../useApi";

export function useGetRows(tableName: string, offset: number, orderBy: string) {
  return useGetRequest<ServerRows>([
    "rows",
    `rows/${tableName}`,
    "GET",
    undefined,
    {
      offset: offset.toString(),
      order_by: orderBy,
    },
  ]);
}

export function useCreateRow() {
  const request = useApiMutation<ServerRow>(["rows"], true);

  const mutateRow = (table: ServerTable, params: ServerRow) => {
    request.mutate({
      queryKey: ["rows", `rows/${table.table_name}`, "POST", params],
    });
  };

  return { request, mutateRow };
}

export function useUpdateRow() {
  const request = useApiMutation<ServerRow>(["rows"], true);

  const mutateRow = (table: ServerTable, params: ServerRow, id: RowId) => {
    request.mutate({
      queryKey: ["rows", `rows/${table.table_name}/${id}`, "PUT", params],
    });
  };

  return { request, mutateRow };
}

export function useDeleteRow() {
  const request = useApiMutation<ServerRow>(["rows"]);

  const deleteRow = (tableName: string, rowId: RowId) => {
    request.mutate({
      queryKey: ["rows", `rows/${tableName}/${rowId}`, "DELETE"],
    });
  };

  return { request, deleteRow };
}
