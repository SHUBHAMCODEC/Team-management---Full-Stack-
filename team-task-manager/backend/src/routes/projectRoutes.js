import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/auth.js';
import taskRouter from './taskRoutes.js';

const router = express.Router();

// Re-route into other resource routers
router.use('/:projectId/tasks', taskRouter);

router
  .route('/')
  .get(protect, getProjects)
  .post(protect, authorize('ADMIN'), createProject);

router
  .route('/:id')
  .get(protect, getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

export default router;
