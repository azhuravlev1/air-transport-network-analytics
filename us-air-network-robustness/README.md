# US network: robustness to removing airports

Airports removed from the giant component in order of each centrality ranking until the network disconnects. Most central first: 1 removal by harmonic centrality, 2 by degree, PageRank, authority or hub, 4 by betweenness. Least central first: many more removals, sometimes nearly the whole network.

Code: the robustness section of [`../analysis.ipynb`](../analysis.ipynb).
