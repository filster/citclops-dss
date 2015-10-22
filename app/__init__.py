import sys
from flask import Flask
from threading import Thread
from Queue import Queue

__author__ = "Filip Velickovski"
__copyright__ = "Copyright 2015, Citclops Project"
__credits__ = ["Filip Velickovski",  "Alexander Steblin", "Laia Subirats",
                    "Luigi Ceccaroni"]
__license__ = "GPL"
__version__ = "3"
__maintainer__ = "Filip Velickovski"
__email__ = "filip.velickovski@eurecat.org"
__status__ = "Prototype"


app = Flask(__name__)

# launch background queue
bg_queue = Queue()

app.config.from_object('config')

if not app.debug:
    # Initialise logging
    import logging
    formatter = logging.Formatter("%(asctime)s;%(levelname)s;%(message)s")
    from logging.handlers import RotatingFileHandler
    file_handler = RotatingFileHandler('logs/dss.log', maxBytes=100000000, backupCount=1)
    app.logger.setLevel(logging.DEBUG)
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)
    app.logger.addHandler(file_handler)
    app.logger.info('Starting DSS server...') 

# queue worker
def q_worker():
  print 'Launching queue worker...'
  while True:
    item = bg_queue.get()
    (function, args) = item
    qThread = Thread(target=function, args=args)
    qThread.start()
    qThread.join()
    bg_queue.task_done()
    
# launch queue worker
t = Thread(target=q_worker)
t.daemon = True
t.start()




from app import views, models, services, data_management_service





