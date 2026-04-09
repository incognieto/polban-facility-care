"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, UserPlus, AlertCircle, CheckCircle, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.message || "Sign up failed.");
        return;
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    });
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <UserPlus className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-sm text-muted-foreground">Polban Facility Care</p>
      </div>

      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
          <CardTitle className="text-lg">New Account</CardTitle>
          <CardDescription className="text-xs">
            Sign up with your Polban campus email
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="flex gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>Account created! Redirecting to login...</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isPending}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@polban.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">Must be a @polban.ac.id email</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                Role
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-background">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="TESTER">Tester</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isPending}
                  className="pl-10"
                  required
                />
              </div>
              {password && confirmPassword && password === confirmPassword && (
                <p className="text-xs text-green-600">Passwords match ✓</p>
              )}
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-600">Passwords do not match</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Creating account..." : "Sign Up"}
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
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
