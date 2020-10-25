import numpy as np
from sklearn.cluster import KMeans
from sklearn import datasets, metrics
from active_semi_clustering.semi_supervised.pairwise_constraints import PCKMeans
from active_semi_clustering.active.pairwise_constraints import ExampleOracle, ExploreConsolidate, MinMax
import matplotlib.pyplot as plt
import sys
import pickle
from sklearn.neighbors import NearestNeighbors
import pandas as pd
from pandas.api.types import is_string_dtype
# Importing a custom metric class
from distython import HEOM


def create_model(clustering_iter, question_num, cluster_num, export=False):
    # y is target = Goal of ML
    data, y = datasets.load_breast_cancer(return_X_y=True)
    print(data)
    # Will not be aware of ml or cl constraints until after user passes Iteration 1
    if int(cluster_iter) != 1:
        # Used until own oracle implemented.
        # oracle = ExampleOracle(y, max_queries_cnt=5)
        # active_learner = MinMax(n_clusters=cluster_num)
        # active_learner.fit(data, oracle=oracle)
        # pairwise_constraints = active_learner.pairwise_constraints_
        # How to add to the constraints
        ml_con = []
        cl_con = []
        # ml_con.append((52,0)
        # ml_con.append((0,52))
        # ml_con.append((1,52))
        # ml_con.append((52,1))
        # Applying new constraints to the model
        model = PCKMeans(n_clusters=cluster_num)
        # model.fit(data, ml=pairwise_constraints[0], cl=pairwise_constraints[1])
        model.fit(data, ml=ml_con, cl=cl_con)
    else:
        model = PCKMeans(n_clusters=cluster_num)
        model.fit(data)

    # Creation of graph for image.
    plt.scatter(data[:, 0], data[:, 1], c=model.labels_, s=10, cmap='viridis')
    plt.savefig("images/clusterImg"+cluster_iter)

    if export:
        export_model(model)
    else:
        compute_questions(data, model.labels_, clustering_iter, question_num)

def gather_data_information(data):
    df = pd.DataFrame(data=data)
    category_columns = []
    #Determine which columns are categorical
    for i in range(0,len(df.columns)):
        if is_string_dtype(df[0]):
            category_columns.append(i)
    print("Category Columns:", category_columns)
    return category_columns

def export_model(model):
    # dump (obj, open(filename, mode))
    pickle.dump(model, open('finalized_model.sav', 'wb'))


def compute_questions(data, labels, clustering_iter, question_num):
    categorical_ix = gather_data_information(data)
    if not categorical_ix:
        #For situation where all numeric columns
        print("Running minkowski algo")
        neighbor = NearestNeighbors()
    else:
        #For situation where a category exists that is not numerical
        print("Running HEOM algo")
        heom_metric = HEOM(data, categorical_ix)
        neighbor = NearestNeighbors(metric=heom_metric.heom)
    neighbor.fit(data)
    # Passing my data (data) and the certain cluster that each data point from X should be based on our model.
    sil_arr = metrics.silhouette_samples(data, labels)
    sorted_sil_arr = sorted(sil_arr)

    question_set_indices = []
    # Interested in question_num/2 unreliable data points as we will compare the nearest neighbour of same node and nearest neighbour of a diffrent node
    for value in sorted_sil_arr[:int(question_num/2)]:
        question_set_indices += np.where(sil_arr == value)
    # Converting the lowest indecies into an array of list(index,index) based on nearest sets of clusters.
    print(question_set_indices)
    question_set = []
    for value in question_set_indices:
        # Sets the even value of the array to the nearest neighbour.
        question_set.append((value[0], neighbor.kneighbors(
            data[value].reshape(1, -1), n_neighbors=2)[1][0, 1]))
        # Sets the odd values of the array to the nearest neighbour that doens't have the same cluster value
        found = True
        index = 2
        while found:
            neighbor_index = neighbor.kneighbors(
                data[value].reshape(1, -1), n_neighbors=(index+1))[1][0, index]
            if labels[neighbor_index] != labels[value[0]]:
                question_set.append((value[0], neighbor_index))
                found = False
            index += 1
    print(question_set)
    # Send the indecies for the bottom values to React.


'''
clustering_iter - to support the naming of the clustering in images.
question_num - the input from the landing page will set the num of samples that will be collected.
cluster_num - the number of clusters for the PCKmeans algorithm.
'''
# Handle incoming values from program call.
cluster_iter = str(sys.argv[1])
question_num = int(sys.argv[2])
cluster_num = int(sys.argv[3])

try:
    if str(sys.argv[4]) == "export":
        export = True
    else:
        export = False
except IndexError:
    export = False

if bool(export):
    create_model(cluster_iter, question_num, cluster_num, export=True)
else:
    create_model(cluster_iter, question_num, cluster_num)
