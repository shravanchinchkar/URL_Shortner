import "dotenv/config";
import express, { Router } from "express";
import { createToken } from "../utils/generateToken";
import { hashedPasswordWithSalt } from "../utils/hash";
import { getUserByEmail, createNewUser } from "../services/user.service";
import {
  signupSchema,
  signinSchema,
} from "../validation/user.request.validation";

const router: Router = express.Router();

// following is the signup route
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

  // check whether the email already exists or not
  const existingUser = await getUserByEmail(email);

  if (existingUser)
    return res.status(400).json({
      success: false,
      error: `User with email ${email} already exists!`,
    });

  // Hash the password using buildin node.js module crypto
  const { salt, hashedPassword } = hashedPasswordWithSalt(password);

  // Create new user
  const user = await createNewUser({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    salt,
  });

  return res.status(201).json({
    success: true,
    message: `new user created successfully. userId: ${user.id}`,
  });
});

// following is the signin route
router.post("/signin", async (req, res) => {
  const validateInput = await signinSchema.safeParseAsync(req.body);
  if (!validateInput.success) {
    return res
      .status(400)
      .json({ success: false, error: validateInput.error.format() });
  }

  const { email, password } = validateInput.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return res.status(400).json({
      success: false,
      error: `User with email ${email} does not exists`,
    });
  }

  const { hashedPassword } = hashedPasswordWithSalt(
    password,
    existingUser.salt
  );

  if (existingUser.password !== hashedPassword) {
    return res.status(400).json({ success: false, error: "Invalid Password" });
  }

  // const token = jwt.sign(existingUser.id, process.env.JWT_SECRET!);
  const token = await createToken({ id: existingUser.id });

  return res
    .status(200)
    .json({ success: true, message: "Signin successful!", token: token });
});

export default router;
