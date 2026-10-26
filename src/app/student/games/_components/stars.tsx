/** Three stars, filled up to `count` — a level's result in the games. */
export function Stars({
  count,
  className = "size-4",
}: {
  count: number;
  className?: string;
}) {
  return (
    <span
      className="inline-flex gap-0.5"
      role="img"
      aria-label={`${count} of 3 stars`}
    >
      {[1, 2, 3].map((s) => (
        <svg
          key={s}
          viewBox="0 0 24 24"
          className={`${className} ${count >= s ? "text-amber-400" : "text-slate-200"}`}
          aria-hidden="true"
        >
          <path
            d="m12 3.6 2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.98l-5.25 2.77 1-5.85L3.5 9.75l5.9-.85L12 3.6Z"
            fill="currentColor"
          />
        </svg>
      ))}
    </span>
  );
}
