# Graph Report - codex_pro  (2026-09-14)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 24 nodes · 27 edges · 5 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `00523260`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3

## God Nodes (most connected - your core abstractions)
1. `create_item()` - 5 edges
2. `delete_item()` - 4 edges
3. `read_items()` - 4 edges
4. `Item` - 3 edges
5. `list_items()` - 3 edges
6. `write_items()` - 3 edges
7. `deleteItem()` - 2 edges
8. `loadItems()` - 2 edges
9. `Simple FastAPI backend that stores items in a JSON file (no database).` - 1 edges
10. `form` - 1 edges

## Surprising Connections (you probably didn't know these)
- `create_item()` --calls--> `read_items()`  [EXTRACTED]
  backend/app/main.py → backend/app/main.py  _Bridges community 0 → community 2_

## Import Cycles
- None detected.

## Communities (5 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.31
Nodes (7): delete_item(), list_items(), Simple FastAPI backend that stores items in a JSON file (no database)., read_items(), write_items(), delete, get

### Community 1 - "Community 1"
Cohesion: 0.40
Nodes (5): deleteItem(), form, input, list, loadItems()

### Community 2 - "Community 2"
Cohesion: 0.50
Nodes (4): create_item(), Item, BaseModel, post

### Community 3 - "Community 3"
Cohesion: 0.50
Nodes (3): name, private, version

## Knowledge Gaps
- **6 isolated node(s):** `form`, `input`, `list`, `name`, `private` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 13 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `create_item()` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `Item` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `form`, `input`, `list` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._