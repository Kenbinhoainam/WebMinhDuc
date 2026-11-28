# Branch, tag and review protection plan

**PROPOSED / BLOCKED_PERMISSION.** All 11 pre-task branch records returned `protected:false`; repository rulesets returned `[]`. Detailed protection endpoints returned HTTP 403 `Resource not accessible by integration`. Repository profile reports admin/push for the user, which does not grant the connector administration scope. No protection/ruleset was enabled in this task.

[CODEOWNERS](../../.github/CODEOWNERS) names the verified repository owner `@Kenbinhoainam`; it is a file-level ownership proposal, not enforcement. A solo owner cannot approve their own PR to satisfy required reviews: appoint a real independent write-access reviewer before requiring one, or record a narrowly scoped audited owner bypass. Do not invent reviewer accounts/teams.

## Admin rollout

1. Confirm GitHub plan and account/connector administration permission. Export existing settings and bypass actors. Retain default `prototype`.
2. First protect `prototype` against force push and deletion; require PR and conversation resolution. Assess active branch publishing: even a docs merge may redeploy under current Pages settings. Obtain the release-impact decision before merging governance.
3. Run real CI successfully on representative PRs. Select check names **from GitHub's actual check list**. Candidate `Governance contracts` must be introduced and verified first; source and dependency checks are conditional/advisory until stable. Do not configure missing check names. An unknown/skipped check must not permanently block every PR.
4. Require appropriate independent review and CODEOWNERS only after valid reviewers are assigned. Restrict merges to approved maintainers. Use an expiring, audited emergency bypass if supported; never use routine AI credentials as bypass actors.
5. Protect existing `gh-pages` against force push/deletion, without declaring it active live. If publishing later uses a dedicated branch, restrict writes to the approved release mechanism and protect its source separately.
6. After release strategy approval, restrict creation/update/deletion of `v*` tags to release maintainers. Do not create retrospective tags for unverified version labels.
7. Test with a disposable PR and an unauthorized force-push dry run without modifying protected refs; retain evidence of UI/API state. Record enabled rule IDs, actor, date, check names and limitations in the handoff.

Do not blindly import a ruleset JSON across GitHub plans. If a control is unsupported, document the gap and compensating manual review rather than claiming it is enabled. No proposed required check in this document has been set as a repository requirement.
