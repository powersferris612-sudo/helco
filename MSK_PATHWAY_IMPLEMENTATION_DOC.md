# HealCo MSK Pathway - Implementation Doc

## 1. Objective

Deliver a working end-to-end flow for one pathway:

- MSK pathway (lower back pain)
- Input -> Route -> Decision -> Action -> Governance Log
- Persisted in DB
- Traceable in logs
- Consistent across API and DB

## 2. Scope Delivered

### 2.1 Input -> Route

- API accepts symptom payload via `POST /api/v1/workflows`.
- Routing logic is deterministic and maps back-pain keywords to `MSK`.

### 2.2 Route -> Decision

- Rules engine is deterministic (no LLM).
- For MSK:
- `red_flags = true` OR `pain_level >= 6` -> `IMAGING_FIRST`
- otherwise -> `PT_FIRST`

### 2.3 Decision -> Next Action

- Action worker executes one concrete mock action:
- `PT referral created` or `Imaging referral created`.
- Workflow is marked completed with:
- `actualCare`
- `isAdhered`
- `completedAt`

### 2.4 Governance Log

- Each transition is recorded with:
- `fromState`
- `toState`
- `actor`
- `narrative`
- `payloadSnapshot`
- Readable summary is returned by logs API.
- Adherence is captured in final action snapshot.

## 3. Data Model (Persistence)

### WorkflowRecord

- `id`
- `idempotencyKey` (unique)
- `traceId`
- `status`
- `contextData`
- `actualCare`
- `isAdhered`
- `retryCount`
- `completedAt`
- `createdAt`
- `updatedAt`

### GovernanceLog

- `id`
- `workflowId`
- `traceId`
- `fromState`
- `toState`
- `actor`
- `narrative`
- `payloadSnapshot`
- `createdAt`

## 4. API Endpoints

- `POST /api/v1/workflows`
- `GET /api/v1/workflows/:id`
- `GET /api/v1/workflows/:id/logs`
- `GET /api/v1/workflows?status=COMPLETED&limit=20&offset=0`

## 5. API Request/Response Examples

### 5.1 Create Workflow (MSK happy path)

Request:

```http
POST /api/v1/workflows
Content-Type: application/json

{
  "idempotencyKey": "validate_002",
  "payload": {
    "symptom": "lower back pain",
    "pain_level": 3,
    "duration": "2 weeks",
    "red_flags": false,
    "age": 34,
    "patient_id": "patient_001"
  }
}
```

Response:

```json
{
  "workflow_id": "cmo15ay910001umco7wqlhr5j",
  "status": "INITIATED"
}
```

### 5.2 Get Workflow (normalized context order)

Request:

```http
GET /api/v1/workflows/cmo15ay910001umco7wqlhr5j
```

Response:

```json
{
  "id": "cmo15ay910001umco7wqlhr5j",
  "idempotencyKey": "validate_002",
  "traceId": "70f64db8-8f35-4321-bdcd-e97f3495e5ca",
  "status": "COMPLETED",
  "contextData": {
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
  "actualCare": "PT referral created",
  "isAdhered": true,
  "retryCount": 0,
  "completedAt": "2026-04-16T07:16:01.436Z",
  "createdAt": "2026-04-16T07:16:01.381Z",
  "updatedAt": "2026-04-16T07:16:01.437Z"
}
```

### 5.3 Get Governance Logs (readable summary + structured logs)

Request:

```http
GET /api/v1/workflows/cmo15ay910001umco7wqlhr5j/logs
```

Response:

```json
{
  "summary": "Routed to MSK pathway -> PT_FIRST selected -> PT referral created completed",
  "logs": [
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
    "idempotencyKey": "...",
    "status": "COMPLETED",
    "contextData": {
      "input": {},
      "routingDecision": {},
      "decision": {},
      "action": {}
    },
    "actualCare": "...",
    "isAdhered": true,
    "completedAt": "..."
  }
]
```

## 6. Consistency Notes

- API and DB stay consistent through repository-backed persistence.
- `idempotencyKey` prevents duplicate workflow creation for repeated create requests.
- `traceId` links one workflow across all governance entries.
- `contextData` and `payloadSnapshot` are returned in a normalized readable order.

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