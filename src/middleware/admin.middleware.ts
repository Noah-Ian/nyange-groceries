import type {Response, NextFunction} from "express";
import type { AuthRequest} from "./auth.middleware.js"

export const requireAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  if (req.user.role !== "ADMIN") {
    res.status(403).json({
      message: "Admin access required",
    });
    return;
  }

  next();
};