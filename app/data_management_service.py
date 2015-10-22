import os
import sys
import errno

from threading import Thread
from time import sleep


from flask import request
from werkzeug import secure_filename
from app import app, bg_queue

import zipfile
from zipfile import ZipFile
import tempfile

import shutil
import subprocess
import xml.etree.ElementTree as ET
import psycopg2
import re
import hashlib

__author__ = "Filip Velickovski"
__copyright__ = "Copyright 2015, Citclops Project"
__credits__ = ["Filip Velickovski",  "Alexander Steblin", "Laia Subirats",
                    "Luigi Ceccaroni"]
__license__ = "GPL"
__version__ = "3"
__maintainer__ = "Filip Velickovski"
__email__ = "filip.velickovski@eurecat.org"
__status__ = "Prototype"

OBSERVATIONS_FOLDER = app.config['OBSERVATIONS_FOLDER']
SENT_FILE_FOLDER = app.config['SENT_FILE_FOLDER']
DB_CONNECTION = app.config['DB_CONNECTION']
OBSERVATION_TABLE = app.config['OBSERVATION_TABLE']
DQC_SCRIPT_PATH = app.config['DQC_SCRIPT_PATH']
USE_DQC         = app.config['USE_DQC']

XML_OBSERVATION_FIELDS = [ # note: all fields are written in lower case
            'dataset_name',
            'observation_id',
            'fu_value',
            'date_time',
            'measuring_area_type',
            'datum_coordinate_system',
            'parameters_measured',
            'abstract',
            'platform_type',
            'device_type',
            'device_name',
            'station_name',
            'pi',
            'station_start_date_time',
            'station_end_date_time',
            'language',
            'profile',
            'data_format',
            'data_file',
            'viewing_angle',
            'azimuth_angle',
            'remark',
            'rain',
            'bottom',
            'cloud_fraction',
            'wind_waves',
            'surface_sd',
            'secchi_disk_type',
            'shadow',
            'height',
            'location',
            'userhassecchidisk',
            'userhasplasticfuscale',
            # Quality control flags
            'fu_processed',
			'secchidiskdepth'
          ]

# Fields above to be treated as boolean of the above types
XML_OBS_BOOL_FIELDS = ['userhassecchidisk', 'userhasplasticfuscale', 'rain', 'bottom', 'shadow']

# Any fields above that should be mapped to another name in the db table
# currently
# {'xml_fieldname' : 'db_field_name'}
XML_TO_DB_FIELDMAP = {}


@app.route('/upload', methods=['POST'])
def upload_file():
  
  upload_method = 'smartphone'
  if 'upload_method' in request.form:
    upload_method = request.form['upload_method']    
  
  filename = 'Unknown'
  try:
    # receive uploaded zip file
    ufile = request.files['file']

    # cp received file (zip) to a backup folder (in case we want to test with it later)
    filename = secure_filename(ufile.filename)
    
    # save to zip location
    zipFilePath = os.path.join(SENT_FILE_FOLDER, filename)
    ufile.save(zipFilePath)    
  except:
    app.logger.error("Receieved non-readable zip file or not a zip file %s" % (filename))
    raise
  
  # start thread to process file
  item=(async_process_zip, (zipFilePath, upload_method))
  bg_queue.put(item)
  
  return 'zip file %s has been correctly received and will be processed' % (ufile)


def async_process_zip(zipFilePath, upload_method):
  app.logger.info('processing zip file %s...' % (zipFilePath))
  
  
  zipFile = ZipFile(zipFilePath, 'r')
  
  # get the xml and img filename
  xmlFileName = ''
  imgFileName = ''
  if len (zipFile.namelist()) != 2:
    app.logger.error("Zip file should only 2 files: an XML and JPG/PNG %d found" % (len (zipFile.namelist())))
    return
    
  for filename in zipFile.namelist():
    # Get the file extension
    ext = filename.split('.')[-1].lower()
    
    if ext == 'xml':
      xmlFileName = secure_filename(filename)
    elif  ext == 'jpg' or  ext == 'png':
      imgFileName = secure_filename(filename)
    else:
      app.logger.error("Unexpected file extension %s found in uploaded zipfile" % (ext))
      return

  try:
      # create temporary directory
      tmpUploadDir = tempfile.mkdtemp(suffix='tmpUPD')  
     
     # unzip the contents in the temporary directory
      zipFile.extractall(tmpUploadDir)

      # Repair the received XML
      # Append ROOT_ to the root element of the XML file
      # this fixes xml files where the root element begins with numerically
      # (illegal XML) the root element has the same name as the filename 
      # without the .XML extension
      rootElementName = '.'.join(xmlFileName.split('.')[0:-1])
      append_prefix(os.path.join(tmpUploadDir, xmlFileName), rootElementName, 'ROOT_')

      # Fix abstracts that don't encapsulate xml in CDATA
      add_cdata_abstract(os.path.join(tmpUploadDir, xmlFileName))

      # set full path to XML file
      tmpXmlFilePath = os.path.join(tmpUploadDir, xmlFileName)      
      
      if USE_DQC:
        # process img and xml with octave command
        fugaOutXmlName= "fuga.xml"
        origWD = os.getcwd() # remember our original working directory
        os.chdir(DQC_SCRIPT_PATH)
        exitStatus = subprocess.call(["octave", "--silent", "--eval", "FUGA_DQC_execute " + os.path.join(tmpUploadDir, xmlFileName) + " " + os.path.join(tmpUploadDir, fugaOutXmlName)])
        os.chdir(origWD) # get back to our original working directory
        
        app.logger.info("exit status of FUGA QC octave program: %d" % (exitStatus))
            
        # if DQC is succesful we use the new output xml file
        if exitStatus == 0:
          tmpXmlFilePath = os.path.join(tmpUploadDir, fugaOutXmlName)
                 
      # extract key/value pairs into python dictionary 
      record = extract_record(tmpXmlFilePath)
      
      # insert filenames
      record['data_file'] = imgFileName # this should already be in the xml but 
                                        # we override with the sent image filename
      record['xml_filename'] = xmlFileName
      
      # add upload method
      record['upload_method'] = upload_method
           
      # insert as row in metadata table
      insert_into_metadata_table(record, tmpUploadDir)

      # move the xml and jpg into the samples UPLOAD folder            
      shutil.move(tmpXmlFilePath, os.path.join(OBSERVATIONS_FOLDER, xmlFileName)) 
      shutil.move(os.path.join(tmpUploadDir, imgFileName), os.path.join(OBSERVATIONS_FOLDER, imgFileName))
  except:
    app.logger.error("Could not process data from XML %s correctly" % (xmlFileName))
    raise
  finally:
    # Remove temporary directory if it exists
    try:
      shutil.rmtree(tmpUploadDir)  # delete directory
    except:
      pass
  
  app.logger.info('files %s %s have correctly been processed and uploaded' % (xmlFileName, imgFileName))
  


