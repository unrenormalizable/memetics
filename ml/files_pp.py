import os
import os.path
import hashlib
import uuid
import shutil


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


def __get_normalize_names(src_dir):
    files = (
        (os.path.join(src_dir, f), os.path.splitext(f)[1])
        for f in os.listdir(src_dir)
        if os.path.isfile(os.path.join(src_dir, f))
    )
    uuids = (
        (f[0], (str(__generate_uuid_from_file(f[0])) + f[1]).lower()) for f in files
    )
    return uuids


def normalize_names(src_dir, dst_dir):
    """Is idempotent + does not delete the files in src_dir"""
    normalized_names = (
        (nn[0], os.path.join(dst_dir, nn[1]), nn[1])
        for nn in __get_normalize_names(src_dir)
    )

    for nn in normalized_names:
        src = nn[0]
        dst = nn[1]
        shutil.copyfile(src, dst)
        yield (nn[2], dst)
