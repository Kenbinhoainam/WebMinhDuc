# Public/private boundaries

`Kenbinhoainam/WebMinhDuc` is public. Public-safe source, synthetic tests, sanitized SDD/QA summaries, decision IDs and release checksums belong here. Raw customer documents, commercial quotes, contracts, CVs, candidate contact data, credentials, private screenshots/traces and rights-restricted media need a separately approved private GitHub destination.

**BLOCKED_PRIVACY:** no new private repository name, owner or audience has been approved for this task. No restricted original was imported; no new repository or audience change was made. PO must approve exact repository name, members/roles, retention and what may be mirrored publicly. Do not use public GitHub Issues as a substitute for that decision.

Apply the same review to commits, PR bodies, comments, Actions logs/artifacts and exported spreadsheets. Audit tools must allowlist metadata, omit deployment payloads/actors/private Project items, and never request secret values. A private repository still needs least privilege, retention and revocation.

Historical public files/links remain in Git history. Their pre-existing presence is not a new rights certification. Review asset provenance in `docs/flagship/` before product release; do not duplicate or delete history to hide unresolved rights. Use synthetic QA data; redact before committing.
