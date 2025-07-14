// src/routes/skills.ts
import { Router } from 'express';
import { getAllSkills } from '../controllers/skillsController';

const router = Router();

// This is a public route, anyone can see the list of available skills.
router.get('/', getAllSkills);

export default router;
