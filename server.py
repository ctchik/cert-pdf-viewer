import flask
from flask import request, jsonify
import json
from flask_cors import CORS
import flask_cors

#Ensure that the path of api.py is imported from the right directory.
import sys
sys.path.append('../cert-pdf/cert_pdf')
import api

app = flask.Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

pubkeys = api.pubkey_list
@app.route('/', methods=['GET'])
def home():
    return '''<h1>Blockcert API hosted by UST</h1>'''

@app.route('/postjson', methods=['POST'] )
def verifyJson():
   content = request.data
   with open('./signed/data.json', 'wb') as f:
       f.write(content)
   checks = api.verify_cert('./signed/data.json', pubkeys)
   return jsonify(checks)

@app.route('/keys', methods=['GET'])
def getKeys():
    return jsonify(pubkeys)

app.run()
