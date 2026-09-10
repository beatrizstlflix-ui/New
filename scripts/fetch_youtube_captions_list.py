#!/usr/bin/env python3
"""Para cada video do inventario, chama captions.list (funciona com API key,
so retorna metadados - nao o texto) para descobrir disponibilidade REAL de
legenda (o campo contentDetails.caption do videos.list e conhecido por nao
ser confiavel). Nao baixa o conteudo (isso exige OAuth - ver docs/bloqueios).

Retomavel: pula videos ja processados salvos no checkpoint.
"""
import json
import time
import urllib.request
import urllib.parse
import urllib.error

BASE = "/home/user/New"
CHECKPOINT = f"{BASE}/data/raw/youtube/captions_list_by_video.json"

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

inv = json.load(open(f"{BASE}/data/processed/youtube_video_inventory.json"))
video_ids = [v["video_id"] for v in inv["videos"]]

try:
    results = json.load(open(CHECKPOINT))
except FileNotFoundError:
    results = {}

done = 0
errors = 0
for vid in video_ids:
    if vid in results:
        continue
    url = f"https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId={vid}&key={API_KEY}"
    try:
        with urllib.request.urlopen(url, timeout=15) as r:
            data = json.load(r)
        tracks = data.get("items", [])
        results[vid] = [
            {"language": t["snippet"].get("language"), "trackKind": t["snippet"].get("trackKind"),
             "status": t["snippet"].get("status")}
            for t in tracks
        ]
    except urllib.error.HTTPError as e:
        results[vid] = {"error": e.code}
        errors += 1
    except Exception as e:
        results[vid] = {"error": str(e)}
        errors += 1
    done += 1
    if done % 50 == 0:
        json.dump(results, open(CHECKPOINT, "w"), ensure_ascii=False)
        print(f"...{done} processados neste run, {len(results)} no total, {errors} erros")
    time.sleep(0.05)

json.dump(results, open(CHECKPOINT, "w"), ensure_ascii=False)

with_captions = sum(1 for v in results.values() if isinstance(v, list) and len(v) > 0)
with_asr_pt = sum(1 for v in results.values() if isinstance(v, list) and any(t.get("trackKind") == "asr" and t.get("language", "").startswith("pt") for t in v))
no_captions = sum(1 for v in results.values() if isinstance(v, list) and len(v) == 0)
with_error = sum(1 for v in results.values() if isinstance(v, dict) and "error" in v)

print()
print("=== RESUMO CAPTIONS.LIST (metadados, nao o texto) ===")
print("Total processado:", len(results), "de", len(video_ids))
print("Com pelo menos 1 faixa de legenda:", with_captions)
print("Com legenda automatica (ASR) em portugues:", with_asr_pt)
print("Sem nenhuma faixa de legenda:", no_captions)
print("Erros de API:", with_error)
