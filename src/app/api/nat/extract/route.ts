import { NextResponse } from "next/server";

import { auth } from "~/server/auth";
import {
  extractNatTests,
  NatExtractError,
  type NatSource,
} from "~/server/nat-extract";

// A long reviewer takes Claude a few minutes to read and write out.
export const maxDuration = 300;
export const dynamic = "force-dynamic";

/** Vercel refuses request bodies over 4.5 MB. */
const MAX_BYTES = 4 * 1024 * 1024;

/**
 * Reads uploaded CB-NAT reviewer files (and/or pasted text) into practice
 * tests for the uploader to check before saving. Teachers, admins and the
 * owner only.
 */
export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return NextResponse.json(
      { error: "Please sign in again." },
      { status: 401 },
    );
  }
  if (user.role !== "TEACHER" && user.role !== "ADMIN" && !user.isOwner) {
    return NextResponse.json(
      { error: "Only teachers can add CB-NAT questions." },
      { status: 403 },
    );
  }

  const form = await request.formData();
  const files = form
    .getAll("files")
    .filter((f): f is File => f instanceof File);
  const text = form.get("text");
  const pasted = typeof text === "string" ? text : "";
  const size = files.reduce((sum, f) => sum + f.size, 0);
  if (files.length === 0 && !pasted.trim()) {
    return NextResponse.json(
      { error: "Choose a file or paste the questions." },
      { status: 400 },
    );
  }
  if (size > MAX_BYTES) {
    return NextResponse.json(
      {
        error:
          "The files are too big (over 4 MB). Upload fewer pages at a time, or save the PDF in a smaller size.",
      },
      { status: 413 },
    );
  }

  const sources: NatSource[] = await Promise.all(
    files.map(async (f) => ({
      name: f.name,
      type: f.type,
      data: Buffer.from(await f.arrayBuffer()),
    })),
  );

  try {
    const result = await extractNatTests(sources, pasted);
    if (result.tests.length === 0) {
      return NextResponse.json(
        {
          error:
            "No multiple-choice questions were found in this file." +
            (result.notes ? ` ${result.notes}` : ""),
        },
        { status: 422 },
      );
    }
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof NatExtractError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    console.error("CB-NAT extract failed", error);
    return NextResponse.json(
      { error: "Something went wrong while reading the file. Try again." },
      { status: 500 },
    );
  }
}
