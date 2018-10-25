from django.db import connection


def db_table_exists(table_name):
    return table_name in connection.introspection.table_names()


# Check to see if democracylab's database tables have been initialized yet
def db_is_initialized():
    return db_table_exists('common_tag')
