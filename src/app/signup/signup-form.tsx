"use client";

import Link from "next/link";
import { useActionState, useId, useState } from "react";

import { AlertIcon, ArrowRightIcon } from "~/app/_components/icons";
import { signUp, type SignUpState } from "./actions";

type Role = "TEACHER" | "STUDENT";
const initialState: SignUpState = { error: null };

const input =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-4 focus:ring-brand/12";
const labelClass = "mb-1.5 block text-sm font-semibold text-ink";

export function SignUpForm({
  initialRole,
  initialCode,
}: {
  initialRole: Role;
  initialCode: string;
}) {
  const [role, setRole] = useState<Role>(initialRole);
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();

  const tab = (value: Role, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={role === value}
      onClick={() => setRole(value)}
      className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition ${
        role === value
          ? "bg-navy text-white shadow"
          : "text-muted hover:text-ink"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-md">
      <h1 className="text-ink text-3xl font-extrabold tracking-tight">
        Create an account
      </h1>
      <p className="text-muted mt-2 text-[15px]">
        {role === "TEACHER"
          ? "Teachers can sign in right away. The registrar assigns your classes."
          : "Use your school email. If your teacher gave you a class code, enter it to join the class now."}
      </p>

      <div
        role="tablist"
        aria-label="Account type"
        className="bg-canvas border-line mt-6 flex gap-1 rounded-xl border p-1"
      >
        {tab("TEACHER", "I'm a Teacher")}
        {tab("STUDENT", "I'm a Student")}
      </div>

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="role" value={role} />
        {state.error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
          >
            <AlertIcon className="mt-px size-4 shrink-0" />
            {state.error}
          </p>
        )}

        <div
          className={
            role === "TEACHER" ? "grid grid-cols-[100px_1fr] gap-3" : ""
          }
        >
          {role === "TEACHER" && (
            <div>
              <label htmlFor={`${id}-title`} className={labelClass}>
                Title
              </label>
              <input
                id={`${id}-title`}
                name="title"
                maxLength={20}
                placeholder="Ms."
                className={input}
              />
            </div>
          )}
          <div>
            <label htmlFor={`${id}-name`} className={labelClass}>
              Full name
            </label>
            <input
              id={`${id}-name`}
              name="name"
              required
              maxLength={120}
              autoComplete="name"
              placeholder="Juan Dela Cruz"
              className={input}
            />
          </div>
        </div>

        <div>
          <label htmlFor={`${id}-email`} className={labelClass}>
            School email
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@yourschool.edu.ph"
            className={input}
          />
        </div>

        {role === "STUDENT" ? (
          <>
            <div className="grid grid-cols-[1fr_130px] gap-3">
              <div>
                <label htmlFor={`${id}-lrn`} className={labelClass}>
                  Student number (LRN)
                </label>
                <input
                  id={`${id}-lrn`}
                  name="studentNumber"
                  required
                  maxLength={40}
                  inputMode="numeric"
                  className={input}
                />
              </div>
              <div>
                <label htmlFor={`${id}-grade`} className={labelClass}>
                  Grade
                </label>
                <select
                  id={`${id}-grade`}
                  name="gradeLevel"
                  required
                  defaultValue="10"
                  className={input}
                >
                  {[7, 8, 9, 10, 11, 12].map((g) => (
                    <option key={g} value={g}>
                      Grade {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor={`${id}-code`} className={labelClass}>
                Class code{" "}
                <span className="text-muted font-normal">(optional)</span>
              </label>
              <input
                id={`${id}-code`}
                name="classCode"
                maxLength={20}
                defaultValue={initialCode}
                placeholder="e.g. 7F3A2C"
                autoCapitalize="characters"
                className={`${input} font-mono uppercase placeholder:font-sans placeholder:normal-case`}
              />
            </div>
          </>
        ) : (
          <div>
            <label htmlFor={`${id}-emp`} className={labelClass}>
              Employee number{" "}
              <span className="text-muted font-normal">(optional)</span>
            </label>
            <input
              id={`${id}-emp`}
              name="employeeNumber"
              maxLength={40}
              className={input}
            />
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <label
                htmlFor={`${id}-pw`}
                className="text-ink text-sm font-semibold"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-brand text-xs font-semibold hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id={`${id}-pw`}
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              className={input}
            />
          </div>
          <div>
            <label htmlFor={`${id}-pw2`} className={labelClass}>
              Confirm password
            </label>
            <input
              id={`${id}-pw2`}
              name="confirm"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              className={input}
            />
          </div>
        </div>
        <p className="text-muted text-xs">At least 8 characters.</p>

        <button
          type="submit"
          disabled={pending}
          className="group bg-navy hover:bg-navy-deep focus:ring-navy/20 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-[15px] font-semibold text-white transition focus:ring-4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending
            ? "Creating your account…"
            : role === "TEACHER"
              ? "Create teacher account"
              : "Create student account"}
          {!pending && (
            <ArrowRightIcon className="size-4 transition group-hover:translate-x-0.5" />
          )}
        </button>
      </form>

      <p className="text-muted mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-brand font-semibold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
