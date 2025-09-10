import express from "express";
import { Request, Response, Router } from "express";
import { ensureAuthenticated } from "../middlewares/auth.middleware";
import { shortenURLSchema } from "../validation/user.request.validation";
import {
  shortenURL,
  redirectURL,
  getAllCodes,
  getURLById,
  deleteURL,
  updateShortCode,
} from "../services/url.service";

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

// get all the shortcode for the logged in user only
router.get(
  "/codes",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const result = await getAllCodes(req.user?.id);
    return res.status(200).json({ result });
  }
);

// delete a specific url of logged in user only
router.delete(
  "/:id",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const urlId = req.params.id;
    const userId = req.user?.id;

    const existingURLById = await getURLById(urlId);

    if (!existingURLById) {
      return res.status(400).json({ success: false, error: "Invalid URL Id!" });
    }
    const response = await deleteURL(existingURLById.id, userId);
    if (response.rowCount === 0) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized request!" });
    }
    return res.status(204).json({ deleted: true });
  }
);

router.patch(
  "/:id",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const urlId = req.params.id;
    const userId = req.user?.id;
    const existingURLById = await getURLById(urlId);

    if (!existingURLById) {
      return res.status(400).json({ success: false, error: "Invalid URL Id!" });
    }
    const { shortCode } = req.body;

    const response = await updateShortCode(
      existingURLById.id,
      userId,
      shortCode
    );

    if (!response) {
      return res.status(400).json({ error: "Unauthorized URL id!" });
    }
    
    return res.status(200).json({
      oldData: existingURLById,
      newShortCode: shortCode,
      newData: response,
    });
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
