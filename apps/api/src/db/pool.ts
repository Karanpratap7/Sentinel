import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString:"postgresql://karan:Sam%402024@localhost:5432/sentinel",
});
