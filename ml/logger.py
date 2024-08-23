import os

os.system("")

_BLACK = "\033[30m"
_RED = "\033[31m"
_GREEN = "\033[32m"
_YELLOW = "\033[33m"
_BLUE = "\033[34m"
_MAGENTA = "\033[35m"
_CYAN = "\033[36m"
_WHITE = "\033[37m"
_UNDERLINE = "\033[4m"
_RESET = "\033[0m"


def info(s):
    print(f"{_GREEN}{s}{_RESET}")


def warning(s):
    print(f"{_YELLOW}{s}{_RESET}")


def error(s):
    print(f"{_RED}{s}{_RESET}")
