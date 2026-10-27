"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Card, Pill } from "~/app/_components/ui";
import { type RouterOutputs, api } from "~/trpc/react";

type School = RouterOutputs["school"]["list"][number];

const field =
  "border-line bg-canvas text-ink placeholder:text-muted focus:border-brand focus:bg-surface focus:ring-brand/10 rounded-lg border px-3 py-2 text-sm transition outline-none focus:ring-4";
const label = "text-ink text-xs font-bold";
const primary =
  "bg-navy hover:bg-navy-deep rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60";
const secondary =
  "border-line bg-surface text-ink hover:bg-canvas rounded-lg border px-3 py-1.5 text-sm font-semibold transition disabled:opacity-60";

/** Add a school, then manage each one: open it, edit it, add its admins. */
export function SchoolsManager({ schools }: { schools: School[] }) {
  return (
    <div className="space-y-6">
      <NewSchool />
      <div className="grid gap-4 lg:grid-cols-2">
        {schools.map((school) => (
          <SchoolCard key={school.id} school={school} />
        ))}
      </div>
    </div>
  );
}

function NewSchool() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [depedId, setDepedId] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const create = api.school.create.useMutation({
    onSuccess: () => {
      setName("");
      setDepedId("");
      setAddress("");
      router.refresh();
    },
    onError: (e) => setError(e.message),
  });

  return (
    <Card className="p-5">
      <p className="text-ink font-extrabold">Add a school</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          create.mutate({ name, depedId, address });
        }}
        className="mt-3 flex flex-wrap items-end gap-3"
      >
        <div className="min-w-[240px] flex-[2]">
          <label htmlFor="school-name" className={label}>
            School name
          </label>
          <input
            id="school-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rizal National High School"
            required
            maxLength={120}
            className={`${field} mt-1 w-full`}
          />
        </div>
        <div className="w-36">
          <label htmlFor="school-deped" className={label}>
            DepEd School ID
          </label>
          <input
            id="school-deped"
            value={depedId}
            onChange={(e) => setDepedId(e.target.value)}
            placeholder="optional"
            maxLength={20}
            className={`${field} mt-1 w-full`}
          />
        </div>
        <div className="min-w-[200px] flex-1">
          <label htmlFor="school-address" className={label}>
            Address
          </label>
          <input
            id="school-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="optional"
            maxLength={200}
            className={`${field} mt-1 w-full`}
          />
        </div>
        <button type="submit" disabled={create.isPending} className={primary}>
          {create.isPending ? "Adding…" : "Add school"}
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-2 text-sm text-rose-600">
          {error}
        </p>
      )}
    </Card>
  );
}

