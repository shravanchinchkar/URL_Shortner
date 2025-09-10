import db from "../db/index";
import express from "express";
import { nanoid } from "nanoid";
import { Request, Response,Router } from "express";
import { urlsTable } from "../models/url.model";
import { shortenURLSchema } from "../validation/user.request.validation";

const router:Router = express.Router();

// Extend the Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace with your user type
    }
  }
}

router.post("/shorten", async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId)
    return res.status(401).json({
      success: false,
      error: "You must be logged in to access this resource",
    });

  const validateInput = await shortenURLSchema.safeParseAsync(req.body);

  if (!validateInput.success) {
    return res.status(400).json({
      success: false,
      errorMessage: "Invalid Input",
      error: validateInput.error.format(),
    });
  }

  const { url, code } = validateInput.data;

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

  return res.status(201).json({ success: true, result });
});

export default router;
