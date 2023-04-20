import { rest } from "msw";

export const handlers = [
  rest.get("api/v1/tables", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        tables: [
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
        ],
      })
    );
  }),
];
