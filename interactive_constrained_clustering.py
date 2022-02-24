import numpy as np
from active_semi_clustering.semi_supervised.pairwise_constraints import PCKMeans
from active_semi_clustering.exceptions import InconsistentConstraintsException
import matplotlib.pyplot as plt
import sys
import pickle
from sklearn import datasets, metrics
from sklearn.neighbors import NearestNeighbors, LocalOutlierFactor
from sklearn.ensemble import IsolationForest
import pandas as pd
from pandas.api.types import is_object_dtype, is_bool_dtype

def convert_problematic_data(data):
    '''
    Takes a pandas dataframe
    Converts all data that is not numerical into numerical data. 
    Returns an updated dataframe with one hot encoding. 
    '''
    df = data.infer_objects() 
    category_columns = []
    # Determine which columns are categorical
    for column in df:
        if(df[column].dtype == "object"):
            df[column] = df[column].astype('category')
            df = df.drop(columns=[column]) #Drop em for now but gotta actually do something with em later
        elif(df[column].dtype == "bool"):
            df = df.drop(columns=[column]) #Drop these too for now
    #TODO: One hot encoding
    return df

def create_constraint(links):
    '''
    Takes a list of (index, index) lists. 
    Exports links to be symettric and linked based off of logic within links. 

    Input: [(40, 41), (42, 41)]
    Output: [(40, 41), (41, 40), (42, 41), (41, 42), (40, 42), (42, 40)]

    Input: [(40, 41), (42, 43)]
    Output: [(40, 41), (41, 40), (42, 43), (43, 42)]
    '''
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

def constraint_already_exists(constraint_sets, v1, v2):
    '''
    Checks if a constraint between v1 and v2 exists in constraint_sets
    constraint_sets should be a 2d list of constraints 
    eg. if the must link constraints were (1,2) and (3,4), the cannot link constrains were (5,6) and (7,8) and the unknown constraints were (9,0) constraint_sets would look like:
    [[1,2,3,4],
    [5,6,7,8],
    [9,0]]
    '''
    for constraint_set in constraint_sets:
        for i in range(0, len(constraint_set)-1, 2):
            if int(constraint_set[i]) == int(v1) and int(constraint_set[i+1]) == int(v2) or int(constraint_set[i]) == int(v2) and int(constraint_set[i+1]) == int(v1):
                return True
    return False

def find_nearest_neighbor(neighbors, numpy_data, value, labels, same_cluster, constraints=[]):
    '''
    Finds and returns the nearest neighbor to the item at numpy_data[value] with either the same or different label depending on same_cluster 
    '''
    closest_neighbor_index = neighbors.kneighbors(numpy_data[value].reshape(1, -1), n_neighbors=len(numpy_data))[1][0]

    for i in range(1, len(closest_neighbor_index)):
        # If the labels are the same and same_cluster is true or the labels are different and same_cluster is false
        if (labels[closest_neighbor_index[i]] == labels[value[0]]) == same_cluster and not constraint_already_exists(constraints, closest_neighbor_index[i], value[0]):
            return closest_neighbor_index[i]
    
    print(3)
    raise IndexError("Unable to find another Sample to match "+ str(value[0]) +" with due to constraints.")


