#!/usr/bin/env python3
"""Resumo do inventario organico do YouTube para uso no dashboard."""
import json
from collections import Counter, defaultdict

BASE = "/home/user/New"
inv = json.load(open(f"{BASE}/data/processed/youtube_video_inventory.json"))
vids = inv["videos"]

cadence = Counter(v["published_at"][:7] for v in vids if v.get("published_at"))
by_format = Counter(v["format_guess"] for v in vids)

top_by_views = sorted(vids, key=lambda v: -(v["view_count"] or 0))[:20]
top_by_likes_ratio = sorted(
    [v for v in vids if (v["view_count"] or 0) >= 1000],
    key=lambda v: -((v["like_count"] or 0) / max(v["view_count"], 1)),
)[:20]

out = {
    "source": "YouTube Data API v3 (API key), estatisticas vitalicias, canal UCb3H1VIsLk9l6xAz6eyyLwQ",
    "extracted_at": "2026-09-10",
    "channel": inv["channel"],
    "video_count_inventoried": inv["video_count_inventoried"],
    "by_format": dict(by_format),
    "publish_cadence_by_month": dict(sorted(cadence.items())),
    "top_videos_by_views": [
        {"video_id": v["video_id"], "title": v["title"], "view_count": v["view_count"],
         "like_count": v["like_count"], "comment_count": v["comment_count"],
         "duration_seconds": v["duration_seconds"], "format_guess": v["format_guess"],
         "published_at": v["published_at"]}
        for v in top_by_views
    ],
    "top_videos_by_like_ratio_min1000views": [
        {"video_id": v["video_id"], "title": v["title"], "view_count": v["view_count"],
         "like_count": v["like_count"], "like_ratio": round((v["like_count"] or 0) / max(v["view_count"], 1), 4),
         "format_guess": v["format_guess"]}
        for v in top_by_likes_ratio
    ],
}
json.dump(out, open(f"{BASE}/data/processed/youtube_organic_summary.json", "w"), ensure_ascii=False, indent=2)
print("ok - resumo organico salvo")
print("Formatos:", dict(by_format))
