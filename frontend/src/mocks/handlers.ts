import { rest } from "msw";
import type { ServerTable } from "../interface";

export let mockTables: ServerTable[] = [];

export function initMockTables() {
  mockTables = [
    {
      table_name: "table1",
      columns: [{ name: "col1", data_type: "dt1" }],
      primary_key: "col1",
    },
    {
      table_name: "table2",
      columns: [{ name: "col2", data_type: "dt2" }],
      primary_key: "col2",
    },
  ];
}

export const handlers = [
  rest.get("api/v1/tables", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        tables: mockTables,
      })
    );
  }),

  rest.post("api/v1/tables", async (req, res, ctx) => {
    const table = await req.json();

    table.primary_key = "id";
    mockTables = [...mockTables, table];

    if (table.table_name === "error400") {
      return res(ctx.status(400), ctx.json({ error: "post error" }));
    }

    return res(
      ctx.delay(table.table_name === "long_delay" ? 1000 : 0),
      ctx.status(201),
      ctx.json(table)
    );
  }),

  rest.delete("api/v1/tables/:tableName", (req, res, ctx) => {
    const { tableName } = req.params;

    mockTables = mockTables.filter((table) => table.table_name !== tableName);
    return res(ctx.status(204));
  }),
];
