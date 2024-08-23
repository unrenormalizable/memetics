import os
import os.path
import hashlib
import uuid
import shutil
from pathlib import Path
import re
import logger
import common

MEMETICS_PREFIX = "memetics_"
MEMES_FILE_NAME_CRACKER = rf"^{MEMETICS_PREFIX}([0-9a-f]*)\..*$"


def __generate_uuid_from_file(file_path):
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)

    # Get the MD5 hash as a hex string
    md5_hash_hex = hash_md5.hexdigest()

    # Convert the MD5 hash to a UUID
    file_uuid = uuid.UUID(md5_hash_hex)

    return file_uuid


def __is_meme_file(f):
    """Must have the name with correct format + associated json file"""
    if not Path(f).is_absolute():
        raise ValueError("Function expects fully qualified path")

    if not re.match(MEMES_FILE_NAME_CRACKER, os.path.split(f)[1].lower()):
        logger.error(f"Not a meme, ignoring... {f}")
        return False

    if not (
        os.path.isfile(f) and os.path.isfile(f"{common.change_extension(f, '.json')}")
    ):
        logger.error(f"Associated json not found, ignoring... {f}")
        return False

    return True


def __get_memes(_dir):
    memes = {
        os.path.join(_dir, f)
        for f in os.listdir(_dir)
        if not f.casefold().endswith(".json")
    }

    yield from filter(__is_meme_file, memes)


def __generate_meme_ids(_dir):
    memes = __get_memes(_dir)
    return (
        {
            "id": str(__generate_uuid_from_file(f)).lower(),
            "url_id": os.path.splitext(os.path.split(f)[1])[0].replace(
                MEMETICS_PREFIX, ""
            ),
            "extn": os.path.splitext(f)[1],
        }
        for f in memes
    )


def __copy_file(src, dst):
    if os.path.isfile(dst):
        logger.error(f"Already exists: {dst}. Not processing {src}...")
    else:
        logger.info(f"Copying meme: {src} -> {dst}")
        shutil.copyfile(src, dst)


def execute(src_dir, dst_dir):
    """
    Given
    - src dir
    - dst dir,

    Return
    - Iterator of {'id': '52b12427-78d9-4025-dc32-b6dd010ca284', 'url_id': '1a45a490af2fb3', 'extn': '.jpeg'}
    """
    names = __generate_meme_ids(src_dir)
    for name in names:
        _id = name["id"]
        url_id = name["url_id"]
        extn = name["extn"]

        img_src = os.path.join(src_dir, f"{MEMETICS_PREFIX}{url_id}{extn}")
        img_dst = os.path.join(dst_dir, f"{_id}{extn}")
        __copy_file(img_src, img_dst)

        md_src = os.path.join(src_dir, f"{MEMETICS_PREFIX}{url_id}.json")
        md_dst = os.path.join(dst_dir, f"{_id}.json")
        __copy_file(md_src, md_dst)

        yield name
