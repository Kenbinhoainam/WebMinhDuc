"""Reconcile the frozen selection with direct and dependency-checked QA evidence.

Usage: python tests/s2-trace-matrix.py --sha <verified code commit>
Output is deterministic for the input reports. External approvals take precedence.
"""
import argparse
import collections
import csv
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path("docs/sdd/SEL-2026.11.27-v1.0.0")
EXEC = ROOT / "execution"
DATA = ROOT / "data"
CONTACT_FIX = "c25a398a424880651cfc375760401aadc0c006d1"
MOTION_BASE = "88e2b61596eab5952f183a81b3030da760696c9c"
BOOKING_FIX = "9db1adb2d7f84371dd7b954038a5c3ae2643a469"
FORM_FIX = "d67c9914a17c3cedb4dcd76e397189e833ab9a4d"
SAVED_FOCUS_FIX = "c83bd9001cf2629dfb1934515fcf1c05ae553910"
SAVED_DETACH_FIX = "66b76036469f07b35bc3cb188dc6b61d40fdda32"
EDGES = {
    SAVED_DETACH_FIX: (SAVED_FOCUS_FIX, ["src/JobsPages.tsx"],
                       "a90a7c5a5bd02f691a1a61b7a04ea32c24c7f242b99e274c525d71e47a12ff37",
                       "Capture the outgoing saved-card focus before detachment; apply its corresponding focus target after the new list commits."),
    SAVED_FOCUS_FIX: (FORM_FIX, ["src/JobsPages.tsx","tests/jobs-sprint1.mjs"],
                      "fc62940bed9800e4c8d0fb26c9cb34c465ae64b63356b1daebdb569bda2c88b8",
                      "Restore the equivalent focus target inside the saved-jobs browser after local removal or storage updates; correct the stale jobs test expectation for validated phone fields."),
    FORM_FIX: (BOOKING_FIX, ["src/Contact.tsx","src/JobsPages.tsx","src/sharedformvalidation.ts","tests/s2-form-field-repair.py"],
               "e9c2bc78866931ef6a065ca68d33941bb700d2b754d438ed9055ed03644ff2df",
               "Update input-time validation of public contact and job application identity fields after a failed submit."),
    CONTACT_FIX: (MOTION_BASE, ["src/Contact.tsx"],
                  "199854d0f19d13cc8ef566b9d1f9661f941f26a15d8afd3c005b978af9fed4f5",
                  "Existing locale catalog translation of office.name for the contact map iframe title."),
    BOOKING_FIX: (CONTACT_FIX, ["src/Consultation.css","src/Consultation.tsx","tests/consultation.mjs"],
                  "a58677d12815d533cdb128fa24b717e951135379ebfa12a75e3332e083edb457",
                  "Update /consultation live date/time summary, receipt formatting, slot timing and its unit assertions."),
}


def ancestors(sha):
    result = []
    while sha in EDGES:
        sha = EDGES[sha][0]
        result.append(sha)
    return result


def impact_check(sha):
    verified = []
    while sha in EDGES:
        parent, expected_names, expected_digest, scope = EDGES[sha]
        assert subprocess.check_output(["git","rev-parse",sha+"^"],text=True).strip() == parent
        names = subprocess.check_output(["git","diff","--name-only",parent,sha],text=True).splitlines()
        assert names == expected_names
        patch = subprocess.check_output(["git","diff","--binary","--full-index","--no-ext-diff","--no-color","--no-renames",
                                         "--diff-algorithm=myers","--src-prefix=a/","--dst-prefix=b/",parent,sha])
        digest = hashlib.sha256(patch).hexdigest()
        assert digest == expected_digest
        verified.append({"parent_sha":parent,"target_sha":sha,"changed_files":names,"diff_sha256":digest,"scope":scope})
        sha = parent
    return list(reversed(verified))


