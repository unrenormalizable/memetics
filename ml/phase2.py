import os
import json
from PIL import Image

import keras_ocr
import common
import recognizer

__pipeline = keras_ocr.pipeline.Pipeline()


def __get_description(img_path):
    words = recognizer.get_text(__pipeline, img_path)
    return " ".join(words)


def __get_image_dimensions(img_path):
    return Image.open(img_path).size


def __get_web_info(path):
    json_path = common.change_extension(path, ".json")
    with open(json_path, encoding="utf-8") as f:
        data = json.load(f)
        return (data["context"], data["nearbyText"])


def __get_index_record_for_one_meme(src_dir, meme):
    _id = meme["id"]
    img_name = f"{_id}{meme['extn']}"
    path = os.path.join(src_dir, img_name)
    description = __get_description(path)
    (w, h) = __get_image_dimensions(path)
    (ctxt, web_text) = __get_web_info(path)

    return {
        "id": 0,
        "url_id": meme["url_id"],
        "width": w,
        "height": h,
        "tags": [],
        "img": img_name,
        "context": ctxt,
        "description": description,
        "web_text": web_text,
    }


def execute(src_dir, memes):
    """
    Given
    - src dir
    - dst dirs
    - Iterator of {'id': '52b12427-78d9-4025-dc32-b6dd010ca284', 'url_id': '1a45a490af2fb3', 'extn': '.jpeg'}

    Emit
    - iterator of type
        {
            "id": i,
            "width": w,
            "height": h,
            "tags": [],
            "img": _id,
            "context": <url>
            "description": <>,
            "web_text": <>,
        }
    """
    for meme in memes:
        yield __get_index_record_for_one_meme(src_dir, meme)
