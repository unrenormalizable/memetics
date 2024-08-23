import os
from datetime import datetime
import json
import urllib.request
import logger
import phase1
import phase2
import phase3

# Temp for now, manually copy and delete
PHASE0_DIR = "/mnt/d/src/delme/memes.0/"
# Normalize names + index
PHASE1_DIR = "/mnt/d/src/delme/memes.1/"
RUN_INDEX = f"{PHASE1_DIR}index.run.{datetime.now().strftime('%Y%m%d%H%M%S')}.json"
NEW_MASTER_INDEX = f"{PHASE1_DIR}index.json"
DIRS_TO_CLEAN = [PHASE1_DIR]
MASTER_INDEX = "https://ksapplications.blob.core.windows.net/memetics/index.json"


def cleanup_dir(_dir):
    print(f"Deleting contents of {_dir}...")
    for _f in os.listdir(_dir):
        os.remove(os.path.join(_dir, _f))


def __download_master_index(master_index_url):
    logger.info(f"Downloading {master_index_url}...")
    index = []
    with urllib.request.urlopen(master_index_url) as _f:
        index = json.loads(_f.read().decode("utf-8"))
    return index


for d in DIRS_TO_CLEAN:
    cleanup_dir(d)

memes = phase1.execute(PHASE0_DIR, PHASE1_DIR)

records = list(phase2.execute(PHASE1_DIR, memes))
logger.info(f"Writing run index {RUN_INDEX}...")
with open(RUN_INDEX, "w", encoding="UTF-8") as f:
    json.dump(records, f)

prev_master_index = __download_master_index(MASTER_INDEX)

merged_records = phase3.execute(records, prev_master_index)
logger.info(f"Writing new master index {NEW_MASTER_INDEX}...")
with open(NEW_MASTER_INDEX, "w", encoding="UTF-8") as f:
    json.dump(merged_records, f)
