import jwt from "jsonwebtoken";
import { tokenSchema, TTokenSchema } from "../validation/token.validation";

export const createToken = async (payload: TTokenSchema) => {
  const validateInput = await tokenSchema.safeParseAsync(payload);

  if (!validateInput.success) throw new Error(validateInput.error.message);

  const payloadValidatedData = validateInput.data;

  const token = jwt.sign(payloadValidatedData, process.env.JWT_SECRET!);
  return token;
};

export function validateUserToken(token: string) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    return payload;
  } catch (error) {
    return null;
  }
}