# add CDATA to the abstract if needed
def add_cdata_abstract(xmlFilepath):
  
  with open(xmlFilepath, "r") as xmlFile:
    data = xmlFile.read()
  
  # only make abstract with CDATA if it is missing
  pattern = r'\<Abstract\>[\s]*\<\!\[CDATA\['
  if not re.search(pattern, data):
    data = data.replace('<Abstract>', '<Abstract><![CDATA[')
    data = data.replace('</Abstract>', ']]></Abstract>')

  with open(xmlFilepath, "w") as xmlFile:
    xmlFile.write(data)
  

def append_prefix(xmlFilepath, elementname, prefix):
  with open(xmlFilepath, "r") as xmlFile:
    data = xmlFile.read()
    
  data = data.replace('<' + elementname + '>', '<' + prefix + elementname + '>')
  data = data.replace('</' + elementname + '>', '</' + prefix + elementname + '>')
  
  with open(xmlFilepath, "w") as xmlFile:
    xmlFile.write(data)


def insert_into_metadata_table(record, staging_directory):
  # build SQL INSERT query from record
  
  # extract hash from observation data_file i.e. the image
  # hash_id = hashlib.md5(open(record['data_file']).read()).hexdigest()
  hash_id = hashlib.md5(open(os.path.join(staging_directory, record['data_file'])).read()).hexdigest()
  record['hash_id'] = hash_id
  
  try:
    conn = psycopg2.connect(DB_CONNECTION)

    # Open a cursor to perform database operations
    cur = conn.cursor()
    
    # find if an observation with the same hash ID exists
    sqlCheck = "SELECT hash_id FROM %s WHERE hash_id ='%s'" % (OBSERVATION_TABLE, hash_id)
    cur.execute(sqlCheck)

    if (cur.rowcount > 0)  :
      app.logger.debug('Deleting record with hash id = %s' % (hash_id))
      # delete record with this observation_id if there are any
      cur.execute("DELETE FROM %s WHERE hash_id ='%s'" % (OBSERVATION_TABLE, hash_id))
      app.logger.debug('%d rows deleted' % (cur.rowcount))
  
    (fields,values,placeholders) = extract_fields_values_placeholders(record)

    # Insert the observation
    sqlInsert = 'INSERT INTO %s (%s) VALUES (%s) ' % (
          OBSERVATION_TABLE,
          ','.join(fields),
          ','.join(placeholders))
    
    app.logger.debug('SQL STATEMENT:\n%s' % (sqlInsert))
    app.logger.debug(values)
  
    # Execute the query to insert the observation into the metadata
    # table of the citclops database
    cur.execute(sqlInsert, values)

    # Make the changes to the database persistent
    conn.commit()
  except Exception as exc:
    app.logger.error("Did not insert observation in database correctly: %s" % (exc))
    raise
  finally:
        # Close communication with the database
        cur.close()
        conn.close()
 
def extract_fields_values_placeholders(record):
  # build SQL INSERT query from record
  fields = []
  values = []
  placeholders = []
  
  for key in record:
    fields.append(key)
    value = record[key]
    values.append(value)
    
    if (key == 'geom'):
      placeholders.append("ST_PointFromText(%s, 4326)")
    else:
      placeholders.append("%s")
      
  return (fields,values,placeholders)
  
   
def extract_record(xmlFileNameFull):
  tree = ET.parse(xmlFileNameFull)
  root = tree.getroot()
  record = {}
  
  for child in root:
    # treat everything in lowercase
    xmlFieldName = child.tag.lower();
      
    if xmlFieldName == 'location_lat_long':
      # process location lat/long specially
      (strLat,strLon) = child.text.split(',')
      record['location_lat'] = strLat
      record['location_lon'] = strLon
      coordinates = "POINT(%s %s)" % (strLon, strLat)
      record['geom'] = coordinates
    else:
      # for the rest of the fields just use the value between the
      # xml tags
      if (xmlFieldName in XML_OBSERVATION_FIELDS):
        if xmlFieldName in XML_TO_DB_FIELDMAP:
          dbFieldName = XML_TO_DB_FIELDMAP[xmlFieldName]
        else:
          dbFieldName = xmlFieldName

        strValue = child.text
        value = strValue
        
        # only process non empty non None values
        if strValue:
          # get boolean(True/False) value for boolean fields
          # 0, false, no  ==> False
          # other strings ==> True
          if xmlFieldName in XML_OBS_BOOL_FIELDS:
            value = not (strValue.lower() in ['no', 'false', '0'])
          
          record[dbFieldName] = value
  return record
    
  




  
  

   
