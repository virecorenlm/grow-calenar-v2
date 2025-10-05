import { IndexedEntity } from "./core-utils";
import type { Strain, Nutrient, Grow } from "@shared/types";
import { MOCK_STRAINS, MOCK_NUTRIENTS, MOCK_GROWS } from "@shared/mock-data";
export class StrainEntity extends IndexedEntity<Strain> {
  static readonly entityName = "strain";
  static readonly indexName = "strains";
  static readonly initialState: Strain = { 
    id: "", 
    name: "", 
    floweringTime: 8, 
    nutrientSensitivity: 'medium' 
  };
  static seedData = MOCK_STRAINS;
}
export class NutrientEntity extends IndexedEntity<Nutrient> {
  static readonly entityName = "nutrient";
  static readonly indexName = "nutrients";
  static readonly initialState: Nutrient = { 
    id: "", 
    brand: "", 
    name: "", 
    npk: "", 
    stage: 'supplement', 
    dosage: "" 
  };
  static seedData = MOCK_NUTRIENTS;
}
export class GrowEntity extends IndexedEntity<Grow> {
  static readonly entityName = "grow";
  static readonly indexName = "grows";
  static readonly initialState: Grow = {
    id: "",
    name: "",
    userId: "",
    strainId: "",
    startDate: new Date().toISOString(),
    plantCount: 1,
    logs: [],
  };
  static seedData = MOCK_GROWS;
}