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

// Create new layer (Bathing Water) layer
var bathingWaterLayer = new L.FeatureGroup();

var satelliteLayer = new L.TileLayer.WMS("http://82.223.73.191:8080/geoserver/citclops_fu/wms", {
			layers: 'citclops_fu:MER_FSG_CCL2R_20041017_104431_000002562031_00180_13761_5294.nc_FU.tif',
			format: 'image/png',
			transparent: true
		});

var maxMMRainorFU = 50


// Function to call service that extracts satellite data
function loadSatelliteData(location, marker, chart, satelliteData)
{
      fuData = satelliteData.map(function(x) {return x.FU;})
      // Reformat as dd/mm/yyyy date
      dateData = satelliteData.map(function(x) {return moment(x.timestamp).format("DD/MM/YYYY");})

      console.log(fuData)
      console.log(dateData)

      //marker.openPopup();

      // Load the FU satellite data into the chart
      chart.load({
        columns: [['x'].concat(dateData),            
            ['satellite'].concat(fuData)
        ],
        axis: {
          satellite: 'y2'
        }       
      });


    // chart.axis.max({y2: Math.max(maxMMRainorFU, Math.max.apply(Math, fuData))});
    chart.axis.max({y2: maxMMRainorFU});  
}

function loadRainfallData(location, marker, chart)
{

  // get the nearest weather station
  var nearest = leafletKnn(gjWeatherStations).nearest(location, 1)[0]
  var feature = nearest.layer.feature

  var startDate = moment(feature.properties.precipitation.start_date, "DD/MM/YYYY")
  var dateData = []
  startDate.subtract(1, 'days')
  for (i = 0; i < 122; i++)
  {
      dateData.push( startDate.add(1, 'days').format("DD/MM/YYYY")  )
  }

  var precipData = feature.properties.precipitation.values

  //remove nan entries
  mask = precipData.map(function(x) {return !isNaN(x)})  
  precipData = $.grep(precipData, function(x, index) { return mask[index] })
  dateData = $.grep(dateData, function(x, index) { return mask[index] })

  console.log(precipData);
  console.log(dateData);

  // Load the rainfall data into the chart
  chart.load({
    columns: [['x'].concat(dateData),            
        ['rainfall'].concat(precipData)
    ],
    axis: {
      rainfall: 'y2'
    }       
  });

  //chart.axis.max({y2: Math.min(maxMMRainorFU, Math.max.apply(Math, precipData))});
  chart.axis.max({y2: maxMMRainorFU});
  // hide the axis
  chart.hide(['rainfall']);

}




// Function to call service that extracts rainfall data
// This has been replaced by more accurate weather station data
//function loadRainfallData(location, marker, chart)
//{
//  $.ajax({
//      type: "POST",
//      url: "weather/rainfall",
//      // The key needs to match your method's input parameter (case-sensitive).
//      data: JSON.stringify({  
//        point: location, 
//        startdate: '2011-06-01T00:00:00Z', 
//        enddate: '2011-10-01T00:00:00Z'
//      }),
//      contentType: "application/json; charset=utf-8",
//      dataType: "json"
//      })
//  .done(function(response) {
//      var rainfallData = response.percipitation;
//      numDates = rainfallData.length;
//
//      // Generate corresponding dates      
//      dateData = []    
//      for (i = 0; i < numDates; ++i)
//      {
//        dateData.push( moment('2011-06-01T00:00:00Z').add(i, 'days').format("DD/MM/YYYY")   )
//      }
//
//
//      console.log(rainfallData);
//      console.log(dateData);
//
//      marker.openPopup();
//
//      // Load the FU satellite data into the chart
//      chart.load({
//        columns: [['x'].concat(dateData),            
//            ['satellite'].concat(rainfallData)
//        ],
//        axis: {
//          satellite: 'y2'
//        }       
//      });
//
//      //chart.axis.max({y2: Math.max(12, Math.max.apply(Math, fuData))});
//  });
//}



