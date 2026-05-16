import httpx

r = httpx.post(
    "http://localhost:8000/api/v1/repurpose",
    json={"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "platforms": ["twitter", "linkedin"]},
    timeout=60,
)
data = r.json()
for p in data["platforms"]:
    print(f"\n=== {p['platform'].upper()} ===\n{p['content']}")