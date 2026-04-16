# Debugging

## Errors in production / dev

Frontend errors land in **Sentry**.

- Org slug: `goodparty`
- URL: https://goodparty.sentry.io
- Region URL: https://us.sentry.io
- Wired via `instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`.

If you have the Sentry MCP server, prefer it over the web UI for fetching issues / replays into the agent's context.

## Backend errors and traces

Backend services (gp-api, election-api, people-api) log to **Grafana Cloud Loki**.

- URL: https://goodparty.grafana.net
- Loki datasource UID: `grafanacloud-logs`
- Tempo (traces) UID: `grafanacloud-traces`
- Prometheus UID: `grafanacloud-prom`

Quick LogQL filter:

```
{service_name="gp-api", deployment_environment_name="prod"}
```

`service_name` ∈ `gp-api | election-api | people-api`.
`deployment_environment_name` ∈ `dev | qa | prod`.

If you have the Grafana MCP server, use `query_loki_logs` instead of pasting LogQL into the UI.

## Reproducing a Sentry issue locally

1. Open the issue in Sentry, capture the **Session Replay** link if available.
2. From the replay, identify the route path and the user action that triggered the error.
3. Boot the app against the same environment's API:

   ```bash
   npm run dev          # local gp-api on :3000
   npm run dev-dev      # remote dev gp-api (faster — no local backend needed)
   ```

4. Sign in as the same user (or a test user with the same role/state), navigate to the route, and reproduce the action.
5. If the bug depends on a specific entity (poll, contact, organization), grab the id from the Sentry breadcrumb or replay network panel.

## Where to look

| Symptom                                  | First place to look                                          |
| ---------------------------------------- | ------------------------------------------------------------ | ----------------- |
| 4xx/5xx from gp-api                      | Loki: `{service_name="gp-api"}                               | = "<request id>"` |
| Frontend exception, no API in trace      | Sentry — check the breadcrumbs for the failing component     |
| Auth redirect loop                       | `middleware.ts`, `UserProvider`, `getServerToken()`          |
| Wrong organization context               | `goodparty-org-slug` cookie, `x-organization` request header |
| Image / map / Stripe widget broken local | `appEnv.ts` env-var fallbacks; check `.env.local`            |

## Common gotchas

- `npm run dev` requires gp-api on `:3000`. Use `npm run dev-dev` to point at remote dev API.
- Several env vars have hardcoded fallbacks in `appEnv.ts` — a missing var won't error, it'll silently hit dev API. Sanity-check the value being used.
