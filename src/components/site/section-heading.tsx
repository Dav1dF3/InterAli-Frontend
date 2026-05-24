import { Badge } from "@/components/ui/badge";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-5 border-l-2 border-primary/15 pl-5 md:flex-row md:items-end md:justify-between md:pl-6">
      <div className="max-w-2xl space-y-3">
        {eyebrow ? (
          <Badge variant="outline" className="w-fit rounded-full border-primary/15 bg-primary/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-foreground">
            {eyebrow}
          </Badge>
        ) : null}
        <div className="space-y-2">
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base leading-7 text-muted-foreground">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}