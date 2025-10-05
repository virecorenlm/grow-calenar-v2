export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  email: string;
  name?: string;
}
export interface Grow {
  id: string;
  name: string;
  userId: string;
  strainId: string;
  startDate: string; // ISO 8601 date string
  plantCount: number;
  environmentNotes?: string;
  logs: Log[];
}
export interface Strain {
  id: string;
  name: string;
  breeder?: string;
  thc?: number;
  cbd?: number;
  sativaPercentage?: number; // e.g., 80 for 80% Sativa
  floweringTime: number; // in weeks
  yield?: string; // e.g., "450-550 g/m²"
  height?: string; // e.g., "80-120 cm"
  nutrientSensitivity: 'low' | 'medium' | 'high';
  growthTips?: string;
}
export interface Nutrient {
  id: string;
  brand: string;
  name: string;
  npk: string; // e.g., "6-4-4"
  stage: 'veg' | 'flower' | 'microbes' | 'boost' | 'rooting' | 'supplement';
  dosage: string; // e.g., "5-10ml/gal"
  applicationFrequency?: string;
  mixingInstructions?: string;
  warnings?: string;
}
export interface Log {
  id: string;
  date: string; // ISO 8601 date string
  ph?: number;
  ec?: number;
  notes?: string;
  photoUrl?: string;
  nutrientsUsed: {
    nutrientId: string;
    amount: number; // in ml or tsp
    unit: 'ml' | 'tsp';
  }[];
}