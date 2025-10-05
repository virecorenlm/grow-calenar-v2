import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { Env } from './core-utils';
import { StrainEntity, NutrientEntity, GrowEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
// Schemas for validation
const growCreateSchema = z.object({
  name: z.string().min(1),
  strainId: z.string().min(1),
  plantCount: z.number().min(1),
  startDate: z.string().datetime(),
});
const logCreateSchema = z.object({
  date: z.string().datetime(),
  ph: z.number().optional(),
  ec: z.number().optional(),
  notes: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
  nutrientsUsed: z.array(z.object({
    nutrientId: z.string().min(1),
    amount: z.number().min(0),
    unit: z.enum(['ml', 'tsp']),
  })).optional(),
});
const strainSchema = z.object({
  name: z.string().min(1),
  breeder: z.string().optional(),
  thc: z.number().optional(),
  cbd: z.number().optional(),
  sativaPercentage: z.number().min(0).max(100).optional(),
  floweringTime: z.number().min(1),
  yield: z.string().optional(),
  height: z.string().optional(),
  nutrientSensitivity: z.enum(['low', 'medium', 'high']),
  growthTips: z.string().optional(),
});
const nutrientSchema = z.object({
    brand: z.string().min(1),
    name: z.string().min(1),
    npk: z.string(),
    stage: z.enum(['veg', 'flower', 'microbes', 'boost', 'rooting', 'supplement']),
    dosage: z.string(),
    applicationFrequency: z.string().optional(),
    mixingInstructions: z.string().optional(),
    warnings: z.string().optional(),
});
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // STRAINS
  app.get('/api/strains', async (c) => {
    await StrainEntity.ensureSeed(c.env);
    const page = await StrainEntity.list(c.env);
    return ok(c, page.items);
  });
  app.post('/api/strains', zValidator('json', strainSchema), async (c) => {
    const strainData = c.req.valid('json');
    const newStrain = { id: crypto.randomUUID(), ...strainData };
    await StrainEntity.create(c.env, newStrain);
    return ok(c, newStrain);
  });
  app.put('/api/strains/:id', zValidator('json', strainSchema), async (c) => {
    const id = c.req.param('id');
    const strainData = c.req.valid('json');
    const strain = new StrainEntity(c.env, id);
    if (!(await strain.exists())) return notFound(c, 'Strain not found');
    const updatedStrain = { ...strainData, id };
    await strain.save(updatedStrain);
    return ok(c, updatedStrain);
  });
  app.delete('/api/strains/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await StrainEntity.delete(c.env, id);
    if (!deleted) return notFound(c, 'Strain not found');
    return ok(c, { id });
  });
  // NUTRIENTS
  app.get('/api/nutrients', async (c) => {
    await NutrientEntity.ensureSeed(c.env);
    const page = await NutrientEntity.list(c.env);
    return ok(c, page.items);
  });
  app.post('/api/nutrients', zValidator('json', nutrientSchema), async (c) => {
    const nutrientData = c.req.valid('json');
    const newNutrient = { id: crypto.randomUUID(), ...nutrientData };
    await NutrientEntity.create(c.env, newNutrient);
    return ok(c, newNutrient);
  });
  app.put('/api/nutrients/:id', zValidator('json', nutrientSchema), async (c) => {
    const id = c.req.param('id');
    const nutrientData = c.req.valid('json');
    const nutrient = new NutrientEntity(c.env, id);
    if (!(await nutrient.exists())) return notFound(c, 'Nutrient not found');
    const updatedNutrient = { ...nutrientData, id };
    await nutrient.save(updatedNutrient);
    return ok(c, updatedNutrient);
  });
  app.delete('/api/nutrients/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await NutrientEntity.delete(c.env, id);
    if (!deleted) return notFound(c, 'Nutrient not found');
    return ok(c, { id });
  });
  // GROWS
  app.get('/api/grows', async (c) => {
    await GrowEntity.ensureSeed(c.env);
    const page = await GrowEntity.list(c.env);
    return ok(c, page.items);
  });
  app.get('/api/grows/:id', async (c) => {
    const id = c.req.param('id');
    const grow = new GrowEntity(c.env, id);
    if (!(await grow.exists())) {
      return notFound(c, 'Grow not found');
    }
    return ok(c, await grow.getState());
  });
  app.post('/api/grows', zValidator('json', growCreateSchema), async (c) => {
    const growData = c.req.valid('json');
    const strain = new StrainEntity(c.env, growData.strainId);
    if (!(await strain.exists())) {
      return bad(c, 'Invalid strain ID');
    }
    const newGrow = {
      id: crypto.randomUUID(),
      userId: 'u1', // Mock user ID for now
      ...growData,
      logs: [],
    };
    await GrowEntity.create(c.env, newGrow);
    return ok(c, newGrow);
  });
  app.post('/api/grows/:id/logs', zValidator('json', logCreateSchema), async (c) => {
    const id = c.req.param('id');
    const logData = c.req.valid('json');
    const growEntity = new GrowEntity(c.env, id);
    if (!(await growEntity.exists())) {
      return notFound(c, 'Grow not found');
    }
    const newLog = {
      id: crypto.randomUUID(),
      ...logData,
      photoUrl: logData.photoUrl || undefined,
      nutrientsUsed: logData.nutrientsUsed || [],
    };
    const updatedGrow = await growEntity.mutate(currentGrow => {
      return {
        ...currentGrow,
        logs: [...currentGrow.logs, newLog],
      };
    });
    return ok(c, updatedGrow);
  });
}