"""Regression tests for Relay's rejection paths using real Git ancestry and diffs."""
import os
from pathlib import Path
import runpy
import subprocess
import tempfile
import unittest
from unittest.mock import patch

MODULE = runpy.run_path(str(Path(__file__).with_name("check-relay.py")))
validate = MODULE["validate"]
REPO = "https://github.com/Kenbinhoainam/WebMinhDuc"


class CheckpointTests(unittest.TestCase):
    def git(self, *args):
        return subprocess.check_output(["git", *args], text=True).strip()

    def setUp(self):
        self.root = tempfile.TemporaryDirectory()
        self.addCleanup(self.root.cleanup)
        cwd = Path.cwd()
        os.chdir(self.root.name)
        self.addCleanup(os.chdir, cwd)
        self.git("init", "-q")
        self.git("config", "user.name", "Relay Test")
        self.git("config", "user.email", "relay@example.invalid")
        self.git("commit", "-qm", "base", "--allow-empty")
        base = self.git("rev-parse", "HEAD")
        Path("owned").mkdir()
        Path("owned/receipt.md").write_text("pilot\n")
        self.git("add", "owned")
        self.git("commit", "-qm", "stage changes")
        head = self.git("rev-parse", "HEAD")
        self.record = {
            "schema_version": 1, "status": "READY_FOR_HANDOFF", "issue": REPO + "/issues/10",
            "pr": REPO + "/pull/11", "repository": "Kenbinhoainam/WebMinhDuc",
            "branch": "chore/10-relay", "base_sha": base, "stage_start_sha": base, "head_sha": head,
            "requirements": ["MDV2-GOV-001 (28/11/2026)"], "sdd": ["N/A: governance only"],
            "sources": [{"url": f"{REPO}/blob/{base}/AGENTS.md", "status": "READ", "note": "opened in fixture"}],
            "agent": "test-sender", "receiver": "test-receiver",
            "ownership": {"integrator": "test-coordinator", "worktree": "test-worktree", "allowed_paths": ["owned/"],
                          "receipt": REPO + "/issues/10#issuecomment-123"},
            "scope": "One synthetic receipt", "exclusions": ["No deploy"], "dependencies": [],
            "changed_files": ["owned/receipt.md"], "completed": [], "in_progress": [], "remaining": [],
            "blockers": [], "tests": [{"command": "npm run build", "environment": "fixture", "sha": None,
                                      "result": "NOT_RUN", "exit_code": None, "evidence": None, "note": "No app changes"}],
            "preview": None, "open_regressions": [], "po_decisions": [], "next_action": "Read the receipt",
        }

    def remote_stub(self, head=None):
        original = validate.__globals__["git"]

        def git(*args):
            if args[0] == "ls-remote":
                self.assertEqual(args[2:], (REPO + ".git", "refs/heads/chore/10-relay"))
                return f"{head or self.record['head_sha']}\t{args[-1]}\n".encode()
            return original(*args)

        return patch.dict(validate.__globals__, git=git)

    def test_ready_with_correct_remote_and_checkout(self):
        with self.remote_stub():
            validate(self.record, remote=True, expect_stage=self.record["base_sha"])

    def test_advanced_remote_rejects_stale_sender(self):
        with self.remote_stub("a" * 40), self.assertRaisesRegex(ValueError, "STALE_CHECKPOINT"):
            validate(self.record, remote=True)

    def test_unreachable_remote_fails(self):
        original = validate.__globals__["git"]

        def git(*args):
            if args[0] == "ls-remote":
                raise subprocess.CalledProcessError(2, args)
            return original(*args)

        with patch.dict(validate.__globals__, git=git), self.assertRaises(subprocess.CalledProcessError):
            validate(self.record, remote=True)

    def test_same_sha_but_dirty_checkout_fails(self):
        Path("untracked.md").write_text("uncommitted")
        with self.remote_stub(), self.assertRaisesRegex(ValueError, "uncommitted changes"):
            validate(self.record, remote=True)

    def test_wrong_checkout_fails(self):
        self.git("checkout", "--detach", self.record["base_sha"])
        with self.remote_stub(), self.assertRaisesRegex(ValueError, "checkout HEAD"):
            validate(self.record, remote=True)

    def test_empty_diff_cannot_replace_receipted_stage(self):
        self.record["stage_start_sha"] = self.record["head_sha"]
        self.record["changed_files"] = []
        with self.assertRaisesRegex(ValueError, "ownership receipt"):
            validate(self.record, expect_stage=self.record["base_sha"])

    def test_undeclared_paths_fail(self):
        self.record["changed_files"] = []
        with self.assertRaisesRegex(ValueError, "does not match"):
            validate(self.record)

    def test_rename_cannot_hide_unowned_old_path(self):
        self.record["stage_start_sha"] = self.record["head_sha"]
        self.git("mv", "owned/receipt.md", "renamed.md")
        self.git("commit", "-qm", "rename receipt")
        self.record["head_sha"] = self.git("rev-parse", "HEAD")
        self.record["ownership"]["allowed_paths"] = ["renamed.md"]
        self.record["changed_files"] = ["renamed.md"]
        with self.assertRaisesRegex(ValueError, "does not match"):
            validate(self.record)
        self.record["changed_files"].append("owned/receipt.md")
        with self.assertRaisesRegex(ValueError, "outside stage ownership"):
            validate(self.record)

    def test_wrong_repo_and_non_ancestor_fail(self):
        self.record["issue"] = "https://github.com/other/repo/issues/10"
        with self.assertRaisesRegex(ValueError, "same-repo"):
            validate(self.record)
        self.record["issue"] = REPO + "/issues/10"
        self.record["base_sha"] = self.record["head_sha"]
        with self.assertRaises(subprocess.CalledProcessError):
            validate(self.record)

    def test_done_unread_source_and_blocker_semantics(self):
        self.record["status"] = "DONE"
        with self.assertRaisesRegex(ValueError, "status must be"):
            validate(self.record)
        self.record["status"] = "READY_FOR_HANDOFF"
        self.record["sources"][0]["status"] = "BLOCKED"
        with self.assertRaisesRegex(ValueError, "required source unread"):
            validate(self.record)
        self.record["status"] = "BLOCKED"
        with self.assertRaisesRegex(ValueError, "requires a blocker"):
            validate(self.record)
        self.record["blockers"] = [{"code": "BLOCKED_PRIVACY", "detail": "Need approved private source"}]
        validate(self.record)

    def test_success_requires_real_exit_code_sha_and_evidence(self):
        self.record["tests"][0]["result"] = "PASS"
        with self.assertRaisesRegex(ValueError, "full SHA and evidence"):
            validate(self.record)
        self.record["tests"][0].update(sha=self.record["head_sha"], evidence=REPO + "/actions/runs/123", exit_code=1)
        with self.assertRaisesRegex(ValueError, "contradicts"):
            validate(self.record)
