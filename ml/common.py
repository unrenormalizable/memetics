import os


def change_extension(f, new_ext):
    return f"{os.path.splitext(f)[0]}{new_ext}"
