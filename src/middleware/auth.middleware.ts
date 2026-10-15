import type {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    userId: number;
    role: "USER" | "ADMIN";
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
 ) => {
   try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" }

        );
        return;
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    req.user = decoded;

    next();
} catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
}
};