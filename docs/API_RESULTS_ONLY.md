# HealCo API Results Only

## GET /health

```json
{
  "ok": true
}
```

## GET /api/v1/workflows?status=COMPLETED&limit=20&offset=0

```json
[
  {
    "id": "cmo6uljph0000um7cka7z2w7g",
    "traceId": "5f4c8d2e-9a1f-4e6c-b7d3-2c1a9f5b8e3d",
    "status": "COMPLETED",
    "input": {
      "symptom": "lower back pain",
      "painLevel": 3,
      "duration": "2 weeks",
      "redFlags": false,
      "age": 34,
      "patientId": "patient_original_scenario",
      "failedPtHistory": false
    },
    "pathway": {
      "route": "MSK",
      "confidence": 0.95,
      "reasoning": "Keyword match - deterministic rules"
    },
    "decision": {
      "plan": "PT_FIRST",
      "expectedCare": "PT referral created",
      "rationale": {
        "selectedBecause": [
          "Pain score is mild to moderate and no red flags are present.",
          "No prior failed PT history is recorded, so conservative care is first-line."
        ],
        "factors": {
          "route": "MSK",
          "painLevel": 3,
          "redFlags": false,
          "failedPtHistory": false
        }
      },
      "alternatives": [
        {
          "plan": "IMAGING_FIRST",
          "expectedCare": "Imaging referral created",
          "ranking": 2,
          "selected": false,
          "notSelectedReason": "Not selected because no red flags and no high pain threshold trigger were found."
        }
      ],
      "comparison": {
        "compared": true,
        "methodology": "rules-v1",
        "notes": "Structured for future weighted scoring and side-by-side strategy comparison."
      }
    },
    "action": {
      "actualCare": "PT referral created",
      "completedAt": "2026-04-20T07:02:57.178Z"
    },
    "adherence": {
      "isAdhered": true,
      "expectedCare": "PT referral created",
      "actualCare": "PT referral created"
    },
    "retryCount": 0,
    "timestamps": {
      "createdAt": "2026-04-20T07:02:56.845Z",
      "updatedAt": "2026-04-20T07:02:57.182Z",
      "completedAt": "2026-04-20T07:02:57.178Z"
    }
  }
]
```

## POST /api/v1/workflows

Request body:

```json
{
  "idempotencyKey": "scenario-1713610976123",
  "payload": {
    "symptom": "lower back pain",
    "painLevel": 3,
    "duration": "2 weeks",
    "redFlags": false,
    "age": 34,
    "patientId": "patient_original_scenario",
    "failedPtHistory": false
  }
}
```

```json
{
  "workflowId": "cmo6uljph0000um7cka7z2w7g",
  "status": "INITIATED"
}
```

## GET /api/v1/workflows/:id

```json
{
  "id": "cmo6uljph0000um7cka7z2w7g",
  "traceId": "5f4c8d2e-9a1f-4e6c-b7d3-2c1a9f5b8e3d",
  "status": "COMPLETED",
  "input": {
    "symptom": "lower back pain",
    "painLevel": 3,
    "duration": "2 weeks",
    "redFlags": false,
    "age": 34,
    "patientId": "patient_original_scenario",
    "failedPtHistory": false
  },
  "pathway": {
    "route": "MSK",
    "confidence": 0.95,
    "reasoning": "Keyword match - deterministic rules"
  },
  "decision": {
    "plan": "PT_FIRST",
    "expectedCare": "PT referral created",
    "rationale": {
      "selectedBecause": [
        "Pain score is mild to moderate and no red flags are present.",
        "No prior failed PT history is recorded, so conservative care is first-line."
      ],
      "factors": {
        "route": "MSK",
        "painLevel": 3,
        "redFlags": false,
        "failedPtHistory": false
      }
    },
    "alternatives": [
      {
        "plan": "IMAGING_FIRST",
        "expectedCare": "Imaging referral created",
        "ranking": 2,
        "selected": false,
        "notSelectedReason": "Not selected because no red flags and no high pain threshold trigger were found."
      }
    ],
    "comparison": {
      "compared": true,
      "methodology": "rules-v1",
      "notes": "Structured for future weighted scoring and side-by-side strategy comparison."
    }
  },
  "action": {
    "actualCare": "PT referral created",
    "completedAt": "2026-04-20T07:02:57.178Z"
  },
  "adherence": {
    "isAdhered": true,
    "expectedCare": "PT referral created",
    "actualCare": "PT referral created"
  },
  "retryCount": 0,
  "timestamps": {
    "createdAt": "2026-04-20T07:02:56.845Z",
    "updatedAt": "2026-04-20T07:02:57.182Z",
    "completedAt": "2026-04-20T07:02:57.178Z"
  }
}
```

## GET /api/v1/workflows/:id/logs

Response sections are intentionally differentiated:

