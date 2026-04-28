import requests

BOOKS = [
    "https://en.wikipedia.org/wiki/The_Great_Gatsby",
    "https://en.wikipedia.org/wiki/The_Catcher_in_the_Rye",
    "https://en.wikipedia.org/wiki/To_Kill_a_Mockingbird",
    "https://en.wikipedia.org/wiki/The_Hobbit",
    "https://en.wikipedia.org/wiki/Pride_and_Prejudice",
    "https://en.wikipedia.org/wiki/Jane_Eyre",
    "https://en.wikipedia.org/wiki/Wuthering_Heights",
    "https://en.wikipedia.org/wiki/Moby-Dick",
    "https://en.wikipedia.org/wiki/The_Scarlet_Letter",
    "https://en.wikipedia.org/wiki/Adventures_of_Huckleberry_Finn",
    "https://en.wikipedia.org/wiki/Great_Expectations",
    "https://en.wikipedia.org/wiki/A_Tale_of_Two_Cities",
    "https://en.wikipedia.org/wiki/Crime_and_Punishment",
    "https://en.wikipedia.org/wiki/Anna_Karenina",
    "https://en.wikipedia.org/wiki/Don_Quixote",
    "https://en.wikipedia.org/wiki/Dune_(novel)",
    "https://en.wikipedia.org/wiki/The_Kite_Runner",
    "https://en.wikipedia.org/wiki/The_Hunger_Games",
    "https://en.wikipedia.org/wiki/The_Lord_of_the_Rings",
    "https://en.wikipedia.org/wiki/Neuromancer"
]

for url in BOOKS:
    res = requests.get(f"http://localhost:5000/books/import", params={"url": url})
    print(f"{res.status_code} — {url.split('/wiki/')[-1]}")