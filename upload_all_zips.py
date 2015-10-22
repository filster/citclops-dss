# Script to list post all zips in a  given directory to the upload service
import os
import glob
import requests

__author__ = "Filip Velickovski"
__copyright__ = "Copyright 2015, Citclops Project"
__credits__ = ["Filip Velickovski",  "Alexander Steblin", "Laia Subirats",
                    "Luigi Ceccaroni"]
__license__ = "GPL"
__version__ = "3"
__maintainer__ = "Filip Velickovski"
__email__ = "filip.velickovski@eurecat.org"
__status__ = "Prototype"

UPLOAD_URL = "http://192.168.56.101:5000/upload"
ZIP_PATH = r"C:\zdata\Citclops\upload-test"
 
  
def main():
   for fileFullPath in glob.glob( os.path.join(ZIP_PATH, '*.zip'  )):
     filename = os.path.basename(fileFullPath)
     print 'POSTing %s...' % filename  
     fileToPost = {'file': (filename, open(fileFullPath, 'rb'), 'application/zip' , {'Expires': '0'})}    
     r = requests.post(UPLOAD_URL, files=fileToPost)    
     print r.text

if __name__ == "__main__":
  main()
  
  
  