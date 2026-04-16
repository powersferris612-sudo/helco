import { Router } from 'express';
import {
  createWorkflow,
  getWorkflow,
  getWorkflowLogs,
  listWorkflows
} from '../../controllers/workflow.controller';

export const workflowRoutes = Router();

workflowRoutes.post('/workflows', createWorkflow);
workflowRoutes.get('/workflows', listWorkflows);
workflowRoutes.get('/workflows/:id', getWorkflow);
workflowRoutes.get('/workflows/:id/logs', getWorkflowLogs);