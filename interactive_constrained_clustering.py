import numpy as np
from sklearn import datasets, metrics
from active_semi_clustering.semi_supervised.pairwise_constraints import PCKMeans
import matplotlib.pyplot as plt
import sys
import pickle
from sklearn.neighbors import NearestNeighbors
import pandas as pd
from pandas.api.types import is_string_dtype
from distython import HEOM
from numpy import genfromtxt

def create_model(clustering_iter, question_num, cluster_num, must_link_constraints, cant_link_constraints, export=False):
    # y is target = Goal of ML
    data = datasets.load_breast_cancer(return_X_y=True)[0]
    # data = genfromtxt('datasets/homes.csv', delimiter=',')
    # print(data)
    # Will not be aware of ml or cl constraints until after user passes Iteration 1
    if int(cluster_iter) != 1:
        # Generates the setup for constraints from input from the user.
        ml = create_constraint(must_link_constraints)
        cl = create_constraint(cant_link_constraints)
        # How to add to the constraints
        ml_con = []
        cl_con = []
        # Applying new constraints to the model
        model = PCKMeans(n_clusters=cluster_num)
        model.fit(data, ml=ml_con, cl=cl_con)
    else:
        model = PCKMeans(n_clusters=cluster_num)
        model.fit(data)

    # Creation of graph for image.
    plt.scatter(data[:, 0], data[:, 1], c=model.labels_, s=10, cmap='viridis')
    plt.savefig("interactive-constrained-clustering/src/images/clusterImg"+cluster_iter)

    if export:
        export_model(model)
    else:
        compute_questions(data, model.labels_, clustering_iter, question_num)

'''
Takes a model 
Exports using pickle format. 
'''
def export_model(model):
    #dump(obj, open(filename, mode))
    pickle.dump(model, open('finalized_model.sav', 'wb'))

'''
Takes a list of (index, index) lists. 
Exports links to be symettric and linked based off of logic within links. 

Input: [(40, 41), (42, 41)]
Output: [(40, 41), (41, 40), (42, 41), (41, 42), (40, 42), (42, 40)]

Input: [(40, 41), (42, 43)]
Output: [(40, 41), (41, 40), (42, 43), (42, 43)]
'''
def create_constraint(links):
    final_link = []
    for link in links:
        final_link.append((link[0], link[1]))
        final_link.append((link[1], link[0]))
    links_new = final_link.copy()
    for link in links_new:
        for link2 in links_new:
            if link != link2 and link[1] == link2[0] and link[0] != link2[1] and (link[0], link2[1]) not in final_link:
                final_link.append((link[0], link2[1]))
                final_link.append((link2[1], link[0]))
    return final_link

def compute_questions(data, labels, clustering_iter, question_num):
    categorical_ix = gather_data_information(data)
    if not categorical_ix:
        # For situation where all numeric columns
        #print("Running minkowski algo")
        neighbor = NearestNeighbors()
    else:
        # For situation where a category exists that is not numerical
        #print("Running HEOM algo")
        heom_metric = HEOM(data, categorical_ix)
        neighbor = NearestNeighbors(metric=heom_metric.heom)
    neighbor.fit(data)
    # Passing my data (data) and the certain cluster that each data point from X should be based on our model.
    sil_arr = metrics.silhouette_samples(data, labels)
    sorted_sil_arr = sorted(sil_arr)

    question_set_indices = []
    # Interested in question_num/2 unreliable data points as we will compare the nearest neighbour of same node and nearest neighbour of a diffrent node
    # Converting the lowest indecies into an array of list(index,index) based on nearest sets of clusters.
    for value in sorted_sil_arr[:int(question_num/2)]:
        question_set_indices += np.where(sil_arr == value) 
    #Format for question_set: [valueQuestioned(VQ), VQSameNeighbor, VQ, VQDiffNeighbor, VQ2, VQ2SameNeighbor, VQ2, VQ2DiffNeighbor,...]
    #This format is used to support the transfer into javascript.
    question_set = []
    for value in question_set_indices:
        # Sets the even value of the array to the nearest neighbour.
        question_set.append(value[0])
        question_set.append(neighbor.kneighbors(data[value].reshape(1, -1), n_neighbors=2)[1][0, 1])
        # Sets the odd values of the array to the nearest neighbour that doens't have the same cluster value
        found = True
        index = 2  # 0th element is itself, 1st element is assigned above.
        while found:
            neighbor_index = neighbor.kneighbors(
                data[value].reshape(1, -1), n_neighbors=(index+1))[1][0, index]
            if labels[neighbor_index] != labels[value[0]]:
                question_set.append(value[0])
                question_set.append(neighbor_index)
                found = False
            index += 1
    print(question_set)
    # Send the indecies for the bottom values to React.

'''
Takes a dataset
Exports a list full of columns indices that are not numerical from the dataset.
'''
def gather_data_information(data):
    df = pd.DataFrame(data=data)
    category_columns = []
    # Determine which columns are categorical
    for i in range(0, len(df.columns)):
        if is_string_dtype(df[i]):
            category_columns.append(i)
    #print("Category Columns:", category_columns)
    return category_columns

'''
clustering_iter - to support the naming of the clustering in images.
question_num - the input from the landing page will set the num of samples that will be collected.
cluster_num - the number of clusters for the PCKmeans algorithm.
'''
# Handle incoming values from program call.
cluster_iter = str(sys.argv[1])
question_num = int(sys.argv[2])
cluster_num = int(sys.argv[3])
ml = [(0, 1), (2, 10), (0, 10), (30, 31)]
cl = [(40, 41), (42, 41)]

try:
    if str(sys.argv[6]) == "export":
        export = True
    else:
        export = False
except IndexError:
    export = False

# print("test")
# print("SEPERATOR")

if bool(export):
    create_model(cluster_iter, question_num, cluster_num, ml, cl, export=True)
else:
    create_model(cluster_iter, question_num, cluster_num, ml, cl)
