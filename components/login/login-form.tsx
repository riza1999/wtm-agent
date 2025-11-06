"use client";

import { loginAction } from "@/app/login/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { signIn } from "next-auth/react";

const loginSchema = z.object({
  username: z.string().min(1, "Please enter a valid username"),
  password: z.string().min(1, "Password is required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

type LoginFormProps = React.ComponentProps<"div"> & {
  callbackUrl?: string;
};

export function LoginForm({
  className,
  callbackUrl,
  ...props
}: LoginFormProps) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const safeCallbackUrl = React.useMemo(() => {
    if (!callbackUrl) return null;
    const trimmed = callbackUrl.trim();

    if (!trimmed.startsWith("/")) return null;
    if (trimmed.startsWith("//")) return null;

    return trimmed;
  }, [callbackUrl]);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  function onSubmit(input: LoginSchema) {
    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          redirect: false,
          username: input.username,
          password: input.password,
          callbackUrl: safeCallbackUrl ?? undefined,
        });

        if (result?.error) {
          const message =
            result.error === "CredentialsSignin"
              ? "Invalid username or password"
              : result.error;
          toast.error(message || "Login failed. Please try again.");
          return;
        }

        if (result?.ok) {
          toast.success("Login successful");
          router.push(safeCallbackUrl ?? "/home");
        } else {
          toast.error("Login failed. Please try again.");
        }
      } catch (err) {
        console.error("Login error:", err);
        toast.error("An error occurred. Please try again.");
      }
    });
  }

  // function onSubmit(input: LoginSchema) {
  //   startTransition(async () => {
  //     try {
  //       // const formData = new FormData();
  //       // formData.append("email", input.username);
  //       // formData.append("password", input.password);

  //       const result = await loginAction(input);

  //       if (result.success) {
  //         toast.success(result.message || "Login successful");
  //         router.push("/home");
  //       } else {
  //         toast.error(result.message || "Login failed. Please try again.");
  //       }
  //     } catch (err) {
  //       console.error("Login error:", err);
  //       toast.error("An error occurred. Please try again.");
  //     }
  //   });
  // }

  return (
    <div className={cn("w-full max-w-md space-y-8", className)} {...props}>
      <div className="text-center">
        <Image
          src="/hb_logo.png"
          alt="THE HOTEL BOX Logo"
          width={144}
          height={144}
          className="mx-auto h-36 w-auto"
        />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              className="mt-1 bg-gray-200 text-black"
              placeholder="Enter your username"
              {...form.register("username")}
              disabled={isPending}
            />
            {form.formState.errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          <div>
            <PasswordInput
              id="password"
              label="Password"
              className="mt-1 bg-gray-200 text-black"
              placeholder="Enter your password"
              {...form.register("password")}
              disabled={isPending}
              error={form.formState.errors.password?.message}
            />
            <a
              href="#"
              className="text-muted-foreground mt-2 block text-right text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Logging in..." : "Login"}
          </Button>

          <Link
            href="/register"
            className="text-muted-foreground block text-center text-sm underline-offset-4 hover:underline"
          >
            Create New Account
          </Link>
        </div>
      </form>
    </div>
  );
}
