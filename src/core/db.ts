import { Prisma, PrismaClient } from '@prisma/client';
import { GovernanceStep, WorkflowStatus } from './workflow-state';

type WorkflowRow = {
  id: string;
  idempotencyKey: string;
  traceId: string;
  status: WorkflowStatus;
  contextData: Prisma.InputJsonValue;
  actualCare: string | null;
  isAdhered: boolean | null;
  retryCount: number;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type GovernanceRow = {
  id: string;
  workflowId: string;
  traceId: string;
  step: GovernanceStep;
  fromState: WorkflowStatus;
  toState: WorkflowStatus;
  actor: string;
  title: string;
  narrative: string;
  message: string;
  routingDecision: Prisma.InputJsonValue | null;
  decisionMade: Prisma.InputJsonValue | null;
  actionTaken: Prisma.InputJsonValue | null;
  adherenceResult: Prisma.InputJsonValue | null;
  payloadSnapshot: Prisma.InputJsonValue;
  createdAt: Date;
};

type WhereInput = { id?: string; idempotencyKey?: string; status?: WorkflowStatus; workflowId?: string };

const workflowRows = new Map<string, WorkflowRow>();
const workflowKeyIndex = new Map<string, string>();
const governanceRows: GovernanceRow[] = [];

function clone<T>(value: T): T {
  return structuredClone(value);
}

function buildWorkflowRecordApi() {
  return {
    async findUnique({ where }: { where: WhereInput }) {
      if (where.id) {
        const row = workflowRows.get(where.id);
        return row ? clone(row) : null;
      }

      if (where.idempotencyKey) {
        const workflowId = workflowKeyIndex.get(where.idempotencyKey);
        if (!workflowId) return null;
        const row = workflowRows.get(workflowId);
        return row ? clone(row) : null;
      }

      return null;
    },
    async create({ data }: { data: { idempotencyKey: string; traceId: string; status: WorkflowStatus; contextData: Prisma.InputJsonValue } }) {
      const now = new Date();
      const id = `wf_${workflowRows.size + 1}`;
      const row: WorkflowRow = {
        id,
        idempotencyKey: data.idempotencyKey,
        traceId: data.traceId,
        status: data.status,
        contextData: clone(data.contextData),
        actualCare: null,
        isAdhered: null,
        retryCount: 0,
        completedAt: null,
        createdAt: now,
        updatedAt: now
      };

      workflowRows.set(id, row);
      workflowKeyIndex.set(data.idempotencyKey, id);
      return clone(row);
    },
    async update({ where, data }: { where: { id: string }; data: Omit<Partial<WorkflowRow>, 'retryCount'> & { retryCount?: { increment: number } } }) {
      const row = workflowRows.get(where.id);
      if (!row) {
        throw new Error(`Workflow ${where.id} not found`);
      }

      const retryCountUpdate = data.retryCount as { increment: number } | undefined;
      if (retryCountUpdate) {
        row.retryCount += retryCountUpdate.increment;
      }

      const nextData = { ...data } as Partial<WorkflowRow>;
      delete nextData.retryCount;
      Object.assign(row, nextData, { updatedAt: new Date() });
      workflowRows.set(where.id, row);
      return clone(row);
    },
    async findMany({ where, orderBy, take, skip }: { where: { status?: WorkflowStatus }; orderBy?: { createdAt: 'asc' | 'desc' }; take?: number; skip?: number }) {
      const rows = Array.from(workflowRows.values()).filter((row) => !where.status || row.status === where.status);
      rows.sort((a, b) => (orderBy?.createdAt === 'asc' ? a.createdAt.getTime() - b.createdAt.getTime() : b.createdAt.getTime() - a.createdAt.getTime()));
      const sliced = rows.slice(skip ?? 0, (skip ?? 0) + (take ?? rows.length));
      return clone(sliced);
    }
  };
}

function buildGovernanceLogApi() {
  return {
    async create({
      data
    }: {
      data: {
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
      };
    }) {
      const row: GovernanceRow = {
        id: `gl_${governanceRows.length + 1}`,
        workflowId: data.workflowId,
        traceId: data.traceId,
        step: data.step,
        fromState: data.fromState,
        toState: data.toState,
        actor: data.actor,
        title: data.title,
        narrative: data.narrative,
        message: data.message,
        routingDecision: data.routingDecision ?? null,
        decisionMade: data.decisionMade ?? null,
        actionTaken: data.actionTaken ?? null,
        adherenceResult: data.adherenceResult ?? null,
        payloadSnapshot: clone(data.payloadSnapshot),
        createdAt: new Date()
      };

      governanceRows.push(row);
      return clone(row);
    },
    async findMany({ where, orderBy }: { where: { workflowId: string }; orderBy?: { createdAt: 'asc' | 'desc' } }) {
      const rows = governanceRows
        .filter((row) => row.workflowId === where.workflowId)
        .sort((a, b) => (orderBy?.createdAt === 'asc' ? a.createdAt.getTime() - b.createdAt.getTime() : b.createdAt.getTime() - a.createdAt.getTime()));
      return clone(rows);
    }
  };
}

const inMemoryPrisma = {
  workflowRecord: buildWorkflowRecordApi(),
  governanceLog: buildGovernanceLogApi()
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | typeof inMemoryPrisma | undefined;
}

export const prisma = globalThis.prisma ?? (process.env.DATABASE_URL ? new PrismaClient() : inMemoryPrisma);

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}