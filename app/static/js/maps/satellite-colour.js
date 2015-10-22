/*
    This file is part of the Citclops Project.

    The Citclops Project is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    The Citclops Project is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with the Citclops Project.  If not, see <http://www.gnu.org/licenses/>.
*/
// Note that months start from zero
// Set the starting date
var satelliteDate = moment([2011,4,26]);

// Set the first date: 7th April 2012
var satMaxDate = moment([2012,3,7]);

// Set the last date: 20th May 2002
var satMinDate = moment([2002,4,20]);

// Create new satellite layer
var satColourLayer = new L.FeatureGroup();

satColourLayer = new L.layerGroup();

// control for the satellite date
// ******************************

var dateSatControl = L.control();
dateSatControl.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};
dateSatControl.update = function (props) {
    this._div.innerHTML = "<div class=\"row\"><div class=\"col-md-2 col-md-offset-10\">\
        <div class=\"form-group\">  \
        <div class='input-group date' id='satDP'> \
            <input type='text' class=\"form-control\" /> \
            <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-calendar\"></span> \
        </div>    \
        </div> \
    </div></div>";
};
function deployDateSatControl(map) 
{
  dateSatControl.addTo(map);
  $('#satDP').datetimepicker({
    format: 'DD/MM/YYYY',
    defaultDate: satelliteDate,
    minDate: satMinDate,
    maxDate: satMaxDate
  });


  $('#satDP').on('dp.change', function(e) {
    dateSelected = $('#satDP').data("DateTimePicker").date().format('DD/MM/YYYY')
    if (dateSelected in satDateToImgFile)
    {
      var tiffs = satDateToImgFile[dateSelected];
      satColourLayer.clearLayers()
      console.log(satColourLayer)
      for (var i = 0; i < tiffs.length; i++)
      {
        tiff = tiffs[i];
        tiff = 'citclops_fu:' + tiff
        console.log('loading satellite date ' + dateSelected + ' from ' + tiff);
        satColourLayer.addLayer(
            new L.TileLayer.WMS("http://82.223.73.191:8080/geoserver/citclops_fu/wms", {
		layers: tiff,
		format: 'image/png',
		transparent: true
      	})
        );
      }
    }
    else
    {
      console.log('No satellite data for this date...');
    }
  });

}  
function removeDateSatControl(map)
{
  satelliteDate = $('#satDP').data("DateTimePicker").date();
  dateSatControl.removeFrom(map);
}
// ******************************

