# State-Level Flight Flow Network Aggregation

## Objective

Transform an airport-level network into a state-level weighted flow graph to support macro-level traffic interpretation.

## Approach

- Contracted airport nodes into state nodes.
- Combined parallel edges by summing passenger-volume weights.
- Evaluated graph connectivity and state-level centrality/strength metrics.

## Key Insights

- Created a compact representation of interstate flight flows while preserving weighted connectivity structure.
- Produced centrality and weighted in/out strength rankings at the state level for high-level decision support.

## Why this matters

This aggregation pattern is useful in analytics roles where teams need:
- interpretable high-level summaries from complex granular data,
- scalable reporting for policy and operations audiences,
- weighted network KPIs instead of raw edge counts.

## Reproducibility

See notebook: `../analysis.ipynb` (state-level aggregation section)

