import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from 'bcrypt';
import { UserRole } from "@prisma/client";
import * as z from "zod";

// Define schema for input validation

const userSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
    // confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  // .refine((data) => data.password === data.confirmPassword, {
  //   path: ['confirmPassword'],
  //   message: 'Password do not match',
  // });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = userSchema.parse(body);

    // check if email already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUserByEmail) {
      return NextResponse.json({
        user: null,
        status: 409,
        message: { error: "Email already exists" },
      });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        firstName, 
        lastName,
        password: hashedPassword,
        role: UserRole.CANDIDATE, 
      }
    });

    const { password: newUserPassword, ...rest } = newUser;

    console.log(rest);

    return NextResponse.json({ user: rest, message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred", status: 500 });
  }
}