import { prisma } from '../core/db';
import { WorkflowStatus } from '../core/workflow-state';

export class GovernanceRepository {
  async create(data: {
    workflowId: string;
    traceId: string;
    fromState: WorkflowStatus;
    toState: WorkflowStatus;
    actor: string;
    narrative: string;
    payloadSnapshot: object;
  }) {
    return prisma.governanceLog.create({ data });
  }

  async findByWorkflowId(workflowId: string) {
    return prisma.governanceLog.findMany({
      where: { workflowId },
      orderBy: { createdAt: 'asc' }
    });
  }
}