- `timeline`: rich, human-readable event feed (UI-first view).
- `logs`: compact projection aligned to `timeline` by index and step.
- `rawLogs`: raw transition records for audit/debug only.
- `overview`: final aggregate snapshot.

Raw logs query behavior:

- Default (no `include` query): excludes `rawLogs`.
- `?include=timeline,logs,overview`: excludes `rawLogs`.
- `?include=raw`: explicitly includes `rawLogs`.

```json
{
  "workflowId": "cmo6uljph0000um7cka7z2w7g",
  "summary": "Routed to MSK pathway because symptom keyword mapping matched deterministic rules (confidence 0.95) → PT_FIRST selected because: Pain score is mild to moderate and no red flags are present. | No prior failed PT history is recorded, so conservative care is first-line. → PT referral created completed",
  "timeline": [
    {
      "index": 1,
      "label": "Intake",
      "at": "2026-04-20T07:02:56.845Z",
      "displayLine": "1. [Intake] - 7:02:56 am",
      "message": "Patient reported lower back pain (pain level 3/10, red flags: no). Workflow created and queued for routing.",
      "step": "INTAKE",
      "transition": "CREATED -> QUEUED",
      "actor": "system",
      "pathway": {
        "route": "MSK",
        "confidence": 0.95,
        "reasoning": "Keyword match - deterministic rules"
      },
      "decision": null,
      "action": null,
      "adherence": null
    },
    {
      "index": 2,
      "label": "Route",
      "at": "2026-04-20T07:02:56.892Z",
      "displayLine": "2. [Route] - 7:02:56 am",
      "message": "Symptoms matched MSK Spine Pathway criteria. No red flags detected. Patient assigned to MSK Spine Pathway automatically.",
      "step": "ROUTE",
      "transition": "ROUTING -> DECISION_PENDING",
      "actor": "route-worker",
      "pathway": {
        "route": "MSK",
        "confidence": 0.95,
        "reasoning": "Keyword match - deterministic rules"
      },
      "decision": null,
      "action": null,
      "adherence": null
    },
    {
      "index": 3,
      "label": "Decision",
      "at": "2026-04-20T07:02:56.956Z",
      "displayLine": "3. [Decision] - 7:02:56 am",
      "message": "PT-first pathway selected. Pain score is mild to moderate and no red flags are present. No prior failed PT history is recorded, so conservative care is first-line. Telehealth Physical Therapy recommended as first line of care.",
      "step": "DECISION",
      "transition": "DECISION_PENDING -> ACTION_PENDING",
      "actor": "decision-worker",
      "pathway": {
        "route": "MSK",
        "confidence": 0.95,
        "reasoning": "Keyword match - deterministic rules"
      },
      "decision": {
        "plan": "PT_FIRST",
        "expectedCare": "PT referral created",
        "rationale": {
          "selectedBecause": [
            "Pain score is mild to moderate and no red flags are present.",
            "No prior failed PT history is recorded, so conservative care is first-line."
          ],
          "factors": {
            "route": "MSK",
            "painLevel": 3,
            "redFlags": false,
            "failedPtHistory": false
          }
        },
        "alternatives": [
          {
            "plan": "IMAGING_FIRST",
            "expectedCare": "Imaging referral created",
            "ranking": 2,
            "selected": false,
            "notSelectedReason": "Not selected because no red flags and no high pain threshold trigger were found."
          }
        ],
        "comparison": {
          "compared": true,
          "methodology": "rules-v1",
          "notes": "Structured for future weighted scoring and side-by-side strategy comparison."
        }
      },
      "action": null,
      "adherence": null
    },
    {
      "index": 4,
      "label": "Action",
      "at": "2026-04-20T07:02:57.015Z",
      "displayLine": "4. [Action] - 7:02:57 am",
      "message": "Referral created for City PT Clinic (Telehealth, In-Network). Care navigator notified. Workflow completed. No overrides. Pathway adhered.",
      "step": "ACTION",
      "transition": "ACTION_PENDING -> COMPLETED",
      "actor": "action-worker",
      "pathway": {
        "route": "MSK",
        "confidence": 0.95,
        "reasoning": "Keyword match - deterministic rules"
      },
      "decision": {
        "plan": "PT_FIRST",
        "expectedCare": "PT referral created",
        "rationale": {
          "selectedBecause": [
            "Pain score is mild to moderate and no red flags are present.",
            "No prior failed PT history is recorded, so conservative care is first-line."
          ],
          "factors": {
            "route": "MSK",
            "painLevel": 3,
            "redFlags": false,
            "failedPtHistory": false
          }
        },
        "alternatives": [
          {
            "plan": "IMAGING_FIRST",
            "expectedCare": "Imaging referral created",
            "ranking": 2,
            "selected": false,
            "notSelectedReason": "Not selected because no red flags and no high pain threshold trigger were found."
          }
        ],
        "comparison": {
          "compared": true,
          "methodology": "rules-v1",
          "notes": "Structured for future weighted scoring and side-by-side strategy comparison."
        }
      },
      "action": {
        "actualCare": "PT referral created",
        "completedAt": "2026-04-20T07:02:57.178Z"
      },
      "adherence": {
        "isAdhered": true,
        "expectedCare": "PT referral created",
        "actualCare": "PT referral created"
      }
    }
  ],
  "logs": [
    {
      "index": 1,
      "at": "2026-04-20T07:02:56.845Z",
      "step": "INTAKE",
      "transition": "CREATED -> QUEUED",
      "actor": "system",
      "message": "Patient reported lower back pain (pain level 3/10, red flags: no). Workflow created and queued for routing.",
      "route": "MSK",
      "plan": null,
      "actualCare": null,
      "isAdhered": null
    },
    {
      "index": 2,
      "at": "2026-04-20T07:02:56.892Z",
      "step": "ROUTE",
      "transition": "ROUTING -> DECISION_PENDING",
      "actor": "route-worker",
      "message": "Symptoms matched MSK Spine Pathway criteria. No red flags detected. Patient assigned to MSK Spine Pathway automatically.",
      "route": "MSK",
      "plan": null,
      "actualCare": null,
      "isAdhered": null
    },
    {
      "index": 3,
      "at": "2026-04-20T07:02:56.956Z",
      "step": "DECISION",
      "transition": "DECISION_PENDING -> ACTION_PENDING",
      "actor": "decision-worker",
      "message": "PT-first pathway selected. Pain score is mild to moderate and no red flags are present. No prior failed PT history is recorded, so conservative care is first-line. Telehealth Physical Therapy recommended as first line of care.",
      "route": "MSK",
      "plan": "PT_FIRST",
      "actualCare": null,
      "isAdhered": null
    },
    {
      "index": 4,
      "at": "2026-04-20T07:02:57.015Z",
      "step": "ACTION",
      "transition": "ACTION_PENDING -> COMPLETED",
      "actor": "action-worker",
      "message": "Referral created for City PT Clinic (Telehealth, In-Network). Care navigator notified. Workflow completed. No overrides. Pathway adhered.",
      "route": "MSK",
      "plan": "PT_FIRST",
      "actualCare": "PT referral created",
      "isAdhered": true
    }
  ],
  "sections": {
    "timeline": {
      "role": "primary-rich",
      "description": "Human-readable, detailed timeline for UI and audit playback."
    },
    "logs": {
      "role": "compact-aligned",
      "description": "Compact projection of timeline for table/list rendering.",
      "alignment": {
        "with": "timeline",
        "guaranteed": true,
        "fields": ["index", "step", "transition", "actor", "message"]
      }
    },
    "rawLogs": {
      "role": "audit-debug",
      "description": "Raw transition records with payload snapshots for diagnostics."
    },
    "overview": {
      "role": "final-state",
      "description": "Final aggregate snapshot of input, pathway, decision, action, and adherence."
    }
  },
  "overview": {
    "input": {
      "symptom": "lower back pain",
      "painLevel": 3,
      "duration": "2 weeks",
      "redFlags": false,
      "age": 34,
      "patientId": "patient_original_scenario",
      "failedPtHistory": false
    },
    "pathway": {
      "route": "MSK",
      "confidence": 0.95,
      "reasoning": "Keyword match - deterministic rules"
    },
    "decision": {
      "plan": "PT_FIRST",
      "expectedCare": "PT referral created",
      "rationale": {
        "selectedBecause": [
          "Pain score is mild to moderate and no red flags are present.",
          "No prior failed PT history is recorded, so conservative care is first-line."
        ],
        "factors": {
          "route": "MSK",
          "painLevel": 3,
          "redFlags": false,
          "failedPtHistory": false
        }
      },
      "alternatives": [
        {
          "plan": "IMAGING_FIRST",
          "expectedCare": "Imaging referral created",
          "ranking": 2,
          "selected": false,
          "notSelectedReason": "Not selected because no red flags and no high pain threshold trigger were found."
        }
      ],
      "comparison": {
        "compared": true,
        "methodology": "rules-v1",
        "notes": "Structured for future weighted scoring and side-by-side strategy comparison."
      }
    },
    "action": {
      "actualCare": "PT referral created",
      "completedAt": "2026-04-20T07:02:57.178Z"
    },
    "adherence": {
      "isAdhered": true,
      "expectedCare": "PT referral created",
      "actualCare": "PT referral created"
    }
  },
  "responseMeta": {
    "includeQuery": null,
    "rawLogs": {
      "included": false,
      "query": "include=raw",
      "note": "rawLogs are excluded by default and returned only when include=raw is requested."
    }
  }
}
```
