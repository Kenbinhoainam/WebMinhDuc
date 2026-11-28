"""Idempotent additive label setup; run only from an authorized trusted work branch."""
import json
from pathlib import Path
import subprocess

REPO = "Kenbinhoainam/WebMinhDuc"
def gh(*args, payload=None):
    result = subprocess.run(["gh", "api", *args], input=json.dumps(payload) if payload is not None else None,
                            capture_output=True, text=True)
    if result.returncode:
        raise RuntimeError("GitHub label operation failed: " + result.stderr.strip())
    return json.loads(result.stdout)
expected = json.loads(Path(".github/labels.json").read_text())
existing = {r["name"].casefold() for page in gh("--paginate", "--slurp", "repos/" + REPO + "/labels?per_page=100") for r in page}
created = []
for label in expected:
    if label["name"].casefold() not in existing:
        gh("--method", "POST", "repos/" + REPO + "/labels", "--input", "-", payload=label)
        created.append(label["name"])
        existing.add(label["name"].casefold())
verified = {r["name"].casefold() for page in gh("--paginate", "--slurp", "repos/" + REPO + "/labels?per_page=100") for r in page}
assert all(r["name"].casefold() in verified for r in expected)
print(json.dumps({"created": created, "verified": [r["name"] for r in expected], "existing_labels_modified": False}))