function load_bathing_waters() 
{
  var DEFAULT_MAX_VALUE = 1500
  for ( var i=0; i < bathingWaters.length; ++i )
  {
    bw = bathingWaters[i]
    for (var j=0; j < bw.sampleLocations.length; ++j)
    {
      /**** Only SELECT 2011 dates ****/
      bw.sampleLocations[j].waterQuality = bw.sampleLocations[j].waterQuality.filter(function(x) {return x.date.split('/')[2] == '2011'});
      /****************/

      sample = bw.sampleLocations[j]

      // Skip sample locations with no data
      if (sample.waterQuality.length == 0)
        continue;
      

      ecoliData = sample.waterQuality.map(function(x) {return x.ecoli;}).reverse();
      enterococcusData = sample.waterQuality.map(function(x) {return x.enterococcus;}).reverse();
      dateData = sample.waterQuality.map(function(x) {return x.date;}).reverse();
      swimSafeData = sample.waterQuality.map(function(x) {
              if (x.message == 'Zona Apta para el baño')
                return true
              else
                return false
            }).reverse();

      m1 = Math.max.apply(Math, ecoliData);
      m2 = Math.max.apply(Math, enterococcusData)
      swimSafe = true
      if (swimSafeData.length > 0) {
        swimSafe = swimSafeData.reduce(function (a,b) {return a && b;}) // if any are false then its false
      }
      maxBact = Math.max(m1,m2);
      
      markerIcon = bwIcon;
  
      if (maxBact > 1000 || !swimSafe)
        markerIcon = bwIconRed;
      else if (maxBact > 500)
        markerIcon = bwIconYellow;  
  
      m = L.marker([sample.lat, sample.lon], {icon: markerIcon} )
        .addTo( bathingWaterLayer );

      (function (i, j, hasMoreSampleLocs, sampleLoc, bwName, ecoliData, enterococcusData, dateData, swimSafeData, m, maxBact) {
        m.on("click", function () {
          if (!m.getPopup())
          {
            /* 
             * Generate and bind chart to popup only if it doesn't exist
             */
            chartID   = sprintf('chartbw%d-%d', i, j); // chart id based on bathing water number and sample location number
  
            latlonstr = sprintf("Lat: %.3f Lon: %.3f", sampleLoc.lat, sampleLoc.lon)
    
            // create a popup
            chartHTML = sprintf('<div id="%s" style="width: 600px; height: 400px;"></div>', chartID);

            // Generate additional sample location sub title if necessary
            sampleStr = ""            
            if (hasMoreSampleLocs)
               sampleStr = sprintf("- Sample Location %d", j+1)              
  
            popupHTML = sprintf('<div style="width: 600px; height: 450px;">'+
                                    '<div align="center" style="">%s %s<br/> %s</div>' +
                                    '<div> %s </div>' +
                                '</div>', bwName, sampleStr, latlonstr, chartHTML);     
            divchart = $(popupHTML).appendTo("#chartstore")[0];
    
            var chartData = {   xs: {
                                  'EColi' : 'x1',
                                  'Enterococcus' : 'x1',
                                  'satellite' : 'x2',
                                },
                                x: 'x',  
                                xFormat: '%d/%m/%Y', 
                                columns: [['x'].concat(dateData),
                                        ['EColi'].concat(ecoliData),
                                        ['Enterococcus'].concat(enterococcusData)],
                                colors: {
                                    EColi: '#009966',
                                    Enterococcus: '#996600',
                                    satellite: '#9933FF',
                                    rainfall: '#0066ff',
                                },                                
                                color: function(color, d) {
                                  if (d.id && d.index && (d.id == 'EColi' || d.id == 'Enterococcus'))
                                    if (!swimSafeData[d.index])
                                      return d3.rgb(255,0,0)

                                  return color
                                },
                                axes: {
                                  EColi: 'y',
                                  Enterococcus: 'y',
                                  satellite: 'y2',
                                  rainfall: 'y2'
                                }
            };

//            charts[chartID] = c3.generate({
              c3Chart = c3.generate({
                bindto: '#' + chartID,
                data: chartData,
                axis: { 
                  y: {
                      label: {
                        text: "UFC/100 mL",
                        position: "outer-middle",
                      },
                    min: 0,
                    max: Math.max(1500, maxBact) // set the upper y axis to 1500 unless there is a maximum that's higher
                  },
                  x: {
                    type: 'timeseries',
                    tick: {
                      format:'%d/%m/%Y',
                      rotate: 65,
                      culling: {max: 5}
                    },
                    height: 90
                  },
                  y2: {
                    label: {
                      text: "FU (index) or rainfall (mm)",
                      position: "outer-middle",
                    },
                    show: true
                  }
                }
            });
         
            popUp = L.popup(
              options = {maxWidth: 800, maxHeight: 800}
            ).setContent(divchart);
  
            m.bindPopup(popUp);
            m.openPopup();
            
            console.log('loading satallite data');
            loadSatelliteData(m.getLatLng(), m, c3Chart, sampleLoc.colourSatellite);
            console.log('loading rainfall data');
            loadRainfallData(m.getLatLng(), m, c3Chart);
          }
            
          }); 
        })(i, j, bw.sampleLocations.length > 1, bw.sampleLocations[j], bw.name, ecoliData, enterococcusData, dateData, swimSafeData, m, maxBact);

    }
  }
}


