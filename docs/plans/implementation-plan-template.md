# [Area] [Feature] — Implementation Plan

> **How to use this template.** Copy to `docs/plans/active/<area>-<feature>-implementation-plan.md`, replace every `[placeholder]`, delete sections that do not apply, and keep the numbered spine intact so a fresh agent can execute without chat history. Derived from completed plans under `docs/plans/complete/` (goal → baseline → architecture → scope → contract → phased tasks → handoff → live progress log).

> **Cornerstone requirement.** Every new plan file must be derived from this template. Do not edit this template in place for a specific task. Source template copied from `C:\Code\aas-mvp-html\resources\documentation\80-plans\implementation-plan-template.md` and adapted for Cornerstone paths, lifecycle folders, and npm commands.

> **Agent preamble (read first).** This file is the authoritative plan for [one-sentence purpose]. Execute it top to bottom in one continuous run unless blocked. Before writing code, read the canonical docs and source files listed below. Preserve [behaviors that must not regress]. Update checklists and the Live Progress Log as you go. Do not infer durable truth from browser-only state, localStorage, optimistic UI, or stale dev-server bundles.

**Status:** Draft | Ready for execution | In progress | Complete (move to `docs/plans/complete/` when done)
**Last updated:** YYYY-MM-DD
**Owner / executor:** [agent or human]

Optional one-line abstracts (useful when scanning without reading the full body):

**Goal:** [one paragraph — what success looks like]
**Architecture:** [one paragraph — ownership, boundaries, source of truth]
**Tech Stack:** [frameworks, routes, test runners, persistence touched]

---

## 1. Goal

[What the user can do when this plan is done. Prefer a concrete success sentence:]

Success = [observable outcome: API/UI/test/smoke proof], while [constraints: preserve X, do not change Y].

---

## 2. Current codebase baseline

Record the tree as of plan authoring (re-verify at execution Phase 0):

- Branch: `[branch]`
- Commit: `[sha] [subject]`
- Worktree / repo path: `[path]`
- `git status` summary: clean | dirty (list unrelated work to preserve)

### 2.1 Read first

Canonical docs and skills:

- `docs/[...]`
- `[external theory / ADR / prior phase plan]`

Relevant source files (paths only; facts go in 2.2):

- `[path]` — [why it matters]

### 2.2 Confirmed current behavior

- [Fact verified against code, with file path]
- [Existing type/API/event already present]
- [Known gap or limitation this plan must close]

### 2.3 Baseline validation commands

```bash
# Adjust to the repo's real scripts
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Note pre-existing failures in the Live Progress Log before any code changes. Do not add new failures.

---

## 3. Architecture

- **Source of truth:** [server store / API / Hermes / client projection only]
- **Ownership:** [who writes durable state; who only reads/renders]
- **Boundaries:** [reuse existing modules; do not invent parallel stores/APIs]
- **Constraints:** [coding guidelines, semantic CSS, no new deps unless justified]
- **Hardlines / permanent guardrails:** [never do X; never lie about Y; never block Z]

Optional sequence diagram or mermaid when the flow is non-obvious:

```text
User action
-> [gate / policy]
-> [durable mutation]
-> [events / telemetry]
-> [UI projection]
```

---

## 4. Tech stack

- [Framework / language / router]
- [Persistence: JSONL, DB, etc.]
- [Test runner and package scripts]
- [External runtime: Hermes, WSL, bridge ports — only if required]
- No new runtime dependency unless justified in the Live Progress Log

---

## 5. Scope

### In scope

- [Deliverable]
- [Tests / docs / smoke]

### Explicit non-goals

- [Deferred follow-up]
- [Adjacent system not touched]
- [UX redesign / schema migration / etc.]

### Permanent guardrails (optional; use for multi-phase pivots)

- [Never automatic activation / never delete classifier / never block streaming / …]

---

## 6. Data / API / UI contract

Define the contracts the phases must implement. Prefer typed shapes and acceptance examples over prose alone.

### 6.1 Data / types

```ts
// Minimum shapes the implementation must satisfy
export type ExampleStatus = "queued" | "running" | "completed" | "failed"

