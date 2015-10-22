import json
from xml.dom import minidom
from datetime import datetime, timedelta, date
import dateutil.parser
import requests
import shapely.geometry
import os
import psycopg2

__author__ = "Filip Velickovski"
__copyright__ = "Copyright 2015, Citclops Project"
__credits__ = ["Filip Velickovski",  "Alexander Steblin", "Laia Subirats",
                    "Luigi Ceccaroni"]
__license__ = "GPL"
__version__ = "3"
__maintainer__ = "Filip Velickovski"
__email__ = "filip.velickovski@eurecat.org"
__status__ = "Prototype"


from flask import request, jsonify

from app import app
from tempfile import NamedTemporaryFile

import netCDF4
import numpy

DB_CONNECTION = app.config['DB_CONNECTION']
OBSERVATION_TABLE = app.config['OBSERVATION_TABLE']


dssUrlPath = app.config['DSS_URL_PATH']


# flag an observation as not suitable (e.g. not water)
# TODO the method below needs to be realigned with MARIS PHP flagging
# so temporarily commented out
# @app.route('/observation/flag', methods=['POST'])
# def incrermentFlagCount():
  # payload=request.get_json(force=True)
  
  # app.logger.debug('request data:%s' % payload)
  
  # hash_id = payload['hash_id']
  
  # # retrieve from citclops DB
  # try:
    # conn = psycopg2.connect(DB_CONNECTION)

    # # Open a cursor to perform database operations
    # cur = conn.cursor()
    
    # sqlSelect = "SELECT record_id, flagged_count from %s WHERE hash_id ='%s'" % (OBSERVATION_TABLE, hash_id)
    # cur.execute(sqlSelect)
    
    # if (cur.rowcount == 0):
      # raise Exception("There is no sample with given hash ID")
    # elif (cur.rowcount > 1):
      # raise Exception("Multiple samples with the same hash ID")      
    
    # (record_id, flagged_count) = cur.fetchone()
    
    # app.logger.debug('selected record %d with flag count %d' % (record_id, flagged_count))

    # # make sure a valid integer is retrieved otherwise set to 0
    # try:
      # flagged_count = int(flagged_count)
    # except ValueError:
      # flagged_count = 0
      
    # # increment the flagcount
    # flagged_count += 1
    
    # # Execute the query to insert the observation into the metadata
    # # table of the citclops database
    # sqlUpdate = "UPDATE %s SET (flagged_count) = (%d) WHERE record_id = %d" %  (OBSERVATION_TABLE, flagged_count, record_id)
    # app.logger.debug('executing sql:\n%s', sqlUpdate)

    # cur.execute(sqlUpdate)
    
    # app.logger.debug('updated record %d with flag count %d' % (record_id, flagged_count))


    # # Make the changes to the database persistent
    # conn.commit()
  # except Exception as exc:
    # app.logger.error("Did not update observation flagcount in database correctly: %s" % (exc))
    # raise
  # finally:
        # # Close communication with the database
        # cur.close()
        # conn.close()

  # # update citclops DB
  # return 'flag count for (record id %d, hash id %r) is %d' % (hash_id, record_id, flagged_count)
  
