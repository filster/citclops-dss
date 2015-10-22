import os

__author__ = "Filip Velickovski"
__copyright__ = "Copyright 2015, Citclops Project"
__credits__ = ["Filip Velickovski",  "Alexander Steblin", "Laia Subirats",
                    "Luigi Ceccaroni"]
__license__ = "GPL"
__version__ = "3"
__maintainer__ = "Filip Velickovski"
__email__ = "filip.velickovski@eurecat.org"
__status__ = "Prototype"


# Citclops server deployment
# 0.0.0.0 listens for outside connections
PORT = 5000
HOST = '0.0.0.0'

basedir = os.path.abspath(os.path.dirname(__file__))

DSS_URL_PATH = ''

CSRF_ENABLED = True
SECRET_KEY = 'you-will-never-guess'

# Data management service - file upload service
OBSERVATIONS_FOLDER = "/home/citclops/data/samples"
SENT_FILE_FOLDER    = "/home/citclops/data/zips"
DB_CONNECTION = "dbname='citclops' user='postgres' password='root' host='127.0.0.1'"
OBSERVATION_TABLE = "metadata_v2"
DQC_SCRIPT_PATH = "/home/citclops/scripts/FUGA_DQC"
USE_DQC         = True

# Open Weather API connections
WEATHER_API_URL= 'http://api.openweathermap.org/data/2.5/weather?'
WEATHER_API_KEY = 'HIDDEN'
WEATHER_API_USER = 'HIDDEN'

# TRANSPERANCY EMAIL FUNCTION PARMETERS
TRANSPARENCY = dict(sender_username = 'HIDDEN', 
                    sender_password = 'HIDDEN', 
                    sender_email = 'HIDDEN',
                    subject = 'New transparency sample',
                    email_list = ['filip.velickovski@eurecat.org'],
                    data_folder = '/usr/local/tomcat/webapps/ROOT/webform/processed')

#SATELLITE_API_URL = 'http://82.223.73.191/web-extraction'
SATELLITE_API_URL = 'http://localhost/web-extraction'

#FLAGGING = dict(NOTIFY_URL = 'http://www.citclops.eu/content/send_flag.asp', FLAG_URL='http://82.223.73.191/maris/viewer/flag.php')
FLAGGING = dict(NOTIFY_URL = 'http://www.citclops.eu/content/send_flag.asp', FLAG_URL='http://localhost/maris/viewer/flag.php')

