import numpy as np
from sklearn import datasets, metrics
from active_semi_clustering.semi_supervised.pairwise_constraints import PCKMeans
from active_semi_clustering.exceptions import InconsistentConstraintsException
import matplotlib.pyplot as plt
import sys
import pickle
from sklearn.neighbors import NearestNeighbors
import pandas as pd
from pandas.api.types import is_string_dtype
from distython import HEOM
from numpy import genfromtxt


def create_model(filename, clustering_iter, question_num, cluster_num, must_link_constraints, cant_link_constraints, unknown_constraints):
    # y is target = Goal of ML
    # How to use a dataset from sklearn
    #data = datasets.load_breast_cancer(return_X_y=True)[0]
    # "TODO: Consider implementing more ways to handle data. Ex. Datasets without features in first row. ")
    data = pd.read_csv('datasets/'+filename)
    data = data.to_numpy()
    # Working for directly to a numpy array. Can be done below. dtype=None to try and handle strings properly.
    # data = genfromtxt('datasets/'+filename, delimiter=',')
    # data = np.delete(data, 0, 0)  # Delete first row of the data for the titles.
    # Will not be aware of ml or cl constraints until after user passes Iteration 1
    if int(cluster_iter) != 1:
        ml_converted = [i for i in zip(*[iter(must_link_constraints)]*2)]
        cl_converted = [i for i in zip(*[iter(cant_link_constraints)]*2)]
        # Generates the setup for constraints from input from the user.
        ml = create_constraint(ml_converted)
        cl = create_constraint(cl_converted)
        # Applying new constraints to the model
        model = PCKMeans(n_clusters=cluster_num)
        try:
            model.fit(data, ml=ml, cl=cl)
        except InconsistentConstraintsException:
            # Error 2 sent to client to handle properly.
            print(2)
            raise InconsistentConstraintsException("Inconsistent constraints")
    else:
        model = PCKMeans(n_clusters=cluster_num)
        try:
            model.fit(data)
        except TypeError:
            # Error 1 sent to client to handle properly.
            print(1)
            raise TypeError("There exists categorical values in the dataset.")

    # Creation of graph for image.
    # plt.style.use('dark_background')
    # plt.cm.RdGy nice red good for whtie plt.cm.BrBG nice green and brown
    plt.scatter(data[:, 0], data[:, 1],
                c=model.labels_, s=10, cmap=plt.cm.RdBu)
    plt.savefig("interactive-constrained-clustering/src/images/clusterImg" +
                cluster_iter, orientation='portrait')  # dpi=100 for landing page pic
    # plt.savefig("interactive-constrained-clustering/src/images/clusterImg"+cluster_iter)

    # Save model.
    #dump(obj, open(filename, mode))
    pickle.dump(model, open(
        'interactive-constrained-clustering/src/model/finalized_model.sav', 'wb'))
    compute_questions(data, model.labels_, clustering_iter,
                      question_num, must_link_constraints, cant_link_constraints, unknown_constraints)


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
        final_link.append((int(link[0]), int(link[1])))
        final_link.append((int(link[1]), int(link[0])))
    links_new = final_link.copy()
    for link in links_new:
        for link2 in links_new:
            if link != link2 and link[1] == link2[0] and link[0] != link2[1] and (link[0], link2[1]) not in final_link:
                final_link.append((int(link[0]), int(link2[1])))
                final_link.append((int(link2[1]), int(link[0])))
    return final_link


