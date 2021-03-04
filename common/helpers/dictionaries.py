def merge_dicts(*dict_args):
    """
    Given any number of dicts, shallow copy and merge into a new dict,
    precedence goes to key value pairs in latter dicts.
    Taken from https://stackoverflow.com/a/26853961/6326903
    """
    result = {}
    for dictionary in dict_args:
        result.update(dictionary)
    return result


def keys_subset(base_dict, keys):
    """
    Generate a dictionary that contains a subset of the entries of the base dictionary
    with the given keys
    """
    return dict((k, base_dict[k]) for k in keys if k in base_dict)


def keys_omit(base_dict, keys):
    """
    Generate a dictionary that contains a subset of the entries of the base dictionary
    that do not match the given keys
    """
    all_keys = set(base_dict.keys())
    omitted_keys = set(keys)
    include_keys = all_keys - omitted_keys
    return keys_subset(base_dict, include_keys)