export interface ExampleRecord {
  id: string
  // ...
}
```

### 6.2 API / events

- `GET/POST [route]` — [request/response summary]
- Events: `[event.name]` emitted when [condition]

### 6.3 UI / behavior

- [What the user sees]
- [Degraded behavior when upstream is unavailable]
- [What must not appear in the transcript / must not block send]

### 6.4 Acceptance examples (optional but high value)

```text
Given: [...]
When:  [...]
Then:  [...]
```

---

## 7. Phases

Rules for every phase:

1. Prefer **tests first** when adding behavior (failing test → implement → green).
2. Each task names **file paths** and concrete operations.
3. End every phase with a **Verification** line (commands + expected outcome).
4. Mark tasks `[x]` only when verification passes; if blocked, log it and stop that phase honestly.
5. Phase 0 is preflight only — no feature code until baseline is recorded.

### Phase 0 — Preflight and baseline

- [ ] 0.1 Run `git status --short --branch --untracked-files=all` and record dirty/unrelated work.
- [ ] 0.2 Read the docs and source files listed in §2.
- [ ] 0.3 Run baseline validation commands; record results (including pre-existing failures) in the Live Progress Log.
- [ ] 0.4 Confirm any external capability assumptions (ports, endpoints, feature flags) before depending on them.

**Verification:** baseline recorded; no feature code yet.

### Phase 1 — [Name: usually types/store or failing tests]

- [ ] 1.1 [Create/extend `path` with …]
- [ ] 1.2 [Add tests in `path.test.ts` covering …]
- [ ] 1.3 […]

**Verification:** `[command]` passes / fails-for-expected-reason before implement.

### Phase 2 — [Name]

- [ ] 2.1 […]
- [ ] 2.2 […]

**Verification:** `[command]`

### Phase N-1 — Documentation and current-state updates

- [ ] Update stable feature docs under `docs/` (actual shipped behavior, not aspirational).
- [ ] Update `docs/08-status.md` if this plan affects multi-area status.
- [ ] Add or update a smoke runbook if live proof is required.

**Verification:** docs match code; known limitations stated honestly.

### Phase N — Full validation, cleanup, and closeout

- [ ] Run full relevant test suites, lint, typecheck, and build.
- [ ] Manual / live smoke checklist (if required by §6 or §8).
- [ ] Record final metrics / proof in the Live Progress Log.
- [ ] Move this plan to `docs/plans/completed/` when fully done and update the relevant closeout/status documentation. Move superseded or cancelled plans to `docs/plans/archived/`.

**Verification:** all gates green; no overclaim of unproven live behavior.

---

## 8. Handoff notes

- **Related docs:** `[paths]`
- **Open questions:** [resolved vs still open — mark which]
- **Known pre-existing issues:** [do not chase unless in scope]
- **Follow-ups (out of scope):** [next plan candidates]
- **Must-not-overclaim:** [e.g. do not claim live Hermes proof if only HTTP mocked]

### Suggested worker / kickoff prompt (optional)

```text
Execute docs/plans/active/<this-plan>.md top to bottom.
Read the preamble docs first. Update the Live Progress Log after each phase.
Do not expand scope. Stop and report if a hardline or baseline gate fails.
```

### Suggested commit sequence (optional)

1. Tests / types only
2. Core implementation
3. Wire-up + UI
4. Docs / closeout

Do not commit unless the user explicitly asks.

---

## 9. Success criteria / completion checklist

- [ ] In-scope behavior works as specified in §1 and §6
- [ ] Explicit non-goals in §5 remain untouched
- [ ] Focused and suite tests pass; no new lint/type/build failures
- [ ] Live smoke completed **or** honest blocker recorded (never silent skip)
- [ ] Docs updated to shipped reality
- [ ] Live Progress Log shows 100% overall (or accurate partial % with blocker)

---

## 10. Live Progress Log

> **Executor instructions:** Update this table immediately after finishing (or being blocked on) each phase — do not batch updates. `Completion %` is an honest estimate; `Notes` is one line (blockers, deviations, pre-existing failures); `Last Updated` is an ISO timestamp. Add rows for unplanned work as needed.

| Phase | Title | Completion % | Notes | Last Updated |
| --- | --- | --- | --- | --- |
| 0 | Preflight and baseline | 0% | | |
| 1 | [Title] | 0% | | |
| 2 | [Title] | 0% | | |
| N-1 | Documentation | 0% | | |
| N | Full validation and closeout | 0% | | |
| — | **Overall** | **0%** | | |

---

## Variant notes (delete from real plans)

Use this full template for **implementation plans**. Slimmer variants seen in archive:

| Variant | When to use | Keep | Drop / replace |
| --- | --- | --- | --- |
| **Implementation plan** (this file) | Build / fix / migrate work | §§1–10 | — |
| **Readiness / alignment review** | Pre-implementation audit | Purpose, verdict, surfaces verified, drift, required plan shape | Phases of feature work |
| **Investigation plan** | Measure / diagnose only | Goal, baseline, measurement harness, report template | Feature delivery phases |
| **Workboard / worker handoff** | Multi-agent execution companion | Lanes, operating rules, live log | Full architecture prose (link the parent plan) |
| **Phased completion / closeout plan** | Finish an existing system | Gap register, gate packets, evidence requirements | Greenfield contracts already shipped |

Naming: `<area>-<feature>-implementation-plan.md` under `docs/plans/active/`. Large efforts may use a package folder with `README.md` naming the authority file.
