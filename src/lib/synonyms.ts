/**
 * US ↔ Indian Drug Generic & Brand Name Mapping Utility
 * 
 * openFDA is a US-centric database. Indian users frequently search using British/Indian
 * generic terms (e.g. Paracetamol) or popular Indian brand names (e.g. Dolo, Crocin, Meftal).
 * 
 * This module transparently maps Indian pharmaceutical terms to their openFDA US equivalents
 * (e.g. Paracetamol → Acetaminophen) so searches succeed while informing the user.
 */

export interface SynonymMatch {
  searchTerm: string;
  mappedTerm: string;
  isIndianBrandOrGeneric: boolean;
  explanation: string;
}

const DRUG_SYNONYMS: Record<string, { mapped: string; explanation: string }> = {
  // Generic Name equivalences (UK/Indian INN vs US USAN)
  paracetamol: {
    mapped: "Acetaminophen",
    explanation: "Paracetamol is known as Acetaminophen in US FDA drug labels.",
  },
  salbutamol: {
    mapped: "Albuterol",
    explanation: "Salbutamol is known as Albuterol in US FDA drug labels.",
  },
  frusemide: {
    mapped: "Furosemide",
    explanation: "Frusemide is listed as Furosemide in openFDA.",
  },
  glibenclamide: {
    mapped: "Glyburide",
    explanation: "Glibenclamide is listed as Glyburide in US FDA labels.",
  },
  orciprenaline: {
    mapped: "Metaproterenol",
    explanation: "Orciprenaline is listed as Metaproterenol in US FDA labels.",
  },
  thyroxine: {
    mapped: "Levothyroxine",
    explanation: "Thyroxine is listed as Levothyroxine in US FDA records.",
  },

  // Popular Indian Brands -> US Generic / FDA equivalent
  dolo: {
    mapped: "Acetaminophen",
    explanation: "Dolo 650 is a popular Indian brand containing Acetaminophen (Paracetamol).",
  },
  crocin: {
    mapped: "Acetaminophen",
    explanation: "Crocin is a popular Indian brand containing Acetaminophen (Paracetamol).",
  },
  calpol: {
    mapped: "Acetaminophen",
    explanation: "Calpol contains Acetaminophen (Paracetamol).",
  },
  combiflam: {
    mapped: "Ibuprofen",
    explanation: "Combiflam contains Ibuprofen and Acetaminophen.",
  },
  meftal: {
    mapped: "Dicyclomine",
    explanation: "Meftal-Spas contains Dicyclomine and Mefenamic Acid.",
  },
  pantocid: {
    mapped: "Pantoprazole",
    explanation: "Pantocid is an Indian brand for Pantoprazole.",
  },
  gelusil: {
    mapped: "Aluminum hydroxide",
    explanation: "Gelusil is an antacid containing Aluminum Hydroxide and Magnesium Hydroxide.",
  },
  digene: {
    mapped: "Magnesium hydroxide",
    explanation: "Digene is an antacid containing Magnesium Hydroxide and Aluminum Hydroxide.",
  },
  augmentin: {
    mapped: "Amoxicillin and clavulanate",
    explanation: "Augmentin contains Amoxicillin and Clavulanate Potassium.",
  },
  azithral: {
    mapped: "Azithromycin",
    explanation: "Azithral is an Indian brand for Azithromycin.",
  },
};

/**
 * Returns synonym translation info if the user's search query matches a known
 * Indian drug generic or brand name.
 */
export function getDrugSynonym(query: string): SynonymMatch | null {
  if (!query) return null;
  const cleanQuery = query.trim().toLowerCase();

  // Exact or partial match check
  for (const [key, value] of Object.entries(DRUG_SYNONYMS)) {
    if (cleanQuery === key || cleanQuery.startsWith(key)) {
      return {
        searchTerm: query,
        mappedTerm: value.mapped,
        isIndianBrandOrGeneric: true,
        explanation: value.explanation,
      };
    }
  }

  return null;
}
