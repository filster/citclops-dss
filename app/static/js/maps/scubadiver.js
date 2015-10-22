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
// Create new recreation (Scuba Diving) layer
var recreationLayer = new L.FeatureGroup();
var charts = {}

// control that shows state info on hover
var datecontrol = L.control();
datecontrol.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

datecontrol.update = function (props) {
    this._div.innerHTML = "<div class=\"row\"><div class=\"col-md-2 col-md-offset-10\">\
        <div class=\"form-group\">  \
        <div class='input-group date' id='datetimepicker1'> \
            <input type='text' class=\"form-control\" /> \
            <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-calendar\"></span> \
        </div>    \
        </div> \
    </div></div>";

};

function deployDateControl(map) 
{
    datecontrol.addTo(map);
    $('#datetimepicker1').datetimepicker();
    today = new Date()
    maxdate = new Date()
    maxdate.setDate(today.getDate() + 6)
    $('#datetimepicker1').data("DateTimePicker").maxDate(maxdate)
    $('#datetimepicker1').data("DateTimePicker").date(today);
    $('#datetimepicker1').on('dp.change', function(e) {
        refreshSuitability($('#datetimepicker1').data("DateTimePicker").date());
        refreshSatelliteData($('#datetimepicker1').data("DateTimePicker").date());
    });
}

function removeDateControl(map)
{
    datecontrol.removeFrom(map);
}



var addedbeaches = false;
var currentBeaches = [];

function randgen(low_value, high_value)
{
   low_value = typeof low_value !== 'undefined' ? low_value : 1;
   high_value = typeof high_value !== 'undefined' ? high_value : 10;

   return Math.floor(Math.random() * (high_value - low_value + 1) + low_value);
}


function refreshSatelliteData(datechosen)
{
    timestamp = datechosen.valueOf() / 1000;
    seconds15D = (60 * 60 * 24) * 15;
    seconds3Y = (60 * 60 * 24 * 365) * 3;
    datechosen = new Date(datechosen.valueOf());
    
    for (var i = 0; i < currentBeaches.length; i++)
    {
      if (currentBeaches[i]['info']['type'] != 'FU')
        continue;

        (function(beach, i)
        {
            $.ajax({
                type: "POST",
                url: "satellite/getFUForPolyzone",
                // The key needs to match your method's input parameter (case-sensitive).
                data: JSON.stringify({ startdate: (timestamp - seconds15D - seconds3Y), enddate: (timestamp + seconds15D - seconds3Y), polygon: beach['info']['poly']}),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
                })
            .done(function(response) {
                var satelliteData = response;
                
                var chartData = { columns: [['FU-index'].concat(
                    satelliteData.map(function(x){ return Math.round(x*100)/100})
                )]};
                
                chartID   = sprintf('chart%d', i);

                var divchart = d3.select('#' + chartID);

                if (divchart.empty())
                {
                    // create a popup
                    chartHTML = sprintf('<div id="%s" style="width: 300px; height: 300px;"></div>', chartID);
                    popupHTML = sprintf('<div class="row">'+
                                            '<div align="center" style="font-weight: bold">%s</div>' +
                                            '<div> %s </div>' +
                                        '</div>', beach["info"]["name"], chartHTML);                    
                    divchart = $(popupHTML).appendTo("#chartstore")[0];
                    
                    beach['marker'].bindPopup(divchart);
                    charts[chartID] = c3.generate({
                        bindto: '#' + chartID,
                        data: chartData});
                }
                else
                {
                    // Load the new data in the existing popup
                    charts[chartID].load(chartData);
                }                
                
                
            });
        })(currentBeaches[i], i);

    }    
}


function refreshSuitability(datechosen)
{
    timestamp = datechosen.valueOf() / 1000;
    datechosen =  new Date(datechosen.valueOf());

    var rainbow = new Rainbow();
    rainbow.setNumberRange(0, 100);
    rainbow.setSpectrum('green', 'yellow', 'red');
    
    
    for (var i = 0; i < currentBeaches.length; i++)
    {
      if (currentBeaches[i]['info']['type'] != 'scuba')
        continue;

        (function(beach, i)
        {
            $.ajax({
                type: "POST",
                url: "weather/cloudcover",
                // The key needs to match your method's input parameter (case-sensitive).
                data: JSON.stringify({ timestamp: timestamp, latitude: beach['marker'].getLatLng().lat, longitude: beach['marker'].getLatLng().lng}),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
                })
            .done(function(response){
                var weather = response
                var color = '#' + rainbow.colourAt(weather['clouds']);
                beach['polygon'].setStyle({color: color, fillColor: color});
                //beach['marker']._popup.setContent( sprintf("<strong> %s </strong> <br/> %s <br/> Cloud cover %.0f%%", beach["info"]["name"], weather['description'], 
                //weather['clouds']));
                var cctext = sprintf('%s  (cloud cover %.0f%%)', weather['description'], weather['clouds']);
                
                /* 
                 *Generate and bind chart to popup 
                 */
                chartID   = sprintf('chart%d', i);
                               
                var divCCText = $('#cc-' + chartID);
                            
                if (divCCText.length == 0)
                {
                    // create a popup
                    popupHTML = sprintf('<div class="row">'+
                                            '<div align="center" style="font-weight: bold">%s</div>' +
                                            '<div id="cc-%s" align="center"> %s </div>' +
                                        '</div>', beach["info"]["name"], chartID, cctext);                    
                    divchart = $(popupHTML).appendTo("#chartstore")[0];
                    
                    beach['marker'].bindPopup(divchart);
                }
                else
                {
                    // Load the new data in the existing popup
                    divCCText[0].innerHTML = cctext;
                }
            });
        })(currentBeaches[i], i);
    }
}

function update_beach_zones(e) 
{
    var bounds = map.getBounds();
    var zoom   = map.getZoom();
    
    if (zoom > 8)
    {
        if (!addedbeaches)
        {
            $.ajax({
                type: "POST",
                url: "/beaches/getzones",
                // The key needs to match your method's input parameter (case-sensitive).
                data: JSON.stringify({ Bounds: bounds }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                })
            .done(function(response){
                 beaches = response;
                 currentBeaches = []
                 for (var i = 0; i < beaches.length; i++)
                 {
                     var beachInfo = beaches[i];
                     var name = beachInfo["name"];
                     var poly = beachInfo["poly"];
                     var centre = beachInfo["centre"];             
                     
                     beach = {}
                     
                     beach['polygon'] = L.polygon(poly,{
                        color: 'green',
                        fillColor: 'green',
                        fillOpacity: 0.4
                    }).addTo( recreationLayer );// add the scuba diving polygons


                    if (beachInfo['type'] == 'scuba')
                      icon = scubaIcon;
                    else
                      icon = fuIcon;

                     beach['marker'] = L.marker( [centre[0], centre[1]], {icon: icon} )
                        .addTo( recreationLayer );
                        
                    beach['info'] = beachInfo
                    
                    currentBeaches.push(beach)
                 }
                 today = new Date();
                 refreshSuitability(today);
                        refreshSatelliteData(today);
                 addedbeaches = true;
            });
        }
    }
}

var fuIcon = L.icon({
    iconUrl: '/static/img/maps/pin48.png',
    iconSize: [57, 48], // size of the icon
    });

var scubaIcon = L.icon({
      iconUrl: '/static/img/scuba.png',
    iconSize: [30, 30], // size of the icon
    });