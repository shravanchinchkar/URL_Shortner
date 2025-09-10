import db from "../db/index";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { NextFunction } from "express";
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

export async function redirectURL(code: string) {
  const [result] = await db
    .select({
      targetURL: urlsTable.targetURL,
    })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, code));

  return result;
}

export async function getAllCodes(id: string) {
  const result = await db
    .select()
    .from(urlsTable)
    .where(eq(urlsTable.userId, id));
    
  return result;
}
