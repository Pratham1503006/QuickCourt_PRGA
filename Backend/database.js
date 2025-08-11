import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  host: process.env.PGHOST || "localhost",
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || "youruser",
  password: process.env.PGPASSWORD || "yourpassword",
  database: process.env.PGDATABASE || "yourdb",
});

client.connect();

export default client;