import db from "../db/index";
import { eq } from "drizzle-orm";
import { usersTable } from "../models/user.model";

type TSignupSchema = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  salt: string;
};

export async function getUserByEmail(email: string) {
  const [existingUser] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      salt: usersTable.salt,
      password: usersTable.password,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));
  return existingUser;
}

export async function createNewUser({
  firstName,
  lastName,
  email,
  password,
  salt,
}: TSignupSchema) {
  const [user] = await db
    .insert(usersTable)
    .values({
      firstName,
      lastName,
      email,
      password,
      salt,
    })
    .returning({ id: usersTable.id });
  return user;
}
