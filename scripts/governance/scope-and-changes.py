"""Check this governance branch preserves source/artifacts; select economical CI jobs."""
import json
import os
from pathlib import Path
import re
import subprocess

BASELINE = "19ac2b365f2264399fde4312639127b8de80736f"
def changed(base, head="HEAD"):
    return subprocess.check_output(["git", "diff", "--name-only", base, head], text=True).splitlines()
branch = os.environ.get("WORK_BRANCH", "")
if branch == "chore/8-github-control-center":
    allowed_roots = {"AGENTS.md", "GEMINI.md", "CLAUDE.md", "OPENCODE.md", "CONTRIBUTING.md",
                     "CHANGELOG.md", "README.md", "GITHUB-AUDIT.md", "DEPLOYMENT-AUDIT.md",
                     "VERSION-INVENTORY.md", "RISKS-AND-DEPENDENCIES.md"}
    unexpected = [p for p in changed(BASELINE) if p not in allowed_roots and
                  not p.startswith((".github/", "docs/", "scripts/governance/"))]
    if unexpected:
        raise SystemExit("Unexpected source/published artifact changes: " + repr(unexpected))
event = json.loads(Path(os.environ["GITHUB_EVENT_PATH"]).read_text())
base = event.get("before") or (event.get("pull_request") or {}).get("base", {}).get("sha") or BASELINE
if not re.fullmatch(r"[0-9a-f]{40}", base) or base == "0" * 40:
    base = BASELINE
paths = changed(base)
source = any(p.startswith(("src/", "tests/", "public/")) or
             (p.startswith("scripts/") and not p.startswith("scripts/governance/")) or
             p in {"package.json", "package-lock.json", "tsconfig.json", "vite.config.ts", ".github/workflows/governance-ci.yml"}
             for p in paths)
# This operational smoke audits the preserved artifact, never a PR's proposed production deploy.
artifact = any(p.startswith(("assets/", "mirror/", "optimized/")) or
               (p.endswith(".html") and not p.startswith("docs/")) or
               p in {".pages-output.json", "robots.txt", "sitemap.xml", ".nojekyll"}
               for p in paths)
browser = source or artifact or "scripts/governance/browser-smoke.py" in paths
with open(os.environ["GITHUB_OUTPUT"], "a") as output:
    output.write("source=" + str(source).lower() + "\n")
    output.write("browser=" + str(browser).lower() + "\n")
print(json.dumps({"changed_paths": len(paths), "source_checks_needed": source, "browser_smoke_needed": browser, "artifact_changed": artifact,
                  "governance_preservation_check": branch == "chore/8-github-control-center"}))
