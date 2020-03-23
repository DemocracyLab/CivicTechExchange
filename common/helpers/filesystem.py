import io
import os


def touch(path):
    """
    from https://www.reddit.com/r/pythontips/comments/4md30h/touch_a_file_in_python_emulate_the_gnu_coreutils/
    Emulates the 'touch' command by creating the file at *path* if it does not
    exist.  If the file exist its modification time will be updated.
    """
    with io.open(path, 'ab'):
        os.utime(path, None)