var bwIcon = L.icon({
    iconUrl: '/static/img/maps/pin48.png',
    iconSize: [57, 48], // size of the icon
    });

var bwIconYellow = L.icon({
    iconUrl: '/static/img/maps/pin48yellow.png',
    iconSize: [57, 48], // size of the icon
    });

var bwIconRed = L.icon({
    iconUrl: '/static/img/maps/pin48red.png',
    iconSize: [57, 48], // size of the icon
    });






// Experimenting
//var weatherStations = [{"geometry": {"type": "Point", "coordinates": [-8.416666666666666, 43.36666666666667]}, "type": "Feature", "properities": {"altitude": 67.0, "name": "LA CORUNA"}}, {"geometry": {"type": "Point", "coordinates": [-7.45, 43.1]}, "type": "Feature", "properities": {"altitude": 446.0, "name": "LUGO/ROZAS"}}, {"geometry": {"type": "Point", "coordinates": [-6.033333333333333, 43.56666666666667]}, "type": "Feature", "properities": {"altitude": 130.0, "name": "ASTURIAS/AVILES"}}, {"geometry": {"type": "Point", "coordinates": [-5.683333333333334, 43.55]}, "type": "Feature", "properities": {"altitude": 6.0, "name": "GIJON-MUSEL"}}, {"geometry": {"type": "Point", "coordinates": [-5.866666666666667, 43.35]}, "type": "Feature", "properities": {"altitude": 339.0, "name": "OVIEDO"}}, {"geometry": {"type": "Point", "coordinates": [-3.8166666666666664, 43.416666666666664]}, "type": "Feature", "properities": {"altitude": 1.0, "name": "SANTANDER/PARAYAS"}}, {"geometry": {"type": "Point", "coordinates": [-3.783333333333333, 43.483333333333334]}, "type": "Feature", "properities": {"altitude": 59.0, "name": "SANTANDER"}}, {"geometry": {"type": "Point", "coordinates": [-2.9, 43.28333333333333]}, "type": "Feature", "properities": {"altitude": 39.0, "name": "BILBAO/AEROPUERTO"}}, {"geometry": {"type": "Point", "coordinates": [-2.033333333333333, 43.3]}, "type": "Feature", "properities": {"altitude": 259.0, "name": "SAN SEBASTIAN/IGUELDO"}}, {"geometry": {"type": "Point", "coordinates": [-1.7833333333333332, 43.35]}, "type": "Feature", "properities": {"altitude": 8.0, "name": "SAN SEBASTIAN/FUENTERRABIA"}}, {"geometry": {"type": "Point", "coordinates": [-8.4, 42.88333333333333]}, "type": "Feature", "properities": {"altitude": 367.0, "name": "SANTIAGO/LABACOLLA"}}, {"geometry": {"type": "Point", "coordinates": [-8.6, 42.43333333333333]}, "type": "Feature", "properities": {"altitude": 108.0, "name": "PONTEVEDRA"}}, {"geometry": {"type": "Point", "coordinates": [-8.616666666666667, 42.233333333333334]}, "type": "Feature", "properities": {"altitude": 258.0, "name": "VIGO/PEINADOR"}}, {"geometry": {"type": "Point", "coordinates": [-7.85, 42.31666666666667]}, "type": "Feature", "properities": {"altitude": 147.0, "name": "ORENSE"}}, {"geometry": {"type": "Point", "coordinates": [-6.6, 42.55]}, "type": "Feature", "properities": {"altitude": 550.0, "name": "PONFERRADA"}}, {"geometry": {"type": "Point", "coordinates": [-5.633333333333333, 42.583333333333336]}, "type": "Feature", "properities": {"altitude": 914.0, "name": "LEON/VIRGEN DEL CAMINO"}}, {"geometry": {"type": "Point", "coordinates": [-3.6166666666666667, 42.35]}, "type": "Feature", "properities": {"altitude": 892.0, "name": "BURGOS/VILLAFRIA"}}, {"geometry": {"type": "Point", "coordinates": [-2.7333333333333334, 42.86666666666667]}, "type": "Feature", "properities": {"altitude": 510.0, "name": "VITORIA"}}, {"geometry": {"type": "Point", "coordinates": [-2.3166666666666664, 42.45]}, "type": "Feature", "properities": {"altitude": 363.0, "name": "LOGRONO/AGONCILLO"}}, {"geometry": {"type": "Point", "coordinates": [-1.65, 42.766666666666666]}, "type": "Feature", "properities": {"altitude": 453.0, "name": "PAMPLONA/NOAIN"}}, {"geometry": {"type": "Point", "coordinates": [-5.733333333333333, 41.516666666666666]}, "type": "Feature", "properities": {"altitude": 667.0, "name": "ZAMORA"}}, {"geometry": {"type": "Point", "coordinates": [-4.85, 41.7]}, "type": "Feature", "properities": {"altitude": 846.0, "name": "VALLADOLID/VILLANUBLA"}}, {"geometry": {"type": "Point", "coordinates": [-4.766666666666667, 41.65]}, "type": "Feature", "properities": {"altitude": 735.0, "name": "VALLADOLID"}}, {"geometry": {"type": "Point", "coordinates": [-2.466666666666667, 41.766666666666666]}, "type": "Feature", "properities": {"altitude": 1082.0, "name": "SORIA"}}, {"geometry": {"type": "Point", "coordinates": [-1.4, 41.1]}, "type": "Feature", "properities": {"altitude": 779.0, "name": "DAROCA"}}, {"geometry": {"type": "Point", "coordinates": [-1.0, 41.65]}, "type": "Feature", "properities": {"altitude": 258.0, "name": "ZARAGOZA/AEROPUERTO"}}, {"geometry": {"type": "Point", "coordinates": [0.5833333333333334, 41.61666666666667]}, "type": "Feature", "properities": {"altitude": 199.0, "name": "LLEIDA"}}, {"geometry": {"type": "Point", "coordinates": [1.1666666666666667, 41.13333333333333]}, "type": "Feature", "properities": {"altitude": 76.0, "name": "REUS/AEROPUERTO"}}, {"geometry": {"type": "Point", "coordinates": [2.066666666666667, 41.28333333333333]}, "type": "Feature", "properities": {"altitude": 5.0, "name": "BARCELONA/AEROPUERTO"}}, {"geometry": {"type": "Point", "coordinates": [2.75, 41.9]}, "type": "Feature", "properities": {"altitude": 129.0, "name": "GIRONA/COSTA BRAVA"}}, {"geometry": {"type": "Point", "coordinates": [-5.483333333333333, 40.95]}, "type": "Feature", "properities": {"altitude": 794.0, "name": "SALAMANCA/MATACAN"}}, {"geometry": {"type": "Point", "coordinates": [-4.666666666666667, 40.65]}, "type": "Feature", "properities": {"altitude": 1132.0, "name": "AVILA"}}, {"geometry": {"type": "Point", "coordinates": [-4.116666666666666, 40.93333333333333]}, "type": "Feature", "properities": {"altitude": 1005.0, "name": "SEGOVIA"}}, {"geometry": {"type": "Point", "coordinates": [-4.0, 40.766666666666666]}, "type": "Feature", "properities": {"altitude": 1888.0, "name": "NAVACERRADA"}}, {"geometry": {"type": "Point", "coordinates": [-3.55, 40.46666666666667]}, "type": "Feature", "properities": {"altitude": 582.0, "name": "MADRID/BARAJAS"}}, {"geometry": {"type": "Point", "coordinates": [-3.783333333333333, 40.36666666666667]}, "type": "Feature", "properities": {"altitude": 687.0, "name": "MADRID/CUATRO VIENTOS"}}, {"geometry": {"type": "Point", "coordinates": [-3.716666666666667, 40.3]}, "type": "Feature", "properities": {"altitude": 617.0, "name": "MADRID/GETAFE"}}, {"geometry": {"type": "Point", "coordinates": [-3.1666666666666665, 40.65]}, "type": "Feature", "properities": {"altitude": 640.0, "name": "GUADALAJARA"}}, {"geometry": {"type": "Point", "coordinates": [-2.1333333333333333, 40.06666666666667]}, "type": "Feature", "properities": {"altitude": 946.0, "name": "CUENCA"}}, {"geometry": {"type": "Point", "coordinates": [-1.8833333333333333, 40.833333333333336]}, "type": "Feature", "properities": {"altitude": 1063.0, "name": "MOLINA DE ARAGON"}}, {"geometry": {"type": "Point", "coordinates": [-1.1166666666666667, 40.35]}, "type": "Feature", "properities": {"altitude": 902.0, "name": "TERUEL"}}, {"geometry": {"type": "Point", "coordinates": [0.48333333333333334, 40.81666666666667]}, "type": "Feature", "properities": {"altitude": 50.0, "name": "TORTOSA"}}, {"geometry": {"type": "Point", "coordinates": [-6.333333333333333, 39.46666666666667]}, "type": "Feature", "properities": {"altitude": 405.0, "name": "CACERES"}}, {"geometry": {"type": "Point", "coordinates": [-4.033333333333333, 39.88333333333333]}, "type": "Feature", "properities": {"altitude": 516.0, "name": "TOLEDO"}}, {"geometry": {"type": "Point", "coordinates": [-1.85, 38.95]}, "type": "Feature", "properities": {"altitude": 704.0, "name": "ALBACETE/LOS LLANOS"}}, {"geometry": {"type": "Point", "coordinates": [-0.4666666666666667, 39.483333333333334]}, "type": "Feature", "properities": {"altitude": 62.0, "name": "VALENCIA/AEROPUERTO"}}, {"geometry": {"type": "Point", "coordinates": [-0.06666666666666667, 39.95]}, "type": "Feature", "properities": {"altitude": 35.0, "name": "CASTELLON"}}, {"geometry": {"type": "Point", "coordinates": [2.7333333333333334, 39.55]}, "type": "Feature", "properities": {"altitude": 5.0, "name": "PALMA DE MALLORCA/SON SAN JUAN"}}, {"geometry": {"type": "Point", "coordinates": [4.2, 39.85]}, "type": "Feature", "properities": {"altitude": 86.0, "name": "MENORCA/MAHON"}}, {"geometry": {"type": "Point", "coordinates": [-6.816666666666666, 38.88333333333333]}, "type": "Feature", "properities": {"altitude": 192.0, "name": "BADAJOZ/TALAVERA LA REAL"}}, {"geometry": {"type": "Point", "coordinates": [-3.9166666666666665, 38.983333333333334]}, "type": "Feature", "properities": {"altitude": 629.0, "name": "CIUDAD REAL"}}, {"geometry": {"type": "Point", "coordinates": [-0.48333333333333334, 38.36666666666667]}, "type": "Feature", "properities": {"altitude": 82.0, "name": "ALICANTE"}}, {"geometry": {"type": "Point", "coordinates": [-0.5666666666666667, 38.266666666666666]}, "type": "Feature", "properities": {"altitude": 31.0, "name": "ALICANTE/EL ALTET"}}, {"geometry": {"type": "Point", "coordinates": [1.3833333333333333, 38.86666666666667]}, "type": "Feature", "properities": {"altitude": 17.0, "name": "IBIZA/ES CODOLA"}}, {"geometry": {"type": "Point", "coordinates": [-6.9, 37.266666666666666]}, "type": "Feature", "properities": {"altitude": 20.0, "name": "HUELVA"}}, {"geometry": {"type": "Point", "coordinates": [-5.866666666666667, 37.416666666666664]}, "type": "Feature", "properities": {"altitude": 31.0, "name": "SEVILLA/SAN PABLO"}}, {"geometry": {"type": "Point", "coordinates": [-5.6, 37.15]}, "type": "Feature", "properities": {"altitude": 88.0, "name": "MORON DE LA FRONTERA"}}, {"geometry": {"type": "Point", "coordinates": [-4.833333333333333, 37.833333333333336]}, "type": "Feature", "properities": {"altitude": 92.0, "name": "CORDOBA/AEROPUERTO"}}, {"geometry": {"type": "Point", "coordinates": [-3.8, 37.766666666666666]}, "type": "Feature", "properities": {"altitude": 580.0, "name": "JAEN"}}, {"geometry": {"type": "Point", "coordinates": [-3.783333333333333, 37.18333333333333]}, "type": "Feature", "properities": {"altitude": 570.0, "name": "GRANADA/AEROPUERTO"}}, {"geometry": {"type": "Point", "coordinates": [-1.2166666666666668, 37.95]}, "type": "Feature", "properities": {"altitude": 75.0, "name": "MURCIA/AL CANTARILLA"}}, {"geometry": {"type": "Point", "coordinates": [-1.1666666666666667, 38.0]}, "type": "Feature", "properities": {"altitude": 62.0, "name": "MURCIA"}}, {"geometry": {"type": "Point", "coordinates": [-0.8, 37.78333333333333]}, "type": "Feature", "properities": {"altitude": 3.0, "name": "MURCIA/SAN JAVIER"}}, {"geometry": {"type": "Point", "coordinates": [-6.05, 36.75]}, "type": "Feature", "properities": {"altitude": 28.0, "name": "JEREZ DE LA FRONTERA AEROPUERT"}}, {"geometry": {"type": "Point", "coordinates": [-4.483333333333333, 36.666666666666664]}, "type": "Feature", "properities": {"altitude": 7.0, "name": "MALAGA/AEROPUERTO"}}, {"geometry": {"type": "Point", "coordinates": [-2.35, 36.833333333333336]}, "type": "Feature", "properities": {"altitude": 21.0, "name": "ALMERIA/AEROPUERTO"}}] 

