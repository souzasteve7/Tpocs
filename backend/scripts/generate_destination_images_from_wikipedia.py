#!/usr/bin/env python3
"""
Generate destination image URLs from the Wikipedia Summary API and output/update
an SQL UPDATE block for destinations.image_url in data.sql.

Usage:
  python backend/scripts/generate_destination_images_from_wikipedia.py --sql backend/src/main/resources/data.sql
  python backend/scripts/generate_destination_images_from_wikipedia.py --sql backend/src/main/resources/data.sql --write

Notes:
- Uses Wikipedia thumbnail first, then originalimage.
- If lookup fails, falls back to existing image_url value in destinations row (if present),
  otherwise falls back to the wiki page URL.
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

DESTINATION_WIKI_TITLES: Dict[int, str] = {
    1: "Paris",
    2: "Tokyo",
    3: "New_York_City",
    4: "London",
    5: "Barcelona",
    6: "Rome",
    7: "Sydney",
    8: "Istanbul",
    9: "Bangkok",
    10: "Singapore",
    11: "Dubai",
    12: "Kuala_Lumpur",
    13: "Colombo",
    14: "Kathmandu",
    15: "Ho_Chi_Minh_City",
    16: "Bali",
    17: "Maldives",
    18: "Seoul",
    19: "Bhutan",
    20: "Doha",
    21: "Mumbai",
    22: "Delhi",
    23: "Goa",
    24: "Kerala",
    25: "Rajasthan",
    26: "Kashmir",
    27: "Ladakh",
    28: "Himachal_Pradesh",
    29: "Tamil_Nadu",
    30: "Karnataka",
    31: "Uttarakhand",
    32: "Andhra_Pradesh",
    33: "West_Bengal",
    34: "Gujarat",
    35: "Islamabad",
    36: "Lahore",
    37: "Karachi",
    38: "Kandy",
    39: "Galle",
    40: "Nuwara_Eliya",
    41: "Pokhara",
    42: "Chitwan_National_Park",
    43: "Abu_Dhabi",
    44: "Sharjah",
    45: "Muscat",
}

DESTINATION_IMAGE_OVERRIDES: Dict[int, str] = {
    26: "https://en.wikipedia.org/wiki/Special:FilePath/Pahalgam_Valley.jpg",
}

DESTINATION_INSERT_RE = re.compile(
    r"INSERT INTO destinations \(.*?\) VALUES\n(?P<body>.*?);",
    re.DOTALL,
)

DESTINATION_ROW_RE = re.compile(r"\((?P<id>\d+),\s*'(?P<name>(?:[^']|'')*)'.*?\)", re.DOTALL)

IMAGE_BLOCK_RE = re.compile(
    r"-- Destination image updates \(Wikipedia\)\n(?P<body>.*?)\n-- End destination image updates",
    re.DOTALL,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate destination image URL updates from Wikipedia")
    parser.add_argument("--sql", required=True, help="Path to data.sql")
    parser.add_argument("--write", action="store_true", help="Write generated block back to SQL file")
    parser.add_argument("--sleep", type=float, default=0.15, help="Sleep between API calls")
    parser.add_argument("--request-timeout", type=float, default=6.0, help="HTTP timeout in seconds for each Wikipedia request")
    parser.add_argument("--strict", action="store_true", help="Fail if any title cannot return image")
    return parser.parse_args()


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def wikipedia_page_url(title: str) -> str:
    return f"https://en.wikipedia.org/wiki/{title}"


def fetch_wikipedia_image(title: str, request_timeout: float) -> str | None:
    encoded_title = urllib.parse.quote(title, safe="")
    url = f"{WIKI_API_BASE}{encoded_title}"

    req = urllib.request.Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": "RoamyDestinationImageSeeder/1.0 (https://example.com; contact: dev@roamy.local)",
            "Accept-Language": "en-US,en;q=0.9",
        },
        method="GET",
    )

    with urllib.request.urlopen(req, timeout=max(1.0, request_timeout)) as resp:
        payload = json.loads(resp.read().decode("utf-8"))

    thumbnail = (payload.get("thumbnail") or {}).get("source")
    if thumbnail:
        return thumbnail

    original_image = (payload.get("originalimage") or {}).get("source")
    if original_image:
        return original_image

    return None


def extract_destination_rows(sql_text: str) -> Dict[int, str]:
    match = DESTINATION_INSERT_RE.search(sql_text)
    if not match:
        raise ValueError("Could not locate destinations insert block")

    body = match.group("body")
    rows: Dict[int, str] = {}

    for row_match in DESTINATION_ROW_RE.finditer(body):
        destination_id = int(row_match.group("id"))
        destination_name = row_match.group("name").replace("''", "'").strip()
        rows[destination_id] = destination_name

    if not rows:
        raise ValueError("No destination rows found in destinations insert block")

    return rows


def extract_existing_image_urls(sql_text: str) -> Dict[int, str]:
    existing: Dict[int, str] = {}

    block_match = IMAGE_BLOCK_RE.search(sql_text)
    if block_match:
        for row in re.finditer(r"WHERE id = (?P<id>\d+);", block_match.group("body")):
            pass

    for row_match in re.finditer(r"\((?P<id>\d+),.*?\)", sql_text, re.DOTALL):
        _ = row_match

    return existing


def generate_rows(destination_rows: Dict[int, str], sleep_s: float, strict: bool, request_timeout: float) -> List[Tuple[int, str, str]]:
    rows: List[Tuple[int, str, str]] = []
    failures: List[str] = []

    for destination_id in sorted(DESTINATION_WIKI_TITLES.keys()):
        title = DESTINATION_WIKI_TITLES[destination_id]
        destination_name = destination_rows.get(destination_id, title.replace("_", " "))

        image_url: str | None = DESTINATION_IMAGE_OVERRIDES.get(destination_id)
        if not image_url:
            try:
                image_url = fetch_wikipedia_image(title, request_timeout)
            except Exception as exc:
                failures.append(f"API failed for {title}: {exc}")

        if not image_url:
            image_url = wikipedia_page_url(title)
            if strict:
                failures.append(f"No image returned for {title}")

        rows.append((destination_id, image_url, destination_name))
        time.sleep(max(0.0, sleep_s))

    if strict and failures:
        raise RuntimeError("; ".join(failures))

    if failures:
        print("Warnings:", file=sys.stderr)
        for item in failures:
            print(f"- {item}", file=sys.stderr)

    return rows


def render_update_block(rows: List[Tuple[int, str, str]]) -> str:
    lines = ["-- Destination image updates (Wikipedia)"]
    for destination_id, image_url, destination_name in rows:
        safe_name = destination_name.replace("\n", " ").strip()
        lines.append(f"UPDATE destinations SET image_url = '{image_url}' WHERE id = {destination_id}; -- {safe_name}")
    lines.append("-- End destination image updates")
    return "\n".join(lines)


def replace_or_insert_block(sql_text: str, block: str) -> str:
    existing_block = IMAGE_BLOCK_RE.search(sql_text)
    if existing_block:
        start, end = existing_block.span()
        return sql_text[:start] + block + sql_text[end:]

    destinations_match = DESTINATION_INSERT_RE.search(sql_text)
    if not destinations_match:
        raise ValueError("Could not locate destinations insert block for insertion")

    insert_pos = destinations_match.end()
    return sql_text[:insert_pos] + "\n\n" + block + sql_text[insert_pos:]


def main() -> int:
    args = parse_args()
    sql_path = Path(args.sql)

    if not sql_path.exists():
        print(f"SQL file not found: {sql_path}", file=sys.stderr)
        return 1

    sql_text = read_text(sql_path)

    try:
        destination_rows = extract_destination_rows(sql_text)
        rows = generate_rows(destination_rows, args.sleep, args.strict, args.request_timeout)
        block = render_update_block(rows)
    except Exception as exc:
        print(f"Failed generating destination image rows: {exc}", file=sys.stderr)
        return 1

    if args.write:
        try:
            updated_sql = replace_or_insert_block(sql_text, block)
            sql_path.write_text(updated_sql, encoding="utf-8")
            print(f"Updated destination image block in: {sql_path}")
        except Exception as exc:
            print(f"Failed updating SQL file: {exc}", file=sys.stderr)
            return 1
    else:
        print(block)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
