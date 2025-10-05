import type { Strain, Nutrient } from "@shared/types";
export interface ScheduleNutrient {
  name: string;
  brand: string;
  dosage: string;
}
export interface ScheduleWeek {
  week: number;
  stage: 'Vegetative' | 'Flowering' | 'Flush';
  nutrients: ScheduleNutrient[];
}
export interface GeneratedSchedule {
  weeks: ScheduleWeek[];
  totalWeeks: number;
}
const VEG_WEEKS = 4;
const FLUSH_WEEKS = 1;
export function generateSchedule(
  strain: Strain,
  allNutrients: Nutrient[],
  startDate: Date
): GeneratedSchedule {
  const flowerWeeks = strain.floweringTime;
  const totalWeeks = VEG_WEEKS + flowerWeeks;
  const weeks: ScheduleWeek[] = [];
  // Vegetative Stage
  for (let i = 1; i <= VEG_WEEKS; i++) {
    const vegNutes = allNutrients.filter(n => n.stage === 'veg' || (n.stage === 'supplement' && i <= 2));
    weeks.push({
      week: i,
      stage: 'Vegetative',
      nutrients: vegNutes.map(n => ({ name: n.name, brand: n.brand, dosage: n.dosage })),
    });
  }
  // Flowering Stage
  for (let i = 1; i <= flowerWeeks; i++) {
    const currentWeek = VEG_WEEKS + i;
    // Stop base nutes for the last week (flush)
    if (i > flowerWeeks - FLUSH_WEEKS) {
        weeks.push({
            week: currentWeek,
            stage: 'Flush',
            nutrients: [],
        });
        continue;
    }
    const flowerNutes = allNutrients.filter(n => 
        n.stage === 'flower' || 
        n.stage === 'boost' ||
        (n.stage === 'supplement' && n.name.toLowerCase().includes('cal-mag'))
    );
    weeks.push({
      week: currentWeek,
      stage: 'Flowering',
      nutrients: flowerNutes.map(n => ({ name: n.name, brand: n.brand, dosage: n.dosage })),
    });
  }
  return {
    weeks,
    totalWeeks,
  };
}