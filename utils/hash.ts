import { randomBytes, createHmac } from "crypto";
import { string } from "zod";
export function hashedPasswordWithSalt(password: string, userSalt = "") {
  const salt = userSalt !== "" ? userSalt : randomBytes(256).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  return { salt, hashedPassword };
}