def reusable_measurement(target, observed, code, assertion):
    assert observed in [target, *ancestors(target)], f"Unexpected evidence SHA {observed} on {target}"
    normalized = assertion.casefold()
    while target != observed:
        if target == CONTACT_FIX and (code == "P37-D3" or any(term in normalized for term in (
            "map title","map iframe title","iframe title","localized map","title iframe","tiêu đề iframe","tiêu đề bản đồ","tên bản đồ"
        ))):
            return False
        if target == BOOKING_FIX and (code.startswith(("P38-", "MI06")) or any(term in normalized for term in (
            "/consultation","booking flow","booking page","date/time","appointment time","slot selection","chọn giờ tư vấn","đặt lịch tư vấn"
        ))):
            return False
        if target == FORM_FIX and (code == "CS-C08-3" or any(term in normalized for term in (
            "field error","inline error","invalid phone","invalid identity","identity field","aria-invalid",
            "correcting the phone","phone correction","incorrect phone","phone validation","invalid field",
            "sửa số điện thoại","lỗi số điện thoại","lỗi trường","sửa trường"
        ))):
            return False
        if target in (SAVED_FOCUS_FIX,SAVED_DETACH_FIX) and (code in {"P18-C2","P18-C3"} or any(term in normalized for term in (
            "cross-tab","cross tab","storage event","multi-tab","saved-row focus","saved row focus","saved-list focus",
            "remote removal","focused saved","đổi ở tab khác","đồng bộ giữa các tab"
        ))):
            return False
        target = EDGES[target][0]
    return True


OPT_INS = {
    "MI08-3": "P19 đang dùng dải câu hỏi. Đổi sang accordion mở nhiều mục cần quyết định riêng theo điều kiện của dòng 38.",
    "MI07-3": "Fixture riêng cho lỗi xử lý ở server chưa được chọn. Các lỗi validation của luồng demo vẫn kiểm được.",
    "CS-B05-4": "Chưa duyệt mở rộng sắp xếp việc làm. Cần chỉ rõ tập giá trị, quy tắc và mặc định.",
    "T22": "Toast lưu việc cũ đã được yêu cầu gỡ. Xác nhận vị trí thông tin thay thế hoặc thay đổi phạm vi trước khi tái tạo toast.",
    "MI02-4": "Undo việc đã bỏ lưu cần quyết định opt-in riêng.",
    "CS-C11-2": "Phụ thuộc Undo của MI02-4, cần quyết định opt-in.",
    "MI03-4": "Sắp xếp thu nhập mới cần quy tắc thu nhập và phê duyệt riêng.",
    "MO05-1": "Fade route là hiệu ứng tùy chọn, cần phê duyệt riêng.",
    "MO08-2": "Trang trí lúc video kết thúc cần duyệt riêng. Luồng ended và hai CTA vẫn được kiểm độc lập.",
    "MS01-4": "Spring trang trí cần phê duyệt opt-in.",
    "P21-E4": "Chức năng tải checklist/lưu bài chưa được chọn riêng.",
    "P22-E4": "Chức năng tải checklist/lưu bài chưa được chọn riêng.",
    "P23-E4": "Chức năng tải checklist/lưu bài chưa được chọn riêng.",
    "P24-E4": "Chức năng tải checklist/lưu bài chưa được chọn riêng.",
    "P25-E4": "Chức năng tải checklist/lưu bài chưa được chọn riêng.",
    "P26-E4": "Chức năng tải checklist/lưu bài chưa được chọn riêng.",
    "P20-E4": "Theo dõi tương tác mới chưa được duyệt riêng.",
    "P27-E4": "Đăng ký sự kiện mới cần xác nhận phạm vi.",
    "P28-E3": "Chỉ dẫn địa điểm/đăng ký cần lịch thật đã xác nhận.",
    "P29-E3": "Chưa có URL tham dự đã xác nhận.",
    "P31-E4": "Cần cung cấp và duyệt tài liệu chứng minh năng lực.",
    "P36-E4": "Chức năng CMS mở rộng/AI ngoài nghiệp vụ demo hiện hành.",
    "F08": "Biên tập dùng AI chưa có trong demo. Cần giao phạm vi riêng.",
    "F12": "Tiếp nhận và xử lý tệp thật ngoài phạm vi. Validation metadata mock được kiểm riêng.",
    "P38-F2": "Ghi giờ hẹn vào hồ sơ ADMIN là thay đổi payload có điều kiện; cần quyết định riêng.",
}
WAVES = ["b2b.csv", "b2c.csv", "other-pages.csv", "shared.csv", "p41.csv"]
QA_INPUTS = [
    "trace-content.json",
    "qa/choice-evidence.json",
    "trace-regression.json",
    "trace-ci-regression.json",
    "common-audit.json",
    "media-audit.json",
    "trace-accessibility.json",
    "browser-choice-evidence.json",
    "browser-reviewer-evidence.json",
    "browser-a11y-evidence.json",
    "browser-extra-evidence.json",
    "browser-edge-evidence.json",
    "residual.json",
    "residual-browser.json",
    "residual-education/choices.json",
    "browser-service-keyboard.json",
    "b2b-qa/browser-choices.json",
    "b2b-qa/performance-choices.json",
    "b2c-final-pages/choices.json",
    "b2c-final-pages/vacancies.json",
    "b2c-saved-focus/choices.json",
    "w4-qa/browser-choices-rc6.json",
    "w4-qa/browser-event-choices-rc7.json",
    "trace-booking-functional.json",
    "w4-pages-browser-evidence.json",
    "w4-sites-browser-evidence.json",
]
CHECKS = ["Tiêu chí hoàn thành", "Cách kiểm tra", "Ghi chú cần phân biệt"]
DETAIL = ["Chi tiết để chọn", "Đề xuất cụ thể", "Chi tiết cần nâng cấp", "Các tiểu tiết", "Tên phần hoặc trạng thái"]


