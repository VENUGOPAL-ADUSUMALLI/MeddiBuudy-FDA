export interface Medicine {
  slug: string;
  brandName: string;
  genericName?: string;
  activeIngredients?: string;
  purpose?: string;
  warnings?: string;
  dosageAndAdministration?: string;
  manufacturer?: string;
  dosageForm?: string;
  productNdc?: string;
}

export interface MedicineSummary {
  slug: string;
  brandName: string;
  genericName?: string;
  dosageForm?: string;
  purpose?: string;
  productNdc?: string;
}

export type MedicineLookupResult = { kind: "not-found" } | { kind: "found"; medicine: Medicine };
