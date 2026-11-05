/** What students may attach to their work, shared by the browser and server. */

export const UPLOAD_MAX_BYTES = 32 * 1024 * 1024;

export const UPLOAD_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "text/plain",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/heic",
];

/** Every upload lives under this folder in the private store. */
export const UPLOAD_PREFIX = "submissions/";

/** A unique store path, keeping the file's name readable and safe. */
export function uploadPath(fileName: string, id: string) {
  const safe = fileName.replace(/[^\w.-]+/g, "_").slice(-100);
  return `${UPLOAD_PREFIX}${id}/${safe}`;
}
