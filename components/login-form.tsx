"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("zaenal@polban.ac.id");
  const [password, setPassword] = useState("Zaenal123!");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Sign In</h1>
        <p className="text-sm text-muted-foreground">Polban Facility Care</p>
      </div>

      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
          <CardTitle className="text-lg">Campus Account</CardTitle>
          <CardDescription className="text-xs">
            Use your Polban campus email to sign in
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setError(null);
              startTransition(async () => {
                const response = await fetch("/api/auth/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, password }),
                });

                const payload = await response.json();

                if (!response.ok) {
                  setError(payload.message ?? "Login failed.");
                  return;
                }

                router.push("/dashboard");
                router.refresh();
              });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(event) => setEmail(event.target.value)} 
                placeholder="nama@polban.ac.id"
                className="pl-10 bg-muted/50"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="pl-10 bg-muted/50"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 flex gap-2 items-start">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full gap-2 h-11" disabled={isPending}>
              <LogIn className="h-4 w-4" />
              {isPending ? "Processing..." : "Sign In"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
