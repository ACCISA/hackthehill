from flask import Flask, request, jsonify, make_response, render_template, session
from flask_cors import CORS
from datetime import datetime, timedelta
import requests
from functools import wraps
import uuid
import database
from werkzeug.utils import secure_filename
import cv2
import numpy as np
import io
from PIL import Image
from cloud_vision_api import getLabels

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'static/uploads/'

app.config["SECRET_KEY"] = 'super_secret'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


ALLOWED_EXTENSIONS = set(['png','jpg','jpeg','gif'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.',1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/login", methods=['POST'])
def main_page():
    if request.method == 'POST':
        json = request.json
        print(json)
        print(json['email'])
        if database.does_user_exit(email):
            return jsonify({'status':'true'})  
        return jsonify({'status':'false'})

@app.route("/settings", methods=['POST','GET'])
def settings_route():
    json = request.json
    email = json['email']
    if request.method == 'POST':
        setttings = json['settings']
        if not database.does_user_exit(email): return jsonify({'status':'This user does not exist'})
        database.edit_user_settings(settings, email)
        return jsonify({'status':'Settings updated'})
    if request.method == 'GET':
        if not database.does_user_exit(email): return jsonify({'status':'This user does not exist'})
        settings = database.get_user_settings(email)
        return jsonify({'status':settings})

@app.route("/vision", methods=['POST'])
def upload():
    if request.method == 'POST':
        #fs = request.files['snap'] # it raise error when there is no `snap` in form
        fs = request.files.get('snap')
        if fs:
            print('FileStorage:', fs)
            print('filename:', fs.filename)
            fs.save('ismage.jpg')
            return getLabels('ismage.jpg')
        else:
            return 'You forgot Snap!'
    
    return 'Hello World!'



if __name__ == "__main__":
    database.create_database()

    app.run(debug=True)
