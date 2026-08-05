"use client";

import React, { useState } from "react";
import { Printer, Share2, Check, Copy } from "lucide-react";

interface PrintShareActionsProps {
  brandName: string;
  genericName?: string;
}

export function PrintShareActions({ brandName, genericName }: PrintShareActionsProps) {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const title = `${brandName} - Medicine Information`;
    const text = `FDA Label & Dosage Information for ${brandName}${
      genericName ? ` (${genericName})` : ""
    }`;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // User cancelled share dialog
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex items-center gap-2 print:hidden">
      <button
        onClick={handlePrint}
        type="button"
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-teal-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        title="Print patient dosage information"
      >
        <Printer className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
        <span>Print Guide</span>
      </button>

      <button
        onClick={handleShare}
        type="button"
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-teal-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        title="Share or copy medicine details link"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-emerald-700 dark:text-emerald-300">Link Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <span>Share</span>
          </>
        )}
      </button>
    </div>
  );
}
