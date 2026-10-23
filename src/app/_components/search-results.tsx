import Link from "next/link";

import { SearchIcon } from "~/app/_components/icons";
import { PageHeader } from "~/app/_components/page-header";
import { Card, CardHeader, EmptyState } from "~/app/_components/ui";

export type SearchGroup = {
  title: string;
  items: Array<{ id: string; title: string; detail?: string; href: string }>;
};

/** Case-insensitive match of every word of the query. */
export function matches(
  query: string,
  ...fields: Array<string | null | undefined>
) {
  const haystack = fields.filter(Boolean).join(" ").toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

/** Search page shell: the query box and grouped results. */
export function SearchResults({
  action,
  query,
  groups,
  placeholder,
}: {
  action: string;
  query: string;
  groups: SearchGroup[];
  placeholder: string;
}) {
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <PageHeader
        title="Search"
        subtitle={
          query
            ? `${total} result${total === 1 ? "" : "s"} for “${query}”.`
            : "Type what you're looking for."
        }
      />
      <form action={action} role="search" className="relative">
        <label htmlFor="search-page-q" className="sr-only">
          Search
        </label>
        <SearchIcon className="text-muted absolute top-1/2 left-4 size-5 -translate-y-1/2" />
        <input
          id="search-page-q"
          type="search"
          name="q"
          defaultValue={query}
          autoFocus
          placeholder={placeholder}
          className="border-line bg-surface text-ink placeholder:text-muted focus:border-brand focus:ring-brand/10 w-full rounded-2xl border py-3.5 pr-4 pl-12 text-base transition outline-none focus:ring-4"
        />
      </form>

      {query && total === 0 && (
        <Card>
          <EmptyState>
            Nothing matched. Try fewer or different words.
          </EmptyState>
        </Card>
      )}

      {groups
        .filter((group) => group.items.length > 0)
        .map((group) => (
          <Card key={group.title}>
            <CardHeader
              icon={<SearchIcon className="size-[18px]" />}
              title={group.title}
              subtitle={`${group.items.length} match${group.items.length === 1 ? "" : "es"}`}
            />
            <ul className="divide-line divide-y">
              {group.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="hover:bg-canvas block px-5 py-3 transition"
                  >
                    <span className="text-ink block text-sm font-semibold">
                      {item.title}
                    </span>
                    {item.detail && (
                      <span className="text-muted block text-xs">
                        {item.detail}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ))}
    </div>
  );
}
