import io
import os
from google.cloud import vision
from google.cloud.vision_v1 import types
import pandas as pd

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"hack-the-hill-project-89ee668fc4ee.json"



def getLabels(image_url):
    client = vision.ImageAnnotatorClient()

    file_name = os.path.join(
        os.path.dirname(__file__), image_url
    )

    with io.open(file_name,'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)
    response = client.label_detection(image=image)
    responsetxt = client.text_detection(image=image)

    labels = response.label_annotations
    texts = responsetxt.text_annotations

    print("Labels: ")
    data = {}
    datatxt = {}
    count = 0
    for label in labels:
        data['label'+str(count)] = {'description':label.description, 'score':label.score,'topicality':label.topicality}
        count += 1
    count = 0
    for text in texts:
        data['text'+str(count)] = text.description
        count+=1
    print(data)
    ai_data = {}
    ai_data['vision'] = data
    ai_data['text'] = datatxt
    os.remove(image_url)
    return data