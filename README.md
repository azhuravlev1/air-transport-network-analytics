# Air Transport Network Analytics

The US airport network as a weighted, directed graph: which airports matter most, how quickly the network falls apart when hubs are removed, and what it looks like when airports are merged into states. It was an assignment for DS8014 (Graph Mining) at Toronto Metropolitan University. All the code is in `analysis.ipynb`, using Python, pandas and igraph.

## Experiments

[New York airports](ny-airport-centrality/README.md). On the subgraph of New York state airports (with loops and isolated airports removed), I ranked airports by weighted degree, PageRank, authority and hub scores, betweenness and harmonic centrality. JFK comes out on top by weighted degree and ranks high on every other measure.

[Robustness to removing airports](us-air-network-robustness/README.md). Starting from the giant component of the national network, airports were removed one at a time in order of each centrality ranking, and I counted how many removals it takes to disconnect the network. Removing the most central airports first breaks it almost immediately: one removal by harmonic centrality, two by degree, PageRank, authority or hub, and four by betweenness. Removing the least central airports first takes far longer, which confirms they really are on the periphery.

[State-level network](state-level-flight-flow-network/README.md). Airports were merged into their states, with parallel flights summed into a single weighted edge, giving a compact interstate flow network. Centrality and weighted in and out strength were then ranked at the state level.

## Files

`analysis.ipynb` (all experiments), `connections.csv` (flight connections with passenger counts), `airports_loc.csv` (airport locations and states), `q3.py` (a standalone script version of one of the assignment questions).
