# HealCo MSK Pathway - Implementation Doc

## 1. Objective

Deliver a working end-to-end flow for one pathway:

- MSK pathway (lower back pain)
- Input -> Route -> Decision -> Action -> Governance Log
- Persisted in DB
- Traceable in logs
- Consistent across API and DB

## 2. Scope Delivered

      "index": 1,
      "label": "Intake",
      "at": "2026-04-16T07:16:01.381Z",
      "displayLine": "1. [Intake] - 10:56:17 am",
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
      "at": "2026-04-16T07:16:01.425Z",
      "displayLine": "2. [Route] - 10:56:17 am",
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
      "at": "2026-04-16T07:16:01.433Z",
      "displayLine": "3. [Decision] - 10:56:17 am",
      "message": "PT-first pathway selected. Pain score mild (3/10), no red flags, no prior failed PT on record. Telehealth Physical Therapy recommended as first line of care.",
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
        "expectedCare": "PT referral created"
      },
      "action": null,
      "adherence": null
    },
    {
      "index": 4,
      "label": "Action",
      "at": "2026-04-16T07:16:01.438Z",
      "displayLine": "4. [Action] - 10:56:18 am",
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
        "expectedCare": "PT referral created"
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
  "rawLogs": [
    {
      "id": "cmo15aya90007ummou9thness",
      "workflowId": "cmo15ay910001umco7wqlhr5j",
      "traceId": "70f64db8-8f35-4321-bdcd-e97f3495e5ca",
      "fromState": "ROUTING",
      "toState": "DECISION_PENDING",
      "actor": "route-worker",
      "narrative": "Routed to MSK pathway",
      "payloadSnapshot": {
        "input": {
          "age": 34,
          "symptom": "lower back pain",
          "duration": "2 weeks",
          "red_flags": false,
          "pain_level": 3,
          "patient_id": "patient_001"
        },
        "routingDecision": {
          "route": "MSK",
          "reasoning": "Keyword match - deterministic rules",
          "confidence": 0.95
        }
      },
      "createdAt": "2026-04-16T07:16:01.425Z"
    },
    {
      "id": "cmo15ayag0009ummofxdvpgug",
      "workflowId": "cmo15ay910001umco7wqlhr5j",
      "traceId": "70f64db8-8f35-4321-bdcd-e97f3495e5ca",
      "fromState": "DECISION_PENDING",
      "toState": "ACTION_PENDING",
      "actor": "decision-worker",
      "narrative": "PT_FIRST selected",
      "payloadSnapshot": {
        "input": {
          "age": 34,
          "symptom": "lower back pain",
          "duration": "2 weeks",
          "red_flags": false,
          "pain_level": 3,
          "patient_id": "patient_001"
        },
        "routingDecision": {
          "route": "MSK",
          "reasoning": "Keyword match - deterministic rules",
          "confidence": 0.95
        },
        "decision": {
          "plan": "PT_FIRST",
          "expectedCare": "PT referral created"
        }
      },
      "createdAt": "2026-04-16T07:16:01.433Z"
    },
    {
      "id": "cmo15ayam000bummob32imrei",
      "workflowId": "cmo15ay910001umco7wqlhr5j",
      "traceId": "70f64db8-8f35-4321-bdcd-e97f3495e5ca",
      "fromState": "ACTION_PENDING",
      "toState": "COMPLETED",
      "actor": "action-worker",
      "narrative": "PT referral created completed",
      "payloadSnapshot": {
        "input": {
          "age": 34,
          "symptom": "lower back pain",
          "duration": "2 weeks",
          "red_flags": false,
          "pain_level": 3,
          "patient_id": "patient_001"
        },
        "routingDecision": {
          "route": "MSK",
          "reasoning": "Keyword match - deterministic rules",
          "confidence": 0.95
        },
        "decision": {
          "plan": "PT_FIRST",
          "expectedCare": "PT referral created"
        },
        "action": {
          "isAdhered": true,
          "actualCare": "PT referral created"
        }
      },
      "createdAt": "2026-04-16T07:16:01.438Z"
    }

```json
{
  "workflowId": "cmo15ay910001umco7wqlhr5j",
  "status": "INITIATED"
}
```

### 5.2 Get Workflow (UI-ready shape)

Request:

```http
GET /api/v1/workflows/cmo15ay910001umco7wqlhr5j
```

Response:

```json
{
  "id": "cmo15ay910001umco7wqlhr5j",
  "traceId": "70f64db8-8f35-4321-bdcd-e97f3495e5ca",
  "status": "COMPLETED",
  "input": {
    "symptom": "lower back pain",
    "painLevel": 3,
    "duration": "2 weeks",
    "redFlags": false,
    "age": 34,
    "patientId": "patient_001",
    "failedPtHistory": null
  },
  "pathway": {
    "route": "MSK",
    "confidence": 0.95,
    "reasoning": "Keyword match - deterministic rules"
  },
  "decision": {
    "plan": "PT_FIRST",
    "expectedCare": "PT referral created"
  },
  "action": {
    "actualCare": "PT referral created",
    "completedAt": "2026-04-16T07:16:01.436Z"
  },
  "adherence": {
    "isAdhered": true,
    "expectedCare": "PT referral created",
    "actualCare": "PT referral created"
  },
  "retryCount": 0,
  "timestamps": {
    "createdAt": "2026-04-16T07:16:01.381Z",
    "updatedAt": "2026-04-16T07:16:01.437Z",
    "completedAt": "2026-04-16T07:16:01.436Z"
  }
}
```

### 5.3 Get Governance Logs (readable summary + timeline)

Request:

```http
GET /api/v1/workflows/cmo15ay910001umco7wqlhr5j/logs
```

Response:

```json
{
  "workflowId": "cmo15ay910001umco7wqlhr5j",
  "summary": "Routed to MSK pathway -> PT_FIRST selected -> PT referral created completed",
  "timeline": [
    {
      "id": "cmo15aya90007ummou9thness",
      "at": "2026-04-16T07:16:01.425Z",
      "step": "ROUTE",
      "transition": "ROUTING -> DECISION_PENDING",
      "fromState": "ROUTING",
      "toState": "DECISION_PENDING",
      "actor": "route-worker",
      "message": "Routed to MSK pathway",
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
  ,
  "rawLogs": [
    {
      "id": "cmo15aya90007ummou9thness",
      "workflowId": "cmo15ay910001umco7wqlhr5j",
      "traceId": "70f64db8-8f35-4321-bdcd-e97f3495e5ca",
      "fromState": "ROUTING",
      "toState": "DECISION_PENDING",
      "actor": "route-worker",
      "narrative": "Routed to MSK pathway",
      "payloadSnapshot": {
        "input": {
          "age": 34,
          "symptom": "lower back pain",
          "duration": "2 weeks",
          "red_flags": false,
          "pain_level": 3,
          "patient_id": "patient_001"
        },
        "routingDecision": {
          "route": "MSK",
          "reasoning": "Keyword match - deterministic rules",
          "confidence": 0.95
        }
      },
      "createdAt": "2026-04-16T07:16:01.425Z"
    }
  ]
      "id": "cmo15ayag0009ummofxdvpgug",
      "at": "2026-04-16T07:16:01.433Z",
      "transition": "DECISION_PENDING -> ACTION_PENDING",
      "fromState": "DECISION_PENDING",
      "toState": "ACTION_PENDING",
      "actor": "decision-worker",
      "message": "PT_FIRST selected",
      "pathway": {
        "route": "MSK",
        "confidence": 0.95,
        "reasoning": "Keyword match - deterministic rules"
      },
      "decision": {
        "plan": "PT_FIRST",
        "expectedCare": "PT referral created"
      },
      "action": null,
      "adherence": null
    },
    {
      "id": "cmo15ayam000bummob32imrei",
      "at": "2026-04-16T07:16:01.438Z",
      "transition": "ACTION_PENDING -> COMPLETED",
      "fromState": "ACTION_PENDING",
      "toState": "COMPLETED",
      "actor": "action-worker",
      "message": "PT referral created completed",
      "pathway": {
        "route": "MSK",
        "confidence": 0.95,
        "reasoning": "Keyword match - deterministic rules"
      },
      "decision": {
        "plan": "PT_FIRST",
        "expectedCare": "PT referral created"
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
  ]
}
```

### 5.4 List Completed Workflows

Request:

```http
GET /api/v1/workflows?status=COMPLETED&limit=20&offset=0
```

Response shape:

```json
[
  {
    "id": "...",
    "traceId": "...",
    "status": "COMPLETED",
    "input": {},
    "pathway": {},
    "decision": {},
    "action": {},
    "adherence": {},
    "retryCount": 0,
    "timestamps": {
      "createdAt": "...",
      "updatedAt": "...",
      "completedAt": "..."
    }
  }
]
```

## 6. Consistency Notes

- API and DB stay consistent through repository-backed persistence.
- `idempotencyKey` prevents duplicate workflow creation for repeated create requests.
- `traceId` links one workflow across all governance entries.
- API response shape is UI-ready with explicit `pathway`, `decision`, `action`, and `adherence` fields.
- Governance logs are returned as a readable timeline plus raw log detail for drill-down.

## 7. Out of Scope (intentionally not included)

- UI or dashboard changes
- Additional pathways beyond MSK primary flow
- LLM decisioning
- Reporting and performance optimization

## 8. What Is Ready For Client Review

- End-to-end MSK flow is operational.
- API contract is stable for create, get, list, and logs.
- Governance output is readable and traceable.
- Final action captures adherence for auditability.