# U.S. Air Network Robustness Under Targeted Node Removal

## Objective

Evaluate how vulnerable the U.S. airport network is when removing airports by centrality rank (most central first vs least central first).

## Approach

- Extracted the weakly connected giant component from the national airport graph.
- Computed centrality rankings (`degree`, `PageRank`, `authority`, `hub`, `betweenness`, `harmonic`).
- Iteratively removed nodes by ranking and tracked the minimum removals needed to disconnect the graph.

## Key Results

- Removing top-ranked nodes disconnects the network very quickly:
  - `degree` / `PageRank` / `authority` / `hub`: **2 removals**
  - `betweenness`: **4 removals**
  - `harmonic`: **1 removal**
- Removing low-ranked nodes generally requires far more removals (up to near-total removal), indicating these are genuinely peripheral nodes.

## Why this matters

This is a practical resilience framework for transportation analytics:
- identifies single points of failure,
- supports contingency planning,
- prioritizes protection of high-impact hubs.

## Reproducibility

See notebook: `../analysis.ipynb` (robustness section)

