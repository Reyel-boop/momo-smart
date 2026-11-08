import { SectionPicker, type PickerSection } from "./section-picker";

/** Consistent title block across the student and teacher sub-pages. */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-ink text-3xl font-extrabold tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted mt-2 max-w-2xl text-sm">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {action}
        </div>
      )}
    </div>
  );
}

/** Dropdown used to switch the page between the teacher's sections. */
export function SectionTabs(props: {
  sections: PickerSection[];
  activeId: string | null;
  basePath: string;
  allLabel?: string;
}) {
  return <SectionPicker {...props} />;
}
