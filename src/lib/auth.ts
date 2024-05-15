import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import LinkedInProvider from "next-auth/providers/linkedin";
import { AuthType, UserRole } from "@prisma/client";

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

        if (!existingUser || existingUser.authType !== AuthType.LOCAL) {
          return null;  // User not found, or does not use local auth (no password to check)
        }

        const passwordMatch = await compare(credentials.password, String(existingUser.password));
        
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
      clientId: String(process.env.LINKEDIN_CLIENT_ID),
      clientSecret: String(process.env.LINKEDIN_CLIENT_SECRET),
      authorization: { 
        params: { 
          scope: 'profile email openid', 
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/linkedin` 
        } 
      },
      issuer: 'https://www.linkedin.com/oauth',
      jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
      token: {
        url: "https://www.linkedin.com/oauth/v2/accessToken",
      },
      userinfo: {
        url: "https://api.linkedin.com/v2/userinfo",
      },
      async profile(profile, accessToken) {
        console.log("PROFILE", profile);
        let user = await prisma.user.findUnique({
          where: { 
            email: profile.email,
            authType: AuthType.LINKEDIN 
          }
        });
    
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.email,
              firstName: profile.given_name,
              lastName: profile.family_name,
              role: UserRole.CANDIDATE, // Assume a default role
              authType: AuthType.LINKEDIN
            }
          });
        }
        let account = await prisma.account.findFirst({
          where: {
            provider: "linkedin",
            providerAccountId: user.id
          }
        });
        if (!account) {
          // Create a new Account if it doesn't exist
          await prisma.account.create({
            data: {
              userId: user.id,
              provider: "linkedin",
              providerType: 'linkedin',
              providerAccountId: user.id,
              accessToken: accessToken.access_token,
              refreshToken: accessToken.refresh_token,
              accessTokenExpires: accessToken.expires_at ? new Date(accessToken.expires_at) : null, // Adjust depending on token response structure
            }
          });
        } else {
          // Update existing Account if it exists
          await prisma.account.update({
            where: {
              id: account.id
            },
            data: {
              accessToken: accessToken.access_token,
              refreshToken: accessToken.refresh_token,
              accessTokenExpires: accessToken.expires_at ? new Date(accessToken.expires_at) : null
            }
          });
        }

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          accessToken: accessToken.access_token
        };
      },
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
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
      if (account && account.accessToken) { // Ensure access token is handled
        token.accessToken = account.accessToken;
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