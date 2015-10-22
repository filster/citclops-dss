from flask import render_template, redirect, url_for
from app import app

__author__ = "Filip Velickovski"
__copyright__ = "Copyright 2015, Citclops Project"
__credits__ = ["Filip Velickovski",  "Alexander Steblin", "Laia Subirats",
                    "Luigi Ceccaroni"]
__license__ = "GPL"
__version__ = "3"
__maintainer__ = "Filip Velickovski"
__email__ = "filip.velickovski@eurecat.org"
__status__ = "Prototype"

# front page
@app.route('/')
@app.route('/index')
def index():
    return redirect(url_for('citizen'))
    
   
# Marine Data Analyser - previously 'decision maker'
@app.route('/marine-data-analyser')
def decision_maker():
    return render_template('decision-maker.html',
                           title='Marine data analyser')                           
           
# Citizen observations - previously 'citizen'
@app.route('/citizen-observations')
def citizen():
    return render_template('citizen.html',
                           title='Citizen observations')
                           
# reseracher
# redirects to decision maker until the web site is ready
@app.route('/marine-data-repository')
def researcher():
    return redirect('http://www.citclops.eu/search/welcome.php')        

# Barcelona World Race observations'
@app.route('/bwr')
def bwr():
    return render_template('bwr.html',
                           title='BWR observations')
                           
# testing forms
@app.route('/upload', methods=['GET'])
def uploader():
  return render_template('uploader.html', title='manual data upload')

@app.route('/email-test', methods=['GET'])
def emailtest():
  return render_template('email-tester.html', title='test the email function')
  


# disable this view for now
#@app.route('/observation/flag', methods=['GET'])
#def flagger():
#  return render_template('observation_flagger.html', title='observation flagger')
  
