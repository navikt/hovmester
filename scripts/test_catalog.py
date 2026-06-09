# scripts/test_catalog.py
"""Vokter for Aksel Figma-katalogen.

JSON (aksel-figma-katalog.json) er kilde til sannhet for verktøy/automasjon.
Markdown (aksel-figma-katalog.md) er det lesbare laget for agent-kontekst.
Disse testene sikrer at de to ikke drifter fra hverandre, og at JSON er
internt konsistent (gyldige akser, defaults, countAxis, slot, kind, keys).
"""

import json
import os
import re

REPO_ROOT = os.path.join(os.path.dirname(__file__), "..")
REF_DIR = os.path.join(
    REPO_ROOT, "dist", "skills", "prototype", "references"
)
JSON_PATH = os.path.join(REF_DIR, "aksel-figma-katalog.json")
MD_PATH = os.path.join(REF_DIR, "aksel-figma-katalog.md")
GITHUB_JSON_PATH = os.path.join(
    REPO_ROOT, ".github", "skills", "prototype", "references",
    "aksel-figma-katalog.json",
)

VALID_KINDS = {"componentSet", "component"}
HEX40 = re.compile(r"^[0-9a-f]{40}$")


def _load():
    with open(JSON_PATH, encoding="utf-8") as f:
        return json.load(f)


def _all_keys(comp):
    """Alle Figma-keys for en komponent (key, keys{}, keyHorizontal, ...)."""
    keys = []
    if "key" in comp:
        keys.append(comp["key"])
    if "keys" in comp:
        keys.extend(comp["keys"].values())
    for extra in ("keyHorizontal", "keyFerdigMal"):
        if extra in comp:
            keys.append(comp[extra])
    return keys


def test_json_is_valid_and_has_components():
    d = _load()
    assert isinstance(d.get("komponenter"), list)
    assert len(d["komponenter"]) > 0
    assert isinstance(d.get("kunKode"), list)


def test_each_component_has_required_fields():
    d = _load()
    for c in d["komponenter"]:
        navn = c.get("navn")
        assert navn, f"komponent mangler navn: {c}"
        assert c.get("kind") in VALID_KINDS, f"{navn}: ugyldig kind {c.get('kind')}"
        assert "axes" in c, f"{navn}: mangler axes"
        assert "textNodes" in c, f"{navn}: mangler textNodes"
        assert _all_keys(c), f"{navn}: mangler key/keys"


def test_all_keys_are_40_char_hex():
    d = _load()
    for c in d["komponenter"]:
        for k in _all_keys(c):
            assert HEX40.match(k), f"{c['navn']}: ugyldig key {k!r}"


def test_axes_defaults_are_within_values():
    d = _load()
    for c in d["komponenter"]:
        for ax in c["axes"]:
            assert "navn" in ax and "verdier" in ax and "default" in ax, (
                f"{c['navn']}: ufullstendig akse {ax}"
            )
            assert ax["default"] in ax["verdier"], (
                f"{c['navn']}: default {ax['default']!r} ikke i "
                f"{ax['navn']}-verdier"
            )


def test_count_axis_references_existing_axis():
    d = _load()
    for c in d["komponenter"]:
        if "countAxis" in c:
            axis_names = {ax["navn"] for ax in c["axes"]}
            assert c["countAxis"] in axis_names, (
                f"{c['navn']}: countAxis {c['countAxis']!r} finnes ikke i akser"
            )


def test_slot_is_bool_when_present():
    d = _load()
    for c in d["komponenter"]:
        if "slot" in c:
            assert isinstance(c["slot"], bool), f"{c['navn']}: slot må være bool"


def test_dekning_matches_actual_counts():
    d = _load()
    dek = d["dekning"]
    assert dek["iFigma"] == len(d["komponenter"]), "dekning.iFigma != antall komponenter"
    assert dek["kunKode"] == len(d["kunKode"]), "dekning.kunKode != antall kunKode"
    assert dek["totalt"] == dek["iFigma"] + dek["kunKode"], "dekning.totalt feil sum"


def test_markdown_mirrors_json_components():
    """Hvert JSON-komponentnavn og hver key må finnes i markdown-katalogen."""
    d = _load()
    with open(MD_PATH, encoding="utf-8") as f:
        md = f.read()
    for c in d["komponenter"]:
        assert re.search(rf"^\|\s*{re.escape(c['navn'])}\s*\|", md, re.M), (
            f"komponent {c['navn']} mangler som tabellrad i markdown"
        )
        for k in _all_keys(c):
            assert k in md, f"{c['navn']}: key {k} mangler i markdown"


def test_markdown_mirrors_json_kunkode():
    d = _load()
    with open(MD_PATH, encoding="utf-8") as f:
        md = f.read()
    for c in d["kunKode"]:
        # navn kan ha parentes-suffix i md (f.eks. "Navpoleonskake (Breadcrumbs)")
        base = c["navn"].split(" (")[0]
        assert base in md, f"kun-kode {c['navn']} mangler i markdown"


def test_markdown_dekning_line_matches_json():
    d = _load()
    with open(MD_PATH, encoding="utf-8") as f:
        md = f.read()
    expected = f"{d['dekning']['iFigma']}/{d['dekning']['totalt']}"
    assert expected in md, f"markdown mangler dekningstall {expected}"


def test_github_mirror_json_matches_dist():
    assert os.path.isfile(GITHUB_JSON_PATH), (
        f"forventet .github-speil mangler: {GITHUB_JSON_PATH} (kjør self-sync)"
    )
    with open(JSON_PATH, encoding="utf-8") as f:
        dist = f.read()
    with open(GITHUB_JSON_PATH, encoding="utf-8") as f:
        mirror = f.read()
    assert dist == mirror, "JSON-katalog: .github-speil != dist"
