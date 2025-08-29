# ADR-001: Adopt npm workspaces

## Status
Accepted

## Context
Initial scaffolding referenced pnpm, but project conventions and tooling expect npm workspaces.

## Decision
Use npm workspaces alongside Turbo to manage packages and scripts.

## Consequences
- Root package.json declares npm as the package manager and defines workspaces.
- Scripts now invoke npm instead of pnpm.