@app.route('/transparency/sendmail', methods=['POST'])
def emailTransparencySample():
  # Import smtplib for the actual sending function
  import smtplib
  from os.path import basename, exists, join
  

  
  # Here are the email package modules we'll need
  from email.mime.multipart import MIMEMultipart
  from email.mime.text import MIMEText
  from email.mime.base import MIMEBase
  from email import encoders
  
  from werkzeug import secure_filename



  email = ''  
  if 'email' in request.form:
    email = request.form['email']
    
  metadataFilename = ''
  if 'metadata_filename' in request.form:
    metadataFilename = secure_filename(request.form['metadata_filename'])
    
  imageFilename = ''
  if 'image_filename' in request.form:
    imageFilename = secure_filename(request.form['image_filename'])
   
  # validate existence and extention, and prepare file path in files list
  files = []
  for filename in [metadataFilename, imageFilename]:
    # Get the file extension
    ext = filename.split('.')[-1].lower()
    
    if ext not in ['xml', 'png', 'jpg']:
      raise Exception("Unexpected file extension (%s), can only be xml, png, or jpg" % (ext))
      
    filepath = join(app.config['TRANSPARENCY']['data_folder'], filename)
    if not exists(filepath):
      raise Exception("file %s does not exist" % (filename))
    
    files.append(filepath)
    
  #TODO: unccoment this code if validation is needed
  # validate email, should belong to a list of approved email addresses
  #if email not in app.config['TRANSPARENCY']['email_list']:
  #  errorMsg = 'email provided must be from an approved list'
  #  raise Exception(errorMsg)
    
  # Create the container (outer) email message.
  msg = MIMEMultipart()
  msg['Subject'] = app.config['TRANSPARENCY']['subject']
  # me == the sender's email address
  # family = the list of all recipients' email addresses
  msg['From'] = 'Citclops server <' + app.config['TRANSPARENCY']['sender_email'] + '>'
  msg['To'] = email
  msg.preamble = app.config['TRANSPARENCY']['subject']
  msg.attach(MIMEText('A new transparency sample is attached.'))
  
  # attach files to message
  for f in files:
    part = MIMEBase('application', "octet-stream")
    part.set_payload( open(f,"rb").read() )
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', 'attachment; filename="{0}"'.format(basename(f)))
    msg.attach(part)  
  
  
  # Send the email via our own SMTP server.
  s = smtplib.SMTP('smtp.gmail.com', 587)
  s.ehlo()
  s.starttls()
  s.login(app.config['TRANSPARENCY']['sender_username'], app.config['TRANSPARENCY']['sender_password'])
  s.sendmail(app.config['TRANSPARENCY']['sender_email'], email, msg.as_string())
  s.quit()
  
  return 'sample has been emailed'
  
# launches the MARIS flagging services
@app.route(dssUrlPath + '/observation/flag', methods=['POST'])
def flagObservation():
  payload = request.get_json()
  
  r = requests.get(app.config['FLAGGING']['NOTIFY_URL'], params=payload)
    
  if r.status_code != 200:
    return jsonify(status='ERROR', description='Could not process flag request'), r.status_code
    
  r = requests.get(app.config['FLAGGING']['FLAG_URL'], params={'id': payload['code']})
  if r.status_code != 200:
   return jsonify(status='ERROR', description='Could not process flag request'), r.status_code

  return jsonify(status='OK')

  
  

@app.route(dssUrlPath + '/weather/rainfall', methods=['POST'])
def getRainFall():
  payload = json.loads(request.get_data())
  
  # extract arguments
  location = payload['point']
  start_date = payload['startdate']
  end_date = payload['enddate']
  
  
  # transform latlng location to image index
  # indLON 0 to 359 ==> 0.5 to 359.5 degrees east
  # indLAT 0 to 179 ==> 89.5 to -89.5 degrees north
  if (location['lng'] >= 0):
    indLON = int(numpy.floor(location['lng']))
  else:
    indLON = int(numpy.floor(360.0 + location['lng']))

  indLAT = int(numpy.floor(90.0 - location['lat']))
  
  # transform dates to time_index
  firstDate = date(1996,10,01) 
  startDate = dateutil.parser.parse(start_date).date()
  endDate = dateutil.parser.parse(end_date).date()
  indStartDate = (startDate - firstDate).days
  indEndDate = (endDate - firstDate).days
  
  print 'indexes are: ', indStartDate, indEndDate, indLAT, indLON
  
  # check indicies and dates are within range
  
  # open netCDF weather file
  weatherData = netCDF4.Dataset('./app/weather/GPCP_1DD_v1.2_199610-201407.nc')
  
  mmRain = weatherData.variables['PREC'][indStartDate:indEndDate, indLAT, indLON].tolist()
  
  return json.dumps(dict(percipitation=mmRain,units='mm/day'))

  
  

