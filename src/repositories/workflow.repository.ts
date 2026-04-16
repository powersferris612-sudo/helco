import { prisma } from '../core/db';
import { WorkflowStatus, WorkflowContext } from '../core/workflow-state';

export class WorkflowRepository {
  async findById(id: string) {
    return prisma.workflowRecord.findUnique({ where: { id } });
  }

  async findByIdempotencyKey(key: string) {
    return prisma.workflowRecord.findUnique({ where: { idempotencyKey: key } });
  }

  async create(data: {
    idempotencyKey: string;
    traceId: string;
    status: WorkflowStatus;
    contextData: WorkflowContext;
  }) {
    return prisma.workflowRecord.create({ data });
  }

  async updateStatus(id: string, status: WorkflowStatus, contextData: WorkflowContext) {
    return prisma.workflowRecord.update({
      where: { id },
      data: { status, contextData, updatedAt: new Date() }
    });
  }

  async markCompleted(
    id: string,
    actualCare: string,
    isAdhered: boolean,
    contextData: WorkflowContext
  ) {
    return prisma.workflowRecord.update({
      where: { id },
      data: {
        status: WorkflowStatus.COMPLETED,
        actualCare,
        isAdhered,
        contextData,
        completedAt: new Date()
      }
    });
  }

  async markFailed(id: string) {
    return prisma.workflowRecord.update({
      where: { id },
      data: {
        status: WorkflowStatus.FAILED,
        retryCount: { increment: 1 }
      }
    });
  }

  async listByStatus(status: WorkflowStatus, limit: number, offset: number) {
    return prisma.workflowRecord.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });
  }
}