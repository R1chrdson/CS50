from enum import Enum


class Operation(Enum):
    """Operations"""

    DELETED = 1
    INSERTED = 2
    SUBSTITUTED = 3

    def __str__(self):
        return str(self.name.lower())


def distances(a, b):
    """Calculate edit distance from a to b"""

    # set up 2D list
    matrix = [[(0, None) for i in range(len(b) + 1)] for j in range(len(a) + 1)]

    # add values for base cases (first row and first column)
    for i in range(1, len(a) + 1):
        matrix[i][0] = (i, Operation.DELETED)

    for j in range(1, len(b) + 1):
        matrix[0][j] = (j, Operation.INSERTED)

    # fill in the other entires in the table
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            # deletion
            deletion, _ = matrix[i - 1][j]
            deletion += 1

            # insertion
            insertion, _ = matrix[i][j - 1]
            insertion += 1

            # substitution
            substitution, _ = matrix[i - 1][j - 1]
            if a[i - 1] != b[j - 1]:
                substitution += 1

            # min
            if deletion <= insertion and deletion <= substitution:
                matrix[i][j] = (deletion, Operation.DELETED)
            elif insertion <= substitution:
                matrix[i][j] = (insertion, Operation.INSERTED)
            else:
                matrix[i][j] = (substitution, Operation.SUBSTITUTED)

    return matrix
