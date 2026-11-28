"""Exercise the pinned consultation test and record its demo payload separately from the chosen slot."""
import hashlib
import json
import subprocess
import sys
import tempfile
from pathlib import Path

output = Path("docs/sdd/SEL-2026.11.27-v1.0.0/execution")
source = Path("tests/consultation.mjs")
sha = subprocess.check_output(["git","rev-parse","--verify",sys.argv[1]+"^{commit}"],text=True).strip()
source_bytes = subprocess.check_output(["git","show",sha+":"+str(source)])
fixture = source_bytes.decode()
insert_before = "  await click('.consultation-success button');"
assert fixture.count(insert_before) == 1
observations = """
  const fieldNames = Object.keys(rows[0].fields).sort();
  assert.deepEqual(fieldNames,['email','message']);
  assert.equal(rows[0].name,'Ví dụ');
  assert.equal(rows[0].phone,'0912345678');
  const contactLink = document.querySelector('.consultation-back[href="/contact"]');
  assert.ok(contactLink, 'the demo receipt has a path back to Contact');
  assert.match(success.textContent,/Không có lịch hẹn thực tế/);
  console.log('TRACE_RECORD '+JSON.stringify({receipt:success.textContent,fieldNames,type:rows[0].type,
    source:rows[0].source,message:rows[0].fields.message,count:rows.length,contactHref:contactLink.getAttribute('href')}));
"""
fixture = fixture.replace(insert_before,observations+insert_before)
with tempfile.TemporaryDirectory(prefix="s2-booking-") as temporary:
    checkout = Path(temporary)
    archive = subprocess.check_output(["git","archive",sha,"src","package.json","tsconfig.json"])
    subprocess.run(["tar","-x","-C",temporary],input=archive,check=True)
    (checkout/"node_modules").symlink_to(Path("node_modules").resolve(),target_is_directory=True)
    (checkout/"trace.mjs").write_text(fixture)
    run = subprocess.run(["node","trace.mjs"],cwd=checkout,capture_output=True,text=True)
log = output/"logs"/"trace-booking-functional.log"
log.write_text("sha="+sha+"\n"+run.stdout+run.stderr)
if run.returncode:
    raise SystemExit("Booking fixture failed; see "+str(log))
actual = json.loads(next(line.removeprefix("TRACE_RECORD ") for line in run.stdout.splitlines() if line.startswith("TRACE_RECORD ")))
assert "PASS contact details/form/map hierarchy" in run.stdout
proof = {
    "T15":"F02 is locked and produces one local receipt; no fetch call occurred.",
    "P38-B1":"Receipt labels the experience as a demonstration, gives a mock reference and explicitly says it created no real appointment.",
    "P38-C1":"Choose, enter required contact details, edit the slot, return, submit twice and reset; the fixture asserts focus at each stage.",
    "P38-C2":"Empty date and empty time focus their own invalid control. A chosen date that becomes past at midnight prevents submission, keeps the draft and updates min.",
    "P38-C3":"The F02 draft survives a slot change and the repeat-receipt button returns to an empty date step.",
    "P38-E1":"Only the locked F02 form is present in details. The single stored record is F02 from /consultation.",
    "P38-E2":"Submitting before the local date rollover is reconciled creates no record. Completing with valid date/time and contact and repeating submission creates one receipt.",
    "P38-E3":"The receipt displays the chosen slot and mock reference, links back to Contact, supports reset, creates one local record and sends no request.",
    "P38-F1":"The receipt has a localized date and time. The stored record keeps the name/phone at the top level and only email/message in fields, F02, source /consultation.",
}
partial = {"P38-B1":"Read labels/commitments throughout the entire flow in the other four locales."}
choices = [dict(choice_id=code,coverage="partial" if code in partial else "full",test_status="Pass",
                assertion=assertion,actual=actual,evidence_ref="logs/trace-booking-functional.log",
                remaining=partial.get(code,"")) for code,assertion in proof.items()]
(output/"trace-booking-functional.json").write_text(json.dumps(dict(build_sha=sha,source_test=str(source),
    source_sha256=hashlib.sha256(source_bytes).hexdigest(),instrumented_fixture_sha256=hashlib.sha256(fixture.encode()).hexdigest(),
    environment="Node, JSDOM, Vietnamese; mock clock and fetch bound to the fixture; no production scheduling.",choices=choices),
    ensure_ascii=False,indent=2)+"\n")
print(len(choices),"choice assertions",actual)