def compute_questions(data, labels, clustering_iter, question_num, ml, cl, unknown):
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
    print(sorted_sil_arr[0])
    print("SEPERATOR")
    print(sum(sorted_sil_arr)/len(sorted_sil_arr))
    print("SEPERATOR")
    print(sorted_sil_arr[-1])
    print("SEPERATOR")

    question_set_indices = []
    # Interested in question_num/2 unreliable data points as we will compare the nearest neighbour of same node and nearest neighbour of a diffrent node
    # Converting the lowest indecies into an array of list(index,index) based on nearest sets of clusters.
    for value in sorted_sil_arr[:int(question_num/2)]:
        question_set_indices += np.where(sil_arr == value)
    # Format for question_set: [valueQuestioned(VQ), VQSameNeighbor, VQ, VQDiffNeighbor, VQ2, VQ2SameNeighbor, VQ2, VQ2DiffNeighbor,...]
    # This format is used to support the transfer into javascript.
    question_set = []
    for value in question_set_indices:
        # Sets the even value of the array to the nearest neighbour.
        found = False
        index = 1
        closest_neighbor_index = neighbor.kneighbors(
            data[value].reshape(1, -1), n_neighbors=len(data))[1][0]
        while not found:
            try:
                if labels[closest_neighbor_index[index]] != labels[value[0]]:
                    found = search_in_question_set(
                        question_set, value[0], closest_neighbor_index[index])
                    if found:
                        found = search_in_question_set(
                            ml, value[0], closest_neighbor_index[index])
                        if found:
                            found = search_in_question_set(
                                cl, value[0], closest_neighbor_index[index])
                            if found:
                                found = search_in_question_set(
                                    unknown, value[0], closest_neighbor_index[index])
                if found:
                    question_set.append(value[0])
                    question_set.append(closest_neighbor_index[index])
                    found = True
                index += 1
            except IndexError:
                # Error 3 sent to client to handle properly.
                print(3)
                raise IndexError("Unable to find another Sample to match "+ str(value[0]) +" with due to constraints.")
        # Sets the odd values of the array to the nearest neighbour that doens't have the same cluster value
        found = False
        index = 2  # 0th element is itself, 1st element is assigned above.
        closest_neighbor_index = neighbor.kneighbors(
            data[value].reshape(1, -1), n_neighbors=len(data))[1][0]
        while not found:
            try:
                if labels[closest_neighbor_index[index]] != labels[value[0]]:
                    found = search_in_question_set(
                        question_set, value[0], closest_neighbor_index[index])
                    if found:
                        found = search_in_question_set(
                            ml, value[0], closest_neighbor_index[index])
                        if found:
                            found = search_in_question_set(
                                cl, value[0], closest_neighbor_index[index])
                            if found:
                                found = search_in_question_set(
                                    unknown, value[0], closest_neighbor_index[index])
                if found:
                    question_set.append(value[0])
                    question_set.append(closest_neighbor_index[index])
                    found = True
                index += 1
            except IndexError:
                # Error 3 sent to client to handle properly.
                print(3)
                raise IndexError("Unable to find another Sample to match "+ str(value[0]) +" with due to constraints.")
    print(question_set)
    # Send the indecies for the bottom values to React.


'''
Supports in question_set calculation. 
Checks if two samples are already inputed to the question set or not. 
'''


def search_in_question_set(set, v1, v2):
    for i in range(len(set)-1):
        #print("Set[i]: " ,set[i], "Set[i+1]:", set[i+1], "V1: " ,v1, "V2: ", v2 )
        if int(set[i]) == int(v1) and int(set[i+1]) == int(v2):
            return False
        if int(set[i]) == int(v2) and int(set[i+1]) == int(v1):
            return False
    return True


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
filename - filename within datasets folder to search for. 
clustering_iter - to support the naming of the clustering in images.
question_num - the input from the landing page will set the num of samples that will be collected.
cluster_num - the number of clusters for the PCKmeans algorithm.
ml - The must link constraints from the oracle.
cl - The can't link constraints from the oracle.
'''
# Handle incoming values from program call.
filename = str(sys.argv[1])
cluster_iter = str(sys.argv[2])
question_num = int(sys.argv[3])
cluster_num = int(sys.argv[4])
ml = sys.argv[5].split(",")
cl = sys.argv[6].split(",")
unknown = sys.argv[7].split(",")

# FOr testing purposes
# ml = [1,2,3,4,5,6]
# cl = [1,2,3,4,5,6]

create_model(filename, cluster_iter, question_num,
             cluster_num, ml, cl, unknown)
