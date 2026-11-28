"""Read configuration and names only. Never requests secret values or writes GitHub state."""
import datetime
import json
from pathlib import Path
import subprocess

REPO = "Kenbinhoainam/WebMinhDuc"
endpoints = [
    "pages", "pages/builds/latest", "environments", "deployments?per_page=100",
    "milestones?state=all&per_page=100", "labels?per_page=100",
    "actions/workflows?per_page=100", "actions/runners?per_page=100",
    "actions/secrets?per_page=100", "actions/permissions", "rulesets",
    "branches/prototype/protection", "branches/gh-pages/protection",
]
report = {"observed_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(), "repository": REPO, "endpoints": {}}
for endpoint in endpoints:
    command = ["gh", "api", "--paginate", "--slurp", "repos/" + REPO + "/" + endpoint]
    result = subprocess.run(command, text=True, capture_output=True)
    if result.returncode:
        report["endpoints"][endpoint] = {"status": "BLOCKED_PERMISSION", "error": result.stderr.strip()}
    else:
        report["endpoints"][endpoint] = {"status": "READ", "pages": json.loads(result.stdout)}
# Read-only discovery. No create operation is attempted when enumeration is unavailable.
query = 'query { user(login:"Kenbinhoainam") { projectsV2(first:100) { nodes { number title url closed } pageInfo { hasNextPage endCursor } } } }'
result = subprocess.run(["gh", "api", "graphql", "-f", "query=" + query], capture_output=True, text=True)
report["projects"] = {"status": "READ" if result.returncode == 0 else "BLOCKED_PERMISSION",
                      "response": json.loads(result.stdout) if result.stdout.strip() else None,
                      "error": result.stderr.strip() or None}
# Only authorized metadata above is stored; environment variable values are never queried.
Path("/tmp/mdv2-platform.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps(report, ensure_ascii=False, indent=2))
