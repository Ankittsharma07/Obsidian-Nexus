import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { credentialsSchema } from "@/lib/validation";
import { signIn, auth } from "@/lib/auth";
import { SignInForm } from "@/components/auth/sign-in-form";
import type { LoginState } from "@/types/auth";

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  "use server";
  const values = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!values.success) {
    return { error: "Invalid credentials" };
  }

  try {
    await signIn("credentials", {
      email: values.data.email,
      password: values.data.password,
      redirectTo: "/clients"
    });
    redirect("/clients");
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Incorrect email or password" };
    }
    throw error;
  }

  return prevState;
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInForm action={loginAction} />}>
      <SignInContent />
    </Suspense>
  );
}

async function SignInContent() {
  const session = await auth();
  if (session?.user) {
    redirect("/clients");
  }

  return <SignInForm action={loginAction} />;
}