# Retrieve satellite maximums for a square
# zone of certain lat and lon widths
# with a datetime range in unix time stamp format
@app.route(dssUrlPath + '/satellite/maxsForZone', methods=['POST'])
def satteliteFUZone():
    # incoming api call    
    satelliteUrl = app.config['SATELLITE_API_URL']
    LATWIDTH = 0.016
    LNGWIDTH = 0.016
    
    payload = json.loads(request.get_data())
    
    p = payload['point']
    start_date = payload['startdate']
    end_date = payload['enddate']
        
    # Prepare Polygon
    # flip long, lat to lat, long for wkt format
    polygon = [(p['lng'] - LNGWIDTH, p['lat'] + LATWIDTH),
               (p['lng'] + LNGWIDTH, p['lat'] + LATWIDTH),    
               (p['lng'] + LNGWIDTH, p['lat'] - LATWIDTH),    
               (p['lng'] - LNGWIDTH, p['lat'] - LATWIDTH),    
               (p['lng'] - LNGWIDTH, p['lat'] + LATWIDTH)]
               
    polygon = shapely.geometry.Polygon(polygon)
    
    # exctract wkt format
    polygonWKT = polygon.wkt
    daterange = start_date + ',' + end_date
    
    payload = {'wkt': polygonWKT, 'date-ranges': daterange, 'all-vars': False}
    r = requests.post(satelliteUrl, params=payload)
   
    # prepare temporary file and write received data to it
    ftmp = NamedTemporaryFile(delete=False, dir='./tmp')
    ftmp.write(r.content)
    ftmp.close()

    # open content
    satData = netCDF4.Dataset(ftmp.name)
    fu = satData.variables['FU']
    t = satData.variables['time']
    
    ntimeslices = fu.shape[0]
     
    # compute mean FU at each time slice
    maxFUt = numpy.max(numpy.max(fu, axis=1), axis=1).tolist()

    # time units is in 'hours since 2000-01-01T00:00:00Z'
    dates = [datetime(2000,1,1) + timedelta(hours = float(x)) for x in t[0:]]

    
    # Close and remove NetCDF4 file
    satData.close()
    os.remove(ftmp.name)
    
    iso_8601_format = '%Y-%m-%dT%H:%M:%SZ'
    payload = [dict(FU=color,timestamp=dt.strftime(iso_8601_format)) for (color,dt) in zip(maxFUt, dates)]
    
    return  json.dumps(payload)





# Retrieve satellite averages for a polygon zone
@app.route(dssUrlPath + '/satellite/getFUForPolyzone', methods=['GET', 'POST'])
def satteliteFU():
    # incoming api call    
    satelliteUrl = app.config['SATELLITE_API_URL']
    
    if request.method == 'GET': ## GET for testing purposes
      polygonWKT = request.args['polygon']
      start_date = request.args['startdate']
      end_date   = request.args['enddate']
      daterange  = start_date + ',' + end_date
      print 'WKT: ' + '\n'      
      print polygonWKT
      print '\n'
    else:
      payload = json.loads(request.get_data())
      print payload
      polygon = payload['polygon']
      start_date_ts = int(payload['startdate'])
      end_date_ts = int(payload['enddate'])
          
      # Prepare Polygon
      # flip long, lat to lat, long for wkt format
      polygon = [(b,a) for (a,b) in polygon]
      polygon = shapely.geometry.Polygon(polygon)
      # exctract wkt format
      polygonWKT = polygon.wkt
    
      # Transform unix timestamp to ISO 8601 format
      iso_8601_format = '%Y-%m-%dT%H:%M:%SZ'    
      start_date = date.fromtimestamp(start_date_ts)
      end_date = date.fromtimestamp(end_date_ts)    
      start_date = start_date.strftime(iso_8601_format)
      end_date = end_date.strftime(iso_8601_format)
    
      daterange = start_date + ',' + end_date
    
    payload = {'wkt': polygonWKT, 'date-ranges': daterange, 'all-vars': False}
    r = requests.post(satelliteUrl, params=payload)

    #print 'received object :' + '\n'
    #print '-->' + str(type(r)) + '\n'
    #print '-->' + str(r.status_code)
    #print '-->' + str(r.headers.items())
    #print '-->' + str(r.content)
    
    # prepare temporary file and write received data to it
    if r.status_code == 200:
      ftmp = NamedTemporaryFile(delete=False, dir='./tmp')
      ftmp.write(r.content)
      ftmp.close()
  
      # open content
      satData = netCDF4.Dataset(ftmp.name)
      fu = satData.variables['FU']
      ntimeslices = fu.shape[0]
      mask = (numpy.max(fu, axis=0) == 0)
      mask = numpy.tile(mask, [ntimeslices, 1, 1])
  
      fu = numpy.ma.array(fu, mask=mask)
   
      # compute mean FU at each time slice
      meanFUTimeSlices = fu.mean(axis=1).mean(axis=1).data.tolist()
      
      # Close and remove NetCDF4 file
      satData.close()
      os.remove(ftmp.name)
      
      return  json.dumps(meanFUTimeSlices)
    else:
      return json.dumps([])






# retrieve beach zones
@app.route(dssUrlPath + '/beaches/getzones', methods=['GET', 'POST'])
def beachZones():
   #content = request.get_json();
   
   ## here we fetch zones all
   
   bounds =  json.loads(request.get_data())['Bounds']
   
   app.logger.debug("NE (%.2f, %.2f), SW (%.2f, %.2f)" % (bounds['_northEast']['lat'], bounds['_southWest']['lng'], bounds['_southWest']['lat'], bounds['_northEast']['lng']));
   
   beaches = json.dumps(fetchBeachZones(bounds))
   
   return beaches

