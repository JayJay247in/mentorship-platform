// src/controllers/skillsController.ts
import { Request, Response } from 'express';
import handleError from '../utils/errorHandler';
import * as skillService from '../services/skillService';

/**
 * Handles the HTTP request to get all skills.
 */
export const getAllSkills = async (req: Request, res: Response) => {
  try {
    const skills = await skillService.getAllSkills();
    res.json(skills);
  } catch (error) {
    handleError(error, res);
  }
};
