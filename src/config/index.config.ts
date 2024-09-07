import Joi from "joi";
import { baseConfig, baseConfigValidationSchema } from "./app.config";
import { jwtConfig, jwtConfigValidationSchema } from "./jwt.config";

export const configs = [
  baseConfig,
  jwtConfig,
];

const schemas = [
  baseConfigValidationSchema,
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