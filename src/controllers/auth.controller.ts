import {Request, Response} from 'express';  
import {registerUser, loginUser} from '../services/auth.service';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

export const register = async (req: Request, res: Response) => {
    try {
        const data = registerSchema.parse(req.body);

        const user = await registerUser(data);

        res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                message: error.message,
            });

            return;
        }

        res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const data = loginSchema.parse(req.body);

        const result = await loginUser(data);

        res.status(200).json({
            message: "Login successful",
            ...result,
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({
                message: error.message,
            });

            return;
        }

        res.status(500).json({
            message: "Internal server error",
        });
    }

};