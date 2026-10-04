# Loculary — Autonomous Feature Workers

This directory contains the reusable contracts for autonomous workers that deliver substantial Loculary product features.

A Feature Worker is the implementation counterpart to the audit system for a product capability: it inspects the current state, challenges the proposed feature, designs and implements the validated scope, verifies it, and delivers a focused PR.

## Files

- `FEATURE-FACTORY-CONTRACT.md` — canonical operating contract.
- `FEATURE-WORKER.md` — reusable prompt for one ChatGPT conversation.
- `FEATURE-ORCHESTRATOR.md` — optional prompt for coordinating feature work across conversations.

## Typical use

Start a dedicated ChatGPT conversation with the contents of `FEATURE-WORKER.md`, then say:

- `implement the accounts feature`
- `continue`
- `continue accounts`
- `implement another feature`

The worker must inspect the real repository and GitHub state before acting. It must not assume that a feature mentioned in a prompt is already approved product scope.

## Scope

Feature Workers are intended for substantial product capabilities such as:

- accounts and authentication;
- preferences;
- favorites/history;
- collections;
- search and discovery;
- sharing;
- installability/PWA;
- community capabilities;
- other durable product features.

They are not a replacement for the broad audit missions. An audit can identify and challenge a problem; a Feature Worker can then implement an explicitly validated capability.
