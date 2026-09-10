#!/usr/bin/env python3
"""Inventario completo de videos do canal STLFLIX BR via YouTube Data API v3
(modo API key - estatisticas publicas e vitalicias, sem filtro de periodo).

Le YOUTUBE_API_KEY / YOUTUBE_CHANNEL_ID de .env.local. Nao imprime a chave.
Salva raw paginado em data/raw/youtube/ e um inventario consolidado em
data/processed/youtube_video_inventory.json.
"""
import json
import os
import time
import urllib.request
import urllib.parse

BASE = "/home/user/New"

def load_env():
    env = {}
    with open(f"{BASE}/.env.local") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k] = v
    return env

env = load_env()
API_KEY = env["YOUTUBE_API_KEY"]
CHANNEL_ID = env["YOUTUBE_CHANNEL_ID"]

def api_get(endpoint, params):
    params = {**params, "key": API_KEY}
    url = f"https://www.googleapis.com/youtube/v3/{endpoint}?{urllib.parse.urlencode(params)}"
    with urllib.request.urlopen(url, timeout=30) as r:
        return json.load(r)

# 1) canal -> uploads playlist id
ch = api_get("channels", {"part": "contentDetails,statistics,snippet", "id": CHANNEL_ID})
uploads_playlist = ch["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
channel_stats = ch["items"][0]["statistics"]
print("Uploads playlist:", uploads_playlist)
print("Canal (lifetime):", channel_stats)

# 2) paginar playlistItems -> lista de video ids
video_ids = []
page_token = None
raw_pages = []
while True:
    params = {"part": "snippet,contentDetails", "playlistId": uploads_playlist, "maxResults": 50}
    if page_token:
        params["pageToken"] = page_token
    resp = api_get("playlistItems", params)
    raw_pages.append(resp)
    for it in resp.get("items", []):
        vid = it["contentDetails"]["videoId"]
        video_ids.append(vid)
    page_token = resp.get("nextPageToken")
    if not page_token:
        break
    time.sleep(0.05)

print("Total de video IDs coletados (uploads playlist):", len(video_ids))
os.makedirs(f"{BASE}/data/raw/youtube", exist_ok=True)
json.dump({"uploads_playlist": uploads_playlist, "pages": raw_pages},
          open(f"{BASE}/data/raw/youtube/playlist_items_RAW.json", "w"), ensure_ascii=False)

# 3) videos.list em lotes de 50 para detalhes (snippet, statistics, contentDetails)
def chunks(lst, n):
    for i in range(0, len(lst), n):
        yield lst[i:i+n]

all_video_details = []
for batch in chunks(video_ids, 50):
    resp = api_get("videos", {
        "part": "snippet,statistics,contentDetails,status",
        "id": ",".join(batch),
    })
    all_video_details.extend(resp.get("items", []))
    time.sleep(0.05)

json.dump({"videos": all_video_details}, open(f"{BASE}/data/raw/youtube/videos_details_RAW.json", "w"), ensure_ascii=False)
print("Total de videos com detalhes:", len(all_video_details))

# 4) inventario consolidado e enxuto
def parse_duration_seconds(iso_dur):
    # PT#H#M#S
    import re
    m = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso_dur or "")
    if not m:
        return None
    h, mnt, s = (int(x) if x else 0 for x in m.groups())
    return h*3600 + mnt*60 + s

inventory = []
for v in all_video_details:
    sn = v.get("snippet", {})
    st = v.get("statistics", {})
    cd = v.get("contentDetails", {})
    dur_s = parse_duration_seconds(cd.get("duration"))
    fmt = "short" if (dur_s is not None and dur_s <= 60) else ("live" if sn.get("liveBroadcastContent") == "was_live" else "long")
    inventory.append({
        "video_id": v["id"],
        "url": f"https://www.youtube.com/watch?v={v['id']}",
        "title": sn.get("title"),
        "description": sn.get("description"),
        "published_at": sn.get("publishedAt"),
        "channel_id": sn.get("channelId"),
        "category_id": sn.get("categoryId"),
        "tags": sn.get("tags", []),
        "duration_seconds": dur_s,
        "format_guess": fmt,
        "privacy_status": v.get("status", {}).get("privacyStatus"),
        "caption_available": cd.get("caption") == "true",
        "definition": cd.get("definition"),
        "view_count": int(st.get("viewCount", 0)) if st.get("viewCount") is not None else None,
        "like_count": int(st.get("likeCount")) if st.get("likeCount") is not None else None,
        "comment_count": int(st.get("commentCount")) if st.get("commentCount") is not None else None,
        "thumbnail": (sn.get("thumbnails", {}).get("high") or sn.get("thumbnails", {}).get("default") or {}).get("url"),
    })

inventory.sort(key=lambda x: x["published_at"] or "")

out = {
    "source": "YouTube Data API v3 (modo API key, estatisticas vitalicias/publicas)",
    "extracted_at": "2026-09-10",
    "channel": {
        "channel_id": CHANNEL_ID,
        "title": ch["items"][0]["snippet"]["title"],
        "custom_url": ch["items"][0]["snippet"].get("customUrl"),
        "country": ch["items"][0]["snippet"].get("country"),
        "published_at": ch["items"][0]["snippet"].get("publishedAt"),
        "subscriber_count": int(channel_stats.get("subscriberCount", 0)),
        "view_count": int(channel_stats.get("viewCount", 0)),
        "video_count_reported": int(channel_stats.get("videoCount", 0)),
    },
    "video_count_inventoried": len(inventory),
    "videos": inventory,
}
os.makedirs(f"{BASE}/data/processed", exist_ok=True)
json.dump(out, open(f"{BASE}/data/processed/youtube_video_inventory.json", "w"), ensure_ascii=False, indent=2)

print()
print("=== RESUMO ===")
print("Videos inventariados:", len(inventory))
print("Shorts (<=60s):", sum(1 for v in inventory if v["format_guess"] == "short"))
print("Longos:", sum(1 for v in inventory if v["format_guess"] == "long"))
print("Com legenda disponivel (caption=true):", sum(1 for v in inventory if v["caption_available"]))
print("Privados/nao publicos:", sum(1 for v in inventory if v["privacy_status"] != "public"))
