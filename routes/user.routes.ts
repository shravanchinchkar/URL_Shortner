import express, { Router } from "express";
import { hashedPasswordWithSalt } from "../utils/hash";
import { signupSchema } from "../validation/request.validation";
import { getUserByEmail, createNewUser } from "../services/user.service";

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

export default router;
