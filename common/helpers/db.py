from django.db import connection


def db_table_exists(table_name):
    return table_name in connection.introspection.table_names()


# Check to see if democracylab's database tables have been initialized yet
def db_is_initialized():
    return db_table_exists('common_tag')


def bulk_delete(Table, delete_results):
    ids = delete_results.values_list("id", flat=True)
    Table.objects.filter(pk__in=list(ids)).delete()


def unique_column_values(model, column, filter_func):
    # the condition `is_searchable` is to filter the countries without approved projects.
    values = map(lambda obj_property: obj_property[column], model.objects.filter(is_searchable=True).values(column).distinct())
    return list(filter(filter_func, values))