import { registerAs } from "@nestjs/config";
import Joi from "joi";

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
}));

export const jwtConfigValidationSchema = Joi.object({
  JWT_SECRET: Joi.string().required(),
})