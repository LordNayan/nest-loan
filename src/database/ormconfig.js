module.exports = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: false,
  entities: ['./dist/database/entities/**/*.js'],
  migrations: ['./dist/database/migrations/*.js'],
  cli: {
    migrationsDir: './src/database/migrations',
  },
};
