import { ChevronDown } from "lucide-react";

const HEADING_LINE = /^[A-Z][A-Za-z0-9À-ÿ ,'’-]{2,70}:$|^(Do not use|Ask a doctor.*|Stop use.*|Keep out of reach.*|If pregnant.*)$/;
const PREVIEW_LENGTH = 64;

function splitForAccordion(paragraph: string): { summary: string; body: string } {
  const [firstLine, ...rest] = paragraph.split(/(?<=:)\s/);
  if (HEADING_LINE.test(firstLine.trim()) && rest.length > 0) {
    return { summary: firstLine, body: rest.join(" ") };
  }

  if (paragraph.length <= PREVIEW_LENGTH) {
    return { summary: paragraph, body: paragraph };
  }
  const cut = paragraph.lastIndexOf(" ", PREVIEW_LENGTH);
  const preview = paragraph.slice(0, cut > 0 ? cut : PREVIEW_LENGTH);
  return { summary: `${preview}…`, body: paragraph };
}

export function DetailField({
  id,
  label,
  value,
  unavailableText,
  accordion = false,
}: {
  id?: string;
  label: string;
  value?: string;
  unavailableText: string;
  accordion?: boolean;
}) {
  const paragraphs = value ? value.split(/\n\n+/).filter(Boolean) : [];

  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-slate-200/80 pt-6 first:border-t-0 first:pt-0 dark:border-slate-800"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
        {label}
      </h2>

      {paragraphs.length > 0 ? (
        accordion ? (
          <div className="space-y-2">
            {paragraphs.map((p, i) => {
              const { summary, body } = splitForAccordion(p);
              const isLiverOrSevere =
                p.toLowerCase().includes("liver") || p.toLowerCase().includes("allergy");

              return (
                <details
                  key={i}
                  className="group rounded-lg border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-medium text-slate-900 hover:bg-slate-100/70 dark:text-white dark:hover:bg-slate-800/60">
                    <div className="flex items-center gap-2 min-w-0">
                      {isLiverOrSevere && (
                        <span className="inline-flex shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                          Important
                        </span>
                      )}
                      <span className="truncate text-sm font-medium">{summary}</span>
                    </div>
                    <ChevronDown
                      className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <div className="border-t border-slate-200/60 bg-white p-4 text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    {body}
                  </div>
                </details>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {paragraphs.map((p, i) => {
              const [firstLine, ...rest] = p.split(/(?<=:)\s/);
              const isHeading = HEADING_LINE.test(firstLine.trim()) && rest.length > 0;
              return (
                <p key={i} className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                  {isHeading ? (
                    <>
                      <span className="font-semibold text-slate-900 dark:text-white">{firstLine} </span>
                      {rest.join(" ")}
                    </>
                  ) : (
                    p
                  )}
                </p>
              );
            })}
          </div>
        )
      ) : (
        <p className="text-sm text-slate-500 italic dark:text-slate-400">
          {unavailableText}
        </p>
      )}
    </section>
  );
}

