/**
 * openFDA's raw SPL-derived label text bakes its section/sub-section titles
 * directly into the string, duplicated back-to-back (e.g. "Warnings ​Warnings
 * Acetaminophen liver damage warning Acetaminophen liver damage warning: ...")
 * with no paragraph breaks at all. Rendered as-is it's an unreadable wall of text.
 * This cleans that up: strips the redundant leading section label (we already
 * render our own heading), collapses duplicated sub-heading phrases, and inserts
 * paragraph breaks before each sub-heading so long sections (Warnings especially)
 * read as a list of short points instead of one paragraph.
 */
export function cleanupLabelText(raw: string | undefined, sectionLabel: string): string | undefined {
  if (!raw) return undefined;

  let text = raw.replace(/​/g, " ").replace(/\s+/g, " ").trim();

  // Collapse an immediate duplicate of the same phrase ("Warnings Warnings",
  // "Acetaminophen liver damage warning Acetaminophen liver damage warning:").
  text = text.replace(/\b([A-Z][A-Za-z0-9À-ÿ ,'’-]{2,80}?)\s\1(:?)/g, "$1$2");

  // Strip a leading duplicate of our own section heading (e.g. body starting
  // with "Warnings " when we already render a "Warnings" <h2>).
  const labelPattern = new RegExp(`^${sectionLabel}s?:?\\s+`, "i");
  text = text.replace(labelPattern, "");

  // Insert paragraph breaks before sub-heading-shaped phrases ("Do not use",
  // "Stop use and ask a doctor if", "X warning:", etc.) so long sections read
  // as separate points instead of one run-on paragraph.
  text = text.replace(
    /\s(?=(?:[A-Z][A-Za-z0-9À-ÿ ,'’-]{2,70}:)|(?:Do not use\b)|(?:Ask a doctor\b)|(?:Stop use\b)|(?:Keep out of reach\b)|(?:If pregnant\b)|(?:adults and children\b)|(?:children under\b))/g,
    "\n\n"
  );

  return text.trim() || undefined;
}
