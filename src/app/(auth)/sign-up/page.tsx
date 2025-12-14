import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { signIn, auth } from "@/lib/auth";
import { SignUpForm } from "@/components/auth/sign-up-form";
import type { LoginState } from "@/types/auth";
import { addMockUser, getMockUsers } from "@/lib/mock-data";

export type SignupState = LoginState & { success?: string };

export async function signUpAction(prevState: SignupState, formData: FormData): Promise<SignupState> {
  "use server";
  const values = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!values.success) {
    return { error: "Please provide valid name, email, and password (min 6 chars)." };
  }

  const passwordHash = await bcrypt.hash(values.data.password, 10);

  if (!process.env.DATABASE_URL) {
    const exists = getMockUsers().some((user) => user.email === values.data.email);
    if (exists) {
      return { error: "User already exists. Please sign in instead." };
    }
    addMockUser({
      id: `mock-${Date.now()}`,
      name: values.data.name,
      email: values.data.email,
      role: "ANALYST",
      passwordHash
    });
    await signIn("credentials", {
      email: values.data.email,
      password: values.data.password,
      redirectTo: "/clients"
    });
    redirect("/clients");
  }

  const exists = await prisma.user.findUnique({ where: { email: values.data.email } });
  if (exists) {
    return { error: "User already exists. Please sign in instead." };
  }

  await prisma.user.create({
    data: {
      name: values.data.name,
      email: values.data.email,
      passwordHash,
      role: "ANALYST"
    }
  });

  await signIn("credentials", {
    email: values.data.email,
    password: values.data.password,
    redirectTo: "/clients"
  });
  redirect("/clients");
}

export default async function SignUpPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/clients");
  }

  return <SignUpForm action={signUpAction} />;
}
