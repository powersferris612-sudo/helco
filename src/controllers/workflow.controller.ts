import { Request, Response } from 'express';
import { z } from 'zod';
import * as workflowService from '../services/workflow.service';
import * as governanceService from '../services/governance.service';

const createSchema = z.object({
  idempotencyKey: z.string().min(1),
  payload: z.object({
    symptom: z.string(),
    pain_level: z.number().min(0).max(10),
    duration: z.string(),
    red_flags: z.boolean(),
    age: z.number().positive(),
    patient_id: z.string(),
    failed_pt_history: z.boolean().optional()
  })
});

function normalizeContextDataOrder(contextData: unknown) {
  if (!contextData || typeof contextData !== 'object') {
    return contextData;
  }

  const data = contextData as Record<string, unknown>;
  const { input, routingDecision, decision, action, ...rest } = data;
  return {
    input,
    routingDecision,
    decision,
    action,
    ...rest
  };
}

function normalizeWorkflowResponse<T extends { contextData?: unknown }>(workflow: T) {
  return {
    ...workflow,
    contextData: normalizeContextDataOrder(workflow.contextData)
  };
}

function normalizeWorkflowLogsResponse<T extends { summary: string; logs: Array<Record<string, unknown>> }>(
  result: T
) {
  return {
    ...result,
    logs: result.logs.map((log) => ({
      ...log,
      payloadSnapshot: normalizeContextDataOrder(log.payloadSnapshot)
    }))
  };
}

export async function createWorkflow(req: Request, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const workflow = await workflowService.startWorkflow(parsed.data);
  return res.status(202).json({ workflow_id: workflow.id, status: workflow.status });
}

export async function getWorkflow(req: Request, res: Response) {
  const workflow = await workflowService.getWorkflowById(String(req.params.id));
  if (!workflow) return res.status(404).json({ error: 'not found' });
  return res.json(normalizeWorkflowResponse(workflow));
}

export async function getWorkflowLogs(req: Request, res: Response) {
  const result = await governanceService.getLogsWithSummary(String(req.params.id));
  return res.json(normalizeWorkflowLogsResponse(result));
}

export async function listWorkflows(req: Request, res: Response) {
  const { status = 'COMPLETED', limit = '20', offset = '0' } = req.query;
  const workflows = await workflowService.listWorkflows(
    String(status),
    Number.parseInt(String(limit), 10),
    Number.parseInt(String(offset), 10)
  );
  return res.json(workflows.map((workflow) => normalizeWorkflowResponse(workflow)));
}