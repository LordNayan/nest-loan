export default () => ({
  application: {
    port: parseInt(process.env.PORT) || 3000,
  },
  database: {
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT),
  },
});
