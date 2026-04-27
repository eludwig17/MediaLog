import requests

BOOKS = [
    "https://en.wikipedia.org/wiki/The_Great_Gatsby",
    "https://en.wikipedia.org/wiki/The_Catcher_in_the_Rye",
    "https://en.wikipedia.org/wiki/To_Kill_a_Mockingbird",
    "https://en.wikipedia.org/wiki/The_Hobbit"
]

for url in BOOKS:
    res = requests.get(f"http://localhost:5000/books/import", params={"url": url})
    print(f"{res.status_code} — {url.split('/wiki/')[-1]}")