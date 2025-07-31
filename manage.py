#!/usr/bin/env python
import os
import sys
from importlib.util import find_spec, module_from_spec

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "democracylab.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError:
        # The above import may fail for some other reason. Ensure that the
        # issue is really that Django is missing to avoid masking other
        # exceptions on Python 2.
        try:
            module_spec = find_spec("django")
            if module_spec is not None:
                module = module_from_spec(module_spec)
                module_spec.loader.exec_module(module)
            
        except ImportError:
            raise ImportError(
                "Couldn't import Django. Are you sure it's installed and "
                "available on your PYTHONPATH environment variable? Did you "
                "forget to activate a virtual environment?"
            )
        raise
    execute_from_command_line(sys.argv)


