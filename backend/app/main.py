"""Simple FastAPI backend that stores items in a JSON file (no database)."""

import json
import uuid
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

DATA_FILE = Path(__file__).resolve().parent.parent / "data.json"
ITEM_NOT_FOUND = "Item not found"

app = FastAPI(title="codex_pro API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Item(BaseModel):
    id: str | None = None
    text: str


def read_items() -> list[dict]:
    if not DATA_FILE.exists():
        return []
    with DATA_FILE.open("r", encoding="utf-8") as f:
        return json.load(f)


def write_items(items: list[dict]) -> None:
    with DATA_FILE.open("w", encoding="utf-8") as f:
        json.dump(items, f, indent=2)


@app.get("/api/health")
def health_check() -> dict:
    return {"status": "ok"}


@app.get("/api/items")
def list_items() -> list[dict]:
    return read_items()


@app.get("/api/items/count")
def count_items() -> dict:
    return {"count": len(read_items())}


@app.get("/api/items/{item_id}")
def get_item(item_id: str) -> dict:
    for existing in read_items():
        if existing["id"] == item_id:
            return existing
    raise HTTPException(status_code=404, detail=ITEM_NOT_FOUND)


@app.post("/api/items")
def create_item(item: Item) -> dict:
    items = read_items()
    new_item = {"id": str(uuid.uuid4()), "text": item.text}
    items.append(new_item)
    write_items(items)
    return new_item


@app.put("/api/items/{item_id}")
def update_item(item_id: str, item: Item) -> dict:
    items = read_items()
    for existing in items:
        if existing["id"] == item_id:
            existing["text"] = item.text
            write_items(items)
            return existing
    raise HTTPException(status_code=404, detail=ITEM_NOT_FOUND)


@app.delete("/api/items/{item_id}")
def delete_item(item_id: str) -> dict:
    items = read_items()
    remaining = [i for i in items if i["id"] != item_id]
    if len(remaining) == len(items):
        raise HTTPException(status_code=404, detail=ITEM_NOT_FOUND)
    write_items(remaining)
    return {"status": "deleted"}


@app.delete("/api/items")
def delete_all_items() -> dict:
    write_items([])
    return {"status": "cleared"}


def main() -> None:
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)


if __name__ == "__main__":
    main()
