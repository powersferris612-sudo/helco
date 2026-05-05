/**
 * Builder for ConsolidatedResponse
 * Transforms workflow context into UI-ready format with human-readable labels
 */

import { ConsolidatedResponse } from '../core/consolidated-response.types';
import {
  getPathwayName,
  getDecisionStatement,
  getActionInstruction,
  getAvoidedPathwayLabel
} from '../core/pathway-labels';

type WorkflowLike = {
  id: string;
  contextData: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Build consolidated response from workflow
 */
export function buildConsolidatedResponse(
  workflow: WorkflowLike,
  memberName: string | null = null
): ConsolidatedResponse {
  const context = workflow.contextData as Record<string, unknown>;
  const decision = (context.decision as Record<string, unknown>) ?? {};
  const pathway = (context.pathway as Record<string, unknown>) ?? {};
  const action = (context.action as Record<string, unknown>) ?? {};
  const input = (context.input as Record<string, unknown>) ?? {};

  const planCode = String(decision.plan ?? 'UNKNOWN');
  const avoidedPathCode = String(decision.avoidedPath ?? 'HOSPITAL_FIRST');
  const confidence = Number(pathway.confidence ?? 0.85);
  const rationales = Array.isArray(decision.selectedBecause)
    ? decision.selectedBecause.map(String)
    : Array.isArray((decision.rationale as any)?.selectedBecause)
      ? (decision.rationale as any).selectedBecause.map(String)
      : [];

  const timestamp = (workflow.updatedAt ?? workflow.createdAt ?? new Date()).toISOString();

  return {
    member: {
      id: workflow.id,
      name: memberName ?? (String(input.patientId) || null)
    },

    decision: {
      statement: getDecisionStatement(planCode),
      pathwayName: getPathwayName(planCode),
      timestamp,
      confidence: Math.min(1, Math.max(0, confidence)),
      rationale: rationales.length > 0 ? rationales : ['Clinical algorithm applied']
    },

    action: {
      instruction: getActionInstruction(planCode),
      expectedOutcome: String(decision.expectedCare ?? 'Care initiated per protocol')
    },

    counterfactual: {
      avoidedPath: getAvoidedPathwayLabel(avoidedPathCode),
      reason: String(
        decision.avoidedReason ?? 'Alternative pathway was not selected based on clinical criteria'
      )
    },

    impact: {
      estimatedSavings: null, // Populated from external cost model if available
      episodeType: '90-day',
      referralStatus: String(action.isDefaultPath === false ? 'Pending' : 'Auto-generated')
    },

    governance: {
      decisionId: workflow.id,
      processingStatus: String(action.actualCare ? 'Completed' : 'Active'),
      decisionDate: timestamp
    }
  };
}
