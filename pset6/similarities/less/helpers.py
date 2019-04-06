from nltk.tokenize import sent_tokenize


def lines(a, b):
    """Return lines in both a and b"""

    # split each input into lines
    set_a = set(a.split('\n'))
    set_b = set(b.split('\n'))
    # compute a list of all lines than appear in both a and b
    return set_a & set_b


def sentences(a, b):
    """Return sentences in both a and b"""

    # sent_tokenize(a && b) returns sets (without duplicates)
    # and func. list convert it to list
    return list(set(sent_tokenize(a)) & set(sent_tokenize(b)))


def substrings(a, b, n):
    """Return substrings of length n in both a and b"""

    substr_a = []
    substr_b = []
    # make substrings for a
    for i in range((len(a) - (n - 1))):
        substr_a.append(a[i:i + n])
    # make substrings for b
    for i in range((len(b) - (n - 1))):
        substr_b.append(b[i:i + n])
    # return list of unique substrings
    return list(set(substr_a) & set(substr_b))
