"use server";

import db from "@/lib/db";
import { compare, hash } from "@/utils/scrypt";

export const registerUser = async (
  username: string,
  email: string,
  password: string,
) => {
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  if (existingUser) {
    return {
      status: 400,
      message: "User already exists",
    };
  }
  const hashedPassword = await hash(password);
  const user = await db.user.create({
    data: {
      username,
      email,
      // password: hashedPassword,
    },
    select: {
      username: true,
      email: true,
    },
  });
  if (!user) {
    return {
      status: 500,
      message: "An unexpected error occurred",
    };
  }
  return {
    status: 200,
    message: "User created successfully",
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      username: true,
      email: true,
      // password: true,
    },
  });
  if (!user) {
    return {
      status: 401,
      message: "Invalid credentials",
    };
  }
  return {
    status: 200,
    message: "User logged in successfully",
  };
};