@app.route(dssUrlPath + '/weather/getcloudcover', methods=['GET','POST'])
def weatherCloudCover():
    type = 'current'
    
    app.logger.debug(request)
    payload = json.loads(request.get_data())

    request_timestamp = payload['timestamp']
    longitude = payload['longitude']
    latitude = payload['latitude']
    
    #requestdate = datetime.fromtimestamp(request_timestamp)
    #nowdate     = datetime.today()
    requestdate = date.fromtimestamp(request_timestamp)
    nowdate     = date.today()
    
    delta        = requestdate - nowdate
    
    if (delta.days == 0):
        type = 'current'
    elif (delta.days > 0):
        type = 'forecast'
    elif (delta.days < 0):
        type = 'historic'
       
    print delta.days    
    
    
    # retrieve weather by cached API call to openweather service
    
    if (type == 'forecast' or type == 'current'):
        url = 'http://api.openweathermap.org/data/2.5/forecast/daily?'
    else:
        return json.dumps(50)
    
    payload = {'lon': longitude, 'lat': latitude, 'APPID': app.config['WEATHER_API_KEY']}
    r = requests.get(url, params=payload)
    
    weatherdata = r.json()
    forecast = weatherdata['list'][delta.days]
    
    cloudcover = forecast['clouds']
    weather = {}
    weather['clouds']    = forecast['clouds']
    weather['weather']   = forecast['weather'][0]['description']

    # return value 0 - 1, 0: sunny 1: overcast    

    return json.dumps(weather)
    
@app.route(dssUrlPath + '/weather/cloudcover', methods=['GET','POST'])
def weatherCloudCoverFromXML():
    type = 'current'
    
    if request.method == 'POST':
        payload = json.loads(request.get_data())
    else:
        payload = {}
        payload['timestamp'] = float(request.args.get('timestamp'))
        payload['longitude'] = float(request.args.get('longitude'))
        payload['longitude'] = float(request.args.get('longitude'))


    request_timestamp = payload['timestamp']
    longitude = payload['longitude']
    latitude = payload['longitude']
    
    #requestdate = datetime.fromtimestamp(request_timestamp)
    #nowdate     = datetime.today()
    requestdate = date.fromtimestamp(request_timestamp)
    nowdate     = date.today()
    
    delta        = requestdate - nowdate

    if (delta.days == 0):
        type = 'current'
    elif (delta.days > 0):
        type = 'forecast'
    elif (delta.days < 0):
        type = 'historic'
       
    app.logger.debug(delta.days)
    
    
    # retrieve weather by cached API call to openweather service
    weather = {}
    if (type == 'forecast' or type == 'current'):
        # We will use an XML web service
        url = 'http://api.openweathermap.org/data/2.5/forecast/daily?'
    
        payload = {'lon': longitude, 'lat': latitude, 'APPID': app.config['WEATHER_API_KEY'], 'mode' : 'xml'}
        
        r = requests.get(url, params=payload)
        
        xmldoc = minidom.parseString(r.text)
        itemlist = xmldoc.getElementsByTagName('time');
        
        forecast   = itemlist[delta.days]
        cloudcover = forecast.getElementsByTagName('clouds')[0]
        
        weather['clouds']  = float(cloudcover.attributes['all'].value);
        weather['description'] = cloudcover.attributes['value'].value;
    else:
        # We will use a JSON service
        app.logger.debug('request time stamp is ' + str(request_timestamp))
                
        url = 'http://api.openweathermap.org/data/2.5/history/city?'
        payload = {'lon': longitude, 'lat': latitude, 'APPID': app.config['WEATHER_API_KEY'], 'mode' : 'json', 'start' : request_timestamp, 'cnt' : 1}
        

        r = requests.get(url, params=payload)
        app.logger.debug(r.text)
        
        weatherdata = r.json()
        
        historic = weatherdata['list'][0]
    
        cloudcover = historic['clouds']['all']
        weather['clouds']        = cloudcover
        weather['description']   = historic['weather'][0]['description']
    
    return json.dumps(weather)
   
   
