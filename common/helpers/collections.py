# Find first occurrence of an item in a collection that satisfies the condition
def find_first(collection, condition):
    for item in collection:
        if condition(item):
            return item
    return None


def flatten(nested_collection):
    flat_list = []
    for collection in nested_collection:
        for item in collection:
            flat_list.append(item)
    return flat_list


def count_occurrences(collection):
    count_dict = {}
    for item in collection:
        if item not in count_dict:
            count_dict[item] = 1
        else:
            count_dict[item] = count_dict[item] + 1
    return count_dict
