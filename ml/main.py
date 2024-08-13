import os
import json
from PIL import Image

# import keras_ocr
# import recognizer
# import files_pp

SRC_PATH = "/mnt/d/src/delme/memes/"
DST_PATH = "/mnt/d/src/delme/memes.pp/"
INDEX_JSON = f"{DST_PATH}index.json"
INDEX_TEXT = f"{DST_PATH}index.txt"

# img_paths = files_pp.normalize_names(SRC_PATH, DST_PATH)

# pipeline = keras_ocr.pipeline.Pipeline()


# def get_text_from_images(_img_paths):
#     for img_path in _img_paths:
#         words = recognizer.get_text(pipeline, img_path[1])
#         yield (img_path[0], words)


# with open(INDEX_TEXT, "w", encoding="utf8") as index:
#     for img_text in get_text_from_images(img_paths):
#         print(f"#### Processed {img_text[0]}...")
#         index.write(f"{img_text[0]} = {'|'.join(img_text[1])}\n")
#         index.flush()


def __process_text(text):
    return text.rstrip().replace("|", " ")


def __get_records(path):
    with open(INDEX_TEXT, "r", encoding="UTF-8") as file:
        for i, line in enumerate(file):
            kv = line.split(" = ")
            _id = kv[0].rstrip()
            description = __process_text(kv[1]) if len(kv) > 1 else ""
            w, h = Image.open(os.path.join(path, _id)).size
            yield {
                "id": i,
                "width": w,
                "height": h,
                "tags": [],
                "img": _id,
                "description": description,
            }


with open(INDEX_JSON, "w", encoding="UTF-8") as f:
    data = list(__get_records(DST_PATH))
    json.dump(data, f)
