import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  host: process.env.PGHOST || 'db', // Use 'db' as it's the service name in docker-compose
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'admin',
  database: process.env.PGDATABASE || 'newodoo',
});

const connectWithRetry = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      await client.connect();
      console.log('Successfully connected to PostgreSQL');
      return client;
    } catch (err) {
      console.error('Database connection error:', err);
      retries -= 1;
      console.log(`Failed to connect to PostgreSQL. Retries left: ${retries}`);
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      }
    }
  }
  throw new Error('Failed to connect to PostgreSQL after multiple attempts');
};

// Connect to database when this module is imported
connectWithRetry().catch(err => {
  console.error('Failed to connect to PostgreSQL:', err);
  process.exit(1);
});

export default client;