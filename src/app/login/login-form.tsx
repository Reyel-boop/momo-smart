"use client";

import Link from "next/link";
import { useActionState, useId, useState } from "react";

import { AlertIcon, ArrowRightIcon, LockIcon } from "~/app/_components/icons";
// Accounts created by `npm run db:seed`, offered as one-tap fill.
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "~/server/demo/accounts";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export function LoginForm({
  showDemoAccounts,
}: {
  /** Only the public demo offers its shared accounts. */
  showDemoAccounts: boolean;
}) {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const emailId = useId();
  const passwordId = useId();

  return (
    <div className="w-full max-w-md">
      <h1 className="text-ink text-3xl font-extrabold tracking-tight">
        Welcome back
      </h1>
      <p className="text-muted mt-2 text-[15px]">
        Sign in with your school account to reach your courses, grading queue
        and assessments.
      </p>

      <form action={formAction} className="mt-8 space-y-4">
        {state.error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
          >
            <AlertIcon className="mt-px size-4 shrink-0" />
            {state.error}
          </p>
        )}

        <div>
          <label
            htmlFor={emailId}
            className="text-ink mb-1.5 block text-sm font-semibold"
          >
            School email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@yourschool.edu.ph"
            className="border-line bg-surface text-ink placeholder:text-muted/70 focus:border-brand focus:ring-brand/12 w-full rounded-xl border px-4 py-3 text-[15px] transition outline-none focus:ring-4"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <label
              htmlFor={passwordId}
              className="text-ink text-sm font-semibold"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="text-brand text-xs font-semibold hover:underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            id={passwordId}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="border-line bg-surface text-ink placeholder:text-muted/70 focus:border-brand focus:ring-brand/12 w-full rounded-xl border px-4 py-3 text-[15px] transition outline-none focus:ring-4"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="group bg-navy hover:bg-navy-deep focus:ring-navy/20 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-[15px] font-semibold text-white transition focus:ring-4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Signing in…" : "Sign in"}
          {!pending && (
            <ArrowRightIcon className="size-4 transition group-hover:translate-x-0.5" />
          )}
        </button>

        <p className="text-muted flex items-center justify-center gap-1.5 text-xs">
          <LockIcon className="size-3.5" />
          Sessions last 12 hours and are signed on the server.
        </p>
      </form>

      <div className="mt-8">
        <div className="flex items-center gap-3">
          <span className="bg-line h-px flex-1" />
          <span className="text-muted text-xs font-semibold tracking-[0.12em] uppercase">
            New to Momo Smart?
          </span>
          <span className="bg-line h-px flex-1" />
        </div>
        <p className="text-ink mt-3 text-center text-sm font-semibold">
          Create an account
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link
            href="/signup?role=teacher"
            className="border-line bg-surface text-ink hover:border-brand hover:bg-brand-soft rounded-xl border px-4 py-3 text-center text-sm font-bold transition"
          >
            I&apos;m a Teacher
          </Link>
          <Link
            href="/signup?role=student"
            className="border-line bg-surface text-ink hover:border-brand hover:bg-brand-soft rounded-xl border px-4 py-3 text-center text-sm font-bold transition"
          >
            I&apos;m a Student
          </Link>
        </div>
      </div>

      {showDemoAccounts && (
        <div className="border-line bg-canvas mt-8 rounded-2xl border p-4">
          <p className="text-muted text-xs font-semibold tracking-[0.12em] uppercase">
            Demo accounts
          </p>
          <p className="text-muted mt-1 text-xs">
            Seeded by <code className="font-semibold">npm run db:seed</code>.
            Password:{" "}
            <code className="text-ink font-semibold">{DEMO_PASSWORD}</code>
          </p>
          <div className="mt-3 grid gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => {
                  setEmail(account.email);
                  setPassword(DEMO_PASSWORD);
                }}
                className="border-line bg-surface hover:border-brand/40 hover:bg-brand-soft flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition"
              >
                <span className="min-w-0">
                  <span className="text-ink block text-sm font-semibold">
                    {account.name}
                  </span>
                  <span className="text-muted block truncate text-xs">
                    {account.email}
                  </span>
                </span>
                <span className="bg-brand-soft text-brand shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold">
                  {account.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
