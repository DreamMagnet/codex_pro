# codex_pro

Scaffolded by CodeAtlas as a both project.ccc
 varghese

 chnages addedd
 user can see

## Run locally

From the project root, install and start the API:

```powershell
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```

Install the UI icons in another terminal:

```powershell
npm --prefix frontend install
```

Open [frontend/index.html](frontend/index.html) in a browser. No frontend build or
dev server is needed. The page connects to `http://127.0.0.1:8000` and supports
adding, searching, duplicating, and deleting items. Items are stored in
`backend/data.json`; this is a local, single-user demo with no authentication.

## New endpoints

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/api/items/search?query=coffee` | Case-insensitive substring search. Leading/trailing query whitespace is ignored; an empty query returns all items. |
| POST | `/api/items/{item_id}/duplicate` | Copies the item's text with a new UUID and persists it. Returns `201`, or `404` if the source item is missing. No body is required. |

Interactive API documentation is available at `http://127.0.0.1:8000/docs`.

## Tests

Run from the project root:

```powershell
python -m pip install -r backend/requirements-dev.txt
python -m unittest discover -s backend -p test_main.py -v
```

Tests use a temporary JSON file and do not change application data.
