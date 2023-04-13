import { ServerRows, ServerRow } from "../interface";
import { useGetRequest, useApiMutation } from "../useApi";

export function useGetRows(tableName: string, offset: number) {
  return useGetRequest<ServerRows>([
    "rows",
    `rows/${tableName}`,
    "GET",
    undefined,
    { offset: offset.toString() },
  ]);
}

export function useCreateRow() {
  const request = useApiMutation<ServerRow>(["rows"]);

  const createRow = (tableName: string, params: ServerRow) => {
    request.mutate({
      queryKey: ["rows", `rows/${tableName}`, "POST", params],
    });
  };

  return { request, createRow };
}

export function useUpdateRow() {
  const request = useApiMutation(["rows"]);

  const updateRow = (tableName: string, params: ServerRow) => {
    request.mutate({
      queryKey: ["rows", `rows/${tableName}`, "PUT", params],
    });
  };

  return { request, updateRow };
}

export function useDeleteRow() {
  const request = useApiMutation(["rows"]);

  const deleteRow = (tableName: string, rowId: string) => {
    request.mutate({
      queryKey: ["rows", `rows/${tableName}/${rowId}`, "DELETE"],
    });
  };

  return { request, deleteRow };
}
