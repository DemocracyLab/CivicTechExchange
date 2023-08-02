# Find first occurrence of an item in a collection that satisfies the condition
def find_first(collection: list, condition):
    for item in collection:
        if condition(item):
            return item
    return None


# Convert an array of arrays into a single array
def flatten(nested_collection: list):
    flat_list = []
    for collection in nested_collection:
        for item in collection:
            flat_list.append(item)
    return flat_list


# Count how many times a value repeats in the data
def count_occurrences(collection: list):
    count_dict = {}
    for item in collection:
        if item not in count_dict:
            count_dict[item] = 1
        else:
            count_dict[item] = count_dict[item] + 1
    return count_dict


# Find a distinct value from an object
def distinct(list_a: list, list_b: list, key_func):
    """
    Take two lists of arbitrary objects and get the union of distinct objects between the two
    :param list_a: First object list
    :param list_b: Second object list
    :param key_func: function for extracting unique key from objects
    :return: The values of the two lists, minus duplicates.
    """
    lists_dict = {key_func(item): item for item in list_a}
    lists_dict.update({key_func(item): item for item in list_b})

    return lists_dict.values()


def omit_falsy(collection: list):
    """
    Removes falsy entries from a list, returning None if no entries remaining
    """
    new_list = list(filter(lambda entry: entry, collection))
    return new_list or None
