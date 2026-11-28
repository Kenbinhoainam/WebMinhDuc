"""Validate a Relay v1 checkpoint. Never execute commands from the record."""
import argparse
import json
from pathlib import Path
import re
import subprocess
import sys

SHA = r"[0-9a-f]{40}"
REPO = r"[A-Za-z0-9][A-Za-z0-9-]*/(?!\.{1,2}(?:/|$))[A-Za-z0-9_.-]+"
GITHUB = rf"https://github\.com/{REPO}"
PERMALINK = rf"{GITHUB}/blob/{SHA}/[^\s<>]+"
EVIDENCE = (
    rf"{GITHUB}/(?:blob/{SHA}/[^\s<>]+|commit/{SHA}|"
    r"actions/runs/[1-9][0-9]*(?:/job/[1-9][0-9]*)?|"
    r"(?:issues|pull)/[1-9][0-9]*#issuecomment-[1-9][0-9]*)"
)
TEMPLATE = Path(__file__).resolve().parents[2] / "docs/ai/relay/checkpoint.template.json"


def require(condition, message):
    if not condition:
        raise ValueError(message)


def matches(pattern, value):
    return isinstance(value, str) and re.fullmatch(pattern, value) is not None


def filled(value):
    return isinstance(value, str) and bool(value.strip()) and not value.startswith("<")


def fields(obj, keys, label):
    require(isinstance(obj, dict) and obj.keys() == set(keys), f"{label}: missing or unknown keys")


def strings(value, label, nonempty=False):
    require(isinstance(value, list) and all(filled(item) for item in value), f"{label}: expected text list")
    require(value or not nonempty, f"{label}: at least one item required")


def safe_path(path, allow_prefix=False):
    name = path.removesuffix("/") if allow_prefix else path
    return not any(part in {"", ".", ".."} for part in name.split("/")) and not re.search(r"[\\\x00-\x1f]", name)


def git(*args):
    return subprocess.run(
        ["git", *args], capture_output=True, check=True, timeout=30
    ).stdout


def validate_test(test):
    fields(test, "command environment sha result exit_code evidence note".split(), "test")
    require(all(filled(test[key]) for key in ("command", "environment", "note")), "test: missing detail")
    require(test["result"] in ("PASS", "FAIL", "BLOCKED", "NOT_RUN"), "test: invalid result")
    sha, code, evidence = test["sha"], test["exit_code"], test["evidence"]
    require(sha is None or matches(SHA, sha), "test: invalid SHA")
    require(evidence is None or matches(EVIDENCE, evidence), "test: invalid evidence link")
    if test["result"] in ("PASS", "FAIL"):
        require(matches(SHA, sha) and matches(EVIDENCE, evidence), "executed test needs full SHA and evidence")
        require(type(code) is int and (code == 0) == (test["result"] == "PASS"), "test: exit code contradicts result")
    else:
        require(code is None, "test not completed: use a null exit code")


