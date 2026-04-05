import { Request, Response } from 'express';
import { loadDeals } from '../data/loader';
import { runSimulation } from '../services/simulation.service';
import { SimulationInput } from '../models/deal';

export const simulateController = async (req: Request, res: Response) => {
  try {
    const deals = await loadDeals();
    const input: SimulationInput = req.body;

    // Sanitize numeric inputs while preserving filters
    const sanitizedInput: SimulationInput = {
      ...input,
      conversionDelta: parseFloat(input.conversionDelta as any) || 0,
      dealSizeDelta: parseFloat(input.dealSizeDelta as any) || 0,
      salesCycleDelta: parseFloat(input.salesCycleDelta as any) || 0,
      month: input.month !== undefined ? parseInt(input.month as any) : undefined
    };

    const result = runSimulation(deals, sanitizedInput);

    res.json(result);
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
