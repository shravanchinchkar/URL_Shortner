import db from "../db/index";
import { eq } from "drizzle-orm";
import express, { Router } from "express";
import { randomBytes, createHmac } from "crypto";
import { usersTable } from "../models/user.model";
import { signupSchema } from "../validation/request.validation";

const router: Router = express.Router();

router.post("/signup", async (req, res) => {
  const validateInput = await signupSchema.safeParseAsync(req.body);

  if (!validateInput.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid Inputs",
      error: validateInput.error.format(),
    });
  }

  const { firstName, lastName, email, password } = validateInput.data;

  const [existingUser] = await db
    .select({
      id: usersTable.id,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existingUser)
    return res.status(400).json({
      success: false,
      error: `User with email ${email} already exists!`,
    });

  // Hash the password using buildin node.js module crypto
  const salt = randomBytes(256).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  // Create new user
  const [user] = await db
    .insert(usersTable)
    .values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      salt,
    })
    .returning({ id: usersTable.id });

  return res.status(201).json({
    success: true,
    message: `new user created successfully. userId: ${user.id}`,
  });
});

export default router;
