import { registerAs } from "@nestjs/config";
import Joi from 'joi';

export const dbConfig = registerAs('db', () => ({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNCHRONIZE && process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING,
}));

export const dbConfigValidationSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().optional(),
  DB_LOGGING: Joi.string().optional(),
});
