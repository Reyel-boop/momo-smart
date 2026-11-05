"use client";

import { uploadPresigned } from "@vercel/blob/client";
import { useId, useState } from "react";

import { FileIcon } from "~/app/_components/icons";
import { UPLOAD_MAX_BYTES, uploadPath } from "~/lib/uploads";
import {
  attachUploadedFiles,
  registerUpload,
  removeAttachment,
} from "../actions";

/** Mirrors UPLOAD_TYPES in ~/lib/uploads. */
const ACCEPT =
  ".pdf,.docx,.pptx,.xlsx,.csv,.txt,.png,.jpg,.jpeg,.webp,.gif,.heic";
const MAX_FILES = 5;

export type Attachment = {
  id: string;
  fileName: string;
  url: string;
  sizeLabel: string;
};

/**
 * Drag-and-drop upload for a draft. Files go straight to the private store,
 * then get attached to the draft, which re-renders the page with the new list.
 */
export function FileDropzone({
  assignmentId,
  submissionId,
  attachments,
}: {
  assignmentId: string;
  submissionId: string | null;
  attachments: Attachment[];
}) {
  const inputId = useId();
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const upload = async (files: File[]) => {
    if (files.length === 0 || isUploading) return;
    setError(null);
    if (files.length > MAX_FILES) {
      setError(`Upload up to ${MAX_FILES} files at a time.`);
      return;
    }
    const tooBig = files.find((file) => file.size > UPLOAD_MAX_BYTES);
    if (tooBig) {
      setError(`${tooBig.name} is over 32 MB.`);
      return;
    }
    setProgress(0);
    setIsUploading(true);
    try {
      const total = files.reduce((sum, file) => sum + file.size, 0);
      let done = 0;
      const fileIds: string[] = [];
      for (const file of files) {
        const blob = await uploadPresigned(
          uploadPath(file.name, crypto.randomUUID()),
          file,
          {
            access: "private",
            handleUploadUrl: "/api/upload",
            contentType: file.type || undefined,
            onUploadProgress: ({ loaded }) =>
              setProgress(Math.round(((done + loaded) / total) * 100)),
          },
        );
        done += file.size;
        const saved = await registerUpload(blob.pathname, file.name);
        if (!saved.ok) {
          setError(saved.error);
          return;
        }
        fileIds.push(saved.fileId);
      }
      const result = await attachUploadedFiles(assignmentId, fileIds);
      if (!result.ok) setError(result.error);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "The upload failed. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const remove = async (fileId: string) => {
    if (!submissionId) return;
    setRemoving(fileId);
    const result = await removeAttachment(submissionId, fileId);
    setRemoving(null);
    if (!result.ok) setError(result.error);
  };

  return (
    <div>
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void upload([...event.dataTransfer.files]);
        }}
        className={`flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${
          dragging
            ? "border-brand bg-brand-soft/60"
            : "border-line hover:border-brand/50 hover:bg-canvas"
        } ${isUploading ? "pointer-events-none opacity-70" : ""}`}
      >
        <span className="bg-brand-soft text-brand flex size-11 items-center justify-center rounded-full">
          <FileIcon className="size-5" />
        </span>
        <span className="text-ink mt-3 text-sm font-bold">
          {isUploading ? `Uploading… ${progress}%` : "Drag & drop files here"}
        </span>
        {!isUploading && (
          <span className="text-muted mt-0.5 text-xs">
            or{" "}
            <span className="text-brand font-semibold underline">
              browse your computer
            </span>
          </span>
        )}
        <span className="text-muted mt-2 text-[11px]">
          PDF, Word, PowerPoint, Excel, CSV, text or images • up to 32 MB
        </span>
      </label>
      <input
        id={inputId}
        type="file"
        multiple
        accept={ACCEPT}
        disabled={isUploading}
        className="sr-only"
        onChange={(event) => {
          const files = [...(event.target.files ?? [])];
          event.target.value = "";
          void upload(files);
        }}
      />

      {error && (
        <p
          role="alert"
          className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700"
        >
          {error}
        </p>
      )}

      {attachments.length > 0 && (
        <ul className="mt-3 space-y-2">
          {attachments.map((file) => (
            <li
              key={file.id}
              className="border-line flex items-center gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <FileIcon className="text-muted size-4 shrink-0" />
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink min-w-0 flex-1 truncate font-semibold hover:underline"
              >
                {file.fileName}
              </a>
              <span className="text-muted shrink-0">{file.sizeLabel}</span>
              <button
                type="button"
                onClick={() => void remove(file.id)}
                disabled={removing === file.id}
                aria-label={`Remove ${file.fileName}`}
                className="text-muted shrink-0 font-semibold transition hover:text-rose-600 disabled:opacity-60"
              >
                {removing === file.id ? "Removing…" : "Remove"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
