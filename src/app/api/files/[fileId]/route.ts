import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";

/** Types a browser can safely show; everything else is downloaded. */
const SHOW_INLINE = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

/**
 * Opens a stored file. The store is private, so this is the only way in: the
 * uploader, a teacher of the class it was submitted to, or an admin.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const { fileId } = await params;
  const user = session.user;

  const file = await db.fileObject.findUnique({
    where: { id: fileId },
    select: {
      storageKey: true,
      fileName: true,
      mimeType: true,
      uploadedById: true,
      submissionFiles: {
        select: {
          submission: {
            select: {
              assignment: {
                select: {
                  section: { select: { teacherId: true, schoolId: true } },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!file) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  const sections = file.submissionFiles.map(
    (f) => f.submission.assignment.section,
  );
  const allowed =
    file.uploadedById === user.id ||
    (user.role === "TEACHER" &&
      sections.some((s) => s.teacherId === user.teacherId)) ||
    (user.role === "ADMIN" &&
      sections.some((s) => s.schoolId === user.schoolId));
  if (!allowed) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  const blob = await get(file.storageKey, { access: "private" });
  if (blob?.statusCode !== 200) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  const name = encodeURIComponent(file.fileName);
  const mode = SHOW_INLINE.has(file.mimeType) ? "inline" : "attachment";
  return new NextResponse(blob.stream, {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Disposition": `${mode}; filename*=UTF-8''${name}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
