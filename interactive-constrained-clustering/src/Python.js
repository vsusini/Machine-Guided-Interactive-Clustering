export class FormInput {
    filename = ""
    questionsPerIteration = ""
    numberOfClusters = ""
    maxConstraintPercent = ""
    ml = []
    cl = []
    unknown = []
}

export class Stats {
    clConstraintCount = ""
    mlConstraintCount = ""
    unknownConstraintCount = ""
    maxConstraint = ""
    constrainedPercent = ""
    constructor(clSize, mlSize, unknownSize, maxConstraint, totalSamples) {
        const samples = totalSamples - 1 //Done cause the first row is a feature row. 
        //Constraint Count
        this.clConstraintCount = clSize
        this.mlConstraintCount = mlSize
        this.unknownConstraintCount = unknownSize
        //Constraint Percent
        this.maxConstraint = maxConstraint
        this.possibleConstraints = samples * samples
        this.totalConstraints = (clSize + mlSize + unknownSize)
        this.constrainedPercent = Math.round((this.totalConstraints / (this.possibleConstraints * (maxConstraint / 100))) * 100)  //Might be calculating this wrong
    }
}

export class PythonOutput {
    question_set = ""

    constructor(question_set) {
        this.question_set = this.convertIncomingSet(question_set)
    }

    convertIncomingSet(set) {
        var new_set = set.substring(1, set.length - 1).split(",")
        new_set.forEach((item, index, arr) => {
            arr[index] = parseInt(item.trim())
        })
        return new_set
    }
}