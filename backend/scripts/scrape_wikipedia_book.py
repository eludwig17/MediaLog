import sys
import re
import hashlib
import requests
from bs4 import BeautifulSoup # good old reliable :D


WIKI_BASE = "https://en.wikipedia.org"


def __IdFromUrl(url: str) -> str:
    slug = url.rstrip("/").split("/wiki/")[-1]
    return hashlib.sha256(slug.encode()).hexdigest()[:12]


def __Normalize(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())


def __IdFromName(name: str, title: str) -> str:
    key = f"{__Normalize(name)}:{__Normalize(title)}"
    return hashlib.sha256(key.encode()).hexdigest()[:12]


def __ParseDateOfBirth(raw: str) -> str: 
    iso = re.search(r"\((\d{4}-\d{2}-\d{2})\)", raw)
    if iso:
        return iso.group(1)
    # Fall back to "Month DD, YYYY" How lame
    readable = re.search(r"([A-Z][a-z]+ \d{1,2}, \d{4})", raw)
    if readable:
        return readable.group(1)
    return raw


def __ScrapeAuthor(url: str) -> dict:
    response = requests.get(url, headers={"User-Agent": "MediaLog/1.0"})
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    infobox = soup.find("table", class_=re.compile(r"infobox"))

    author = {
        "authorID": __IdFromUrl(url),
        "firstName": "",
        "lastName": "",
        "middleName": "",
        "dateOfBirth": "",
        "homeTown": "",
        "country": "",
    }

    heading = soup.find("h1", id="firstHeading")
    if heading:
        parts = heading.get_text(strip=True).split()
        if len(parts) == 1:
            author["firstName"] = parts[0]
        elif len(parts) == 2:
            author["firstName"], author["lastName"] = parts[0], parts[1]
        else:
            author["firstName"] = parts[0]
            author["lastName"] = parts[-1]
            author["middleName"] = " ".join(parts[1:-1])

    if not infobox:
        return author

    for row in infobox.find_all("tr"):
        header = row.find("th")
        cell = row.find("td")
        if not header or not cell:
            continue

        label = header.get_text(strip=True).lower()
        value = cell.get_text(" ", strip=True)

        if "born" in label:
            author["dateOfBirth"] = __ParseDateOfBirth(value)
        elif "hometown" in label or "home town" in label:
            author["homeTown"] = value
        elif "nationality" in label or "country" in label:
            author["country"] = value

    return author


def __ScrapePublisher(url: str) -> dict:
    response = requests.get(url, headers={"User-Agent": "MediaLog/1.0"})
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    infobox = soup.find("table", class_=re.compile(r"infobox"))

    publisher = {
        "publisherUID": __IdFromUrl(url),
        "name": "",
        "location": "",
    }

    heading = soup.find("h1", id="firstHeading")
    if heading:
        publisher["name"] = heading.get_text(strip=True)

    if not infobox:
        return publisher

    for row in infobox.find_all("tr"):
        header = row.find("th")
        cell = row.find("td")
        if not header or not cell:
            continue

        label = header.get_text(strip=True).lower()
        value = cell.get_text(" ", strip=True)

        if "headquarters" in label or "location" in label or "country" in label:
            publisher["location"] = value

    return publisher


def ScrapWiki(url: str) -> dict:
    response = requests.get(url, headers={"User-Agent": "MediaLog/1.0"})
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    infobox = soup.find("table", class_=re.compile(r"infobox"))

    book = {
        "title": "",
        "isbn": "",
        "authorIDs": [],
        "publishYear": "",
        "publisherUIDs": [],
        "locale": "",
        "genres": [],
    }
    authors = []
    publishers = []

    heading = soup.find("h1", id="firstHeading")
    if heading:
        book["title"] = heading.get_text(strip=True)

    if not infobox:
        return {"book": book, "authors": authors, "publishers": publishers}

    for row in infobox.find_all("tr"):
        header = row.find("th")
        cell = row.find("td")
        if not header or not cell:
            continue

        label = header.get_text(strip=True).lower()
        value = cell.get_text(" ", strip=True)

        if "isbn" in label:
            book["isbn"] = re.sub(r"[^0-9\-]", "", value.split()[0]) if value else ""
        elif "author" in label:
            links = cell.find_all("a", href=re.compile(r"^/wiki/"))
            if links:
                for link in links:
                    author = __ScrapeAuthor(WIKI_BASE + link["href"])
                    authors.append(author)
                    book["authorIDs"].append(author["authorID"])
            else:
                for name in [n.strip() for n in re.split(r"[,\n]", value) if n.strip()]:
                    author_id = __IdFromName(name, book["title"])
                    parts = name.split()
                    author = {"authorID": author_id, "firstName": "", "lastName": "", "middleName": "", "dateOfBirth": "", "homeTown": "", "country": ""}
                    if len(parts) == 1:
                        author["firstName"] = parts[0]
                    elif len(parts) == 2:
                        author["firstName"], author["lastName"] = parts[0], parts[1]
                    else:
                        author["firstName"] = parts[0]
                        author["lastName"] = parts[-1]
                        author["middleName"] = " ".join(parts[1:-1])
                    authors.append(author)
                    book["authorIDs"].append(author_id)
        elif "publisher" in label:
            links = cell.find_all("a", href=re.compile(r"^/wiki/"))
            if links:
                for link in links:
                    pub = __ScrapePublisher(WIKI_BASE + link["href"])
                    publishers.append(pub)
                    book["publisherUIDs"].append(pub["publisherUID"])
            else:
                for name in [p.strip() for p in re.split(r"[,\n]", value) if p.strip()]:
                    uid = __IdFromName(name, book["title"])
                    publishers.append({"publisherUID": uid, "name": name, "location": ""})
                    book["publisherUIDs"].append(uid)
        elif "published" in label or "publication date" in label:
            match = re.search(r"\d{4}", value)
            book["publishYear"] = match.group() if match else value
        elif "genre" in label:
            book["genres"] = [g.strip() for g in re.split(r"[,;\n]", value) if g.strip()]
        elif "language" in label:
            book["locale"] = value

    key_fields = [
        bool(book["title"]),
        bool(book["authorIDs"]),
        bool(book["publishYear"]),
        bool(book["publisherUIDs"]),
        bool(book["locale"]),
    ]
    if sum(key_fields) < 3:
        raise ValueError(f"Too little information detected for '{book['title'] or url}' — aborting.")

    return {"book": book, "authors": authors, "publishers": publishers}


if __name__ == "__main__":
    import json

    if len(sys.argv) < 2:
        print("Usage: python ScrapWiki.py <wikipedia_url>")
        sys.exit(1)

    try:
        result = ScrapWiki(sys.argv[1])
    except ValueError as e:
        print(f"Error: {e}")
        sys.exit(1)
    print(json.dumps(result, indent=2))
