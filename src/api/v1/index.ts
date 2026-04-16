import { Router } from 'express';
import { workflowRoutes } from './workflowRoutes';

export const v1Router = Router();

v1Router.use('/', workflowRoutes);