def get_current_weather(longitude, latitude):
    # TODO rewrite this code using the much cleaner library requests
    import urllib
    serviceurl = app.config['WEATHER_API_URL']
    
    url = serviceurl + urllib.urlencode({'lon': longitude, 
          'lat': latitude, 'APPID': app.config['WEATHER_API_KEY']})
    
    uh = urllib.urlopen(url)
    data = uh.read()
    
    try: js = json.loads(str(data))
    except: js = None
    
    if 'status' not in js or js['status'] != 'OK':
        app.logger.error('Failure To retrieve weather data')
    
    app.logger.debug(json.dumps(js, indent=4))

    cloudyness = js["clouds"]["all"]
    
    app.logger.debug('cloudyness = %d%%' % (cloudyness))
    
    return cloudyness

def area_for_polygon(polygon):
    result = 0
    imax = len(polygon) - 1
    for i in range(0,imax):
        result += (polygon[i][0] * polygon[i+1][1]) - (polygon[i+1][0] * polygon[i][1])
    result += (polygon[imax][0] * polygon[0][1]) - (polygon[0][0] * polygon[imax][1])
    return result / 2.

def centroid_for_polygon(polygon):
    area = area_for_polygon(polygon)
    imax = len(polygon) - 1

    result_x = 0
    result_y = 0
    for i in range(0,imax):
        result_x += (polygon[i][0] + polygon[i+1][0]) * ((polygon[i][0] * polygon[i+1][1]) - (polygon[i+1][0] * polygon[i][1]))
        result_y += (polygon[i][1] + polygon[i+1][1]) * ((polygon[i][0] * polygon[i+1][1]) - (polygon[i+1][0] * polygon[i][1]))
    result_x += (polygon[imax][0] + polygon[0][0]) * ((polygon[imax][0] * polygon[0][1]) - (polygon[0][0] * polygon[imax][1]))
    result_y += (polygon[imax][1] + polygon[0][1]) * ((polygon[imax][0] * polygon[0][1]) - (polygon[0][0] * polygon[imax][1]))
    result_x /= (area * 6.0)
    result_y /= (area * 6.0)
    
    return [result_x, result_y]

   
# return all the beach zones within the bounds
def fetchBeachZones(bounds):
    zones = []
    
    zone = {}
    
    zone['name'] = "L'Ampolla"
    zone['poly'] = [[40.816408,0.733681],
                    [40.810041,0.714626],
                    [40.806403,0.712566], 
                    [40.805884,0.708275], 
                    [40.803675,0.703983], 
                    [40.800036,0.703125], 
                    [40.793799,0.707073], 
                    [40.787430,0.714798], 
                    [40.780281,0.720291], 
                    [40.776122,0.727329], 
                    [40.772872,0.732822], 
                    [40.768842,0.744839], 
                    [40.765461,0.759258], 
                    [40.767932,0.768356], 
                    [40.772742,0.775738], 
                    [40.777292,0.767326], 
                    [40.780151,0.753422], 
                    [40.778852,0.743637], 
                    [40.784051,0.742779], 
                    [40.783661,0.732651], 
                    [40.789900,0.726643], 
                    [40.794318,0.729389], 
                    [40.797437,0.740719], 
                    [40.801076,0.750847], 
                    [40.816408,0.733681]]                    
    zone['centre'] = centroid_for_polygon(zone['poly'])
    zone['type'] = 'scuba'
    zones.append(zone)
    zone = {}
    
    zone['name'] = 'Perello'
    zone['poly'] = [[40.817187,0.735741],
                    [40.802765,0.753765], 
                    [40.819006,0.784149], 
                    [40.849398,0.818825], 
                    [40.865497,0.795135], 
                    [40.858227,0.781059], 
                    [40.855371,0.772133], 
                    [40.849917,0.766640], 
                    [40.844983,0.765610], 
                    [40.844983,0.753937], 
                    [40.839009,0.751877], 
                    [40.830697,0.747414], 
                    [40.822383,0.746040], 
                    [40.817187,0.735741]]
    
    zone['centre'] = centroid_for_polygon(zone['poly'])    
    zone['type'] = 'scuba'
    zones.append(zone)
    zone = {}
    
    zone['name'] = "L'Ametella"
    zone['poly'] = [[40.869132, 0.797539],
                    [40.853812,0.823288], 
                    [40.898203,0.855904], 
                    [40.909102,0.833931], 
                    [40.897165,0.824318], 
                    [40.886005,0.810928], 
                    [40.873026,0.803375], 
                    [40.869132,0.797539]]
    zone['type'] = 'FU'
    zone['centre'] = centroid_for_polygon(zone['poly'])
    
    zones.append(zone)
        
    return zones
    
   
   