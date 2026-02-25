#!/usr/bin/env python3
"""
Generate attraction image URLs from the Wikipedia Summary API and output/update
an INSERT block for attraction_images in data.sql.

Usage:
  python backend/scripts/generate_attraction_images_from_wikipedia.py --sql backend/src/main/resources/data.sql
  python backend/scripts/generate_attraction_images_from_wikipedia.py --sql backend/src/main/resources/data.sql --write

Notes:
- Tries Wikipedia thumbnail first, then originalimage.
- If API lookup fails for an attraction, falls back to the existing URL currently in
  attraction_images block (if present), otherwise falls back to the wiki page URL.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Dict, List, Tuple

WIKI_API_BASE = "https://en.wikipedia.org/api/rest_v1/page/summary/"

WIKI_TITLES: Dict[int, str] = {
    1: "Eiffel_Tower",
    2: "Louvre",
    3: "Sensō-ji",
    4: "Tokyo_Skytree",
    5: "Central_Park",
    6: "Statue_of_Liberty",
    7: "British_Museum",
    8: "Tower_of_London",
    9: "Gateway_of_India",
    10: "Elephanta_Caves",
    11: "Marine_Drive,_Mumbai",
    12: "Red_Fort",
    13: "India_Gate",
    14: "Qutb_Minar",
    15: "Basilica_of_Bom_Jesus",
    16: "Dudhsagar_Falls",
    17: "Baga,_Goa",
    18: "Kerala_backwaters",
    19: "Munnar",
    20: "Chinese_fishing_nets",
    21: "Hawa_Mahal",
    22: "City_Palace,_Jaipur",
    23: "Amber_Fort",
    24: "Dal_Lake",
    25: "Shalimar_Bagh,_Srinagar",
    26: "Gulmarg",
    27: "Leh_Palace",
    28: "Pangong_Tso",
    29: "Nubra_Valley",
    30: "Shimla",
    31: "Rohtang_Pass",
    32: "Faisal_Mosque",
    33: "Badshahi_Mosque",
    34: "Clifton,_Karachi",
    35: "Temple_of_the_Tooth",
    36: "Galle_Fort",
    37: "Horton_Plains_National_Park",
    38: "Phewa_Lake",
    39: "Sheikh_Zayed_Grand_Mosque",
    40: "Louvre_Abu_Dhabi",
}

ATTRACTION_IMAGES_BLOCK_RE = re.compile(
    r"INSERT INTO attraction_images \(attraction_id, image_url\) VALUES\n(?P<body>.*?);",
    re.DOTALL,
)

ATTRACTION_IMAGE_ROW_RE = re.compile(r"\((?P<id>\d+),\s*'(?P<url>[^']+)'\)")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate attraction image URLs from Wikipedia")
    parser.add_argument("--sql", required=True, help="Path to data.sql")
    parser.add_argument("--write", action="store_true", help="Write the generated block back to SQL file")
    parser.add_argument("--sleep", type=float, default=0.15, help="Sleep between API calls")
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Fail if any title cannot return an image URL",
    )
    return parser.parse_args()


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def extract_existing_attraction_urls(sql_text: str) -> Dict[int, str]:
    match = ATTRACTION_IMAGES_BLOCK_RE.search(sql_text)
    if not match:
        return {}

    rows_text = match.group("body")
    existing: Dict[int, str] = {}
    for row in ATTRACTION_IMAGE_ROW_RE.finditer(rows_text):
        existing[int(row.group("id"))] = row.group("url")

    return existing


def wikipedia_page_url(title: str) -> str:
    return f"https://en.wikipedia.org/wiki/{title}"


def fetch_wikipedia_image(title: str) -> str | None:
    encoded_title = urllib.parse.quote(title, safe="")
    url = f"{WIKI_API_BASE}{encoded_title}"

    req = urllib.request.Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": "RoamyImageSeeder/1.0 (https://example.com; contact: dev@roamy.local)",
            "Accept-Language": "en-US,en;q=0.9",
        },
        method="GET",
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        payload = json.loads(resp.read().decode("utf-8"))

    thumbnail = (payload.get("thumbnail") or {}).get("source")
    if thumbnail:
        return thumbnail

    original_image = (payload.get("originalimage") or {}).get("source")
    if original_image:
        return original_image

    return None


def generate_rows(existing_urls: Dict[int, str], sleep_s: float, strict: bool) -> List[Tuple[int, str, str]]:
    rows: List[Tuple[int, str, str]] = []
    failures: List[str] = []

    for attraction_id in sorted(WIKI_TITLES.keys()):
        title = WIKI_TITLES[attraction_id]
        url: str | None = None

        try:
            url = fetch_wikipedia_image(title)
        except Exception as exc:
            failures.append(f"API failed for {title}: {exc}")

        if not url:
            url = existing_urls.get(attraction_id) or wikipedia_page_url(title)
            if strict and attraction_id not in existing_urls:
                failures.append(f"No image returned for {title}")

        rows.append((attraction_id, url, title.replace("_", " ")))
        time.sleep(max(0.0, sleep_s))

    if strict and failures:
        raise RuntimeError("; ".join(failures))

    if failures:
        print("Warnings:", file=sys.stderr)
        for item in failures:
            print(f"- {item}", file=sys.stderr)

    return rows


def render_block(rows: List[Tuple[int, str, str]]) -> str:
    lines = ["INSERT INTO attraction_images (attraction_id, image_url) VALUES"]
    for idx, (attraction_id, image_url, label) in enumerate(rows):
        suffix = "," if idx < len(rows) - 1 else ";"
        lines.append(f"({attraction_id}, '{image_url}'){suffix} -- {label}")
    return "\n".join(lines)


def replace_block(sql_text: str, new_block: str) -> str:
    match = ATTRACTION_IMAGES_BLOCK_RE.search(sql_text)
    if not match:
        raise ValueError("Could not locate attraction_images block for replacement")

    start, end = match.span()
    return sql_text[:start] + new_block + sql_text[end:]


def main() -> int:
    args = parse_args()
    sql_path = Path(args.sql)

    if not sql_path.exists():
        print(f"SQL file not found: {sql_path}", file=sys.stderr)
        return 1

    sql_text = read_text(sql_path)
    existing_urls = extract_existing_attraction_urls(sql_text)

    try:
        rows = generate_rows(existing_urls, args.sleep, args.strict)
    except Exception as exc:
        print(f"Failed generating attraction image rows: {exc}", file=sys.stderr)
        return 1

    new_block = render_block(rows)

    if args.write:
        try:
            updated_sql = replace_block(sql_text, new_block)
        except Exception as exc:
            print(f"Failed replacing attraction_images block: {exc}", file=sys.stderr)
            return 1

        sql_path.write_text(updated_sql, encoding="utf-8")
        print(f"Updated attraction_images block in: {sql_path}")
    else:
        print(new_block)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
