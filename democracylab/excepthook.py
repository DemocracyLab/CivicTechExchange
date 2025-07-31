import sys
import traceback
import logging

def exception_logging(exctype, value, tb):
    """ Log exception by using the root logger.
    Parameters
    ----------
    exctype : type
    value : NameError
    tb : traceback
    """
    write_val = {
        'exception_type': str(exctype),
        'message': str(traceback.format_tb(tb, 10))
    }
    logging.error(str(write_val), exc_info=(exctype, value, tb))

# Set the excepthook function
sys.excepthook = exception_logging
