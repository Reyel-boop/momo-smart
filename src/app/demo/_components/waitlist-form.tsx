"use client";

import Link from "next/link";
import { useActionState, useId, useState } from "react";

import { AlertIcon, ArrowRightIcon, CheckIcon } from "~/app/_components/icons";
import { ASKREYEL_SIGN_IN } from "~/lib/askreyel";
import { joinWaitlist } from "../actions";
import { WAITLIST_ROLES, type WaitlistState } from "../waitlist";

const initialState: WaitlistState = { status: "idle", message: null };

const INPUT =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-4 focus:ring-brand/12";
const LABEL = "mb-1.5 block text-sm font-semibold text-ink";

/**
 * Early-access request. Fields are controlled so a validation error does not
 * wipe what the visitor typed (React resets uncontrolled forms after actions).
 */
export function WaitlistForm({ source = "demo" }: { source?: string }) {
  const [state, formAction, pending] = useActionState(
    joinWaitlist,
    initialState,
  );
  const [values, setValues] = useState({
    email: "",
    name: "",
    school: "",
    role: "",
    message: "",
  });
  const id = useId();

  const bind = (name: keyof typeof values) => ({
    id: `${id}-${name}`,
    name,
    value: values[name],
    onChange: (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => setValues((current) => ({ ...current, [name]: event.target.value })),
  });

  if (state.status === "success") {
    return (
      <div className="border-line bg-surface shadow-card rounded-3xl border p-8 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <CheckIcon className="size-6" />
        </span>
        <h3 className="text-ink mt-4 text-xl font-extrabold">
          Request received
        </h3>
        <p className="text-muted mt-2 text-[15px]">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="border-line bg-surface shadow-card relative space-y-4 rounded-3xl border p-6 sm:p-8"
    >
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
        >
          <AlertIcon className="mt-px size-4 shrink-0" />
          {state.message}
        </p>
      )}

      <div className={values.role === "Student" ? "hidden" : undefined}>
        <label htmlFor={`${id}-email`} className={LABEL}>
          Work email
        </label>
        <input
          {...bind("email")}
          type="email"
          autoComplete="email"
          required
          placeholder="you@yourschool.edu"
          className={INPUT}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className={values.role === "Student" ? "hidden" : undefined}>
          <label htmlFor={`${id}-name`} className={LABEL}>
            Name <span className="text-muted font-normal">(optional)</span>
          </label>
          <input
            {...bind("name")}
            autoComplete="name"
            placeholder="Jordan Lee"
            className={INPUT}
          />
        </div>
        <div>
          <label htmlFor={`${id}-role`} className={LABEL}>
            Your role
          </label>
          <select {...bind("role")} required className={INPUT}>
            <option value="" disabled>
              Choose one
            </option>
            {/* Students don't request access: they create their account */}
            <option value="Student">Student</option>
            {WAITLIST_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {values.role === "Student" ? (
        <div className="space-y-3 rounded-2xl bg-amber-50 p-5 text-center">
          <p className="text-ink text-[15px] font-bold">
            Students don&apos;t need to request access. 🎒
          </p>
          <p className="text-muted text-sm">
            Create your student account now. Your teacher gives you the class
            code.
          </p>
          <Link
            href="/signup?role=student"
            className="bg-navy hover:bg-navy-deep flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-[15px] font-semibold text-white transition"
          >
            Create my student account
            <ArrowRightIcon className="size-4" />
          </Link>
          <a
            href={ASKREYEL_SIGN_IN}
            target="_top"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0e8c8f] px-4 py-3 text-[15px] font-bold text-white transition hover:brightness-110"
          >
            I have an AskReyel account
          </a>
        </div>
      ) : (
        <>
          <div>
            <label htmlFor={`${id}-school`} className={LABEL}>
              School or district
            </label>
            <input
              {...bind("school")}
              autoComplete="organization"
              required
              placeholder="Oakridge High School"
              className={INPUT}
            />
          </div>

          <div>
            <label htmlFor={`${id}-message`} className={LABEL}>
              Anything we should know?{" "}
              <span className="text-muted font-normal">(optional)</span>
            </label>
            <textarea
              {...bind("message")}
              rows={3}
              placeholder="Number of sections, when your next term starts, the tools you use today…"
              className={`${INPUT} resize-y`}
            />
          </div>

          <input type="hidden" name="source" value={source} />
          {/* Honeypot — hidden from people and assistive tech, filled by bots. */}
          <div
            aria-hidden="true"
            className="absolute -left-[9999px] size-px overflow-hidden"
          >
            <label>
              Website
              <input
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="group bg-navy hover:bg-navy-deep focus:ring-navy/20 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-[15px] font-semibold text-white transition focus:ring-4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? "Sending…" : "Request early access"}
            {!pending && (
              <ArrowRightIcon className="size-4 transition group-hover:translate-x-0.5" />
            )}
          </button>
          <p className="text-muted text-center text-xs">
            We only use your email to follow up about Momo Smart.
          </p>
        </>
      )}
    </form>
  );
}