def validate(record, remote=False, expect_stage=None):
    fields(record, json.loads(TEMPLATE.read_text(encoding="utf-8")), "checkpoint")
    require(type(record["schema_version"]) is int and record["schema_version"] == 1, "schema_version must be 1")
    status = record["status"]
    require(status in ("READY_FOR_HANDOFF", "BLOCKED"), "status must be READY_FOR_HANDOFF or BLOCKED")
    for key in ("agent", "receiver", "scope", "next_action"):
        require(filled(record[key]), f"{key}: required")
    for key in ("requirements", "sdd", "exclusions", "dependencies", "changed_files",
                "in_progress", "remaining", "open_regressions", "po_decisions"):
        strings(record[key], key, key in ("requirements", "sdd", "exclusions"))

    repo = record["repository"]
    require(matches(REPO, repo), "repository must be GitHub owner/name")
    prefix = re.escape(f"https://github.com/{repo}")
    require(matches(prefix + r"/issues/[1-9][0-9]*", record["issue"]), "issue: invalid same-repo Issue URL")
    require(matches(prefix + r"/pull/[1-9][0-9]*", record["pr"]) or
            (record["pr"] is None and status == "BLOCKED"), "pr: invalid same-repo PR URL")
    require(all(matches(GITHUB + rf"/(?:(?:pull|issues)/[1-9][0-9]*|commit/{SHA})", link)
                for link in record["dependencies"]), "dependencies: invalid GitHub link")

    sources = record["sources"]
    require(isinstance(sources, list) and sources, "sources: at least one pinned source required")
    for source in sources:
        fields(source, ("url", "status", "note"), "source")
        require(matches(PERMALINK, source["url"]) and filled(source["note"]), "sources: use pinned URL and reading note")
        require(source["status"] in ("READ", "BLOCKED"), "sources: invalid read status")
        require(source["status"] == "READ" or status == "BLOCKED", "required source unread on ready checkpoint")

    for key, keys in (("completed", ("item", "evidence")), ("blockers", ("code", "detail"))):
        require(isinstance(record[key], list), f"{key}: expected list")
        for item in record[key]:
            fields(item, keys, key)
            require(all(filled(item[field]) for field in keys), f"{key}: incomplete item")
            if key == "completed":
                require(matches(EVIDENCE, item["evidence"]), "completed: missing GitHub evidence")
            else:
                require(matches(r"BLOCKED_[A-Z][A-Z0-9_]*", item["code"]), "blocker code must start with BLOCKED_")
    require(status != "BLOCKED" or record["blockers"], "BLOCKED requires a blocker")
    require(isinstance(record["tests"], list) and record["tests"], "tests: at least one result or NOT_RUN required")
    for test in record["tests"]:
        validate_test(test)
    require(not any(test["result"] == "FAIL" for test in record["tests"]) or record["open_regressions"],
            "record failed tests in open_regressions")
    preview = record["preview"]
    if preview is not None:
        fields(preview, "source_sha artifact_sha256 revision environment url audience".split(), "preview")
        require(all(filled(value) for value in preview.values()) and matches(SHA, preview["source_sha"]) and
                matches(r"[0-9a-f]{64}", preview["artifact_sha256"]) and matches(r"https://[^\s<>]+", preview["url"]),
                "preview: incomplete source, artifact, revision or URL mapping")

    ownership = record["ownership"]
    fields(ownership, ("integrator", "receipt", "worktree", "allowed_paths"), "ownership")
    require(filled(ownership["integrator"]) and filled(ownership["worktree"]), "ownership: missing integrator or alias")
    receipt = prefix + r"/(?:issues|pull)/[1-9][0-9]*#issuecomment-[1-9][0-9]*"
    require(matches(receipt, ownership["receipt"]), "ownership: use a same-repo Issue/PR comment receipt")
    allowed = ownership["allowed_paths"]
    strings(allowed, "allowed_paths")
    require(all(safe_path(path, allow_prefix=True) for path in allowed), "ownership: invalid path")
    paths = record["changed_files"]
    require(all(safe_path(path) for path in paths) and len(paths) == len(set(paths)), "changed_files: invalid or duplicate path")
    require(all(any(path == rule or (rule.endswith("/") and path.startswith(rule)) for rule in allowed)
                for path in paths), "changed_files: path outside stage ownership")

    require(filled(record["branch"]), "branch: required")
    ref = "refs/heads/" + record["branch"]
    git("check-ref-format", ref)
    base, stage, head = (record[key] for key in ("base_sha", "stage_start_sha", "head_sha"))
    require(expect_stage is None or stage == expect_stage, "stage_start_sha differs from independent ownership receipt")
    for sha in (base, stage, head):
        require(matches(SHA, sha), "commit identity must be a full lowercase SHA")
        require(git("cat-file", "-t", sha).strip() == b"commit", "fetch all checkpoint commits before validating")
    for older, newer in ((base, stage), (stage, head)):
        git("merge-base", "--is-ancestor", older, newer)
    actual = git("diff", "--no-renames", "--name-only", "-z", stage, head).decode("utf-8").split("\0")[:-1]
    require(set(paths) == set(actual), "changed_files does not match stage_start_sha..head_sha Git diff")
    if remote:
        url = f"https://github.com/{repo}.git"
        observed = git("ls-remote", "--exit-code", url, ref).decode().strip().split("\t")
        require(observed == [head, ref], "STALE_CHECKPOINT: remote HEAD differs; fetch and reassess before editing")
        require(git("rev-parse", "HEAD").decode().strip() == head, "checkout HEAD differs from verified remote SHA")
        require(not git("status", "--porcelain", "--untracked-files=all"), "worktree has uncommitted changes")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("checkpoint", type=Path)
    parser.add_argument("--remote", action="store_true", help="Require the GitHub branch tip to equal head_sha")
    parser.add_argument("--expect-stage", help="Full stage-start SHA from the independent ownership receipt")
    args = parser.parse_args()
    try:
        validate(json.loads(args.checkpoint.read_text(encoding="utf-8")), args.remote, args.expect_stage)
    except (ValueError, OSError, subprocess.SubprocessError) as error:
        print(f"Relay validation failed: {error}", file=sys.stderr)
        return 1
    print(f"Relay v1 valid ({'GitHub remote HEAD verified' if args.remote else 'local Git only'})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
