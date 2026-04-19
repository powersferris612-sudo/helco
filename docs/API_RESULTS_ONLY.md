# HealCo API Results Only

## GET /health

```json
{
  "ok": true
}
```

## POST /api/v1/workflows

Request body:

```json
{
  "idempotencyKey": "original-output-20260418183049712",
  "payload": {
    "symptom": "lower back pain",
    "painLevel": 3,
    "duration": "2 weeks",
    "redFlags": false,
    "age": 34,
    "patientId": "patient_001",
    "failedPtHistory": false
  }
}
```

```json
{
  "workflowId": "cmo4dknrg0001umk0s0w5o5hk",
  "status": "INITIATED"
}
```

## GET /api/v1/workflows/:id

```json
{
  "id": "cmo4dic970004umj0yibkjq51",
  "traceId": "dd836929-a54e-48f4-95da-6fd634474133",
  "status": "COMPLETED",
  "input": {
    "symptom": "lower back pain",
    "painLevel": 3,
    "duration": "2 weeks",
    "redFlags": false,
    "age": 34,
    "patientId": "patient_case-h",
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
    "completedAt": "2026-04-18T13:29:02.476Z"
  },
  "adherence": {
    "isAdhered": true,
    "expectedCare": "PT referral created",
    "actualCare": "PT referral created"
  },
  "retryCount": 0,
  "timestamps": {
    "createdAt": "2026-04-18T13:29:01.580Z",
    "updatedAt": "2026-04-18T13:29:02.478Z",
    "completedAt": "2026-04-18T13:29:02.476Z"
  }
}
```

## GET /api/v1/workflows/:id/logs

```json
{
  "workflowId": "cmo4dic970004umj0yibkjq51",
  "summary": "Routed to MSK pathway because symptom keyword mapping matched deterministic rules (confidence 0.95) → PT_FIRST selected because: Pain score is mild to moderate and no red flags are present. | No prior failed PT history is recorded, so conservative care is first-line. → PT referral created completed",
  "timeline": [
    {
      "index": 1,
      "label": "Intake",
      "at": "2026-04-18T13:29:01.580Z",
      "displayLine": "1. [Intake] - 6:29:01 pm",
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
      "label": "MSK Routing Complete",
      "at": "2026-04-18T13:29:02.457Z",
      "displayLine": "2. [MSK Routing Complete] - 6:29:02 pm",
      "message": "Routed to MSK pathway (confidence 0.95). Keyword match - deterministic rules",
      "step": "ROUTE",
      "transition": "ROUTING -> DECISION_PENDING",
      "actor": "route-worker",
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
        "completedAt": null
      },
      "adherence": {
        "isAdhered": true,
        "expectedCare": null,
        "actualCare": "PT referral created"
      }
    },
    {
      "index": 3,
      "label": "PT_FIRST Selected",
      "at": "2026-04-18T13:29:02.472Z",
      "displayLine": "3. [PT_FIRST Selected] - 6:29:02 pm",
      "message": "PT_FIRST selected. PT referral created.",
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
      "label": "Action Completed",
      "at": "2026-04-18T13:29:02.480Z",
      "displayLine": "4. [Action Completed] - 6:29:02 pm",
      "message": "PT referral created. Pathway adhered.",
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
        "completedAt": null
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
      "label": "Intake",
      "at": "2026-04-18T13:29:01.580Z",
      "displayLine": "1. [Intake] - 6:29:01 pm",
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
    }
  ],
  "rawLogs": [
    {
      "id": "cmo4dicxl0001umqsadz2kdi5",
      "workflowId": "cmo4dic970004umj0yibkjq51",
      "traceId": "dd836929-a54e-48f4-95da-6fd634474133",
      "step": "ROUTE",
      "title": "MSK Routing Complete",
      "fromState": "ROUTING",
      "toState": "DECISION_PENDING",
      "actor": "route-worker",
      "narrative": "Routed to MSK pathway because symptom keyword mapping matched deterministic rules (confidence 0.95)",
      "message": "Routed to MSK pathway (confidence 0.95). Keyword match - deterministic rules",
      "routingDecision": {
        "route": "MSK",
        "confidence": 0.95,
        "reasoning": "Keyword match - deterministic rules"
      },
      "decisionMade": null,
      "actionTaken": null,
      "adherenceResult": null,
      "payloadSnapshot": {
        "input": {
          "age": 34,
          "symptom": "lower back pain",
          "duration": "2 weeks",
          "redFlags": false,
          "painLevel": 3,
          "patientId": "patient_case-h",
          "failedPtHistory": false
        },
        "pathway": {
          "route": "MSK",
          "reasoning": "Keyword match - deterministic rules",
          "confidence": 0.95
        }
      },
      "pathway": {
        "route": "MSK",
        "confidence": 0.95,
        "reasoning": "Keyword match - deterministic rules"
      },
      "decision": null,
      "createdAt": "2026-04-18T13:29:02.457Z"
    }
  ],
  "overview": {
    "input": {
      "symptom": "lower back pain",
      "painLevel": 3,
      "duration": "2 weeks",
      "redFlags": false,
      "age": 34,
      "patientId": "patient_case-h",
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
      "completedAt": null
    },
    "adherence": {
      "isAdhered": true,
      "expectedCare": "PT referral created",
      "actualCare": "PT referral created"
    }
  }
}
```

## GET /api/v1/workflows?status=COMPLETED&limit=20&offset=0

```json
[
  {
    "id": "cmo4dl4vy0002umk09iw9uuxq",
    "traceId": "f0abf7d1-fedc-4498-a68b-dc1d787327a1",
    "status": "COMPLETED",
    "input": {
      "symptom": "lower back pain",
      "painLevel": 3,
      "duration": "2 weeks",
      "redFlags": false,
      "age": 34,
      "patientId": "patient_001",
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
      "completedAt": "2026-04-18T13:31:12.912Z"
    },
    "adherence": {
      "isAdhered": true,
      "expectedCare": "PT referral created",
      "actualCare": "PT referral created"
    },
    "retryCount": 0,
    "timestamps": {
      "createdAt": "2026-04-18T13:31:11.998Z",
      "updatedAt": "2026-04-18T13:31:12.913Z",
      "completedAt": "2026-04-18T13:31:12.912Z"
    }
  }
]
```
