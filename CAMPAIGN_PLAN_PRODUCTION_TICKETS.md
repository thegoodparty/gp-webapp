# Campaign Plan Production Tickets

This backlog covers the "productionization" of the Campaign Plan feature in the webapp, focusing on wiring the UI to actual data, API integration, and telemetry. These tickets follow the UI scaffolding work in `@styleguide`.

## 📦 Repo: `@gp-webapp`

Goal: Connect the Campaign Plan UI to real data, enable plan generation, and ensure full telemetry and integrations.

### [webapp] API Integration: Plan & Tasks
- **Scope:** Ensure API endpoints support the full campaign plan requirements.
- **Tasks:**
  - Verify `GET /campaigns/mine/plan-version` returns the full structured JSON (Overview, Landscape, Timeline, Budget, etc.) matching the "What is Included" spec.
  - Update or verify `PUT /campaigns/tasks/complete/:taskId` supports toggling status (complete/incomplete) or add a `DELETE` (reset) endpoint to support "mark as not started".
  - **New Endpoint/Trigger:** Define how plan generation is triggered.
    - *Requirement:* "Automatically generate when I complete onboarding" & "generate... on my next dashboard load".
    - Implement a check in `DashboardPage` (or backend middleware) to trigger generation if missing.
- **Deliverable:** Verified API contract and updated `gpApi/routes.ts` if needed.

### [webapp] Dashboard: Plan Generation & Error Handling
- **Scope:** Handle the asynchronous generation of the plan and display appropriate states.
- **Tasks:**
  - Implement polling or websocket (if available) to check for plan generation completion (Requirement: "95% ... within 6 seconds").
  - **Loading State:** Show a skeleton or "Generating your plan..." state on the dashboard while waiting.
  - **Error State:** Handle failure (Requirement: "Retry 3 times", then "error message explaining failure").
    - Use `TasksList` or a new wrapper to display the empty/error state if no plan is available.
- **Dependencies:** [webapp] API Integration.

### [webapp] Weekly Task Navigator (Logic)
- **Scope:** Implement the logic for the Weekly Navigator component.
- **Tasks:**
  - State management for `currentWeek` (default to `new Date()`).
  - Implement `handlePreviousWeek` and `handleNextWeek` logic using `date-fns` (add/subtract 7 days).
  - "View full plan" action (opens the Modal).
  - Calculate "Today" label visibility.
  - Fetch tasks relevant to the selected week (filter locally or API query params? *Assumption: API returns all or range, frontend filters for speed if list is small, else API param*).
- **Dependencies:** [styleguide] ResponsiveDialog System.

### [webapp] Task List Data Wiring
- **Scope:** Connect `TasksList` and `TaskItem` to the real data.
- **Tasks:**
  - Fetch tasks using `campaign.tasks.list` (ensure it supports date filtering or returns all for client filtering).
  - Map API response to `TaskItem` props:
    - `title`, `description`, `date`, `type`.
    - `status` (mapped from API completion status).
  - Wire `onCheck` to `completeTask` (and new "uncomplete" logic).
  - **Optimistic UI:** Update local state immediately on check/uncheck, revert on error.
  - Handle `type` specific rendering (Event, Text, Robocall labels).

### [webapp] Full Plan Viewer Modal
- **Scope:** Render the read-only full plan view.
- **Tasks:**
  - Fetch full plan via `campaign.planVersion`.
  - Render sections inside `ResponsiveDialog`:
    - **Overview:** Strategic Landscape (Opportunities, Challenges, Metrics).
    - **Timeline:** Grouped by week/month.
    - **Budget:** Recommended Total Budget.
    - **Community:** Know Your Community (Events, Media).
    - **Voter Contact Plan:** Tactic, Purpose, Format.
  - Use prose/typography components for readable text.
- **Dependencies:** [styleguide] ResponsiveDialog System.

### [webapp] Amplitude Telemetry
- **Scope:** Implement event tracking for Campaign Plan features.
- **Tasks:**
  - **Events & Event Properties:**
    - `Dashboard - Campaign Plan Viewed` (on load/navigate).
      - Property `campaignWeekViewed` (integer): `0` (current), negative (past), positive (future).
    - `Dashboard - Full Campaign Plan Viewed` (on PDF/Modal open).
    - `Dashboard - Task Status Changed` (on check/uncheck).
      - Property `status`: `not_started`, `complete`.
    - `Dashboard - Task Clicked` (on interaction).
      - Property `medium`: `sms`, `robocall`, `event`.
  - **User Properties:**
    - `campaignPlanGeneratedDate`: Timestamp of first generation (likely set on backend or upon first load).
    - `campaignPlanTaskCount`: Total tasks in plan (update on generation/load).
    - `campaignPlanCompletionRate`: % complete (update on status change).
- **Reference:** `app/shared/AmplitudeInit.tsx` and `helpers/analyticsHelper`.

### [webapp] HubSpot & Feature Flags
- **Scope:** Enable feature flagging and verify HubSpot signals.
- **Tasks:**
  - **Feature Flag:** Wrap the new Dashboard components in a Feature Flag (using `FeatureFlagsProvider`).
    - Only show new Plan UI if flag is enabled for user/candidate.
  - **HubSpot:** Verify `TaskItem` actions (Text/Robocall) trigger the correct flows/modals.
    - Ensure completion of these flows updates the task status (may need "refetch" or context update after modal close).
    - Verify/Add logic to support the "3-day reminder" requirement (likely backend, but ensure frontend data usage supports it—e.g. `dueDate` is correctly stored).

