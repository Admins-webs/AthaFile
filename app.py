
from flask import Flask, request, send_from_directory, jsonify
from werkzeug.utils import secure_filename
import os, uuid

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return open('index.html').read()

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    if file:
        filename = secure_filename(file.filename)
        unique_id = str(uuid.uuid4())
        full_filename = unique_id + "_" + filename
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], full_filename))
        return jsonify({ 'url': f'/download/{full_filename}' })
    return jsonify({ 'error': 'No file uploaded' })

@app.route('/download/<filename>')
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
