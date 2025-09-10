import express from "express";
import { Request, Response, Router } from "express";
import { shortenURL, redirectURL } from "../services/url.service";
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

// create a shorten URL
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

// To avoid conflicts all the dynamic routes must be at the end

// here shortcode is known as path parameter
router.get("/:shortCode", async (req: Request, res: Response) => {
  const code = req.params.shortCode;

  const result = await redirectURL(code);
  if (!result) {
    return res.status(404).json({ success: false, error: "Invalid URL" });
  }

  return res.redirect(result.targetURL);
});

export default router;
