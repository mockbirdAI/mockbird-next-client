import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import LinkedInProvider from "next-auth/providers/linkedin";
import { UserRole } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john@mail.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existingUser = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!existingUser) {
          return null;
        }

        const passwordMatch = await compare(credentials.password, existingUser.password);
        
        if (!passwordMatch) {
          return null;
        }

        return {
          id: `${existingUser.id}`,
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          role: existingUser.role
        }
      }
    }),
    LinkedInProvider({
      id: "linkedin",
      name: 'linkedin',
      clientId: String(process.env.LINKEDIN_CLIENT_ID),
      clientSecret: String(process.env.LINKEDIN_CLIENT_SECRET),
      issuer: "https://www.linkedin.com",
      authorization: {
        params: {
          scope: "openid profile email",
          // redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/linkedin`
          redirect_uri: `http://localhost:3000/api/auth/callback/linkedin`
        }
      },
      wellKnown: "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      profile: async (profile, tokens) => ({
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        firstName: profile.firstName, // Add the required property
        lastName: profile.lastName, // Add the required property
        role: UserRole.CANDIDATE // Add the required property
      }),
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          email: user.email,
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id,
          email: token.email,
          firstName: token.firstName,
          lastName: token.lastName,
          role: token.role
        }
      }
    },
  }
}