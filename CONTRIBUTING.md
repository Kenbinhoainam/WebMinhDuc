# Contributing

Read [AGENTS.md](AGENTS.md) and [Docs Hub](docs/README.md). Every intentional code/document/test/config/QA change must be committed and pushed to an authorized GitHub repository before handoff. Never upload private customer data here.

## Branches and delivery

Keep `prototype` as current default. Use `feat/<issue>-<short-name>`, `fix/`, `docs/`, `test/` or `chore/` with the same suffix pattern. `release/<version>` needs approved release strategy. Existing branch names remain unchanged.

Fetch and verify the intended base SHA; read Issue/spec; create a branch/worktree; assign files; change/test/review; commit; push; verify remote; open/update PR; update Issue. Use parent/sub-issues for large epics, milestones for genuine agreed delivery dates. Do not invent deadlines.

```sh
git fetch origin --tags
git status --short
git rev-parse origin/prototype
git switch -c docs/8-example origin/prototype
# Make scoped changes and run the appropriate checks.
git diff --check
git diff --stat
git add <explicit-paths>
git commit -m 'docs: describe the change (#8)'
git push -u origin HEAD
git rev-parse HEAD
git ls-remote origin refs/heads/docs/8-example
```

Use the actual issue/branch in place of the example. Verify the two SHAs match. API commits are valid if they preserve the verified parent tree and update only the authorized work ref. No force push, branch deletion or shared-history rewrite.

## Review and acceptance

Fill [PR template](.github/pull_request_template.md) with real commands/results, regression scope, security/privacy, source/deploy mapping and open decisions. CODEOWNERS requests do not enforce review without protection. [Done gate](docs/governance/project-control-center.md) requires evidence and human review; a Draft PR is not Done.

[CI guide](docs/operations/ci-and-qa.md) distinguishes source tests, browser tests and live HTTP checks. Never run `pages:prepare` as routine docs QA. No merge, release tag, production publish, Pages-source migration or audience change under this task's authority.

If push fails: BLOCKED_GITHUB_PUSH. If data is not cleared for public: BLOCKED_PRIVACY. Disclose NOT_TESTED checks and next owner; preserve other agents' work.
