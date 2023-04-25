import type {
  ServerTables,
  ServerTableColumn,
  ServerTable,
  TableAction,
} from "../interface";
import { useGetRequest, useApiMutation } from "../useApi";

export function useGetTables() {
  return useGetRequest<ServerTables>(["tables", "tables"]);
}

export function useCreateTable() {
  const request = useApiMutation<ServerTable>(["tables"], true);

  const createTable = ({
    tableName,
    columns,
    createId,
  }: {
    tableName: string;
    columns: ServerTableColumn[];
    createId: boolean;
  }) => {
    request.mutate({
      queryKey: [
        "tables",
        "tables",
        "POST",
        { table_name: tableName, columns, create_id: createId },
      ],
    });
  };

  return { request, createTable };
}

export function useUpdateTable() {
  const request = useApiMutation(["tables"], true);

  const updateTable = ({
    tableName,
    action,
    remainingSql,
  }: {
    tableName: string;
    action: TableAction;
    remainingSql: string;
  }) => {
    request.mutate({
      queryKey: [
        "tables",
        `tables/${tableName}`,
        "PUT",
        { action, remaining_sql: remainingSql },
      ],
    });
  };

  return { request, updateTable };
}

export function useDeleteTable() {
  const request = useApiMutation(["tables"]);

  const deleteTable = (tableName: string) => {
    request.mutate({
      queryKey: ["tables", `tables/${tableName}`, "DELETE"],
    });
  };

  return { request, deleteTable };
}
