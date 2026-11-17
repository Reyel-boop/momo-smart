import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";

/** A profile picture, for signed-in people (the file store is private). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const session = await auth();
  if (!session) return new NextResponse(null, { status: 401 });
  const { userId } = await params;
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { image: true },
  });
  if (!user?.image?.startsWith(`/api/avatar/${userId}?`)) {
    return new NextResponse(null, { status: 404 });
  }
  const blob = await get(`avatars/${userId}.jpg`, { access: "private" });
  if (blob?.statusCode !== 200) return new NextResponse(null, { status: 404 });
  return new NextResponse(blob.stream, {
    headers: {
      "Content-Type": blob.blob.contentType || "image/jpeg",
      "X-Content-Type-Options": "nosniff",
      // The link changes (?v=) whenever the picture does.
      "Cache-Control": "private, max-age=604800, immutable",
    },
  });
}
