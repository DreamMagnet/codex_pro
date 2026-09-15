# Graph Report - codex_pro  (2026-09-15)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 30 nodes · 43 edges · 6 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ce6444ab`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4

## God Nodes (most connected - your core abstractions)
1. `read_items()` - 7 edges
2. `create_item()` - 5 edges
3. `update_item()` - 5 edges
4. `write_items()` - 5 edges
5. `Item` - 4 edges
6. `delete_item()` - 4 edges
7. `count_items()` - 3 edges
8. `get_item()` - 3 edges
9. `list_items()` - 3 edges
10. `delete_all_items()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `create_item()` --calls--> `read_items()`  [EXTRACTED]
  backend/app/main.py → backend/app/main.py  _Bridges community 0 → community 1_
- `delete_item()` --calls--> `read_items()`  [EXTRACTED]
  backend/app/main.py → backend/app/main.py  _Bridges community 0 → community 3_
- `create_item()` --calls--> `write_items()`  [EXTRACTED]
  backend/app/main.py → backend/app/main.py  _Bridges community 1 → community 3_

## Import Cycles
- None detected.

## Communities (6 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.39
Nodes (7): count_items(), get_item(), health_check(), list_items(), Simple FastAPI backend that stores items in a JSON file (no database)., read_items(), get

### Community 1 - "Community 1"
Cohesion: 0.33
Nodes (6): create_item(), Item, update_item(), BaseModel, post, put

### Community 2 - "Community 2"
Cohesion: 0.40
Nodes (5): deleteItem(), form, input, list, loadItems()

### Community 3 - "Community 3"
Cohesion: 0.67
Nodes (4): delete_all_items(), delete_item(), write_items(), delete

### Community 4 - "Community 4"
Cohesion: 0.50
Nodes (3): name, private, version

## Knowledge Gaps
- **6 isolated node(s):** `form`, `input`, `list`, `name`, `private` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 12 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `create_item()` connect `Community 1` to `Community 0`, `Community 3`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `update_item()` connect `Community 1` to `Community 0`, `Community 3`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `Item` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `form`, `input`, `list` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._