# AAPADRAKSHA Implementation Plan

## Current Architecture Audit

- Frontend: React 19 + TypeScript + Vite, entered through `src/main.tsx` and `src/App.tsx`.
- Active backend: Node/Express in `server.ts`, served through `tsx server.ts` on port 3000; Vite middleware serves the SPA in development.
- Secondary backend: `backend/app/main.py` is a separate FastAPI implementation and is not started by the active application. It duplicates `/api/health`, `/api/zones`, `/api/risk`, `/api/predict`, `/api/reports`, and `/api/alerts` responsibilities.
- Data layer: CSV files under `data/`, metadata under `data/metadata/`, generated connected archive under `data/connected/`, model artifact under `data/models/`, and operational JSON stores under `data/runtime/`.
- State: shared React state in `App.tsx`, hydrated from Node API where available; mock data remains a degraded-mode fallback.
- Role/mode: citizen/authority mode switch with authority-only tab redirection. Current API authority protection is prototype-only and trusts a client-controlled header/query value.
- ML: trained Logistic Regression artifact generated from the 2020-2026 connected archive with chronological 70/15/15 splits. `/api/ml/predict` is the primary inference endpoint; the deterministic risk engine is an explicit fallback. No XGBoost or ConvLSTM runtime is present.

## Requirement Status

- Citizen/Authority separation: **PARTIALLY IMPLEMENTED**. Navigation and rendering are separated; API authorization is not production-grade.
- Citizen safety dashboard: **PARTIALLY IMPLEMENTED**. Safety page, risk translation, emergency banner, weather, and SOS exist; weather values still originate from a hardcoded simulation route.
- Authority command center: **PARTIALLY IMPLEMENTED**. Existing dashboards and technical pages are preserved; some architecture/benchmark cards remain static.
- Trained ML inference: **IMPLEMENTED**. Logistic Regression is trained, persisted, loaded, evaluated, and used by `/api/ml/predict`.
- Fallback inference: **IMPLEMENTED**. Fallback is explicitly labeled and reports the fallback reason.
- Model registry/metrics: **PARTIALLY IMPLEMENTED**. `/api/models` uses the artifact; the older architecture screen still contains static benchmark cards.
- Data quality/provider adapters: **PARTIALLY IMPLEMENTED**. Source labels are truthful, but a formal provider interface and freshness calculations are incomplete.
- Controlled simulation: **PARTIALLY IMPLEMENTED**. Representative historical data and deterministic inference exist; named scenario controls are not yet unified through one scenario API.
- Alert lifecycle: **PARTIALLY IMPLEMENTED**. Create/update/publish/withdraw APIs exist; audit history is still partly frontend-local and lifecycle states are not fully persisted.
- Backend notifications: **IMPLEMENTED** for the prototype persistence layer. Publish creates notifications; read/read-all/clear APIs persist to JSON.
- Citizen reports: **PARTIALLY IMPLEMENTED**. Reports are accepted and authority-visible in the Node process, but report persistence and incident linking need completion.
- SOS/incidents: **PARTIALLY IMPLEMENTED**. SOS creates a persisted internal incident with status `NEW`; authority incident UI and full status workflow need completion.
- Shelter consistency: **IMPLEMENTED** at the API boundary: available slots are calculated from bounded capacity/occupancy.
- Image detection: **PARTIALLY IMPLEMENTED**. A transparent deterministic heuristic exists; no trained CV model is available.
- Weather provider: **MISSING** as a real provider abstraction. Current Node weather endpoint is simulated/hardcoded and should be refactored behind a provider contract.
- Map/inundation integration: **PARTIALLY IMPLEMENTED**. Existing map and zone rendering work, but prediction output is not yet the single source for all map layers.
- Security: **PARTIALLY IMPLEMENTED**. Input validation and authority checks exist, but `x-role`/query role are client-controlled prototype authorization.
- Testing: **PARTIALLY IMPLEMENTED**. Build and API smoke tests exist; automated unit/integration/end-to-end tests are missing.

