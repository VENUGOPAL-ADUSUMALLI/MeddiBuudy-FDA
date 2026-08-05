export function Disclaimer() {
  return (
    <div
      role="note"
      aria-label="Medical disclaimer"
      className="rounded-r-lg border-l-4 border-amber-500 bg-amber-50 py-3 pl-4 pr-4 dark:bg-amber-950/20"
    >
      <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-300">
        <span className="font-semibold">Not medical advice.</span> This information is sourced from the
        FDA drug label and is provided for reference only. Always consult a doctor or pharmacist before
        taking any medicine.
      </p>
    </div>
  );
}