def first(values, fields):
    return next((values[key] for key in fields if values.get(key)), "")


def rows_file(path):
    return [json.loads(line) for line in path.read_text().splitlines() if line]


def csv_file(path):
    with path.open(encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def freeze_integrity():
    handoff="5744b6da70af721bf08d915107960ab61dfb0080"
    files=subprocess.check_output(["git","ls-tree","-r","--name-only",handoff,str(ROOT)],text=True).splitlines()
    hashes={}
    for name in files:
        path=Path(name)
        frozen=subprocess.check_output(["git","show",handoff+":"+name])
        on_disk=path.read_bytes()
        assert frozen==on_disk, f"Frozen artifact changed: {name}"
        hashes[str(path.relative_to(ROOT))]=hashlib.sha256(on_disk).hexdigest()
    return {"handoff":handoff,"immutable_file_sha256":hashes}


def checked_selection():
    manifest = json.loads((ROOT / "manifest.json").read_text())
    template = csv_file(EXEC / "RESULT-BY-CHOICE-TEMPLATE.csv")
    trc = (ROOT / "MDU-TRC-v1.0.0.md").read_text()
    data, reference, excluded = {}, {}, collections.Counter()
    for filename in manifest["frozen_data_files"]:
        file = ROOT / filename
        frozen_rows = rows_file(file)
        if not file.name.startswith("selections-"):
            reference[file.name] = frozen_rows
            continue
        for line_no, choice in enumerate(frozen_rows, 1):
            if choice["status"] != "Chọn":
                excluded[choice["status"]] += 1
                continue
            code = choice["effective_code"]
            assert code not in data, ("duplicate", code)
            data[code] = (choice, f"{filename}#L{line_no}")
    assert excluded == {"Không chọn": 30, "Để sau": 15, "Chưa chọn": 1}, excluded
    # Eight unselected page-E entries are recorded in APPROVAL-BOUNDARIES, not JSONL.
    assert len(reference["dx-proposals-reference-only.jsonl"]) == 246
    assert len(data) == len(template) == manifest["counts"]["selected_total"] == 1257
    assert collections.Counter(r["choice_id"] for r in template) == collections.Counter(data.keys())
    assert len(reference["pages-and-urls.jsonl"]) == 41
    for row in template:
        choice, _ = data[row["choice_id"]]
        assert row["original_code"] == choice["source_code"]
        assert row["sheet"] == choice["sheet"]
        assert int(row["source_row"]) == choice["row"]
        assert row["acceptance_id"] == "QA-" + row["choice_id"]
        assert f'| **{row["choice_id"]}** | {choice["row"]} |' in trc
    assert sum(row["scope_gate"] == "BUSINESS_E_GATE" for row in template) == 146
    return template, data, {r["source_code"]:r["fields"] for r in reference["pages-and-urls.jsonl"]}


def qa_inputs(sha):
    short = (MOTION_BASE if sha in EDGES else sha)[:8]
    hero = f"browser/hero-end-{short}/hero-end-choices.json"
    if not (EXEC / hero).exists():
        hero = "browser/hero-end-choices.json"
    booking = (BOOKING_FIX if sha in (FORM_FIX,SAVED_FOCUS_FIX,SAVED_DETACH_FIX) else sha)[:8]
    form_feedback = sha[:7]
    if sha in (SAVED_FOCUS_FIX,SAVED_DETACH_FIX) and not (EXEC / f"browser/form-feedback-{form_feedback}/choices.json").exists():
        form_feedback = FORM_FIX[:7]
    return [*QA_INPUTS, hero, f"browser/motion-final/{short}/choices.json", f"browser/booking-final/{booking}/choices.json",
            f"browser/form-mode-final/{booking}/choices.json", f"browser/form-feedback-{form_feedback}/choices.json"]


def read_evidence(sha):
    evidence = collections.defaultdict(list)
    for name in qa_inputs(sha):
        path = EXEC / name
        if not path.exists():
            continue
        report = json.loads(path.read_text())
        observed_sha = report["build_sha"]
        assert observed_sha in [sha,*ancestors(sha)], f"{path} from {observed_sha}, expected {sha}"
        for choice in report["choices"]:
            assert choice["coverage"] in ("partial", "full")
            assert choice["test_status"] in ("Pass", "Fail", "Blocked", "Not Run")
            observed = first(choice,["assertion","actual","steps"])
            if not reusable_measurement(sha,observed_sha,choice["choice_id"],observed):
                continue
            evidence[choice["choice_id"]].append({
                "observed_sha":observed_sha,
                "scope":choice["coverage"], "test":choice["test_status"],
                "ref":str(path.relative_to(EXEC))+" → "+choice["choice_id"] + (
                    " · " + choice["evidence_ref"] if isinstance(choice.get("evidence_ref"),str) else ""),
                "observed":observed,
                "remaining":choice.get("remaining", ""),
            })
    return evidence


def read_owners(selected, sha):
    owners = collections.defaultdict(list)
    for filename in WAVES:
        path = EXEC / filename
        if not path.exists():
            continue
        for row in csv_file(path):
            reported_sha = first(row, ["target_sha","build_sha","sha"])
            if reported_sha:
                assert reported_sha in [sha,*ancestors(sha)], f"{path} from {reported_sha}, expected {sha}"
            code = first(row, ["choice_id","id","ID","code"])
            if not code or not code.strip(): continue
            assert code in selected, f"{path} references nonselected {code}"
            owners[code].append((filename, row))
    return owners


def missing_check(code, fields):
    """Describe the unmet full acceptance; device and UAT blocks apply only where required."""
    family = code.split("-")[-1][0] if code.startswith("P") else code[0]
    check = first(fields, CHECKS)
    subject = first(fields, DETAIL)
    page = fields.get("Trang", fields.get("Trang / thành phần áp dụng",""))
    detail = f"{page} · {subject}".strip(" ·")
    if code in {"D03","D11","CS-D05-1"}:
        return "Device QA", "Cần thiết bị iOS Safari / Android Chrome hoặc dịch vụ thiết bị đã cấp quyền, bàn phím hệ thống và phép xoay màn hình.", True
    requires_participant = any(phrase in check.lower() for phrase in (
        "cho người thử", "hỏi người thử", "yêu cầu người thử", "quan sát người thử",
        "ghi cta người thử chọn", "ghi chỗ người thử", "người thử mô tả", "người thử hiểu",
        "người thử giải thích", "người thử chỉ ra", "người thử nêu", "người thử đoán",
        "người thử phân biệt", "người thử chọn đúng nhóm",
    ))
    if requires_participant or code in {"A10","B06","CS-A07-1","CS-B01-1","P03-E1","P04-E1","P05-E1","P06-E1","P07-E1","P08-E1","P31-E1"}:
        return "PO / UX research", "Điều phối người dùng thử ngoài nhóm thực thi. Thu nhận câu trả lời và đối chiếu tiêu chí: " + check, True
    if family in {"A","D"} or code.startswith(("CS-A","CS-D")):
        return "Browser QA", "Đo hoặc so sánh build bằng trình duyệt ở viewport/zoom và trạng thái cụ thể: " + detail + " · " + check, False
    if code.startswith(("MI","MO","MS")):
        return "Motion QA", ("Thực hiện trigger " + fields.get("Kích hoạt","") + "; lặp/hủy: "
                            + fields.get("Khi thao tác liên tiếp / bị ngắt","") + "; giảm chuyển động: "
                            + fields.get("Giảm chuyển động","") + "; đối chiếu: " + check), False
    return "Functional QA", detail + " · " + check, False


def build_matrix(sha):
    impact_check(sha)
    template, selection, pages = checked_selection()
    outcomes, owners = read_evidence(sha), read_owners(selection, sha)
    motion_path = EXEC / "shared-qa/MOTION-INVENTORY.csv"
    motion = {r["ID"]:r for r in csv_file(motion_path)} if motion_path.exists() else {}
    if motion:
        assert len(motion) == 88 and set(motion) <= selection.keys()
    fixes = {}
    for commit, codes in (
        ("4231bae137528dbf152250832c1a26d060c579d9", ("CS-C07-4","P22-B1","P22-B3")),
        ("49259ccec3d3a6f6fe1d77ba5e692a3fe5cd046d", ("CS-D01-2","P36-D2")),
        ("625a2eafe24dc28a0b88ed2afc4746bcf384ba56", ("CS-A02-2","MI05-4")),
        ("6e7a7e4c47c293920dec1255c15d73a68cc7a563", ("P36-D2","CS-D01-2","MI05-2","MI05-3")),
        (MOTION_BASE, ("MO02-4","MO03-3","MO03-4")),
        (CONTACT_FIX, ("P37-D3",)),
        (BOOKING_FIX, ("MI06-1","MI06-2")),
        (FORM_FIX, ("CS-C08-3",)),
        (SAVED_FOCUS_FIX, ("P18-C2","P18-C3")),
        (SAVED_DETACH_FIX, ("P18-C2","P18-C3")),
    ):
        if subprocess.run(["git","merge-base","--is-ancestor",commit,sha]).returncode == 0:
            fixes.update(dict.fromkeys(codes,commit))
    assert set(outcomes) <= selection.keys(), "evidence attached to an unselected ID"
    for row in template:
        code = row["choice_id"]
        choice, source = selection[code]
        f = choice["fields"]
        page = pages.get(code.split("-")[0], {})
        scope = first(f, ["Trang / thành phần áp dụng","Thuộc trang","Địa chỉ / cách mở"])
        row.update(
            source_file=source, component=page.get("Căn cứ mã nguồn", scope or f.get("Hạng mục", "")),
            route_or_scope=page.get("Đường dẫn",scope or "Shared"),
            selected_detail=first(f,DETAIL), frozen_check=first(f,CHECKS),
            applicability=f.get("Điều kiện áp dụng",""),
            trigger=f.get("Kích hoạt",""),feedback=f.get("Phản hồi và quy tắc",""),
            motion_token=f.get("Chuyển động đề xuất",""),interruption=f.get("Khi thao tác liên tiếp / bị ngắt",""),
            reduced_motion=f.get("Giảm chuyển động",""),
            next_owner="QA", next_check=first(f,CHECKS),
            verification_scope="No evidence for the full row on this build.",
            observed_behavior="", evidence="", target_sha=sha, evidence_shas="", acceptance_pass_shas="", evidence_basis="",
        )
        row["fix_commit"] = fixes.get(code, "")
        next_owner, next_check, missing_environment = missing_check(code, f)
        row.update(next_owner=next_owner,next_check=next_check)
        if code == "ROW625-P01-A-UNRESOLVED":
            row.update(implementation_status="Blocked",test_status="Blocked",next_owner="Project Owner",
                       blocker="B625 có nguyên văn Chọn. Cần xác minh mã nguồn trước khi nghiệm thu.",
                       observed_behavior="Ô mã ở dòng 625 trong bản đóng băng chứa nguyên văn Chọn.",
                       verification_scope="Đã đối chiếu tọa độ, giá trị thô và lỗi SEL-ERR-625.",
                       next_check="Xác nhận mã nguồn của ô B625 và giữ bản đóng băng.",
                       evidence="APPROVAL-BOUNDARIES.md → SEL-ERR-625")
            continue
        local_evidence = outcomes.get(code,[])
        observations, refs, observed_shas = [], [], set()
        if code in motion:
            row["component"] = motion[code]["source_or_review_location"]
            refs.append("shared-qa/MOTION-INVENTORY.csv → " + code + " · Source mapping; see independent QA for observed behavior.")
        full_owner = False
        full_shas = {r["observed_sha"] for r in local_evidence if r["scope"]=="full" and r["test"]=="Pass"}
        for filename, entry in owners.get(code, []):
            status = first(entry, ["status","Status","implementation_status"])
            evidence = first(entry,["evidence","Evidence","evidence_ref"])
            owner_sha = first(entry,["target_sha","build_sha","sha"])
            reusable = bool(owner_sha and reusable_measurement(sha,owner_sha,code,evidence))
            if status and reusable:
                observed_shas.add(owner_sha)
            if status:
                observations.append(first(entry, ["actual","observed_behavior","notes","detail","qa_status"]) or filename + " · " + status)
                refs.append(filename+" → "+code+(" @"+owner_sha[:8] if owner_sha else "")+(" · "+evidence if evidence else ""))
            # Accept a worker's final evidence only when it explicitly identifies the verified build.
            if (status in ("Completed","Pass") and evidence and not entry.get("qa_status","").startswith("Partial")
                    and reusable):
                full_owner = True
                full_shas.add(owner_sha)
            if status in ("Partial","Not Run","Incomplete") and entry.get("remaining"):
                row["next_check"]=entry["remaining"]
            if status == "Blocked":
                condition = first(entry,["blocker","reason","remaining"]) or evidence
                row.update(implementation_status="Blocked",test_status="Blocked",
                           blocker=condition,next_check=condition,
                           next_owner=first(entry,["next_owner","owner"]) or "Project Owner / QA")
        for result in local_evidence:
            refs.append(result["ref"]+" @"+result["observed_sha"][:8])
            observed_shas.add(result["observed_sha"])
            observations.append(result["observed"])
        if local_evidence or full_owner:
            passed = full_owner or any(r["scope"]=="full" and r["test"]=="Pass" for r in local_evidence)
            failed = [r for r in local_evidence if r["test"]=="Fail"]
            if failed:
                unresolved = row["implementation_status"] == "Blocked"
                row.update(implementation_status="Blocked" if unresolved else "Incomplete",test_status="Fail",
                           verification_scope="See failed predicate and actual values in the linked report.")
                details = [r["remaining"] or r["observed"] for r in failed]
                if not unresolved:
                    row.update(next_owner="Frontend + QA",next_check=" | ".join(dict.fromkeys(details)))
            elif passed and row["implementation_status"] != "Blocked":
                row.update(implementation_status="Completed",test_status="Pass",next_owner="",next_check="",
                           verification_scope="Verified in the recorded test modality and locale scope.")
            elif not passed and row["implementation_status"] != "Blocked":
                row["verification_scope"]="Partial predicate only; full acceptance pending."
                row["next_check"]=" | ".join(r["remaining"] for r in local_evidence if r["remaining"]) or row["next_check"] or row["frozen_check"]
        if missing_environment and row["implementation_status"] != "Blocked" and row["test_status"] != "Fail":
            row.update(implementation_status="Blocked",test_status="Blocked",blocker=next_check,next_owner=next_owner,next_check=next_check,
                       verification_scope="The required participant or device observation is pending.")
        rendered_checks = [result["remaining"] for result in local_evidence if result["remaining"]
                           and result["ref"].startswith(("browser-choice-evidence.json","browser-reviewer-evidence.json","browser-extra-evidence.json","browser-edge-evidence.json"))]
        if rendered_checks and row["implementation_status"] == "Incomplete":
            row.update(next_owner="Browser QA", next_check=" | ".join(dict.fromkeys(rendered_checks)))
        if row["fix_commit"] and code == "CS-C07-4" and row["implementation_status"] == "Incomplete" and any(
            result["test"] == "Pass" and "publish the demo" in result["observed"] for result in local_evidence
        ):
            row.update(next_owner="Browser QA",
                       next_check="Xác nhận vị trí thông báo cạnh các nút CMS và phản hồi trợ năng bản dịch trên trình duyệt. Ca sửa tiếp sau cả lưu nháp và xuất bản thử đã đạt.")
        if row["implementation_status"] == "Incomplete":
            required = (row["frozen_check"] + " " + row["applicability"]).casefold()
            if "ghi riêng kết quả viewport mô phỏng và điện thoại thật" in required or "và điện thoại thật;" in required:
                row["next_owner"] = "Browser QA + Device QA"
                row["next_check"] += " Ghi thêm kết quả riêng trên điện thoại thật cho trạng thái tương ứng, gồm hướng màn hình, bàn phím hệ thống và modal nếu có."
            if "công nghệ trợ giúp đã chọn" in required:
                row["next_owner"] = "Accessibility QA"
                row["next_check"] += " Cần nghe trực tiếp kết quả bằng tổ hợp AT đã chọn với log chế độ, tên trình đọc và lời đọc."
        if code == "P37-D3" and row["implementation_status"] == "Incomplete" and any(
            r["test"]=="Pass" and r["ref"].startswith("b2b-qa/browser-choices.json") for r in local_evidence
        ):
            row.update(next_owner="Browser QA + Device QA",
                       next_check="Đã đối chiếu tên điểm của iframe với văn phòng hiển thị ở 5 ngôn ngữ, cùng phương án khi bản đồ ngoài bị chặn. Cần kiểm lại bộ chọn và đường mở chỉ dẫn bằng bàn phím, phóng to và trên điện thoại thật theo tiêu chí gốc.")
        if code in OPT_INS:
            gate = OPT_INS[code]
            row.update(implementation_status="Blocked",test_status="Blocked",blocker=gate,
                       next_owner="Project Owner",next_check=gate,
                       verification_scope="Optional extension held; any checked existing behavior is linked separately.")
            refs.append("APPROVAL-BOUNDARIES.md + "+source)
        if row["implementation_status"] == "Incomplete" and row["next_owner"] in {"Browser QA","Functional QA","Motion QA","Accessibility QA","Browser QA + Device QA"}:
            row["next_owner"] = "Frontend + " + row["next_owner"]
        row["evidence_shas"] = " | ".join(sorted(observed_shas))
        if row["implementation_status"]=="Completed":
            row["acceptance_pass_shas"] = " | ".join(sorted(full_shas))
        if observed_shas == {sha}:
            row["evidence_basis"] = "Direct results on target SHA."
        elif observed_shas:
            row["evidence_basis"] = ("Direct target results and unchanged prior observations" if sha in observed_shas else "Unchanged prior observations") + " · see SELECTION-INTEGRITY.json / change_impact."
        row["evidence"]=" | ".join(dict.fromkeys(refs)) or ("Chưa có quan sát riêng trên build; tiêu chí gốc: " + source)
        row["observed_behavior"]=" | ".join(dict.fromkeys(obs for obs in observations if obs))
        if not row["observed_behavior"]:
            row["observed_behavior"]="Chưa có phép kiểm đủ tiêu chí trên build này."
    return template


def decision_register(rows, sha):
    grouped = collections.defaultdict(list)
    for row in rows:
        if row["implementation_status"] == "Blocked":
            grouped[(row["next_owner"], row["blocker"])].append(row["choice_id"])
    lines = [
        "# Quyết định và điều kiện nghiệm thu còn thiếu", "",
        f"Build UI `{sha}`.", "",
        "Mỗi dòng dưới đây dẫn tới các mã có trạng thái Blocked trong RESULT-BY-CHOICE.csv. "
        "Các bước QA còn có thể thực hiện được liệt kê ở cột next_check của các mã Incomplete.", "",
        "| Người xử lý | Mã lựa chọn | Điều kiện để tiếp tục |",
        "| --- | --- | --- |",
    ]
    for (owner, reason), codes in sorted(grouped.items()):
        lines.append("| " + owner + " | " + ", ".join(codes) + " | " + reason.replace("|", " / ").replace("\n"," ") + " |")
    remaining = collections.defaultdict(list)
    for row in rows:
        if row["implementation_status"] == "Incomplete":
            remaining[row["next_owner"]].append(row)
    lines += ["", "## Phần còn lại của đội thực hiện", "",
              "Các mã Incomplete còn thuộc phạm vi bàn giao. Frontend và QA cần đối chiếu tiêu chí gốc, sửa chênh lệch nếu phát hiện và ghi lại phép thử. Xem cột next_check của từng dòng trong [bảng kết quả](RESULT-BY-CHOICE.csv).", "",
              "| Người xử lý tiếp | Số mã Incomplete | Ví dụ mã và bước kiểm |",
              "| --- | ---: | --- |"]
    for owner, pending in sorted(remaining.items()):
        sample = pending[0]
        text = sample["next_check"].replace("|"," / ").replace("\n"," ")
        lines.append(f"| {owner} | {len(pending)} | {sample['choice_id']} · {text} |")
    (EXEC / "TRACE-GAPS.md").write_text("\n".join(lines) + "\n")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sha",required=True)
    parser.add_argument("--out",type=Path,default=EXEC / "RESULT-BY-CHOICE.csv")
    args=parser.parse_args()
    sha = subprocess.check_output(["git","rev-parse","--verify",args.sha+"^{commit}"],text=True).strip()
    verified = freeze_integrity()
    rows = build_matrix(sha)
    with args.out.open("w", encoding="utf-8", newline="") as stream:
        writer=csv.DictWriter(stream, fieldnames=rows[0].keys(),lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
    if args.out == EXEC / "RESULT-BY-CHOICE.csv":
        verified["app_sha"] = sha
        if sha in EDGES:
            verified["change_impact"] = impact_check(sha)
        verified["selected"] = len(rows)
        verified["selected_page_e"] = sum(r["scope_gate"] == "BUSINESS_E_GATE" for r in rows)
        verified["excluded"] = {"Không chọn, kể cả 8 dòng E của P01/P02": 38,"Để sau":15,"Chưa chọn":1,
                                "DX chỉ tham khảo":246}
        verified["result_csv_sha256"] = hashlib.sha256(args.out.read_bytes()).hexdigest()
        complete = [r for r in rows if r["implementation_status"] == "Completed"]
        assert all(r["acceptance_pass_shas"] for r in complete), "Missing execution SHA on a completed choice"
        verified["completed_by_execution"] = {
            "target_pass": sum(sha in r["acceptance_pass_shas"].split(" | ") for r in complete),
            "only_prior_unchanged_pass": sum(sha not in r["acceptance_pass_shas"].split(" | ") for r in complete),
        }
        verified["result_counts"] = {k:dict(collections.Counter(r[k] for r in rows))
                                     for k in ("implementation_status","test_status")}
        verified["qa_input_sha256"] = {name:hashlib.sha256((EXEC/name).read_bytes()).hexdigest()
                                       for name in qa_inputs(sha) + WAVES + ["shared-qa/MOTION-INVENTORY.csv","trace-reviewer.json","browser/keyboard-zoom/browser-results.json","browser/keyboard-zoom-edges/browser-results.json","browser/service-keyboard/browser-results.json"]
                                       if (EXEC/name).is_file()}
        decision_register(rows, sha)
        (EXEC/"SELECTION-INTEGRITY.json").write_text(json.dumps(verified,indent=2,ensure_ascii=False)+"\n")
    print(len(rows), dict(collections.Counter(r["implementation_status"] for r in rows)),
          dict(collections.Counter(r["test_status"] for r in rows)),
          hashlib.sha256(args.out.read_bytes()).hexdigest())

if __name__ == "__main__":
    main()
