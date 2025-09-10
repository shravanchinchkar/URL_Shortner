import { usersTable } from "./user.model";
import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const urlsTable = pgTable("urls", {
  id: uuid().primaryKey().defaultRandom(),
  shortCode: varchar("code", { length: 155 }).notNull().unique(),
  targetURL: text("target_url").notNull(),

  userId: uuid("user_Id")
    .references(() => usersTable.id)
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
