/**
 * Consolidated response schema that maps directly to UI
 * Single source of truth for decision outcome display
 */

export type ConsolidatedResponse = {
  // Member context
  member: {
    id: string;
    name: string | null;
  };

  // Decision: what was selected and why
  decision: {
    statement: string; // e.g., "MSK Bundled Pathway selected"
    pathwayName: string; // e.g., "MSK Bundled Care Pathway"
    timestamp: string; // ISO 8601
    confidence: number; // 0-1
    rationale: string[];
  };

  // Action: what happens next
  action: {
    instruction: string; // e.g., "Route to MSK Bundled Provider"
    expectedOutcome: string; // e.g., "Bundled episode with cost controls"
  };

  // Counterfactual: what was NOT selected and why
  counterfactual: {
    avoidedPath: string; // e.g., "Hospital-First Pathway"
    reason: string; // Why this alternative was ruled out
  };

  // Impact metrics for display
  impact: {
    estimatedSavings: number | null;
    episodeType: string; // e.g., "90-day"
    referralStatus: string; // "Created" | "Pending" | "Auto-generated"
  };

  // Governance & auditability
  governance: {
    decisionId: string; // workflowId or traceId
    processingStatus: string; // "Active" | "Completed"
    decisionDate: string; // ISO 8601
  };
};