function SchoolCard({ school }: { school: School }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const open = api.school.switchTo.useMutation({
    onSuccess: () => {
      router.push("/admin");
      router.refresh();
    },
    onError: (e) => setError(e.message),
  });

  return (
    <Card
      className={`overflow-hidden ${school.current ? "ring-brand ring-2" : ""}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
        <div className="min-w-0">
          <p className="text-ink text-lg leading-tight font-extrabold">
            {school.name}
          </p>
          <p className="text-muted mt-0.5 text-xs">
            {[school.depedId && `School ID ${school.depedId}`, school.address]
              .filter(Boolean)
              .join(" · ") || "No School ID or address yet"}
          </p>
        </div>
        {school.current ? (
          <Pill tone="blue">Open now</Pill>
        ) : (
          <button
            type="button"
            onClick={() => {
              setError(null);
              open.mutate({ schoolId: school.id });
            }}
            disabled={open.isPending}
            className={primary}
          >
            {open.isPending ? "Opening…" : "Open"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 px-5 py-4 text-center">
        {[
          ["Sections", school.sections],
          ["Classes", school.classes],
          ["Teachers", school.teachers],
          ["Students", school.students],
        ].map(([name, value]) => (
          <div key={name} className="bg-canvas rounded-xl py-2">
            <p className="text-ink text-xl font-extrabold tabular-nums">
              {value}
            </p>
            <p className="text-muted text-[10px] font-bold tracking-wide uppercase">
              {name}
            </p>
          </div>
        ))}
      </div>

      <div className="border-line border-t px-5 py-3 text-sm">
        <p className="text-muted text-xs">
          School code for teacher sign-up:{" "}
          <span className="text-ink font-mono font-bold">
            {school.joinCode}
          </span>
        </p>
        <p className="text-ink mt-2 text-xs font-bold">School admins</p>
        {school.admins.length === 0 ? (
          <p className="text-muted text-xs">None yet.</p>
        ) : (
          <ul className="mt-1 space-y-0.5">
            {school.admins.map((a) => (
              <li key={a.id} className="text-xs">
                <span className="text-ink font-semibold">{a.name}</span>{" "}
                <span className="text-muted">{a.email}</span>
                {a.mustChangePassword && (
                  <span className="ml-1 text-amber-700">
                    (hasn&apos;t signed in yet)
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-line flex flex-wrap gap-2 border-t px-5 py-3">
        <button
          type="button"
          onClick={() => {
            setAdding((v) => !v);
            setEditing(false);
          }}
          className={secondary}
        >
          + Add school admin
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing((v) => !v);
            setAdding(false);
          }}
          className={secondary}
        >
          Edit details
        </button>
      </div>
      {adding && <AddAdmin schoolId={school.id} />}
      {editing && (
        <EditSchool school={school} onDone={() => setEditing(false)} />
      )}
      {error && (
        <p role="alert" className="px-5 pb-3 text-sm text-rose-600">
          {error}
        </p>
      )}
    </Card>
  );
}

function AddAdmin({ schoolId }: { schoolId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const add = api.school.addAdmin.useMutation({
    onSuccess: () => router.refresh(),
    onError: (e) => setError(e.message),
  });

  if (add.data) {
    return (
      <div className="mx-5 mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        <p className="font-bold">Admin account created.</p>
        <p className="mt-1">
          Sign-in: <span className="font-mono">{add.data.email}</span>
          <br />
          Temporary password:{" "}
          <span className="font-mono font-bold">{add.data.password}</span>
        </p>
        <p className="mt-1 text-xs">
          Copy it now — it isn&apos;t shown again. They choose their own
          password at first sign-in.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        add.mutate({ schoolId, name, email });
      }}
      className="flex flex-wrap items-end gap-2 px-5 pb-4"
    >
      <div className="min-w-[160px] flex-1">
        <label htmlFor={`admin-name-${schoolId}`} className={label}>
          Name
        </label>
        <input
          id={`admin-name-${schoolId}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={120}
          className={`${field} mt-1 w-full`}
        />
      </div>
      <div className="min-w-[180px] flex-1">
        <label htmlFor={`admin-email-${schoolId}`} className={label}>
          Email
        </label>
        <input
          id={`admin-email-${schoolId}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`${field} mt-1 w-full`}
        />
      </div>
      <button type="submit" disabled={add.isPending} className={primary}>
        {add.isPending ? "Creating…" : "Create"}
      </button>
      {error && (
        <p role="alert" className="w-full text-sm text-rose-600">
          {error}
        </p>
      )}
    </form>
  );
}

function EditSchool({
  school,
  onDone,
}: {
  school: School;
  onDone: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(school.name);
  const [depedId, setDepedId] = useState(school.depedId ?? "");
  const [address, setAddress] = useState(school.address ?? "");
  const [error, setError] = useState<string | null>(null);
  const update = api.school.update.useMutation({
    onSuccess: () => {
      onDone();
      router.refresh();
    },
    onError: (e) => setError(e.message),
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        update.mutate({ id: school.id, name, depedId, address });
      }}
      className="flex flex-wrap items-end gap-2 px-5 pb-4"
    >
      <div className="min-w-[200px] flex-[2]">
        <label htmlFor={`edit-name-${school.id}`} className={label}>
          School name
        </label>
        <input
          id={`edit-name-${school.id}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={120}
          className={`${field} mt-1 w-full`}
        />
      </div>
      <div className="w-32">
        <label htmlFor={`edit-deped-${school.id}`} className={label}>
          School ID
        </label>
        <input
          id={`edit-deped-${school.id}`}
          value={depedId}
          onChange={(e) => setDepedId(e.target.value)}
          maxLength={20}
          className={`${field} mt-1 w-full`}
        />
      </div>
      <div className="min-w-[160px] flex-1">
        <label htmlFor={`edit-address-${school.id}`} className={label}>
          Address
        </label>
        <input
          id={`edit-address-${school.id}`}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          maxLength={200}
          className={`${field} mt-1 w-full`}
        />
      </div>
      <button type="submit" disabled={update.isPending} className={primary}>
        {update.isPending ? "Saving…" : "Save"}
      </button>
      {error && (
        <p role="alert" className="w-full text-sm text-rose-600">
          {error}
        </p>
      )}
    </form>
  );
}
