# Release management

**PROPOSED.** No tags or GitHub Releases currently existed in the pre-task inventory. UI labels v14/v30 and Sites version 10 are historical labels, not SemVer promises. [Version inventory](../../VERSION-INVENTORY.md) is the sole maintained historical table.

For future approved source/product releases, use SemVer `vMAJOR.MINOR.PATCH`; a preview may use `v0.2.0-preview.1` once scope is agreed. Governance-only documents can retain their MDV2 document revisions without inventing a product release. Never retag an existing commit to make history look orderly.

A release requires reviewed source SHA/PR, lockfile/toolchain, tested artifact checksum, environment/revision, actual URL, QA scope, explicit PO approval evidence and rollback procedure. [Manifest schema](manifest.schema.json) and [template](manifest.template.json) separate these fields. A template with null values is not a release receipt.

## Procedure

1. Resolve approved source/branch and capture exact full SHA; complete associated Issues/SDD/AC review.
2. Build/test deterministically, compute artifact digest, retain approved sanitized evidence and restricted raw data in the correct repository.
3. Record manifest and review through a pushed PR. PO approves the exact manifest/source revision and release scope.
4. Authorized release owner creates annotated (signed where available) tag and GitHub Release pointing to that source. Attach manifest/checksum; publish only through approved CD/environment gate.
5. Verify actual serving URL, update deployment ID/observed hashes and release register through GitHub. Retain prior version and proven rollback artifact.

## Release register

| Record | State | Evidence |
|---|---|---|
| Existing Pages publish 19ac2b3 | Observed deployment; no new release/UAT approval | [Deployment audit](../../DEPLOYMENT-AUDIT.md) |
| Sprint 2 preview v10 | Separate review environment | [PR #3 handoff](https://github.com/Kenbinhoainam/WebMinhDuc/blob/1300df840190ac0ecffa32e576f0c809887e9c64/docs/sdd/SEL-2026.11.27-v1.0.0/execution/PREVIEW-RELEASE.md) |
| Future SemVer release | PROPOSED | No tag/Release created |
