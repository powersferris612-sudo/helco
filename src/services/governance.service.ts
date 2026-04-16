import { GovernanceRepository } from '../repositories/governance.repository';
import { WorkflowStatus } from '../core/workflow-state';

const repo = new GovernanceRepository();

export async function logTransition(data: {
  workflowId: string;
  traceId: string;
  fromState: WorkflowStatus;
  toState: WorkflowStatus;
  actor: string;
  narrative: string;
  payloadSnapshot: object;
}) {
  return repo.create(data);
}

export async function getLogsWithSummary(workflowId: string) {
  const logs = await repo.findByWorkflowId(workflowId);
  const summary = logs.map((log) => log.narrative).filter(Boolean).join(' → ');
  return { summary, logs };
}