gjWeatherStations = L.geoJson([weatherStations], {
			onEachFeature: function (feature, layer) {
                 //   layer.bindPopup("<p> Weather Station </p><p>" + feature.properties.name + "</p>");
                    layer.on("click", function () {
                      /* 
                       * Generate and bind chart to popup only if it doesn't exist
                       */
                      chartID   = 'weatherX' // chart id based on bathing water number and sample location number
            
                      latlonstr = sprintf("Lat: %.3f Lon: %.3f", feature.geometry.coordinates[1], feature.geometry.coordinates[0])
              
                      // create a popup
                      chartHTML = sprintf('<div id="%s" style="width: 600px; height: 400px;"></div>', chartID);
          
                      console.log(feature.properties.precipitation.values);

                      popupHTML = sprintf('<div style="width: 600px; height: 450px;">'+
                                              '<div align="center" style="">%s<br/> %s</div>' +
                                              '<div> %s </div>' +
                                          '</div>', feature.properties.name, latlonstr, chartHTML);     
                      
                      divchart = $(popupHTML).appendTo("#chartstore")[0];

                      var startDate = moment(feature.properties.precipitation.start_date, "DD/MM/YYYY")
                      var dateData = []
                      startDate.subtract(1, 'days')
                      for (i = 0; i < 122; i++)
                      {
                          dateData.push( startDate.add(1, 'days').format("DD/MM/YYYY")  )
                      }

                      precipData = feature.properties.precipitation.values

                      //remove nan entries
                      mask = precipData.map(function(x) {return !isNaN(x)})  
                      precipData = $.grep(precipData, function(x, index) { return mask[index] })
                      dateData = $.grep(dateData, function(x, index) { return mask[index] })
              
                      var chartData = {   x: 'x',
                                          xFormat: '%d/%m/%Y',
                                          columns:  [ ['x'].concat(dateData),
                                                      ['precipitation'].concat(precipData)], };
          
                      var c3Chart = c3.generate({
                          bindto: '#' + chartID,
                          data: chartData,
                          axis: { 
                            y: {
                                label: {
                                  text: "mm/day",
                                  position: "outer-middle",
                                },
                              min: 0,
                              max: 50
                            },
                            x: {
                              type: 'timeseries',
                              tick: {
                                format:'%d/%m/%Y',
                                rotate: 65,
                                culling: {max: 5}
                              },
                              height: 90
                            },
                        }
                      });
                   
                      popUp = L.popup(
                        options = {maxWidth: 800, maxHeight: 800}
                      ).setContent(divchart);

                      
                                layer.bindPopup(popUp);
                                layer.openPopup();
                    });
                 },
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, {
					radius: 8,
					fillColor: "#ff7800",
					color: "#000",
					weight: 1,
					opacity: 1,
					fillOpacity: 0.8
				});
			}
		}).addTo(bathingWaterLayer);













