"""Validate managed governance documents and forms; no external services required."""
import json
from pathlib import Path
import re
import urllib.parse

ROOT = Path(__file__).resolve().parents[2]
managed = json.loads((ROOT / "docs/governance/managed-files.json").read_text())
errors = []
for rel in managed:
    path = ROOT / rel
    if not path.is_file():
        errors.append("Missing managed file: " + rel)
        continue
    text = path.read_text()
    if re.search(r"^(<<<<<<< |=======\s*$|>>>>>>> )", text, re.M):
        errors.append("Conflict marker: " + rel)
    if path.suffix == ".json":
        json.loads(text)
    if path.suffix == ".md":
        fence = chr(96) * 3
        stripped = re.sub("(?ms)^" + fence + ".*?^" + fence + r"\s*$", "", text)
        for target in re.findall(r"\[[^\]\n]+\]\(([^)\n]+)\)", stripped):
            target = target.strip("<>")
            parsed = urllib.parse.urlsplit(target)
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            resolved = (path.parent / urllib.parse.unquote(parsed.path)).resolve()
            if not resolved.is_relative_to(ROOT) or not resolved.exists():
                errors.append(rel + ": broken local link " + target)
rule = "EVERY INTENTIONAL CODE OR DOCUMENT CHANGE MUST BE COMMITTED AND PUSHED TO AN AUTHORIZED GITHUB REPOSITORY."
shared = (ROOT / "AGENTS.md").read_text()
for required in [rule, "BLOCKED_GITHUB_PUSH", "BLOCKED_PRIVACY"]:
    if required not in shared:
        errors.append("AGENTS.md: missing " + required)
for provider in ["GEMINI.md", "CLAUDE.md", "OPENCODE.md"]:
    content = (ROOT / provider).read_text()
    for target in ("AGENTS.md", "docs/ai/multi-agent-protocol.md"):
        if f"]({target})" not in content:
            errors.append(provider + ": missing shared entrypoint " + target)
forms = sorted((ROOT / ".github/ISSUE_TEMPLATE").glob("*.yml"))
issue_forms = [p for p in forms if p.name != "config.yml"]
required_ids = {"goal", "authority", "scope", "inputs", "acceptance", "tests", "dependencies", "done", "handoff"}
labels = {r["name"] for r in json.loads((ROOT / ".github/labels.json").read_text())}
if len(issue_forms) != 8:
    errors.append("Expected exactly eight typed issue forms")
for form in issue_forms:
    data = json.loads(form.read_text())
    ids = [r["id"] for r in data["body"] if "id" in r]
    if len(ids) != len(set(ids)) or not required_ids.issubset(ids):
        errors.append(form.name + ": missing/duplicate form ID")
    if not set(data["labels"]).issubset(labels):
        errors.append(form.name + ": label missing from specification")
master = (ROOT / "docs/requirements/master-requirements.md").read_text()
if "v0.1.0-DRAFT" not in master or "NOT APPROVED PRODUCTION BASELINE" not in master:
    errors.append("Master requirements draft boundary lost")
print(json.dumps({"managed_files": len(managed), "issue_forms": len(issue_forms),
                  "checks": ["local link targets (not anchors/external URLs)", "JSON/form structure",
                             "provider entrypoints and shared policy", "draft requirement boundary"],
                  "errors": errors}, ensure_ascii=False, indent=2))
raise SystemExit(1 if errors else 0)
