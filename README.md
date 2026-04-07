# Air Transport Network Analytics

Primary analysis notebook: `analysis.ipynb`

## Project Overview

This project analyzes air-transport systems as weighted directed graphs to identify critical nodes, compare centrality behavior, and test network robustness under targeted removals.

It is designed to demonstrate:
- applied graph analytics on real-world transportation data,
- metric-driven decision support (hub importance and failure sensitivity),
- reproducible exploratory workflows for data science and analytics teams.

## Key Outcomes

- Computed and compared centrality measures (`degree`, `PageRank`, `authority/hub`, `betweenness`, `harmonic`) on airport networks.
- Quantified vulnerability by removing top-vs-bottom-ranked nodes and measuring how quickly connectivity breaks.
- Built a state-level aggregated flight-flow network to support macro-level interpretation and ranking.

## Skills Demonstrated

- Python, Pandas, `igraph`
- Network modeling and centrality analysis
- Robustness/stress testing and sensitivity analysis
- Translating graph metrics into interpretable operational insights

## Subprojects

- [`ny-airport-centrality`](ny-airport-centrality/README.md)
- [`us-air-network-robustness`](us-air-network-robustness/README.md)
- [`state-level-flight-flow-network`](state-level-flight-flow-network/README.md)

## Suggested Resume Summary

**Air Transport Network Centrality and Robustness Analysis**  
Modeled airport traffic as a weighted directed graph, compared multiple centrality metrics, and performed node-removal stress tests to identify high-impact hubs and resilience bottlenecks.