def compute_questions(filename, cluster_iter, question_num, cluster_num, must_link_constraints, cant_link_constraints, unknown_constraints):
    '''
    Args:
        filename: name of the csv file
        cluster_iter: what iteration we are currently on
        question_num: Questions per iteration rounded down to nearest even number
        must_link_constraints: 
        cant_link_constraints:
        unknown_constraints:
    '''
    
    # ================Generate clustering model================

    df = convert_problematic_data(pd.read_csv('datasets/' + filename))
    numpy_data = df.to_numpy()
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
            model.fit(numpy_data, ml=ml, cl=cl)
        except InconsistentConstraintsException:
            # Error 2 sent to client to handle properly.
            print(2)
            raise InconsistentConstraintsException("Inconsistent constraints")
        clusters_inc_model = PCKMeans(n_clusters=cluster_num+1)
        clusters_inc_model.fit(numpy_data, ml=ml, cl=cl)
        #Don't need to sort these as avg is the only value being taken from this. 
        cluster_inc_sil_arr = metrics.silhouette_samples(numpy_data, clusters_inc_model.labels_)
        if cluster_num > 2:
            clusters_dec_model = PCKMeans(n_clusters=cluster_num-1)
            clusters_dec_model.fit(numpy_data, ml=ml, cl=cl)
            #Don't need to sort these as avg is the only value being taken from this. 
            cluster_dec_sil_arr = metrics.silhouette_samples(numpy_data, clusters_dec_model.labels_)
    else:
        model = PCKMeans(n_clusters=cluster_num)
        try:
            model.fit(numpy_data)
        except TypeError:
            # Error 1 sent to client to handle properly.
            print(1)
            raise TypeError("There exists a string values in the dataset that the tool was unable to handle properly.")

    # ================Generate graph for website================
    labels = model.labels_
    # Creation of graph for image.
    # plt.style.use('dark_background') for landing page pic
    plt.scatter(numpy_data[:, 0], numpy_data[:, 1], c=labels, s=10, cmap=plt.cm.RdBu)
    plt.savefig("interactive-constrained-clustering/src/images/clusterImg" + cluster_iter, orientation='portrait')  # dpi=100 for landing page pic
    # plt.savefig("interactive-constrained-clustering/src/images/clusterImg"+cluster_iter)
    # Save model and data for the image generation.
    #dump(obj, open(filename, mode))
    pickle.dump(model, open('interactive-constrained-clustering/src/model/finalized_model.sav', 'wb'))
    pickle.dump(model, open('interactive-constrained-clustering/src/model/temp/latest_model.sav', 'wb'))
    pickle.dump(numpy_data, open('interactive-constrained-clustering/src/model/temp/latest_numpy_data.sav', 'wb'))
    pickle.dump(df, open('interactive-constrained-clustering/src/model/temp/latest_df.sav', 'wb'))

    # ================Evaluate clustering model================

    labels = model.labels_

    #Isolation Forest Anomaly Score
    if_samp = IsolationForest(random_state=0).fit(numpy_data).score_samples(numpy_data)
    norm_if_scores = map(lambda x, r=float(np.max(if_samp) - np.min(if_samp)): ((x - np.min(if_samp)) / r), if_samp)

    #Local Outlier Factor
    neg_out_arr = LocalOutlierFactor().fit(numpy_data).negative_outlier_factor_
    norm_nog = map(lambda x, r=float(np.max(neg_out_arr) - np.min(neg_out_arr)): ((x - np.min(neg_out_arr)) / r), neg_out_arr)

    #Sihlouette
    # Passing my data (data) and the certain cluster that each data point from X should be based on our model.
    sil_arr = metrics.silhouette_samples(numpy_data, labels)
    sorted_sil_arr = sorted(sil_arr)
    norm_sil = map(lambda x, r=float(np.max(sil_arr) - np.min(sil_arr)): ((x - np.min(sil_arr)) / r), sil_arr)

    avg_sil = sum(sorted_sil_arr)/len(sorted_sil_arr)
    #cluster+1 and cluster-1 portion for silhoutte. Determine if we must flag the notif in front-end app. 
    sil_change_value = 0
    if int(cluster_iter) != 1:
        avg_inc_sil = sum(cluster_inc_sil_arr)/len(cluster_inc_sil_arr)
        if int(cluster_num) > 2:
            avg_dec_sil = sum(cluster_dec_sil_arr)/len(cluster_dec_sil_arr)
            if avg_sil < avg_inc_sil and avg_dec_sil < avg_inc_sil:
                sil_change_value = 4
            elif avg_sil < avg_dec_sil and avg_inc_sil < avg_dec_sil:
                sil_change_value = 5
        else:
            if avg_sil < avg_inc_sil:
                sil_change_value = 4


    #Take all the normalized metric arrays, determine the avg to provide for question determination
    normalized_magic = [((x*0.5) + (y*0.25) + (z*0.25)) for x, y, z in zip(norm_sil, norm_nog, norm_if_scores)]
    sorted_norm_magic = sorted(normalized_magic)

    #Min
    print(sorted_norm_magic[0])
    print("SEPERATOR")
    #Avg
    print(str(sum(normalized_magic)/len(normalized_magic)))
    print("SEPERATOR")
    #Max
    print(sorted_norm_magic[-1])
    print("SEPERATOR")

    # ================Decide what questions to ask clustering model================

    question_set_indices = []
    # Interested in question_num/2 unreliable data points as we will compare the nearest neighbour of same node and nearest neighbour of a diffrent node
    # Converting the lowest indecies into an array of list(index,index) based on nearest sets of clusters.
    for v in sorted_norm_magic[:int(question_num/2)]:
        question_set_indices += np.where(normalized_magic == v)

    #Creating neighbor to determine nearest nodes. 
    neighbor = NearestNeighbors()
    neighbor.fit(numpy_data)
    # Format for question_set: [valueQuestioned(VQ), VQSameNeighbor, VQ, VQDiffNeighbor, VQ2, VQ2SameNeighbor, VQ2, VQ2DiffNeighbor,...]
    # This format is used to support the transfer into javascript.
    question_set = []

    for value in question_set_indices:
        # Creates an "odd" question with value and the nearest neighbour to value that is in the same cluster and has no existing constraints with value
        question_set.append(value[0])
        question_set.append(find_nearest_neighbor(neighbor, numpy_data, value, labels, True, constraints=[must_link_constraints, cant_link_constraints, unknown_constraints]))
        # Creates and "even" question with value and the nearest neighbour to value that is in a different cluster and has no existing constraints with value
        question_set.append(value[0])
        question_set.append(find_nearest_neighbor(neighbor, numpy_data, value, labels, False, constraints=[must_link_constraints, cant_link_constraints, unknown_constraints]))

    print(question_set)
    print("SEPERATOR")
    print(sil_change_value)

    # print the column names so the ui can populate the drop down menus
    print("SEPERATOR")
    print(list(df.columns.values))
    


'''
filename - filename within datasets folder to search for. 
clustering_iter - to support the naming of the clustering in images.
question_num - the input from the landing page will set the num of samples that will be collected.
cluster_num - the number of clusters for the PCKmeans algorithm.
ml - The must link constraints from the oracle.
cl - The can't link constraints from the oracle.
unknown - The unknown constraints from the oracle. 
'''
# Handle incoming values from program call.
filename = str(sys.argv[1])
cluster_iter = str(sys.argv[2])
question_num = int(sys.argv[3])
cluster_num = int(sys.argv[4])
ml = sys.argv[5].split(",")
cl = sys.argv[6].split(",")
unknown = sys.argv[7].split(",")

compute_questions(filename, cluster_iter, question_num, cluster_num, ml, cl, unknown)