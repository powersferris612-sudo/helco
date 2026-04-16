import { workflowQueue } from '../core/queue';
import { WorkflowStatus, WorkflowContext } from '../core/workflow-state';
import { WorkflowRepository } from '../repositories/workflow.repository';
import { logTransition } from '../services/governance.service';

const repo = new WorkflowRepository();

export async function decisionWorker(workflowId: string) {
  const workflow = await repo.findById(workflowId);
  if (!workflow) throw new Error(`Workflow ${workflowId} not found`);

  const context = workflow.contextData as Record<string, unknown>;
  const input = (context.input as {
    pain_level?: number;
    red_flags?: boolean;
    symptom?: string;
  } | undefined) ?? {};
  const routingDecision = context.routingDecision as { route?: string } | undefined;

  const plan = decidePlan({
    route: routingDecision?.route ?? 'GENERAL',
    painLevel: Number(input.pain_level ?? 0),
    redFlags: Boolean(input.red_flags)
  });

  const updatedContext: WorkflowContext = {
    ...context,
    decision: plan
  };

  await repo.updateStatus(workflowId, WorkflowStatus.ACTION_PENDING, updatedContext);

  await logTransition({
    workflowId,
    traceId: workflow.traceId,
    fromState: WorkflowStatus.DECISION_PENDING,
    toState: WorkflowStatus.ACTION_PENDING,
    actor: 'decision-worker',
    narrative: `${plan.plan} selected`,
    payloadSnapshot: updatedContext
  });

  await workflowQueue.add('process-workflow', { workflowId, step: 'action' });
}

function decidePlan(input: { route: string; painLevel: number; redFlags: boolean }) {
  if (input.route === 'MSK') {
    if (input.redFlags || input.painLevel >= 6) {
      return {
        plan: 'IMAGING_FIRST',
        expectedCare: 'Imaging referral created'
      };
    }

    return {
      plan: 'PT_FIRST',
      expectedCare: 'PT referral created'
    };
  }

  return {
    plan: 'GENERAL_REVIEW',
    expectedCare: 'General referral created'
  };
}