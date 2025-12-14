import NextAuth from "next-auth";
import type { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { credentialsSchema } from "./validation";
import { getMockUsers } from "./mock-data";

export const {
  handlers: { GET: authGetHandler, POST: authPostHandler },
  auth,
  signIn,
  signOut
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret",
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in"
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        if (!process.env.DATABASE_URL) {
          const mock = getMockUsers().find((user) => user.email === parsed.data.email);
          if (mock) {
            const match = await bcrypt.compare(parsed.data.password, mock.passwordHash);
            if (!match) return null;
            const typedMockUser: User = {
              id: mock.id,
              email: mock.email,
              name: mock.name,
              role: mock.role
            };
            return typedMockUser;
          }
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
        if (!user || !user.passwordHash) return null;
        const match = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!match) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && "role" in user) {
        token.role = (user as User).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    }
  }
});
