#!/usr/bin/env python3
"""Agrega o pull video/ad-level do Google Ads (BR) por video_id.
Entrada: data/raw/google_ads/br_video_ad_level_last90d_RAW.json
Saida:   data/processed/google_ads_video_summary_last90d.json
"""
import json
from collections import defaultdict

SRC = "/home/user/New/data/raw/google_ads/br_video_ad_level_last90d_RAW.json"
OUT = "/home/user/New/data/processed/google_ads_video_summary_last90d.json"

rows = json.load(open(SRC))["result"]

by_video = defaultdict(lambda: {
    "video_id": None, "video_title": None, "video_channel_id": None,
    "campaigns": set(), "trueview_views": 0, "engagements": 0,
    "views_by_device": defaultdict(int), "views_by_network": defaultdict(int),
    "q25_weighted": 0.0, "q50_weighted": 0.0, "q75_weighted": 0.0, "q100_weighted": 0.0,
    "weight_sum": 0.0,
})

for r in rows:
    vid = r.get("video_id") or "(sem video_id)"
    e = by_video[vid]
    e["video_id"] = vid
    e["video_title"] = r.get("video_title")
    e["video_channel_id"] = r.get("video_channel_id")
    if r.get("campaign_name"):
        e["campaigns"].add(r["campaign_name"])
    views = r.get("video_trueview_views") or 0
    e["trueview_views"] += views
    e["engagements"] += r.get("engagements") or 0
    e["views_by_device"][r.get("device") or "(desconhecido)"] += views
    e["views_by_network"][r.get("ad_network_type") or "(desconhecido)"] += views
    w = views if views else 0
    for q, key in [("video_quartile_p25_rate","q25_weighted"),
                   ("video_quartile_p50_rate","q50_weighted"),
                   ("video_quartile_p75_rate","q75_weighted"),
                   ("video_quartile_p100_rate","q100_weighted")]:
        val = r.get(q)
        if val is not None:
            e[key] += val * w
    e["weight_sum"] += w

out = []
for vid, e in by_video.items():
    ws = e["weight_sum"] or 1
    out.append({
        "video_id": e["video_id"],
        "video_title": e["video_title"],
        "video_channel_id": e["video_channel_id"],
        "campaigns": sorted(e["campaigns"]),
        "trueview_views": e["trueview_views"],
        "engagements": e["engagements"],
        "views_by_device": dict(e["views_by_device"]),
        "views_by_network": dict(e["views_by_network"]),
        "quartile_p25_view_weighted_avg": round(e["q25_weighted"]/ws, 4),
        "quartile_p50_view_weighted_avg": round(e["q50_weighted"]/ws, 4),
        "quartile_p75_view_weighted_avg": round(e["q75_weighted"]/ws, 4),
        "quartile_p100_view_weighted_avg": round(e["q100_weighted"]/ws, 4),
    })

out.sort(key=lambda x: -x["trueview_views"])

result = {
    "source": "Windsor.ai google_ads (445-144-0907), agregado de linhas ad+device+network por video_id",
    "period": {"date_from": "2026-06-12", "date_to": "2026-09-09"},
    "note": "video_channel_id confirma que os vídeos usados nos anúncios pertencem ao canal UCb3H1VIsLk9l6xAz6eyyLwQ (STLFLIX BR), consistente com o YOUTUBE_CHANNEL_ID informado pelo usuário. Quartis sao media ponderada por trueview_views das combinacoes device/network (nao e a curva de retencao do YouTube Studio).",
    "videos_used_in_ads_count": len(out),
    "videos": out,
}
json.dump(result, open(OUT, "w"), ensure_ascii=False, indent=2)
print("videos distintos usados em ads (90d):", len(out))
print("total trueview_views (90d):", sum(v["trueview_views"] for v in out))
print()
print("Top 10 por trueview_views:")
for v in out[:10]:
    print(f"- {v['video_title'][:70]:70s} | views={v['trueview_views']:>8} | p100_avg={v['quartile_p100_view_weighted_avg']:.3f} | canal={v['video_channel_id']}")
