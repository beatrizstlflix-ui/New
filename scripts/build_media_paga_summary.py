#!/usr/bin/env python3
"""Junta metricas de campanha (90d) + conversoes por acao (90d) em um resumo
unico para o dashboard. Nao inventa numero: campos ausentes ficam None (null).
"""
import json

BASE = "/home/user/New/data"

metrics = json.load(open(f"{BASE}/raw/google_ads/br_campaign_metrics_last90d.json"))["rows"]
convs = {r["campaign_id"]: r for r in json.load(open(f"{BASE}/raw/google_ads/br_conversions_by_action_last90d.json"))["rows"]}

merged = []
for m in metrics:
    cid = m["campaign_id"]
    c = convs.get(cid, {})
    cost_brl = m["cost_micros"] / 1_000_000
    merged.append({
        "campaign_id": cid,
        "campaign_name": m["campaign_name"],
        "advertising_channel_type": m["advertising_channel_type"],
        "cost_brl": round(cost_brl, 2),
        "impressions": m["impressions"],
        "clicks": m["clicks"],
        "conversions_primary": m["conversions"],
        "conversions_value_primary_brl": m["conversions_value"],
        "all_conversions": m["all_conversions"],
        "all_conversions_value_brl": m["all_conversions_value"],
        "youtube_follow_on_views": c.get("all_conversions_youtube_follow_on_views"),
        "youtube_channel_subscriptions": c.get("all_conversions_youtube_channel_subscriptions"),
        "purchase_lp_ambiente_br": c.get("all_conversions_lp_ambiente_br_web_purchase"),
        "purchase_stlflix_geral": c.get("all_conversions_stlflix_geral_web_purchase"),
        "inicio_checkout": c.get("all_conversions_inicio_do_checkout"),
    })

merged.sort(key=lambda x: -x["cost_brl"])

total_cost = sum(x["cost_brl"] for x in merged)
total_video_cost = sum(x["cost_brl"] for x in merged if x["advertising_channel_type"] == "VIDEO")
total_demandgen_cost = sum(x["cost_brl"] for x in merged if x["advertising_channel_type"] == "DEMAND_GEN")
total_pmax_cost = sum(x["cost_brl"] for x in merged if x["advertising_channel_type"] == "PERFORMANCE_MAX")
total_display_cost = sum(x["cost_brl"] for x in merged if x["advertising_channel_type"] == "DISPLAY")
total_follow_on = sum(x["youtube_follow_on_views"] or 0 for x in merged)
total_subs = sum(x["youtube_channel_subscriptions"] or 0 for x in merged)

out = {
    "source": "Windsor.ai google_ads (445-144-0907), 2026-06-12 a 2026-09-09",
    "generated_at": "2026-09-10",
    "totals": {
        "cost_brl": round(total_cost, 2),
        "cost_video_brl": round(total_video_cost, 2),
        "cost_demand_gen_brl": round(total_demandgen_cost, 2),
        "cost_performance_max_brl": round(total_pmax_cost, 2),
        "cost_display_brl": round(total_display_cost, 2),
        "youtube_follow_on_views": total_follow_on,
        "youtube_channel_subscriptions": total_subs,
        "n_campaigns_with_activity": len(merged),
    },
    "campaigns": merged,
}
json.dump(out, open(f"{BASE}/processed/media_paga_resumo_last90d.json", "w"), ensure_ascii=False, indent=2)
print("Investimento total (90d):", round(total_cost, 2), "BRL")
print("  - VIDEO:", round(total_video_cost, 2))
print("  - DEMAND_GEN:", round(total_demandgen_cost, 2))
print("  - PERFORMANCE_MAX:", round(total_pmax_cost, 2))
print("  - DISPLAY:", round(total_display_cost, 2))
print("Follow-on views totais:", total_follow_on, "| Inscrições atribuídas totais:", total_subs)