## Implementation Phases

1. Full audit and this plan.
2. Normalize Node API contracts and mark FastAPI as an unused reference until migration/removal is safe.
3. Harden and document the Logistic Regression training/inference artifact path.
4. Add normalized provider interfaces, data quality/freshness, and controlled named scenarios.
5. Add prediction trace records and actual explanation output from model features/fallback factors.
6. Complete backend alert lifecycle, audit persistence, and notification delivery.
7. Persist citizen reports, link reports to incidents/zones, and complete SOS incident statuses.
8. Connect prediction outputs to map, inundation, shelter, evacuation, and infrastructure calculations.
9. Enforce citizen/authority mode boundaries consistently in frontend and API contracts.
10. Replace client-controlled role checks with a clearly documented prototype auth boundary and prepare JWT/RBAC integration points.
11. Hydrate frontend pages from API with loading/error/degraded states and remove static benchmark claims.
12. Add automated build, API, lifecycle, and model inference tests plus a repeatable SIH demo script.
13. Run a final anti-fabrication scan and update this plan with verified limitations.

## Files Already Changed in This Pass

- `server.ts`
- `backend/ml/train.py`
- `src/App.tsx`
- `src/services/api.ts`
- `src/pages/CitizenSafetyPage.tsx`
- `src/components/DemoModeBanner.tsx`
- `src/pages/DashboardPage.tsx`
- `src/pages/DataFusionPage.tsx`
- `src/pages/AuthorityDataSourcesPage.tsx`
- `src/pages/AIPredictionPage.tsx`
- `src/pages/SettingsPage.tsx`
- `src/components/data/DataPipelineFlow.tsx`
- `src/components/Sidebar.tsx`
- `src/types/index.ts`

## Final Architecture Target

React/Vite frontend -> Node/Express API -> normalized simulation/provider layer -> trained Logistic Regression inference -> fallback risk engine -> prediction trace -> authority review -> persisted alert/notification/incident workflow -> citizen safety UI.

The FastAPI service remains a separate reference implementation until its routes are migrated or it is removed deliberately; it must not remain a competing active API.

## Verified Remediation Outcomes

- FastAPI duplicate routes are retired; `server.ts` is the only active API implementation.
- `/api/ml/predict` executes the persisted Logistic Regression artifact and reports `TRAINED_ML_MODEL` with version and held-out metrics.
- `/api/predict` supports six named simulation scenarios through the same inference pipeline.
- `/api/backend/health` reports `PROTOTYPE_HEADER_MODE` unless `AUTHORITY_API_TOKEN` is configured; query-string role escalation is removed.
- `/api/models` is backed by the actual artifact registry; the old fabricated benchmark matrix is no longer the source of model metadata.
- `/api/analytics` uses the connected archive and no longer emits an arbitrary population proxy.
- Published authority alerts create persisted backend notifications; read/read-all/clear operations are persisted.
- SOS creates persisted internal incidents and authority status updates support `RECEIVED`, `ACKNOWLEDGED`, `DISPATCHED`, and response lifecycle states.
- Citizen reports are persisted in `data/runtime/reports.json`.
- Final runtime lifecycle test passed: `EXTREME_RAIN -> TRAINED_ML_MODEL -> EMERGENCY -> Published -> unread notification -> SOS -> DISPATCHED incident`.
- Final `npm run build` and `npm run lint` passed.

## Remaining Limitations

- External IMD/CWC/NASA/ISRO/radar/satellite providers remain unavailable and are represented as simulation/reference inputs.
- Python is not installed in the current environment, so the standalone Python training script is not executable here; the Node artifact trainer is the active runtime companion.
- Prototype header authorization remains intentionally available when no `AUTHORITY_API_TOKEN` is configured. Set that environment variable for token-protected authority APIs.
- Full provider adapter interfaces, GIS prediction layer coupling, incident UI, and automated browser tests remain future hardening work.
