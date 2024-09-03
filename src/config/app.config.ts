import { registerAs } from "@nestjs/config";
import Joi from "joi";

export const baseConfig = registerAs('app', () => ({
  name: process.env.APP_NAME || '',
}));

export const baseConfigValidationSchema = Joi.object({
  APP_NAME: Joi.string().optional(),
})