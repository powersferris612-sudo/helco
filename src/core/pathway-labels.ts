/**
 * Pathway and decision label mappings for human-readable UI output
 * Transforms internal codes to client-facing terminology
 */

export const PATHWAY_NAMES = {
  MSK: 'MSK Bundled Pathway',
  PT_FIRST: 'PT-First Pathway',
  HOSPITAL_FIRST: 'Hospital-First Pathway',
  IMAGING_FIRST: 'Imaging-First Pathway',
  BUNDLED: 'Bundled Care Pathway',
  GENERAL: 'General Care Pathway',
  CARDIO: 'Cardiology Pathway'
} as const;

export const DECISION_STATEMENTS = {
  IMAGING_FIRST: 'MSK Bundled Pathway selected',
  PT_FIRST: 'PT-first pathway selected',
  HOSPITAL_FIRST: 'Hospital-first pathway selected',
  BUNDLED: 'Bundled care episode initiated',
  CONSERVATIVE: 'Conservative treatment pathway selected',
  ESCALATION: 'Escalation to specialist required'
} as const;

export const ACTION_INSTRUCTIONS = {
  IMAGING_FIRST: 'Route to MSK Bundled Provider',
  PT_FIRST: 'Route to in-network physical therapist',
  HOSPITAL_FIRST: 'Route to hospital for admission',
  BUNDLED: 'Initiate bundled care episode',
  CONSERVATIVE: 'Initiate conservative care plan',
  ESCALATION: 'Create specialist referral'
} as const;

export const AVOIDED_PATHWAY_LABELS = {
  HOSPITAL_FIRST: 'Hospital-First Pathway',
  PT_FIRST: 'PT-First Pathway',
  IMAGING_FIRST: 'Imaging-First Pathway',
  CONSERVATIVE: 'Conservative Treatment',
  ESCALATION: 'Specialist Escalation'
} as const;

/**
 * Get human-readable pathway name
 */
export function getPathwayName(code: string): string {
  return PATHWAY_NAMES[code as keyof typeof PATHWAY_NAMES] || code;
}

/**
 * Get human-readable decision statement
 */
export function getDecisionStatement(code: string): string {
  return DECISION_STATEMENTS[code as keyof typeof DECISION_STATEMENTS] || `Decision: ${code}`;
}

/**
 * Get human-readable action instruction
 */
export function getActionInstruction(code: string): string {
  return ACTION_INSTRUCTIONS[code as keyof typeof ACTION_INSTRUCTIONS] || `Execute: ${code}`;
}

/**
 * Get human-readable avoided pathway label
 */
export function getAvoidedPathwayLabel(code: string): string {
  return AVOIDED_PATHWAY_LABELS[code as keyof typeof AVOIDED_PATHWAY_LABELS] || code;
}
