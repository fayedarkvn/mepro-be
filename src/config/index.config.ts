import Joi from "joi";
import { baseConfig, baseConfigValidationSchema } from "./app.config";

export const configs = [
  baseConfig,
]

const schemas = [
  baseConfigValidationSchema,
]

const mergeSchemas = (schemas: Joi.ObjectSchema<any>[]) => {
  let mergedSchema = Joi.object();
  schemas.forEach(schema => {
    mergedSchema = mergedSchema.concat(schema);
  });
  return mergedSchema;
};

export const validationSchema = mergeSchemas(schemas);