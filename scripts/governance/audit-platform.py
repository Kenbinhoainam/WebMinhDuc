"""Read-only configuration inventory with explicit public-safe output fields."""
import datetime
import json
from pathlib import Path
import re
import subprocess

REPO = "Kenbinhoainam/WebMinhDuc"
ENDPOINTS = ["pages", "pages/builds/latest", "environments", "deployments?per_page=100",
             "milestones?state=all&per_page=100", "labels?per_page=100",
             "actions/workflows?per_page=100", "actions/runners?per_page=100",
             "actions/secrets?per_page=100", "actions/permissions", "rulesets",
             "branches/prototype/protection", "branches/gh-pages/protection"]
def take(row, fields):
    return {k: row[k] for k in fields if k in row}
def sanitize(endpoint, page):
    if endpoint == "pages":
        return take(page, ["status", "cname", "html_url", "build_type", "source", "https_enforced", "public"])
    if endpoint == "pages/builds/latest":
        return take(page, ["status", "commit", "duration", "created_at", "updated_at"])
    if endpoint == "environments":
        return {"total_count": page.get("total_count"), "environments": [
            {"name": e.get("name"), "protection_rule_types": [r.get("type") for r in e.get("protection_rules", [])],
             "deployment_branch_policy": e.get("deployment_branch_policy")} for e in page.get("environments", [])]}
    if endpoint.startswith("deployments"):
        # payload, descriptions, actor identity and external URLs intentionally omitted.
        return [take(d, ["id", "sha", "ref", "environment", "created_at", "updated_at", "production_environment", "transient_environment"]) for d in page]
    if endpoint.startswith("milestones"):
        return [take(m, ["number", "state", "due_on", "open_issues", "closed_issues"]) for m in page]
    if endpoint.startswith("labels"):
        return [take(m, ["name", "color"]) for m in page]
    if endpoint.startswith("actions/workflows"):
        return {"total_count": page.get("total_count"), "workflows": [take(w, ["id", "name", "path", "state"]) for w in page.get("workflows", [])]}
    if endpoint.startswith("actions/runners"):
        return {"total_count": page.get("total_count"), "runners": [take(r, ["id", "os", "status", "busy"]) for r in page.get("runners", [])]}
    if endpoint.startswith("actions/secrets"):
        # Names can themselves contain sensitive business details; publish count/timestamps only.
        return {"total_count": page.get("total_count"), "updated_at": [s.get("updated_at") for s in page.get("secrets", [])]}
    if endpoint == "actions/permissions":
        return take(page, ["enabled", "allowed_actions", "sha_pinning_required"])
    if endpoint == "rulesets":
        return [take(r, ["id", "name", "target", "enforcement"]) for r in page]
    if endpoint.endswith("/protection"):
        return {"required_status_checks": (page.get("required_status_checks") or {}).get("contexts", []),
                "required_approving_review_count": (page.get("required_pull_request_reviews") or {}).get("required_approving_review_count"),
                "require_code_owner_reviews": (page.get("required_pull_request_reviews") or {}).get("require_code_owner_reviews"),
                "allow_force_pushes": page.get("allow_force_pushes"),
                "allow_deletions": page.get("allow_deletions"),
                "required_conversation_resolution": page.get("required_conversation_resolution")}
    raise ValueError("Unreviewed endpoint")
def failure(result):
    match = re.search(r"HTTP (\d{3})", result.stderr)
    code = int(match.group(1)) if match else None
    return {"status": "BLOCKED_PERMISSION" if code in (401, 403) else "READ_FAILED",
            "http_status": code, "exit_code": result.returncode}
report = {"observed_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(), "repository": REPO, "endpoints": {}}
for endpoint in ENDPOINTS:
    result = subprocess.run(["gh", "api", "--paginate", "--slurp", "repos/" + REPO + "/" + endpoint], text=True, capture_output=True)
    report["endpoints"][endpoint] = failure(result) if result.returncode else {
        "status": "READ", "pages": [sanitize(endpoint, p) for p in json.loads(result.stdout)]}
query = 'query { user(login:"Kenbinhoainam") { projectsV2(first:100) { nodes { number title url public closed } pageInfo { hasNextPage } } } }'
result = subprocess.run(["gh", "api", "graphql", "-f", "query=" + query], capture_output=True, text=True)
if result.returncode:
    report["projects"] = failure(result)
else:
    data = json.loads(result.stdout)
    if data.get("errors"):
        report["projects"] = {"status": "READ_FAILED"}
    else:
        projects = data["data"]["user"]["projectsV2"]
        matches = [p for p in projects["nodes"] if p["title"] in ("master", "MinhDucWeb — Master Control")]
        report["projects"] = {"status": "TOKEN_VISIBLE_ONLY", "matching_control_project_count": len(matches),
                              "has_next_page": projects["pageInfo"]["hasNextPage"],
                              "public_control_project_urls": [p["url"] for p in matches if p["public"]],
                              "limitation": "An empty token-visible list does not establish absence. Never create before owner-authorized enumeration."}
Path("/tmp/mdv2-platform.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps(report, ensure_ascii=False, indent=2))
