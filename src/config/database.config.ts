import { registerAs } from "@nestjs/config";
import Joi from 'joi';

export const databaseConfig = registerAs('db', () => ({
  host: process.env.DB_PG_HOST,
  port: process.env.DB_PG_PORT,
  username: process.env.DB_PG_USERNAME,
  password: process.env.DB_PG_PASSWORD,
  database: process.env.DB_PG_DATABASE,
  synchronize: process.env.DB_PG_SYNCHRONIZE,
}));

export const databaseConfigValidationSchema = Joi.object({
  DB_PG_HOST: Joi.string().required(),
  PG_PORT: Joi.number().required(),
  DB_PG_USERNAME: Joi.string().required(),
  DB_PG_PASSWORD: Joi.string().required(),
  DB_PG_DATABASE: Joi.string().required(),
  DB_PG_SYNCHRONIZE: Joi.boolean().required(),
});
