import pickle
import sys
import matplotlib.pyplot as plt

def generate_image(cluster_iter, x_axis, y_axis):
    '''
    generates the graph image using the pickle objects saved at /ineractive-constrainted-clustering/src/model/temp/*.sav
    saves the image to /interactive-constrained-clustering/src/images/cluterImgx.png
    '''

    model = pickle.load(open('interactive-constrained-clustering/src/model/temp/latest_model.sav', 'rb'))
    df = pickle.load(open('interactive-constrained-clustering/src/model/temp/latest_df.sav', 'rb'))
    numpy_data = pickle.load(open('interactive-constrained-clustering/src/model/temp/latest_numpy_data.sav', 'rb'))
    labels = model.labels_
    plt.scatter(numpy_data[:, x_axis], numpy_data[:, y_axis], c=labels, s=10, cmap=plt.cm.Set1)
    plt.xlabel(df.columns[x_axis])
    plt.ylabel(df.columns[y_axis])
    plt.savefig("interactive-constrained-clustering/src/images/clusterImg" + cluster_iter, orientation='portrait')  # dpi=100 for landing page pic

'''
clustering_iter - to support the naming of the clustering in images.
'''

# Handle incoming values from program call.
print(sys.argv)
cluster_iter = sys.argv[1]
x_axis = int(sys.argv[2])
y_axis = int(sys.argv[3])

generate_image(cluster_iter, x_axis, y_axis)