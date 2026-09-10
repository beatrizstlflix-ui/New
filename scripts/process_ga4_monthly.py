#!/usr/bin/env python3
"""Agrega o pull mensal do GA4 (BR) por year_month_name + canal.
Entrada: data/raw/ga4/br_channel_group_monthly_2026_RAW.json
Saida:   data/processed/ga4_monthly_by_channel_2026.json
"""
import json
from collections import defaultdict

SRC = "/home/user/New/data/raw/ga4/br_channel_group_monthly_2026_RAW.json"
OUT = "/home/user/New/data/processed/ga4_monthly_by_channel_2026.json"

rows = json.load(open(SRC))["result"]

agg = defaultdict(lambda: {"sessions": 0, "totalusers": 0, "conversions_purchase": 0})
months_order = []
for r in rows:
    key = (r["year_month_name"], r["session_default_channel_group"])
    a = agg[key]
    a["sessions"] += r.get("sessions") or 0
    a["totalusers"] += r.get("totalusers") or 0
    a["conversions_purchase"] += r.get("conversions_purchase") or 0
    if r["year_month_name"] not in months_order:
        months_order.append(r["year_month_name"])

out_rows = []
for (month, channel), a in agg.items():
    out_rows.append({"year_month_name": month, "channel_group": channel, **a})

result = {
    "source": "Windsor.ai googleanalytics4 (530533972 - LP AMBIENTE BR)",
    "period": {"date_from": "2026-01-01", "date_to": "2026-09-09"},
    "note": "Linhas brutas vieram particionadas por uma dimensao adicional nao solicitada (provavel stream/medium); esta agregacao soma sessions/totalusers/conversions_purchase por mes+canal para evitar contagem dupla incorreta. Ver decisions.md.",
    "rows": sorted(out_rows, key=lambda x: (x["year_month_name"], -x["sessions"])),
}
json.dump(result, open(OUT, "w"), ensure_ascii=False, indent=2)

# Foco: canais relacionados a YouTube + total geral, por mes
focus = ["Organic Video", "Paid Video", "Paid Social", "Organic Search", "Direct", "Referral"]
totals_by_month = defaultdict(lambda: defaultdict(int))
for r in out_rows:
    totals_by_month[r["year_month_name"]][r["channel_group"]] += r["sessions"]

print("Meses presentes:", months_order)
print()
print(f"{'Mes':10s} " + " ".join(f"{c[:12]:>12s}" for c in focus))
for m in months_order:
    vals = [str(totals_by_month[m].get(c, 0)) for c in focus]
    print(f"{m:10s} " + " ".join(f"{v:>12s}" for v in vals))
