# Certificate-PDF-Viewer

This is built on top of PDF embedded blockcerts, allow viewing of certificates in PDF format.

## Installation 
1. Follow this [installation instruction](https://github.com/ppfish45/cert-pdf).
2. Clone cert-pdf-viewer.
```
git clone https://github.com/cnchann/cert-pdf-viewer.git
```
3. Enter the directory and run client browser locally with npm. Download npm [here](https://nodejs.org/en/download/).
```
cd cert-pdf-viewer
npm install .
npm start
```
## Usage
1. Set up backend server with Flask, to make use of cert-pdf API. Both public keys and verification information will be fetched from the server.
### Ensure that path to api.py file is from the right directory in server.py
```
import sys
sys.path.append('../cert-pdf/cert_pdf') #<--------------
import api
```
### Start the server in terminal
```
py server.py
```

2. There are three ways to view pdf-embedded certificate JSON file. PDF document will be displayed at the bottom of the page.
### Drag and drop file within dropbox
### Select from local computer
### From Certificate URI

## Todos
1. Improve animation on modal display.
2. URI Viewing feature is still in development.
3. Add responsive design, for re-sizing purposes.
