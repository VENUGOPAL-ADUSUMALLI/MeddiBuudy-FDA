export function Footer() {
  return (
    <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-500">
      <p>
        Data sourced from the{" "}
        <a
          href="https://open.fda.gov/apis/drug/label/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-slate-600 underline underline-offset-2 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
        >
          U.S. FDA openFDA Drug Label API
        </a>
        . Not medical advice.
      </p>
    </footer>
  );
}
