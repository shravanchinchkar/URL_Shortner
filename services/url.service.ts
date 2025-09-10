import db from "../db/index";
import { nanoid } from "nanoid";
import { urlsTable } from "../models/url.model";

export async function shortenURL(url: string, userId: string, code?: string) {
  const shortCode = code ?? nanoid(6);
  const [result] = await db
    .insert(urlsTable)
    .values({
      shortCode,
      targetURL: url,
      userId,
    })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      target: urlsTable.targetURL,
    });
  return result;
}
