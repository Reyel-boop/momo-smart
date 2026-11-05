import {
  handleUploadPresigned,
  type HandleUploadPresignedBody,
} from "@vercel/blob/client";
import { issueSignedToken } from "@vercel/blob";
import { NextResponse } from "next/server";

import { UPLOAD_MAX_BYTES, UPLOAD_PREFIX, UPLOAD_TYPES } from "~/lib/uploads";
import { auth } from "~/server/auth";

/**
 * Gives a signed-in student a short-lived link to upload one file straight
 * from the browser to the private store, past the hosting body-size limit.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (session?.user.role !== "STUDENT") {
    return NextResponse.json(
      { error: "Only students can upload submissions." },
      { status: 403 },
    );
  }

  const body = (await request.json()) as HandleUploadPresignedBody;
  try {
    const result = await handleUploadPresigned({
      body,
      request,
      getSignedToken: async (pathname) => {
        if (!pathname.startsWith(UPLOAD_PREFIX)) {
          throw new Error("That upload location isn't allowed.");
        }
        const token = await issueSignedToken({
          pathname,
          operations: ["put"],
          allowedContentTypes: UPLOAD_TYPES,
          maximumSizeInBytes: UPLOAD_MAX_BYTES,
          validUntil: Date.now() + 10 * 60_000,
        });
        return { token };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 },
    );
  }
}
