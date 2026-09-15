import bcrypt from "bcrypt";
import jwt, {type SignOptions} from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import type { RegisterInput, LoginInput } from "../schemas/auth.schema.js";


export const registerUser = async (data: RegisterInput) => {
    const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

   return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user){
    throw new Error("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(
    data.password, 
    user.password
  );

  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"],
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};