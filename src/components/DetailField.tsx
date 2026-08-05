import { ChevronDown } from "lucide-react";

const HEADING_LINE = /^[A-Z][A-Za-z0-9À-ÿ ,'’-]{2,70}:$|^(Do not use|Ask a doctor.*|Stop use.*|Keep out of reach.*|If pregnant.*)$/;
const PREVIEW_LENGTH = 64;

/**
 * Splits a paragraph into a short clickable summary + full body. Prefers a
 * real heading (openFDA's own sub-heading text, e.g. "Sore throat warning:")
 * when the cleanup pass found one; otherwise falls back to a truncated
 * preview of the paragraph itself. Every paragraph gets *some* summary/body
 * split, so every accordion row looks and behaves the same way — no mix of
 * "some rows are dropdowns, some aren't" for the reader to puzzle over.
 */
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
  /** Render every paragraph as an individually-expandable row with a short
   *  preview line — keeps long sections (e.g. Warnings) scannable without
   *  dumping all body text on screen, while staying visually consistent
   *  (every row behaves the same way, no mix of plain vs. collapsible text). */
  accordion?: boolean;
}) {
  const paragraphs = value ? value.split(/\n\n+/).filter(Boolean) : [];

  return (
    <section
      id={id}
      className="scroll-mt-28 border-t border-slate-100 py-4 first:border-t-0 first:pt-0 dark:border-slate-800"
    >
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </h2>
      {paragraphs.length > 0 ? (
        accordion ? (
          <div className="mt-1.5 flex flex-col">
            {paragraphs.map((p, i) => {
              const { summary, body } = splitForAccordion(p);
              return (
                <details
                  key={i}
                  className="group border-b border-slate-100 py-2.5 last:border-b-0 dark:border-slate-800"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-2 font-semibold text-slate-900 marker:content-none dark:text-white">
                    <span>{summary}</span>
                    <ChevronDown
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {body}
                  </p>
                </details>
              );
            })}
          </div>
        ) : (
          <div className="mt-1.5 flex flex-col gap-2">
            {paragraphs.map((p, i) => {
              const [firstLine, ...rest] = p.split(/(?<=:)\s/);
              const isHeading = HEADING_LINE.test(firstLine.trim()) && rest.length > 0;
              return (
                <p key={i} className="text-base leading-relaxed text-slate-800 dark:text-slate-200">
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
        <p className="mt-1.5 text-base leading-relaxed text-slate-800 dark:text-slate-200">
          <span className="italic text-slate-400 dark:text-slate-500">{unavailableText}</span>
        </p>
      )}
    </section>
  );
}
