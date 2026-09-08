"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Mail,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [error, setError] = useState("");

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    // Temporary frontend login
    router.push("/dashboard");
  }

  function handleForgotPassword() {
    alert("Please contact the administrator to reset your password.");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 py-8">
      {/* BACKGROUND TEXTURE */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 20%, rgba(59,130,246,0.06), transparent 28%),
            radial-gradient(circle at 85% 80%, rgba(34,197,94,0.05), transparent 28%),
            linear-gradient(rgba(15,23,42,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "auto, auto, 32px 32px, 32px 32px",
        }}
      />

      {/* LOGIN PANEL */}
      <section className="relative z-10 w-full max-w-[420px] rounded-2xl border border-neutral-200 bg-white px-8 py-8 shadow-sm">
        <form onSubmit={handleLogin}>
          {/* HEADER + LOGO */}
          <div className="mb-7 flex items-start justify-between gap-5">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                Log in
              </h1>

              <p className="mt-2 text-sm text-neutral-500">
                Enter your account details to continue.
              </p>
            </div>

            <img
              src="/icon.png"
              alt="JET Skills Logo"
              className="h-16 w-auto shrink-0 object-contain"
            />
          </div>

          {/* EMAIL */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-neutral-700"
            >
              Email
            </label>

            <div className="relative">
              <Mail
                size={17}
                strokeWidth={1.8}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                placeholder="Enter your email"
                autoComplete="email"
                className="h-11 w-full rounded-lg border border-neutral-300 bg-white pl-10 pr-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-neutral-700"
            >
              Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={17}
                strokeWidth={1.8}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="h-11 w-full rounded-lg border border-neutral-300 bg-white pl-10 pr-11 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.8} />
                ) : (
                  <Eye size={18} strokeWidth={1.8} />
                )}
              </button>
            </div>
          </div>

          {/* STAY LOGGED IN */}
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={stayLoggedIn}
              onChange={(event) => setStayLoggedIn(event.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 accent-blue-600"
            />

            <span className="text-sm text-neutral-600">
              Stay logged in
            </span>
          </label>

          {/* ERROR */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
          >
            <LogIn size={17} strokeWidth={1.8} />
            Log in
          </button>

          {/* FORGOT PASSWORD */}
          <div className="mt-5 text-center">
            <span className="text-sm text-neutral-500">
              Forgot your password?{" "}
            </span>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
            >
              Contact administrator
            </button>
          </div>

        </form>
      </section>
    </main>
  );
}