from flask import Flask, jsonify, request
from logic import getScore
from image_ocr import generateText
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

MONGO_URL = ADD_YOUR_URL
DATABASE_NAME = "test"
COLLECTION_NAME = "datas"

@app.route('/getNutritionInfo', methods=['POST'])
def Home():
    if request.method == 'POST':
        if 'image' not in request.files:
            return 'No file part'

        file = request.files['image']   
        selected_value = request.form.get('selectedValue')

        if file.filename == '':
            return 'No selected file'

        text = generateText(file)
        score = getScore(text,selected_value)
        
        return jsonify({'score' : score})  
    

@app.route('/fetchItem', methods=['POST'])
def fetchItem():
    if request.method == 'POST':
        body = request.json
        print(body)
        client = MongoClient(MONGO_URL)
        db = client[DATABASE_NAME]
        collection = db[COLLECTION_NAME]


        query = {'prodName': {'$regex': body['item_name'], '$options': 'i'}}
        cursor = collection.find(query)

        search_results = [{**document, '_id': str(document['_id'])} for document in cursor]

        client.close()

        return jsonify(search_results)



if __name__ == '__main__':
    app.run(port=8000, debug=True)
