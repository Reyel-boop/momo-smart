"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="bg-navy hover:bg-navy-deep inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
    >
      🖨️ Print
    </button>
  );
}
