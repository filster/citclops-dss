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

/* Main map controls */

map = new L.Map('map', { 
	center: new L.LatLng(40.715702, 0.775302), 
	zoom: 11,
	zoomControl: false,
	//layers: [nexrad,kmlLayer,satellite,stations],
      layers: [nexrad],
	attributionControl: true,
	transparent: false
});

var customControl =  L.Control.extend({

		  options: {
		    position: 'bottomright'
		  },

		  onAdd: function (map) {
		    var container = L.DomUtil.create('div', 'bwr leaflet-control-layers leaflet-control-layers-expanded leaflet-control');
		    
		    container.innerHTML = 'Barcelona World Race samples';

		    container.style.backgroundColor = 'white';  

		    container.onclick = function(){
		      console.log('buttonClicked');
		      location.href='http://webmap.citclops.eu/bwr';
		    }

		    return container;
		  }
		});
	
	map.addControl(new customControl());


var overlayMaps = {
	"Artisan fishing": artisan,
	//"Environment": environment,
	//"Aquaculture": industry,
	//"Tourism": tourism,
	//"Health": health, 
	"Scuba Diving": recreationLayer,
      "Bathing waters": bathingWaterLayer,
      "Satellite": satColourLayer,
      //"Citizen": coolPlaces,
};

var baseMaps={
	"Prediction of algal blooms in 1 week":risk,
	"Prediction of algal blooms in 2 weeks":risk2
};

//L.control.zoom({ position: 'bottomright' }).addTo(map);
//L.baseMaps.addTo(map).bringToBack();

var layercontrol = L.control.layers(baseMaps,overlayMaps,{position: 'bottomright',collapsed:false}).addTo(map);
L.control.zoom({ position: 'bottomright' }).addTo(map);

map.on('overlayadd', function (e) 
{
    if (e.layer == recreationLayer)
    {
		deployDateControl(map)
    }
    if (e.layer == satColourLayer)
    {
		deployDateSatControl(map)
    }
}, layercontrol);

map.on('overlayremove', function (e) 
{
    if (e.layer == recreationLayer)
	{
		removeDateControl(map)
	}    
     if (e.layer == satColourLayer)
     {
		removeDateSatControl(map)
     }

}, layercontrol);


update_beach_zones();
load_bathing_waters();
