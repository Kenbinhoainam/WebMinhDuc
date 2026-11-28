"""Inspect brand CSS roles and the shipped fonts. Does not sample browser pixels."""
import re
import subprocess
from pathlib import Path

tokens = dict(re.findall(r"--md-([a-z-]+):\s*(#[0-9a-f]{6});", Path("src/brand-colors.css").read_text()))

def luminance(color):
    channels = [int(color[i:i+2], 16) / 255 for i in (1, 3, 5)]
    linear = [v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in channels]
    return sum(v * coefficient for v, coefficient in zip(linear, (.2126, .7152, .0722)))

for fg, bg, minimum in [
    ("ink", "surface", 4.5), ("muted", "surface", 4.5), ("muted", "surface-blue", 4.5),
    ("surface", "red", 4.5), ("surface", "red-hover", 4.5), ("blue", "surface-blue", 4.5),
    ("blue-hover", "surface-blue", 4.5), ("focus", "surface", 3), ("control-border", "surface", 3),
]:
    dark, light = sorted(map(luminance, (tokens[fg], tokens[bg])))
    ratio = (light + .05) / (dark + .05)
    assert ratio >= minimum, (fg, bg, ratio)
    print(f"PASS S2-COLOR {fg} {tokens[fg]} / {bg} {tokens[bg]} = {ratio:.2f}:1 (opaque source colors)")

css = Path("src/brand-type.css").read_text()
for font in ["inter", "roboto"]:
    available = set()
    for subset in ["latin", "vietnamese"]:
        asset = f"/assets/fonts/{font}-{subset}-wght-normal.woff2"
        assert asset in css
        original = Path("public" + asset)
        info = subprocess.run(["fc-scan","--format","%{variable}|%{weight}|%{charset}\n",str(original)], check=True, capture_output=True, text=True)
        variable = [line.split("|") for line in info.stdout.splitlines() if line.startswith("True|")]
        assert len(variable) == 1 and "210" in variable[0][1], (font, subset, variable)
        for interval in variable[0][2].split():
            low, *high = [int(v, 16) for v in interval.split("-")]
            available.update(range(low, (high[0] if high else low) + 1))
    for sample in ["Nguyễn", "Ứng tuyển", "Đắk Lắk"]:
        assert set(map(ord,sample)) <= available, (font,sample)
    print(f"PASS S2-FONT {font} shipped variable Latin and Vietnamese faces cover Nguyễn, Ứng tuyển, Đắk Lắk (fontconfig cmap, no browser rendering assertion)")
