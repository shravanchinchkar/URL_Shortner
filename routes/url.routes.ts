import express from "express";
import { Request, Response, Router } from "express";
import { shortenURL } from "../services/url.service";
import { ensureAuthenticated } from "../middlewares/auth.middleware";
import { shortenURLSchema } from "../validation/user.request.validation";

const router: Router = express.Router();

// Extend the Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace with your user type
    }
  }
}

router.post(
  "/shorten",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const validateInput = await shortenURLSchema.safeParseAsync(req.body);
    if (!validateInput.success) {
      return res.status(400).json({
        success: false,
        errorMessage: "Invalid Input",
        error: validateInput.error.format(),
      });
    }

    const { url, code } = validateInput.data;

    const result = await shortenURL(url, req.user?.id, code);

    return res.status(201).json({ success: true, result });
  }
);

export default router;
