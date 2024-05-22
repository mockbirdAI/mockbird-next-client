import prisma from "@/lib/prisma";
import bcrypt from 'bcrypt';
import { NextResponse } from "next/server";

export async function POST(request: any) {
  const { token, newPassword } = await request.json();

  const passwordResetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!passwordResetToken || passwordResetToken.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired token' });
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: passwordResetToken.userId },
    data: { password: hashedNewPassword },
  });

  await prisma.passwordResetToken.delete({ where: { id: passwordResetToken.id } });

  return NextResponse.json({ message: 'Password reset successfully' });
}
