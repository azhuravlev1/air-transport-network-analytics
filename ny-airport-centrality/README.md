# NY Airport Centrality Analysis

## Objective

Analyze the New York airport subnetwork to identify which airport is structurally most influential under weighted directed connectivity.

## Approach

- Filtered airport graph to New York state nodes and removed isolated/loop artifacts.
- Computed normalized centrality metrics:
  - weighted degree centrality
  - PageRank
  - authority/hub
  - betweenness
  - harmonic centrality
- Ranked airports by each metric for cross-metric consistency.

## Key Finding

- **JFK** appears as the top-ranked airport in weighted-degree-based centrality in the NY subgraph, with consistently strong prominence across multiple influence metrics.

## Why this matters

This demonstrates practical graph-based ranking for infrastructure systems, useful for:
- capacity prioritization,
- resilience planning,
- resource allocation decisions.

## Reproducibility

See notebook: `../analysis.ipynb` (NY centrality section)

