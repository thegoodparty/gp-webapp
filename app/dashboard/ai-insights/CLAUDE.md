# AI Insights Dashboard

Dashboard page for AI-powered experiment reports. Users generate reports (voter targeting, walking plans, district intel, peer city benchmarking) and view results with rich visualizations.

## How It Works

```
page.tsx (server) → fetches initial runs via GET /mine
    ↓
AIInsightsPage.tsx (client) → picks WIN_TABS or SERVE_TABS based on feature flag + elected office
    ↓
ExperimentTab.tsx → manages lifecycle: no-run → generate → poll → results/error/stale
    ↓
*Results.tsx → fetches artifact via GET /artifact/:runId, renders data
```

### User Flow

1. **Page load**: Server fetches all experiment runs for the user's campaign
2. **Tab selection**: Page shows tabs based on mode — win users see Voter Targeting + Walking Plan, serve users see District Intel + Peer City Benchmarking
3. **Generate**: User clicks "Generate Report" → POST to `/v1/agent-experiments/request`
4. **Polling**: ExperimentTab polls `/v1/agent-experiments/mine` every 5 seconds while PENDING/RUNNING
5. **Results**: On SUCCESS, the experiment-specific Results component fetches the artifact from S3 via the API and renders it
6. **Regenerate**: User can click "Regenerate" to create a fresh run

### Status Handling (ExperimentTab.tsx)

| Status | UI Shown |
|--------|----------|
| (no run) | Dashed border box with "Generate Report" button |
| PENDING / RUNNING | Blue spinner: "Generating your report... 2-5 minutes" |
| SUCCESS | Results component + metadata (date, duration) + "Regenerate" button |
| FAILED / CONTRACT_VIOLATION | Red error alert with message + "Try Again" button |
| STALE | Amber message: "District Intel was updated. Regenerate to get fresh comparisons." + "Regenerate Report" button |

### Win vs Serve Mode

Determined by: `win-serve-split` feature flag + `organization.electedOfficeId`

| Mode | Tabs | Source |
|------|------|--------|
| Win (candidates) | Voter Targeting, Walking Plan | `WIN_TABS` in AIInsightsPage |
| Serve (officials) | District Intel, Peer City Benchmarking | `SERVE_TABS` in AIInsightsPage |

## Files

| File | Purpose |
|------|---------|
| `page.tsx` | Server component: fetches initial runs + campaign, renders AIInsightsPage |
| `types.ts` | `ExperimentId` union, `ExperimentStatus`, `ExperimentRun` interface, per-experiment artifact interfaces |
| `components/AIInsightsPage.tsx` | Tab definitions (WIN_TABS, SERVE_TABS), tab navigation, feature flag check |
| `components/ExperimentTab.tsx` | Lifecycle controller: generate, poll, render results/error/stale for any experiment |
| `components/VoterTargetingResults.tsx` | Renders voter segments, demographics, geographic clusters |
| `components/WalkingPlanResults.tsx` | Renders canvassing areas, door counts, route maps |
| `components/DistrictIntelResults.tsx` | Renders issues with citations, demographic snapshot, affected segments |
| `components/PeerCityBenchmarkingResults.tsx` | Renders peer city cards, issue comparisons, budget/timeline/outcome, takeaways |

## API Integration

All API calls use the legacy `clientFetch` system with routes from `gpApi/routes.ts`:

| Route Key | Method | Path | Purpose |
|-----------|--------|------|---------|
| `agentExperiments.mine` | GET | `/v1/agent-experiments/mine` | List user's runs (for polling) |
| `agentExperiments.request` | POST | `/v1/agent-experiments/request` | Dispatch new experiment |
| `agentExperiments.artifact` | GET | `/v1/agent-experiments/:runId/artifact` | Fetch artifact JSON |

## Adding a New Experiment

1. **`types.ts`**: Add to `ExperimentId` union, create `YourArtifact` interface matching the contract schema from gp-ai-projects
2. **`components/AIInsightsPage.tsx`**: Add entry to `WIN_TABS` or `SERVE_TABS` with `{ id, label, description }`
3. **Create `components/YourResults.tsx`**: Use the `useArtifact` hook + shared components:
   ```tsx
   const { artifact, loading, error, retry } = useArtifact<YourArtifact>(runId)
   // Handle loading → <Loader2 />
   // Handle error → <ArtifactError error={error} onRetry={retry} />
   // Handle success → render artifact data using <Stat />, <Card />, etc.
   ```
4. **`components/ExperimentTab.tsx`**: Add rendering case: `{experimentId === 'your_id' && <YourResults runId={run.runId} />}`
5. **Add tests**: Create `YourResults.test.tsx` covering loading, error+retry, and success states

## Results Component Pattern

All Results components use the shared `useArtifact<T>` hook from `hooks/useArtifact.ts`:

```tsx
const { artifact, loading, error, retry } = useArtifact<YourArtifact>(runId)
```

This handles fetching, loading state, error state, and retry. Shared UI components:
- `<Stat label="..." value={...} />` — label/value pair
- `<ArtifactError error={error} onRetry={retry} />` — error display with retry button

## UI Components Used

- `Card`, `CardHeader`, `CardTitle`, `CardContent` from `@styleguide`
- `Button` with variants `default` / `outline` and sizes `medium` / `small`
- `Loader2`, `AlertCircle`, `ChevronDown`, `ChevronRight` from `lucide-react`
