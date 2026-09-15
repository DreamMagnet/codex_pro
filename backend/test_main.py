import tempfile
import unittest
import uuid
from pathlib import Path
from unittest.mock import patch

from fastapi.testclient import TestClient

from backend.app import main


class ItemEndpointTests(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        data_patch = patch.object(main, "DATA_FILE", Path(directory.name) / "items.json")
        data_patch.start()
        self.addCleanup(data_patch.stop)
        self.client = TestClient(main.app)
        self.addCleanup(self.client.close)
        self.items = [
            {"id": "first", "text": "Buy coffee"},
            {"id": "second", "text": "Coffee filters"},
            {"id": "third", "text": "Call dentist"},
        ]

    def test_search_matches_case_insensitive_substrings_without_writing(self):
        main.write_items(self.items)
        original = main.DATA_FILE.read_bytes()

        response = self.client.get("/api/items/search", params={"query": "  COFFEE  "})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), self.items[:2])
        self.assertEqual(main.DATA_FILE.read_bytes(), original)

    def test_blank_search_returns_all_items(self):
        main.write_items(self.items)

        for params in ({}, {"query": "   "}):
            with self.subTest(params=params):
                response = self.client.get("/api/items/search", params=params)
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.json(), self.items)

    def test_search_handles_unicode_and_no_matches(self):
        item = {"id": "unicode", "text": "Stra\u00dfe"}
        main.write_items([item])

        response = self.client.get("/api/items/search", params={"query": "STRASSE"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [item])
        response = self.client.get("/api/items/search", params={"query": "missing"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [])

    def test_search_without_data_file_returns_empty_list(self):
        response = self.client.get("/api/items/search", params={"query": "coffee"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [])
        self.assertFalse(main.DATA_FILE.exists())

    def test_duplicate_persists_same_text_with_a_new_id(self):
        main.write_items(self.items)

        response = self.client.post("/api/items/first/duplicate")

        self.assertEqual(response.status_code, 201)
        duplicate = response.json()
        self.assertEqual(duplicate["text"], self.items[0]["text"])
        self.assertNotIn(duplicate["id"], [item["id"] for item in self.items])
        self.assertEqual(str(uuid.UUID(duplicate["id"])), duplicate["id"])
        self.assertEqual(main.read_items(), [*self.items, duplicate])
        self.assertEqual(self.client.get(f"/api/items/{duplicate['id']}").json(), duplicate)

    def test_duplicate_missing_item_returns_404_without_writing(self):
        main.write_items(self.items)
        original = main.DATA_FILE.read_bytes()

        response = self.client.post("/api/items/missing/duplicate")

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {"detail": main.ITEM_NOT_FOUND})
        self.assertEqual(main.DATA_FILE.read_bytes(), original)

    def test_existing_crud_and_count_still_work(self):
        created = self.client.post("/api/items", json={"text": "Original"})
        self.assertEqual(created.status_code, 200)
        item_id = created.json()["id"]
        self.assertEqual(self.client.get("/api/items/count").json(), {"count": 1})
        updated = self.client.put(f"/api/items/{item_id}", json={"text": "Updated"})
        self.assertEqual(updated.json()["text"], "Updated")
        self.assertEqual(self.client.get("/api/items").json(), [updated.json()])
        self.assertEqual(self.client.delete(f"/api/items/{item_id}").status_code, 200)
        self.assertEqual(self.client.get("/api/items").json(), [])


if __name__ == "__main__":
    unittest.main()