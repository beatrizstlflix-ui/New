#!/usr/bin/env python3
"""Segmenta o inventario de videos em series de conteudo, cruzando com midia paga.

Series definidas manualmente (nao por regex generico) para evitar classificacao
incorreta - ver docs/taxonomia_series.md para os criterios e casos de fronteira.
"""
import json

BASE = "/home/user/New"

inv = json.load(open(f"{BASE}/data/processed/youtube_video_inventory.json"))["videos"]
inv_by_id = {v["video_id"]: v for v in inv}

ads_summary = json.load(open(f"{BASE}/data/processed/google_ads_video_summary_last90d.json"))["videos"]
ads_by_id = {v["video_id"]: v for v in ads_summary}

conversions = {r["campaign_id"]: r for r in json.load(open(f"{BASE}/data/raw/google_ads/br_conversions_by_action_last90d.json"))["rows"]}
metrics = {r["campaign_id"]: r for r in json.load(open(f"{BASE}/data/raw/google_ads/br_campaign_metrics_last90d.json"))["rows"]}

ARENA_3D = ["X7ngtI2GV3g", "YueS6DDvdpk", "W4K2JKlIllw"]

VIVENDO_DE_IMPRESSAO_3D = [
    "pRFKfBxGRtI",  # R$20 Mil/Mês vendendo impressão 3d e travou | EP1
    "mST92AkiZyQ",  # Do Zero a R$67 Mil/Mês em 8 Meses | EP02
    "_1OJve8Itn4",  # Mãe lucra com impressão 3D em casa | EP03
    "YQOOHZbNdJI",  # Uber ou Impressão 3D | EP04
    "8TWZBPmDcq0",  # Motoboy Vira Empreendedor | EP05
    "AqfFf9vmhP0",  # R$30 Mil/Mês na Shopee | EP06
    "17Gi12-k3_c",  # R$20 Mil/Mês com Impressão 3D em 10 Meses | EP07
    "3Lxrr1YejZI",  # Ele Fatura R$100 MIL/MÊS | EP08
    "XXg0NWacP60",  # Pai e Filho Empreendendo | EP09
    "cqx3aYC9QAw",  # Impressão 3d + Pintura... | EP10
    "Zo5txKEoK0o",  # Ele Fatura R$50 MIL/mês com Impressão 3D em Casa
    "mavt78HpSoY",  # Como ele pagou o plano vitalício em 4 meses
    "3oqYDF4GprM",  # R$20 MIL com Personalizados - Como ele chegou lá
    "ZUmpgv0efHs",  # Ele Começou Há 5 Meses...
    "C0nVtKpRLuk",  # Pediu Demissão do Emprego na STLFLIX
    "TmosUaw4AZU",  # Impressão 3d Vende em Feiras?
    "d4gWJcVKkw8",  # Como Ele Escalou para 9 Impressoras
    "yVK-hTfwyT0",  # O Plano para Vender Impressão 3d Funcionou - Update
    "FXUhs98cSHQ",  # Saiu do Emprego e Hoje Fatura...
    "dCq-wQ3PopA",  # Vai sair do Aplicativo? Motoboy...
    "bTt4wme-79E",  # Ele Largou o Emprego para Vender...
    "KvSsBToBnH0",  # Como Ele Fatura Mais de R$50 MIL - Higor 123dbrindes
]

BORDERLINE_NOT_INCLUDED = [
    {"video_id": "jYZ6RQay4QY", "title": "O nicho que fez esse casal lucrar com impressão 3D!",
     "reason": "menciona um casal real mas formato mais curto (6:53) e tom de dica, nao entrevista completa - fora da serie ate confirmacao"},
    {"video_id": "5nsR9qi9ndA", "title": "Como Faturei R$5 Milhões com Impressão 3D (e o que deu errado)",
     "reason": "narrativa em 1a pessoa ('faturEI'), provavel fundador falando de si mesmo, nao entrevista de convidado"},
]


def build_video_row(video_id, series):
    v = inv_by_id.get(video_id)
    if not v:
        return {"video_id": video_id, "series": series, "error": "nao encontrado no inventario organico"}
    ad = ads_by_id.get(video_id)
    row = {
        "video_id": video_id,
        "series": series,
        "title": v["title"],
        "url": v["url"],
        "published_at": v["published_at"],
        "duration_seconds": v["duration_seconds"],
        "view_count_lifetime": v["view_count"],
        "like_count": v["like_count"],
        "comment_count": v["comment_count"],
        "used_in_paid_media_last90d": ad is not None,
    }
    if ad:
        row["ad_trueview_views_90d"] = ad["trueview_views"]
        row["ad_engagements_90d"] = ad["engagements"]
        row["ad_campaigns"] = ad["campaigns"]
        # soma custo/conversoes das campanhas ligadas a este video
        cost = 0.0
        follow_on = 0
        subs = 0
        checkout = 0.0
        for cname in ad["campaigns"]:
            for cid, m in metrics.items():
                if m["campaign_name"] == cname:
                    cost += m["cost_micros"] / 1_000_000
                    c = conversions.get(cid, {})
                    follow_on += c.get("all_conversions_youtube_follow_on_views") or 0
                    subs += c.get("all_conversions_youtube_channel_subscriptions") or 0
                    checkout += c.get("all_conversions_inicio_do_checkout") or 0
        row["ad_cost_brl_90d"] = round(cost, 2)
        row["ad_follow_on_views_90d"] = follow_on
        row["ad_subscriptions_90d"] = subs
        row["ad_checkout_starts_90d"] = round(checkout, 2)
    return row


def build_series(name, video_ids):
    rows = [build_video_row(vid, name) for vid in video_ids]
    valid = [r for r in rows if "error" not in r]
    totals = {
        "video_count": len(valid),
        "views_lifetime_total": sum(r["view_count_lifetime"] for r in valid),
        "likes_total": sum(r["like_count"] or 0 for r in valid),
        "comments_total": sum(r["comment_count"] or 0 for r in valid),
        "videos_in_paid_media": sum(1 for r in valid if r["used_in_paid_media_last90d"]),
        "ad_cost_brl_90d_total": round(sum(r.get("ad_cost_brl_90d", 0) for r in valid), 2),
        "ad_follow_on_views_90d_total": sum(r.get("ad_follow_on_views_90d", 0) for r in valid),
        "ad_subscriptions_90d_total": sum(r.get("ad_subscriptions_90d", 0) for r in valid),
    }
    rows.sort(key=lambda r: r.get("published_at") or "")
    return {"series_name": name, "totals": totals, "videos": rows}

out = {
    "generated_at": "2026-09-10",
    "note": "Classificacao manual por titulo/formato - ver docs/taxonomia_series.md para criterios e casos de fronteira excluidos.",
    "borderline_not_included": BORDERLINE_NOT_INCLUDED,
    "series": {
        "Arena 3D": build_series("Arena 3D", ARENA_3D),
        "Série Vivendo de Impressão 3D": build_series("Série Vivendo de Impressão 3D", VIVENDO_DE_IMPRESSAO_3D),
    },
}

json.dump(out, open(f"{BASE}/data/processed/series_views.json", "w"), ensure_ascii=False, indent=2)

for name, s in out["series"].items():
    print(f"=== {name} ===")
    print(f"  {s['totals']['video_count']} videos | {s['totals']['views_lifetime_total']:,} views vitalicias | "
          f"{s['totals']['videos_in_paid_media']} em midia paga | R$ {s['totals']['ad_cost_brl_90d_total']:,.2f} investidos (90d)")
