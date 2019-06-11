# Find first occurrence of an item in a collection that satisfies the condition
def find_first(collection, condition):
    for item in collection:
        if condition(item):
            return item
    return None

