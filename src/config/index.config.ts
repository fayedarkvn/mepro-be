import Joi from "joi";
import { baseConfig, baseConfigValidationSchema } from "./app.config";
import { dbConfig, dbConfigValidationSchema } from "./db.config";
import { jwtConfig, jwtConfigValidationSchema } from "./jwt.config";

export const configs = [
  baseConfig,
  dbConfig,
  jwtConfig,
];

const schemas = [
  baseConfigValidationSchema,
  dbConfigValidationSchema,
  jwtConfigValidationSchema,
];

const mergeSchemas = (schemas: Joi.ObjectSchema<any>[]) => {
  let mergedSchema = Joi.object();
  schemas.forEach(schema => {
    mergedSchema = mergedSchema.concat(schema);
  });
  return mergedSchema;
};

export const validationSchema = mergeSchemas(schemas);