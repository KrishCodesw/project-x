// src/app/reset-password/page.tsx
"use client";

import { Suspense, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/actions/reset";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      resetPassword(values, token).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Enter new password
        </CardTitle>
        <CardDescription>
          Your new password must be at least 8 characters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!token && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md dark:bg-red-950/50">
                Missing reset token! Please request a new link.
              </div>
            )}
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md dark:bg-red-950/50">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md dark:bg-green-950/50 dark:text-green-400">
                {success}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || !token || !!success}
            >
              {isPending ? "Updating..." : "Reset password"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        {success && (
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
          >
            Click here to sign in
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

// Wrap in Suspense for Next.js build optimization
export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4">
      <Suspense
        fallback={
          <div className="animate-pulse w-full max-w-md h-[350px] bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
