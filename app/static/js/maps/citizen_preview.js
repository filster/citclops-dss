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

/* code to handle citizen layer */

	//Define clusters
	//var coolPlaces = new L.LayerGroup();
	var coolPlaces= new L.markerClusterGroup({spiderfyOnMaxZoom: true, disableClusteringAtZoom: 20,
		iconCreateFunction: function (cluster) {
		var markers = cluster.getAllChildMarkers();
		var n = 0.0;
		for (var i = 0; i < markers.length; i++) {
			n += parseInt(markers[i].feature.properties.fu_value);
		}
		n=n/markers.length;
		n=Math.round(n);
           console.log('loading clusters using colour: ' + n + 'and length ' + markers.length)
		return L.divIcon({ html: n, className: 'mycluster'+n+'b', iconSize: L.point(40, 40) });
		}
	});
	var defaultParameters = {
		service : 'WFS',
		version : '1.1.0',
		request : 'GetFeature',
		typeName : 'citclops_obs:view_metadata_active',
		outputFormat : 'text/javascript',
		format_options : 'callback:getJson',
		SrsName : 'EPSG:4326'
	};
	
	//Retrieve observation samples from the geoserver with JSONP 
      var beginURL = location.protocol+'//'+location.hostname
	var owsrootUrl = beginURL + ':8080/geoserver/citclops_obs/ows';
	var parameters = L.Util.extend(defaultParameters);
	var URL = owsrootUrl + L.Util.getParamString(parameters);
	var WFSLayer = null;

	var ajax = $.ajax({
		url : URL,
		dataType : 'jsonp',
		jsonpCallback : 'getJson',
		success : function (response) {
			WFSLayer = L.geoJson(response, {
		        style: function (feature) {
                return {
                    stroke: false,
                    fillColor: 'FFFFFF',
                    fillOpacity: 0
                };
				},
				onEachFeature: function (feature, layer) {
                          var fu_value = Math.round(feature.properties.fu_value)
                          var imageFileName = feature.properties.data_file
                          var xmlFileName = feature.properties.xml_filename
                          var imgURL = 'static/samples/'+imageFileName
                          var xmlURL = 'static/samples/'+xmlFileName
                          popupOptions = {maxWidth: 200};
                          layer.on("click", function () {
                            if(typeof layer.getPopup() == 'undefined')
                            {
                                 layer.bindPopup('Citclops app<br> FU colour:'+fu_value+'<br><img src=\"'+imgURL+'" width=\"60\"/><br><a href=\"'+imgURL+'" />Enlarge image</a><br><a href=\"'+ xmlURL +'"/>Metadata</a>',popupOptions);
                                 layer.openPopup();
                            }
                          });
                      }, 
                       
                      pointToLayer: function (data, latlng) {
                       var fu_value = Math.round(data.properties.fu_value)
				var LeafIcon = L.Icon.extend({
				options: {
				iconUrl: '/static/img/'+ fu_value + '.png'	  
				}
				});  
				var greenIcon = new LeafIcon({iconSize: 22});
				return L.marker(latlng, {icon: greenIcon});
				}
			}).addTo(coolPlaces);
			//}).addTo(coolPlaces.addTo(map));		
		}
	});

     
//	var overlayMaps = {
//		"Colour from citizens": coolPlaces,
//		"Colour from satellite": satellite,
//		"Transparency": transparency,
//		"Fluorescence": fluorescence
//	};

	
	//Define the search
//	new L.Control.GeoSearch({
//        provider: new L.GeoSearch.Provider.OpenStreetMap(),
//		position: 'topleft'
//    }).addTo(map);
	
	//Define the grid
	//L.graticule().addTo(map);
	// Specify divisions every 10 degrees
	//L.graticule({ interval: 10 }).addTo(map);

	//Define control buttons
	//L.control.layers(null, overlayMaps,{position: 'bottomright',collapsed:false}).addTo(map);
	//L.control.zoom({ position: 'bottomright' }).addTo(map);
	
	//Personalize the map according to the location of the computer
//	function onLocationFound(e) {
//		var radius = e.accuracy / 2;
//		L.marker(e.latlng).addTo(map)
//		.bindPopup("This is your position").openPopup();
//		L.circle(e.latlng, radius).addTo(map);
//	}
//	function onLocationError(e) {
//		alert(e.message);
//	}
	//map.on('locationfound', onLocationFound);
	//map.on('locationerror', onLocationError);
	//map.locate({setView: true});
		
	//General help and information button
//	var info = L.control();
//	info.onAdd = function (map) {
//		this._div = L.DomUtil.create('div', 'info');
//		this.update();
//		return this._div;
//	};
//	function myPopup2() {
//		window.open( "http://citclops.maris2.nl/content/content.asp?menu=0001_000041", "myWindow", 
//		"status = 1, height = 900, width = 1000, resizable = 0")
//	}
//	info.update = function (props) {
//		this._div.innerHTML = '<form><input type="button" onClick="myPopup2()" value="General help & information"></form>';
//	};

// ******************************
