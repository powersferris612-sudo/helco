import { prisma } from '../core/db';
import { Prisma } from '@prisma/client';
import { GovernanceStep, WorkflowStatus } from '../core/workflow-state';

export class GovernanceRepository {
  async create(data: {
    workflowId: string;
    traceId: string;
    step: GovernanceStep;
    fromState: WorkflowStatus;
    toState: WorkflowStatus;
    actor: string;
    title: string;
    narrative: string;
    message: string;
    routingDecision?: Prisma.InputJsonValue;
    decisionMade?: Prisma.InputJsonValue;
    actionTaken?: Prisma.InputJsonValue;
    adherenceResult?: Prisma.InputJsonValue;
    payloadSnapshot: Prisma.InputJsonValue;
  }) {
    return prisma.governanceLog.create({ data });
  }

  async findByWorkflowId(workflowId: string) {
    return prisma.governanceLog.findMany({
      where: { workflowId },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }]
    });
  }
}