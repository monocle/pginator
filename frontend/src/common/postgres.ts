// https://www.postgresql.org/docs/current/ddl-system-columns.html

export const systemColumns = [
  "TABLEOID",
  "XMIN",
  "CMIN",
  "XMAX",
  "CMAX",
  "CTID",
];

// https://www.postgresql.org/docs/current/datatype.html
export const columnDataTypes = [
  "bigint",
  "bigserial",
  "bit(8)",
  "bit varying(8)",
  "bool", // alias boolean
  "boolean",
  "box",
  "bytea",
  "char(50)", // alias character
  "character(50)",
  "character varying(50)",
  "cidr",
  "circle",
  "date",
  "decimal(10,2)", // alias numeric
  "double precision",
  "float4", // alias float4
  "float8", // alias double precision
  "inet",
  "int", // alias integer
  "int2", // alias smallint
  "int4", // alias integer
  "int8", // alias bigint
  "integer",
  "interval '3 hours 20 minutes'", // https://www.postgresql.org/docs/9.1/datatype-datetime.html
  "json",
  "jsonb",
  "line",
  "lseg",
  "macaddr",
  "macaddr8",
  "money",
  "numeric(10,2)",
  "path",
  "pg_lsn",
  "pg_snapshot",
  "point",
  "polygon",
  "real",
  "smallint",
  "smallserial",
  "serial",
  "serial2", // alias smallserial
  "serial4", // alias serial
  "serial8", // alias bigserial
  "text",
  "time(3)",
  "timestamp(3)",
  "timestamptz(3)", // alias timestamp
  "timetz(3)", // alias time
  "tsquery",
  "tsvector",
  "uuid",
  "varbit(8)", // alias bit varying
  "varchar(50)", // alias character varying
  "xml",
];

// https://www.postgresql.org/docs/current/sql-keywords-appendix.html
export const reservedWords = [
  "ALL",
  "ANALYSE",
  "ANALYZE",
  "AND",
  "ANY",
  "ARRAY",
  "AS",
  "ASC",
  "ASYMMETRIC",
  "AUTHORIZATION",
  "BINARY",
  "BOTH",
  "CASE",
  "CAST",
  "CHECK",
  "COLLATE",
  "COLLATION",
  "COLUMN",
  "CONCURRENTLY",
  "CONSTRAINT",
  "CREATE",
  "CROSS",
  "CURRENT_CATALOG",
  "CURRENT_DATE",
  "CURRENT_ROLE",
  "CURRENT_SCHEMA",
  "CURRENT_TIME",
  "CURRENT_TIMESTAMP",
  "CURRENT_USER",
  "DEFAULT",
  "DEFERRABLE",
  "DESC",
  "DISTINCT",
  "DO",
  "ELSE",
  "END",
  "EXCEPT",
  "FALSE",
  "FETCH",
  "FOR",
  "FOREIGN",
  "FREEZE",
  "FROM",
  "FULL",
  "GRANT",
  "GROUP",
  "HAVING",
  "ILIKE",
  "IN",
  "INITIALLY",
  "INNER",
  "INTERSECT",
  "INTO",
  "IS",
  "ISNULL",
  "JOIN",
  "LATERAL",
  "LEADING",
  "LEFT",
  "LIKE",
  "LIMIT",
  "LOCALTIME",
  "LOCALTIMESTAMP",
  "NATURAL",
  "NOT",
  "NOTNULL",
  "NULL",
  "OFFSET",
  "ON",
  "ONLY",
  "OR",
  "ORDER",
  "OUTER",
  "OVER",
  "OVERLAPS",
  "PLACING",
  "PRIMARY",
  "REFERENCES",
  "RETURNING",
  "RIGHT",
  "SELECT",
  "SESSION_USER",
  "SIMILAR",
  "SOME",
  "SYMMETRIC",
  "TABLE",
  "TABLESAMPLE",
  "THEN",
  "TO",
  "TRAILING",
  "TRUE",
  "UNION",
  "UNIQUE",
  "USER",
  "USING",
  "VARIADIC",
  "VERBOSE",
  "WHEN",
  "WHERE",
  "WINDOW",
  "WITH",
  "WRITE",
];

// https://www.postgresql.org/docs/current/sql-altertable.html
export const tableActions = [
  "ADD",
  "DROP",
  "ALTER",
  "RENAME",
  "RENAME TO",
  "ALTER CONSTRAINT",
  "VALIDATE CONSTRAINT",
  "DROP CONSTRAINT",
  "DISABLE TRIGGER",
  "ENABLE TRIGGER",
  "ENABLE REPLICA TRIGGER",
  "ENABLE ALWAYS TRIGGER",
  "DISABLE RULE",
  "ENABLE RULE",
  "ENABLE REPLICA RULE",
  "ENABLE ALWAYS RULE",
  "DISABLE ROW LEVEL SECURITY",
  "ENABLE ROW LEVEL SECURITY",
  "FORCE ROW LEVEL SECURITY",
  "NO FORCE ROW LEVEL SECURITY",
  "CLUSTER ON",
  "SET WITHOUT CLUSTER",
  "SET WITHOUT OIDS",
  "SET ACCESS METHOD",
  "SET TABLESPACE",
  "SET",
  "RESET",
  "INHERIT",
  "NO INHERIT",
  "OF",
  "NOT OF",
  "OWNER TO",
  "REPLICA IDENTITY",
];
