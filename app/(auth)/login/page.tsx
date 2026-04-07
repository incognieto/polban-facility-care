import { Building2, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="container flex min-h-screen items-center py-6 sm:py-10 px-4 sm:px-6">
      <div className="grid w-full gap-6 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl sm:rounded-[2rem] bg-hero-grid p-6 sm:p-8 shadow-soft">
          <div className="max-w-xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-card/80 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-primary">
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
              Full-stack facility operations hub
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                Polban Facility Care for reporting, triage, and repair monitoring.
              </h1>
              <p className="text-sm sm:text-base text-foreground/70">
                Sign in with your campus email to submit facility issues, manage status updates, and view operational metrics in real-time.
              </p>
            </div>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <div className="rounded-2xl sm:rounded-3xl bg-card/90 p-4 sm:p-5">
                <ShieldCheck className="mb-2 sm:mb-3 h-4 sm:h-5 w-4 sm:w-5 text-primary" />
                <p className="font-semibold text-sm sm:text-base">Secure Access</p>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                  Login restricted to `@polban.ac.id` accounts with `httpOnly` sessions.
                </p>
              </div>
              <div className="rounded-2xl sm:rounded-3xl bg-card/90 p-4 sm:p-5">
                <p className="font-semibold text-sm sm:text-base">Demo Accounts</p>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                  Test accounts available for demonstration purposes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <LoginForm />
      </div>
    </main>
  );
}
