"""Read-only smoke test for the public Supabase likes RPC.

Never creates Auth users or votes. For real like/unlike tests, first enable
Anonymous Sign-Ins and test through the web UI in two separate browser sessions.
"""
from pathlib import Path
import json
import re
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
config = (ROOT / "assets/likes-config.js").read_text(encoding="utf-8")
def setting(name):
    match = re.search(r"\\b" + name + r"\\s*:\\s*'([^']*)'", config)
    return match.group(1) if match else ""
url = setting("supabaseUrl").rstrip("/")
key = setting("publishableKey")
assert re.fullmatch(r"https://[a-z0-9-]+\\.supabase\\.co", url), "Missing Supabase URL"
assert key.startswith("sb_publishable_"), "Only the public publishable key is allowed"
request = urllib.request.Request(
    url + "/rest/v1/rpc/coffee_likes_snapshot",
    data=b"{}",
    method="POST",
    headers={"apikey": key, "Content-Type": "application/json", "Accept": "application/json"},
)
try:
    with urllib.request.urlopen(request, timeout=18) as response:
        rows = json.load(response)
except urllib.error.HTTPError as error:
    raise SystemExit(f"Public likes API failed (HTTP {error.code})") from None
assert isinstance(rows, list), "RPC did not return a list"
ids = {x.get("product_id") for x in rows}
expected = {"espresso","latte","cappuccino","coldbrew","croissant","crocafe","cookie","mocca","sanduiche"}
assert ids == expected, "Unexpected products in likes API response"
assert all(isinstance(x["likes"], int) and x["likes"] >= 0 for x in rows), "Invalid counts"
assert all(isinstance(x["liked"], bool) for x in rows), "Invalid liked state"
print("OK: Supabase shared likes API, 9 products, valid public totals (read-only)")
