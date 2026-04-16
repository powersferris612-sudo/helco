export const WorkflowStatus = {
  INITIATED: 'INITIATED',
  ROUTING: 'ROUTING',
  DECISION_PENDING: 'DECISION_PENDING',
  ACTION_PENDING: 'ACTION_PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
} as const;

export type WorkflowStatus = (typeof WorkflowStatus)[keyof typeof WorkflowStatus];

export type WorkflowContext = Record<string, unknown>;