# imports
import igraph as ig
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import cm
from statistics import mode

D = pd.read_csv('connections.csv')
airports = ig.Graph.TupleList([tuple(x) for x in D.values], directed=True, edge_attrs=['weight'])

# add vertex attributes to graph
A = pd.read_csv('airports_loc.csv')
lookup = {k:v for v,k in enumerate(A['airport'])}
l = [lookup[x] for x in airports.vs()['name']]
airports.vs()['layout'] = [(A['lon'][i],A['lat'][i]) for i in l]
airports.vs()['state'] = [A['state'][i] for i in l]
airports.vs()['city'] = [A['city'][i] for i in l]

# normalized weights 
mw = np.max(G.es['weight'])
G.es()['normalized_weight'] = [w/mw for w in G.es()['weight']]


# directed degree centrality
def degree_centrality(g, weights=None):
    n = g.vcount()
    if g.is_directed():
        dc = [sum(x)/(2*(n-1)) for x in zip(g.strength(mode='in',weights=weights),\
              g.strength(mode='out',weights=weights))]
    else:
        dc = [x/(n-1) for x in g.strength(weights=weights)]
    return dc

def compute_centrality_measures(g):
    mw = np.max(g.es['weight'])
    g.es()['normalized_weight'] = [w/mw for w in g.es['weight']]

    C = pd.DataFrame({'airport': g.vs()['name'],
                     'degree': degree_centrality(g, weights='normalized_weight'),
                     'pagerank': g.pagerank(weights='weight'),
                     'authority': g.authority_score(weights='weight'),
                     'hub': g.hub_score(weights='weight'),
                     'between': g.betweenness(),
                     'harmonic': g.harmonic_centrality()})
    
    # normalize betweenness
    n = g.vcount()
    C['between'] = [2*x/((n-1)*(n-2)) for x in C['between']]
    
    return C

ranked_airports = pd.DataFrame({'airport':airports.vs()['name'],\
                  'degree':degree_centrality(airports,weights='normalized_weight'),\
                  'pagerank':airports.pagerank(weights='weight'),'authority':airports.authority_score(weights='weight'),\
                  'hub':airports.hub_score(weights='weight'),'between':airports.betweenness(),\
                  'closeness':airports.closeness()})

# normalizing betweenness
n = airports.vcount()
ranked_airports['between'] = [2*x/((n-1)*(n-2)) for x in C['between']]

## sort w.r.t. degree centrality, look at top airports
ranked_airports_sorted = ranked_airports.sort_values(by='degree', ascending=False)

ranked_airports_sorted.head()



cl = airports.connected_components(mode='WEAK').membership
giant = mode(cl)
airports_connected = airports.subgraph([v.index for v in airports.vs() if cl[v.index] == giant])

def find_min_nodes_to_disconnect(g, centrality_df, measure, from_top=True):
    # sort nodes by centrality measure and get their indices
    sorted_indices = centrality_df.sort_values(measure, ascending=not from_top).index

    # remove nodes one by one until graph becomes disconnected by looping through the indices
    for i in range(1, len(sorted_indices) + 1):
        nodes_to_remove = sorted_indices[:i]
        temp_g = g.copy()
        temp_g.delete_vertices(nodes_to_remove)
        if len(temp_g.connected_components(mode='WEAK')) > 1:
            return i

    return len(sorted_indices)


def centrality_measures_experiment(graph, centrality_measures, measure_name):
    # sort airports by centrality measure
    airports_sorted = centrality_measures[['airport', measure_name]].sort_values(measure_name, ascending=False)
    print(f"Top 5 airports ranked with respect to {measure_name}:\n")
    print(airports_sorted.head())

    # number of of nodes with the largest score that are needed to be removed
    high_count = find_min_nodes_to_disconnect(graph, centrality_measures, measure_name, from_top=True)
    print("\nNumber of nodes with the largest", measure_name,
          "score that are needed to be removed so that the graph is no longer weakly connected: ", high_count)
    
    # number of of nodes with the smallest score that are needed to be removed
    low_count = find_min_nodes_to_disconnect(graph, centrality_measures, measure_name, from_top=False)
    print("Number of nodes with the smallest", measure_name,
          "score that are needed to be removed so that the graph is no longer weakly connected: ", low_count, "\n")

centrality_measures = compute_centrality_measures(airports_connected)
for measure in ['degree', 'pagerank', 'authority', 'hub', 'between', 'harmonic']:
    centrality_measures_experiment(airports_connected, centrality_measures, measure)



