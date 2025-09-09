import { randomBytes, createHmac } from "crypto";
export function hashedPasswordWithSalt(password: string) {
  const salt = randomBytes(256).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  return { salt, hashedPassword };
}
