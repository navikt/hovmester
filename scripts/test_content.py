# scripts/test_content.py
"""Strukturelle innholdssjekker for dist/skills, dist/agents, dist/instructions."""

import os
import re
import pytest
import yaml

DIST = os.path.join(os.path.dirname(__file__), "..", "dist")


def test_all_skills_have_valid_frontmatter():
    skills_dir = os.path.join(DIST, "skills")
    for skill_name in os.listdir(skills_dir):
        skill_md = os.path.join(skills_dir, skill_name, "SKILL.md")
        if not os.path.isfile(skill_md):
            continue
        with open(skill_md) as f:
            content = f.read()
        assert content.startswith("---\n"), f"{skill_name}: missing frontmatter"
        end = content.find("\n---\n", 4)
        assert end > 0, f"{skill_name}: frontmatter not closed"
        fm = yaml.safe_load(content[4:end])
        assert "name" in fm, f"{skill_name}: missing name"
        assert "description" in fm, f"{skill_name}: missing description"
        assert fm["name"] == skill_name, f"{skill_name}: name mismatch ({fm['name']})"


def test_no_duplicate_skill_names():
    skills_dir = os.path.join(DIST, "skills")
    names = []
    for skill_name in os.listdir(skills_dir):
        skill_md = os.path.join(skills_dir, skill_name, "SKILL.md")
        if not os.path.isfile(skill_md):
            continue
        names.append(skill_name)
    assert len(names) == len(set(names)), f"duplicate names: {[n for n in names if names.count(n) > 1]}"


def test_all_references_exist():
    skills_dir = os.path.join(DIST, "skills")
    ref_pattern = re.compile(r"references/([a-z0-9\-]+\.md)")
    for skill_name in os.listdir(skills_dir):
        skill_md = os.path.join(skills_dir, skill_name, "SKILL.md")
        if not os.path.isfile(skill_md):
            continue
        with open(skill_md) as f:
            body = f.read()
        for ref_name in ref_pattern.findall(body):
            ref_path = os.path.join(skills_dir, skill_name, "references", ref_name)
            assert os.path.isfile(ref_path), f"{skill_name}: broken reference to references/{ref_name}"
