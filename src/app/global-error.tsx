"use client";

/** Last-resort error page (when even the main layout failed to load). */
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f5f7fb",
          color: "#0f172a",
          textAlign: "center",
          padding: 24,
        }}
      >
        <div>
          <p style={{ fontSize: 48, margin: 0 }}>🐢</p>
          <h1 style={{ fontSize: 24, margin: "16px 0 8px" }}>
            Momo is a little busy
          </h1>
          <p style={{ color: "#64748b", margin: "0 0 20px" }}>
            Please try again in a moment. Your work is safe.
          </p>
          <button
            type="button"
            onClick={() => {
              reset();
              location.reload();
            }}
            style={{
              border: 0,
              borderRadius: 12,
              padding: "12px 28px",
              background: "#0f2557",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
