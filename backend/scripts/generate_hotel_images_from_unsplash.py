#!/usr/bin/env python3
"""
Generate hotel image URLs from Unsplash API and update the hotel_images block in data.sql.

Usage:
  python backend/scripts/generate_hotel_images_from_unsplash.py --sql backend/src/main/resources/data.sql --write

Environment:
  UNSPLASH_ACCESS_KEY=<your_unsplash_access_key>
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple


@dataclass
class HotelImageRow:
    hotel_id: int
    hotel_name: str
    image_url: str


HOTELS_BLOCK_RE = re.compile(
    r"INSERT INTO hotels \(id, name, address, destination_id, latitude, longitude, description, star_rating, price_per_night, currency, average_rating, total_reviews, phone_number, website, available, featured, check_in_time, check_out_time\) VALUES\n(?P<body>.*?);",
    re.DOTALL,
)

HOTEL_IMAGES_BLOCK_RE = re.compile(
    r"INSERT INTO hotel_images \(hotel_id, image_url\) VALUES\n(?P<body>.*?);",
    re.DOTALL,
)

HOTEL_ROW_RE = re.compile(r"\((?P<id>\d+),\s*'(?P<name>(?:[^']|'' )*[^']*)'", re.MULTILINE)
HOTEL_IMAGE_ROW_RE = re.compile(r"\((?P<id>\d+),\s*'(?P<url>[^']+)'\)")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate hotel image URLs from Unsplash API")
    parser.add_argument("--sql", required=True, help="Path to data.sql")
    parser.add_argument("--write", action="store_true", help="Write changes back to SQL file")
    parser.add_argument("--sleep", type=float, default=0.2, help="Sleep between API calls")
    return parser.parse_args()


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def extract_hotels(sql_text: str) -> Dict[int, str]:
    match = HOTELS_BLOCK_RE.search(sql_text)
    if not match:
        raise ValueError("Could not locate INSERT INTO hotels block")

    body = match.group("body")
    hotels: Dict[int, str] = {}

    for row_match in HOTEL_ROW_RE.finditer(body):
        hotel_id = int(row_match.group("id"))
        hotel_name = row_match.group("name").replace("''", "'").strip()
        hotels[hotel_id] = hotel_name

    if not hotels:
        raise ValueError("No hotels found in hotels block")

    return hotels


def extract_hotel_image_ids(sql_text: str) -> List[int]:
    match = HOTEL_IMAGES_BLOCK_RE.search(sql_text)
    if not match:
        raise ValueError("Could not locate INSERT INTO hotel_images block")

    body = match.group("body")
    ids: List[int] = []
    for row_match in HOTEL_IMAGE_ROW_RE.finditer(body):
        ids.append(int(row_match.group("id")))

    if not ids:
        raise ValueError("No rows found in hotel_images block")

    return ids


def unsplash_search_first(access_key: str, query: str) -> str:
    params = {
        "query": query,
        "per_page": 1,
        "page": 1,
        "orientation": "landscape",
        "content_filter": "high",
    }
    url = "https://api.unsplash.com/search/photos?" + urllib.parse.urlencode(params)

    req = urllib.request.Request(
        url,
        headers={
            "Authorization": f"Client-ID {access_key}",
            "Accept-Version": "v1",
        },
        method="GET",
    )

    with urllib.request.urlopen(req, timeout=30) as response:
        payload = json.loads(response.read().decode("utf-8"))

    results = payload.get("results") or []
    if not results:
        raise ValueError(f"No Unsplash results for query: {query}")

    raw_url = results[0].get("urls", {}).get("raw")
    if not raw_url:
        raise ValueError(f"No raw url in Unsplash response for query: {query}")

    separator = "&" if "?" in raw_url else "?"
    return f"{raw_url}{separator}auto=format&fit=crop&w=1200&q=80"


def build_rows(hotels: Dict[int, str], hotel_image_ids: List[int], access_key: str, sleep_s: float) -> List[HotelImageRow]:
    rows: List[HotelImageRow] = []

    for hotel_id in hotel_image_ids:
        hotel_name = hotels.get(hotel_id)
        if not hotel_name:
            raise ValueError(f"Hotel id {hotel_id} exists in hotel_images but not in hotels")

        search_query = f"{hotel_name} hotel exterior"
        image_url = unsplash_search_first(access_key, search_query)
        rows.append(HotelImageRow(hotel_id=hotel_id, hotel_name=hotel_name, image_url=image_url))
        time.sleep(max(0.0, sleep_s))

    return rows


def render_hotel_images_block(rows: List[HotelImageRow]) -> str:
    lines = ["INSERT INTO hotel_images (hotel_id, image_url) VALUES"]
    for idx, row in enumerate(rows):
        suffix = "," if idx < len(rows) - 1 else ";"
        lines.append(f"({row.hotel_id}, '{row.image_url}'){suffix} -- {row.hotel_name}")
    return "\n".join(lines)


def replace_hotel_images_block(sql_text: str, new_block: str) -> str:
    match = HOTEL_IMAGES_BLOCK_RE.search(sql_text)
    if not match:
        raise ValueError("Could not locate hotel_images block for replacement")

    start, end = match.span()
    return sql_text[:start] + new_block + sql_text[end:]


def main() -> int:
    args = parse_args()
    sql_path = Path(args.sql)
    if not sql_path.exists():
        print(f"SQL file not found: {sql_path}", file=sys.stderr)
        return 1

    access_key = os.getenv("UNSPLASH_ACCESS_KEY", "").strip()
    if not access_key:
        print("UNSPLASH_ACCESS_KEY is required", file=sys.stderr)
        return 1

    sql_text = read_text(sql_path)

    hotels = extract_hotels(sql_text)
    hotel_image_ids = extract_hotel_image_ids(sql_text)

    try:
        rows = build_rows(hotels, hotel_image_ids, access_key, args.sleep)
    except Exception as exc:
        print(f"Failed generating rows: {exc}", file=sys.stderr)
        return 1

    new_block = render_hotel_images_block(rows)

    if args.write:
        updated_sql = replace_hotel_images_block(sql_text, new_block)
        sql_path.write_text(updated_sql, encoding="utf-8")
        print(f"Updated hotel_images block in: {sql_path}")
    else:
        print(new_block)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
