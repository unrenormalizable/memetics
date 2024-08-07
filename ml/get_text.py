import math
import keras_ocr


def get_distance(preds):
    """
    Function returns dictionary with (key,value):
        * text : detected text in image
        * center_x : center of bounding box (x)
        * center_y : center of bounding box (y)
        * distance_from_origin : hypotenuse
        * distance_y : distance between y and origin (0,0)
    """

    # Point of origin
    x0, y0 = 0, 0

    # Generate dictionary
    detections = []
    for group in preds:

        # Get center point of bounding box
        top_left_x, top_left_y = group[1][0]
        bottom_right_x, bottom_right_y = group[1][1]
        center_x, center_y = (top_left_x + bottom_right_x) / 2, (
            top_left_y + bottom_right_y
        ) / 2

        # Use the Pythagorean Theorem to solve for distance from origin
        distance_from_origin = math.dist([x0, y0], [center_x, center_y])

        # Calculate difference between y and origin to get unique rows
        distance_y = center_y - y0

        # Append all results
        detections.append(
            {
                "text": group[0],
                "center_x": center_x,
                "center_y": center_y,
                "distance_from_origin": distance_from_origin,
                "distance_y": distance_y,
            }
        )

    return detections


def distinguish_rows(lst, thresh=15):
    """Function to help distinguish unique rows"""
    sublists = []
    for i in range(0, len(lst) - 1):
        if lst[i + 1]["distance_y"] - lst[i]["distance_y"] <= thresh:
            if lst[i] not in sublists:
                sublists.append(lst[i])
            sublists.append(lst[i + 1])
        else:
            yield sublists
            sublists = [lst[i + 1]]
    yield sublists


IMAGE_PATH = "/mnt/d/src/delme/memes/F-3CwLyXUAA1Hwj.jpeg"

# Initialize pipeline
pipeline = keras_ocr.pipeline.Pipeline()

# Read in image
read_image = keras_ocr.tools.read(IMAGE_PATH)

# prediction_groups is a list of (word, box) tuples
prediction_groups = pipeline.recognize([read_image])

keras_ocr.tools.drawAnnotations(image=read_image, predictions=prediction_groups[0])

raw_detections = []
for prediction in prediction_groups[0]:
    raw_detections.append(prediction[0])
print(f"Detections: {raw_detections}")  # out of order


predictions = prediction_groups[0]  # extract text list
predictions = get_distance(predictions)
print(f"Predictions: {predictions}")


# Set thresh higher for text further apart
predictions = list(distinguish_rows(predictions, thresh=15))
print(f"Predictions: {predictions}")

# Remove all empty rows
predictions = list(filter(lambda x: x != [], predictions))


# Order text detections in human readable format
ordered_preds = []
for row in predictions:
    row = sorted(row, key=lambda x: x["distance_from_origin"])
    for each in row:
        ordered_preds.append(each["text"])
print(f"Detections: {ordered_preds}")
