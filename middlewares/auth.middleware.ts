import { Request, Response, NextFunction } from "express";
import { validateUserToken } from "../utils/generateToken";

// Extend the Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace with your user type
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return next();

  if (!authHeader.startsWith("Bearer"))
    return res.status(400).json({
      success: false,
      error: "authorization header must start with bearer",
    });

  const [_, token] = authHeader.split(" ");
  const payload = validateUserToken(token);
  req.user = payload;
  next();
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      error: "You must be logged in to access this resource",
    });
  }
  next();
}
