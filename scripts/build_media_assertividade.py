"""
Constroi data/processed/media_assertividade_4m.json a partir do raw
data/raw/google_ads/br_monthly_video_campaigns_2026-05-10_2026-09-09.json

Objetivo: responder "estamos sendo assertivos?" na alocacao de midia paga
mes a mes, por campanha, olhando eficiencia (custo por resultado) e se o
orcamento se realoca em direcao aos melhores resultados ao longo do tempo.
"""
import json
from collections import defaultdict

RAW_PATH = "data/raw/google_ads/br_monthly_video_campaigns_2026-05-10_2026-09-09.json"
OUT_PATH = "data/processed/media_assertividade_4m.json"

MONTH_ORDER = {"May 2026": 1, "Jun 2026": 2, "Jul 2026": 3, "Aug 2026": 4, "Sep 2026": 5}
MONTH_LABEL = {"May 2026": "Mai/26", "Jun 2026": "Jun/26", "Jul 2026": "Jul/26", "Aug 2026": "Ago/26", "Sep 2026": "Set/26 (parcial)"}


def load_raw():
    with open(RAW_PATH, encoding="utf-8") as f:
        return json.load(f)


def safe_div(a, b):
    if not b:
        return None
    return a / b


def main():
    raw = load_raw()
    rows = raw["rows"]

    # only VIDEO channel type campaigns are in scope for this question
    video_rows = [r for r in rows if r.get("advertising_channel_type") == "VIDEO"]

    per_campaign_month = []
    for r in video_rows:
        cost_brl = r["cost_micros"] / 1_000_000
        fov = r.get("all_conversions_youtube_follow_on_views") or 0
        subs = r.get("all_conversions_youtube_channel_subscriptions") or 0
        value = r.get("all_conversions_value") or 0
        checkout = r.get("all_conversions_inicio_do_checkout") or 0
        row = {
            "campaign_id": r["campaign_id"],
            "campaign_name": r["campaign_name"],
            "year_month_name": r["year_month_name"],
            "month_label": MONTH_LABEL.get(r["year_month_name"], r["year_month_name"]),
            "month_order": MONTH_ORDER.get(r["year_month_name"], 99),
            "cost_brl": round(cost_brl, 2),
            "impressions": r.get("impressions") or 0,
            "clicks": r.get("clicks") or 0,
            "follow_on_views": fov,
            "subscriptions": subs,
            "checkout_starts": round(checkout, 2),
            "conversions_value_brl": round(value, 2),
            "cost_per_follow_on_view_brl": round(safe_div(cost_brl, fov), 4) if safe_div(cost_brl, fov) is not None else None,
            "cost_per_subscription_brl": round(safe_div(cost_brl, subs), 2) if safe_div(cost_brl, subs) is not None else None,
            "cost_per_brl_of_value": round(safe_div(cost_brl, value), 4) if safe_div(cost_brl, value) is not None else None,
            "zero_result": fov == 0 and subs == 0 and value == 0,
        }
        per_campaign_month.append(row)

    per_campaign_month.sort(key=lambda x: (x["campaign_name"], x["month_order"]))

    # month-over-month reallocation check: for each campaign present in 2+ consecutive months,
    # did cost move in the same direction as prior-month efficiency (value per BRL)?
    by_campaign = defaultdict(list)
    for row in per_campaign_month:
        by_campaign[row["campaign_name"]].append(row)

    reallocation_checks = []
    for name, months in by_campaign.items():
        months_sorted = sorted(months, key=lambda x: x["month_order"])
        for i in range(1, len(months_sorted)):
            prev_m = months_sorted[i - 1]
            cur_m = months_sorted[i]
            prev_value_per_brl = safe_div(prev_m["conversions_value_brl"], prev_m["cost_brl"])
            cost_delta = cur_m["cost_brl"] - prev_m["cost_brl"]
            cost_delta_pct = safe_div(cost_delta, prev_m["cost_brl"])
            reallocation_checks.append({
                "campaign_name": name,
                "from_month": prev_m["month_label"],
                "to_month": cur_m["month_label"],
                "prev_value_per_brl_spent": round(prev_value_per_brl, 3) if prev_value_per_brl is not None else None,
                "prev_was_zero_result": prev_m["zero_result"],
                "cost_prev_brl": prev_m["cost_brl"],
                "cost_cur_brl": cur_m["cost_brl"],
                "cost_delta_brl": round(cost_delta, 2),
                "cost_delta_pct": round(cost_delta_pct * 100, 1) if cost_delta_pct is not None else None,
            })

    # Focus evidence: August 2026 snapshot (full month, most campaigns active, richest signal)
    august_rows = [r for r in per_campaign_month if r["year_month_name"] == "Aug 2026"]
    august_rows_sorted = sorted(august_rows, key=lambda x: x["cost_brl"], reverse=True)

    if august_rows:
        costs = [r["cost_brl"] for r in august_rows]
        cost_min, cost_max = min(costs), max(costs)
        cost_avg = sum(costs) / len(costs)
        # coefficient of variation of cost, vs coefficient of variation of value
        values = [r["conversions_value_brl"] for r in august_rows]
        value_avg = sum(values) / len(values) if values else 0

        def stdev(xs, avg):
            if len(xs) < 2:
                return 0
            return (sum((x - avg) ** 2 for x in xs) / (len(xs) - 1)) ** 0.5

        cost_cv = safe_div(stdev(costs, cost_avg), cost_avg)
        value_cv = safe_div(stdev(values, value_avg), value_avg) if value_avg else None

        n_zero_result_august = sum(1 for r in august_rows if r["zero_result"])

        august_summary = {
            "n_campaigns": len(august_rows),
            "cost_min_brl": round(cost_min, 2),
            "cost_max_brl": round(cost_max, 2),
            "cost_avg_brl": round(cost_avg, 2),
            "cost_coefficient_of_variation_pct": round(cost_cv * 100, 1) if cost_cv is not None else None,
            "value_coefficient_of_variation_pct": round(value_cv * 100, 1) if value_cv is not None else None,
            "n_campaigns_zero_result": n_zero_result_august,
            "pct_campaigns_zero_result": round(100 * n_zero_result_august / len(august_rows), 1),
            "top5_by_cost": [
                {
                    "campaign_name": r["campaign_name"],
                    "cost_brl": r["cost_brl"],
                    "follow_on_views": r["follow_on_views"],
                    "subscriptions": r["subscriptions"],
                    "conversions_value_brl": r["conversions_value_brl"],
                }
                for r in august_rows_sorted[:5]
            ],
            "bottom5_by_cost": [
                {
                    "campaign_name": r["campaign_name"],
                    "cost_brl": r["cost_brl"],
                    "follow_on_views": r["follow_on_views"],
                    "subscriptions": r["subscriptions"],
                    "conversions_value_brl": r["conversions_value_brl"],
                }
                for r in august_rows_sorted[-5:]
            ],
        }
    else:
        august_summary = None

    # correlation (Pearson) between cost and value, per month with enough campaigns (n>=10),
    # to test directly whether spend tracks performance within a given month
    def pearson(xs, ys):
        n = len(xs)
        if n < 2:
            return None
        mx = sum(xs) / n
        my = sum(ys) / n
        cov = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
        sx = (sum((x - mx) ** 2 for x in xs)) ** 0.5
        sy = (sum((y - my) ** 2 for y in ys)) ** 0.5
        if sx == 0 or sy == 0:
            return None
        return cov / (sx * sy)

    correlation_by_month = []
    by_month_rows = defaultdict(list)
    for r in per_campaign_month:
        by_month_rows[r["year_month_name"]].append(r)
    for ym, rs in by_month_rows.items():
        if len(rs) < 8:
            continue
        costs = [r["cost_brl"] for r in rs]
        values = [r["conversions_value_brl"] for r in rs]
        fovs = [r["follow_on_views"] for r in rs]
        correlation_by_month.append({
            "year_month_name": ym,
            "month_label": MONTH_LABEL.get(ym, ym),
            "n_campaigns": len(rs),
            "corr_cost_vs_value": round(pearson(costs, values), 3) if pearson(costs, values) is not None else None,
            "corr_cost_vs_follow_on_views": round(pearson(costs, fovs), 3) if pearson(costs, fovs) is not None else None,
        })
    correlation_by_month.sort(key=lambda x: MONTH_ORDER.get(x["year_month_name"], 99))

    # month totals across all VIDEO campaigns
    month_totals = defaultdict(lambda: {"cost_brl": 0.0, "follow_on_views": 0, "subscriptions": 0, "conversions_value_brl": 0.0, "n_campaigns": 0})
    for r in per_campaign_month:
        mt = month_totals[r["year_month_name"]]
        mt["cost_brl"] += r["cost_brl"]
        mt["follow_on_views"] += r["follow_on_views"]
        mt["subscriptions"] += r["subscriptions"]
        mt["conversions_value_brl"] += r["conversions_value_brl"]
        mt["n_campaigns"] += 1

    month_totals_list = []
    for ym, mt in sorted(month_totals.items(), key=lambda kv: MONTH_ORDER.get(kv[0], 99)):
        month_totals_list.append({
            "year_month_name": ym,
            "month_label": MONTH_LABEL.get(ym, ym),
            "cost_brl": round(mt["cost_brl"], 2),
            "follow_on_views": mt["follow_on_views"],
            "subscriptions": mt["subscriptions"],
            "conversions_value_brl": round(mt["conversions_value_brl"], 2),
            "n_campaigns": mt["n_campaigns"],
            "cost_per_follow_on_view_brl": round(safe_div(mt["cost_brl"], mt["follow_on_views"]), 4) if mt["follow_on_views"] else None,
            "cost_per_subscription_brl": round(safe_div(mt["cost_brl"], mt["subscriptions"]), 2) if mt["subscriptions"] else None,
        })

    # "assertiveness" verdict inputs: how many reallocation_checks show cost DECREASING after a
    # zero-result month, vs cost STAYING FLAT (+/-10%) after a zero-result month.
    # Ago->Set transitions are excluded: Set/26 is a partial month, so a cost drop there is a
    # calendar artifact, not evidence of (or against) performance-based reallocation.
    full_month_checks = [c for c in reallocation_checks if c["to_month"] != "Set/26 (parcial)"]
    zero_result_transitions = [c for c in full_month_checks if c["prev_was_zero_result"]]
    n_zero_then_cut = sum(1 for c in zero_result_transitions if c["cost_delta_pct"] is not None and c["cost_delta_pct"] <= -25)
    n_zero_then_flat = sum(1 for c in zero_result_transitions if c["cost_delta_pct"] is not None and -25 < c["cost_delta_pct"] < 25)
    n_zero_then_increase = sum(1 for c in zero_result_transitions if c["cost_delta_pct"] is not None and c["cost_delta_pct"] >= 25)

    case_study_zero_result_campaign = [
        r for r in per_campaign_month if "como-ele-escalou-9-impressoras" in r["campaign_name"]
    ]

    out = {
        "source": raw["source"],
        "generated_at": "2026-09-10",
        "date_from": raw["date_from"],
        "date_to": raw["date_to"],
        "note": raw.get("note"),
        "scope": "advertising_channel_type == VIDEO apenas (campanhas de video-reconhecimento no YouTube). Demand Gen / Performance Max / Display ficam fora desta pergunta especifica.",
        "caveats": [
            "Setembro 2026 e mes PARCIAL (dados ate 09/09). Quedas de custo de Ago->Set em quase todas as campanhas (~ -68% a -99%) sao em grande parte um artefato de mes incompleto (faltam ~21 dias de gasto), NAO evidencia de realocacao. Por isso as transicoes Ago->Set foram excluidas da leitura de 'assertividade' abaixo; use apenas Mai->Jun, Jun->Jul e Jul->Ago para essa leitura.",
            "cost_micros convertido para BRL dividindo por 1.000.000, conforme o campo ja vem em micros na resposta do Google Ads via Windsor.ai.",
            "'conversions_value'/'all_conversions_value' misturam eventos de valor variado (inicio de checkout parcial, compras, inscricoes no canal) — usar como proxy de resultado economico, nao como receita líquida confirmada.",
        ],
        "case_study_zero_result_campaign_como_ele_escalou": {
            "campaign_name": case_study_zero_result_campaign[0]["campaign_name"] if case_study_zero_result_campaign else None,
            "months": case_study_zero_result_campaign,
            "finding": "Campanha teve ZERO follow-on-views, ZERO inscricoes e ZERO valor de conversao em Jul/26 (mes cheio). Em vez de ser cortada, o orcamento subiu de R$259,79 para R$1.522,67 (+486%) em Ago/26 — e o resultado continuou ZERO no mes cheio seguinte. E o exemplo mais direto, dentro dos dados, de orcamento nao sendo redirecionado com base em desempenho.",
        },
        "month_totals": month_totals_list,
        "correlation_cost_vs_result_by_month": correlation_by_month,
        "august_2026_cross_section": august_summary,
        "zero_result_transitions_summary": {
            "n_transitions_from_zero_result_month": len(zero_result_transitions),
            "n_cost_cut_25pct_or_more": n_zero_then_cut,
            "n_cost_flat_within_25pct": n_zero_then_flat,
            "n_cost_increased_25pct_or_more": n_zero_then_increase,
        },
        "per_campaign_month": per_campaign_month,
        "reallocation_checks": reallocation_checks,
    }

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    print("n_campaign_month_rows", len(per_campaign_month))
    print("month_totals", json.dumps(month_totals_list, ensure_ascii=False, indent=2))
    print("august_summary", json.dumps(august_summary, ensure_ascii=False, indent=2))
    print("zero_result_transitions_summary", out["zero_result_transitions_summary"])


if __name__ == "__main__":
    main()
