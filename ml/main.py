import json

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
    return text.replace("|", " ")


def __get_records():
    with open(INDEX_TEXT, "r", encoding="UTF-8") as file:
        while line := file.readline():
            kv = line.rstrip().split(" = ")
            yield {"id": kv[0], "text": __process_text(kv[1]) if len(kv) > 1 else ""}


with open(INDEX_JSON, "w", encoding="UTF-8") as f:
    data = list(__get_records())
    json.dump(data, f)
