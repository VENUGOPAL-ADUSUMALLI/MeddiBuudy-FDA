export function Disclaimer() {
  return (
    <div
      role="note"
      aria-label="Medical disclaimer"
      className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
    >
      <p>
        <span className="font-semibold text-slate-900 dark:text-white">Medical Disclaimer:</span> This directory displays official drug label information sourced from openFDA for informational and educational reference only. It is not medical advice. Always consult a qualified healthcare professional or physician regarding prescriptions, dosages, or medical conditions.
      </p>
    </div>
  );
}

