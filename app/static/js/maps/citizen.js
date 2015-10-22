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

/*
 * This is a self contained js code to display on the map
 * the simplifie DSS interface for citizens.
 */

/* Define bing satellite */
bingSatellite = new L.BingLayer("ApngjAcpeMY0zAp6qJvJJgnmg0xbBBPN3g8CWh4vKVMCALcT-NAn5ON-MnKV2fHE");

/* code to handle citizen layer */

    //Define clusters
    var fuColourClusters = new L.markerClusterGroup({spiderfyOnMaxZoom: true, disableClusteringAtZoom: 20,
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
      // TEST remove at the end
      // var beginURL = 'http://webmap.citclops.eu'

    var owsrootUrl = beginURL + ':8080/geoserver/citclops_obs/ows';
      var samplesURL = beginURL + '/citclops-samples/'
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
                          var fu_value = Math.round(feature.properties.fu_value);
                          var fu_processed = feature.properties.fu_processed;
                          if (fu_processed != null)
                          {
                              fu_processed = Math.round(fu_processed);
                          }
                          
                          
                          var imageFileName = feature.properties.data_file;
                          var xmlFileName = feature.properties.xml_filename;
                          var imgURL = samplesURL + imageFileName;
                          var xmlURL = samplesURL +  xmlFileName;
                          var location_formatted = Number(feature.properties.location_lat).toFixed(5) +','+ Number(feature.properties.location_lon).toFixed(5)
                          popupOptions = {maxWidth: 200};
                          var d = moment.utc(feature.properties.date_time);
                          var sampleDate = d.format('YYYY-MM-DD');

                          
                          // generate unique id
                          var id_tag = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                                 var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                                                 return v.toString(16);
                                             });

                           popupTxt = '<p class="info_window_dataset">Observation ID: ' + feature.properties.observation_id + '</p>' + 
                                          '<div class="info_window_image_container">' +
                                             '<img class="info_window_image" src=\"' + imgURL + '" width=\"60\"/>' +
                                          '</div>' +
                                          '<div>FU value (User): ' + fu_value + '</div>' +
                                          ((fu_processed != null)?'<div>FU value (Processed): ' + fu_processed + ' </div>':'') +
                                          '<div>Date: ' + sampleDate + ' </div>' +
                                          '<div>Location: ' + location_formatted + ' </div><br>' + 
                                          '<button id="' + id_tag + '" type="button" class="btn btn-primary btn-small">More details</button>';
                                          
                           //layer.bindPopup('Citclops app<br> FU colour:'+fu_value+'<br><img src=\"'+imgURL+'" width=\"60\"/><br><a href=\"'+imgURL+'" />Enlarge image</a><br><a href=\"'+ xmlURL +'"/>Metadata</a>',popupOptions);
                           layer.bindPopup(popupTxt);
                          
                           layer.on("popupopen", function () {  
                              console.log(id_tag);
                              $('#'+id_tag).on('click', function(e) {

                                      // Prepare the flag button
                                      var flag_html = '';
                                      if (!is_flagged(feature.properties.flag_id))
                                      {
                                        var flag_button = '<button id="flag_image" type="button" class="btn btn-primary btn-xs">Flag this! ' +
                                                        '(' + ((feature.properties.flagged_count != null)?feature.properties.flagged_count:0) + ') </button>';
                                        var flag_text = '<dd> Image not water or incorrect?                     Flag it!               </dd>';
                                        flag_html = '<dl class="clearfix"><dt>' + flag_button + '</dt> ' + flag_text + '</dl>';
                                      }
                                      else
                                        flag_html = '<div id="flagged-msg">You have already flagged this image.</div>';


                                       var detail_dialog = '<div id="observation_detail_lightbox">         <div>             <div id="observation_detail_imagebox">            <img class="info_window_image" src=\"' + imgURL + '" width=\"250\"/>' +
                                       '<div id="flag_html">' + flag_html + '</div>' + ' </div>        <dl>              <h4>Observation</h4>            <table border="0" cellpadding="0" cellspacing="0">            <tbody><tr>            '+
                                       '<td>FU value (User)</td><td>' + feature.properties.fu_value +
                                       ((feature.properties.fu_processed != null)?'</td></tr><tr><td>FU value (processed on server)</td><td> ' + feature.properties.fu_processed:'') +
                                       '</td></tr></tbody></table><h4>Location and time</h4><table border="0" cellpadding="0" cellspacing="0"><tbody><tr>' + 
                                       '<td>Dataset name</td> <td>' + feature.properties.dataset_name + 
                                       ((feature.properties.observation_id != null)?'</td></tr><tr><td>Observation ID</td><td>' + feature.properties.observation_id:'') + 
                                       '</td></tr><tr><td>Date and time</td><td>' +  feature.properties.date_time + 
                                       '</td></tr><tr><td>Latitude</td><td>' + feature.properties.location_lat +
                                       '</td></tr><tr><td>Longitude</td><td>' + feature.properties.location_lon + 
                                       '</td></tr><tr><td>Datum</td><td>'+ feature.properties.datum_coordinate_system +
                                       '</td></tr><tr><td>Measured parameter</td><td>' + 'Ocean colour and earth-leaving visible waveband spectral radiation' +
                                       '</td></tr><tr><td>Station ID</td><td>' + feature.properties.station_name + 
                                       '</td></tr><tr><td>Data format</td><td>' + feature.properties.data_format + 
                                       '</td></tr></tbody></table>' + 
                                       '<h4>Observation Details</h4>            <table border="0" cellpadding="0" cellspacing="0">            <tbody><tr>            <td>Device</td>            <td>Smart Phone</td>                </tr>                        <tr>' +
                                       ((feature.properties.viewing_angle != null)?'<td>Viewing angle</td>            <td>' + feature.properties.viewing_angle:'') + 
                                       ((feature.properties.azimuth_angle != null)?'</td></tr><tr><td>Azimuth angle</td><td>' + feature.properties.azimuth_angle:'') + 
                                       ((feature.properties.cloud_fraction != null)?'</td></tr><tr><td>Cloud fraction</td><td>' + feature.properties.cloud_fraction:'') + 
                                       ((feature.properties.rain != null)?'</td></tr><tr><td>Rain</td><td>' + (feature.properties.rain?'Yes':'No'):'') + 
                                       ((feature.properties.wind_waves != null)?'</td></tr><tr><td>Wind/waves</td><td>' + feature.properties.wind_waves:'') + 
                                       ((feature.properties.surface_sd != null)?'</td></tr><tr><td>Surface SD</td><td>' + feature.properties.surface_sd:'') + 
                                       ((feature.properties.bottom != null)?'</td></tr><tr><td>Bottom in sight</td><td>' + (feature.properties.bottom?'Yes':'No'):'') + 
                                       ((feature.properties.height != null)?'</td></tr><tr><td>Height (above water)</td><td>' + feature.properties.height:'') + 
                                       ((feature.properties.pi != null)?'</td></tr><tr><td>User ID</td><td>' + feature.properties.pi:'') +
                                       ((feature.properties.profile != null)?'</td></tr><tr><td>User profile</td><td>' + feature.properties.profile:'') +
                                       '</td></tr><tr><td>Secchi disk used</td><td>'  + (feature.properties.userhassecchidisk?'Yes':'No') + 
                                       ((feature.properties.secchidiskdepth != null)?'</td></tr><tr><td>Secchi disk depth</td><td>' + feature.properties.secchidiskdepth:'') + 
                                       '</td></tr><tr><td>Plastic FU scale used</td><td>' + (feature.properties.userhasplasticfuscale?'Yes':'No') + 
                                       ((feature.properties.shadow != null)?'</td></tr><tr><td>Shadow</td><td>' + feature.properties.shadow:'') +
                                       '</td></tr></tbody></table></dl></div></div>';
                                       $( "#dialog" ).html(detail_dialog);
                                       $( "#dialog" ).dialog({width: 600, height : 600, modal: true});

                                        $('#flag_image').on('click', function (e) {
                                          // TODO: There is a bug in the POSTRESQL view making recordid the dataset_name, when fixed change this to record_id                                          
                                          code = feature.properties.dataset_name;
                                          flag = feature.properties.flag_id;
                                          image = feature.properties.data_file;

                                          postJSON(
                                                   '/observation/flag',
                                                   {'code': code, 'flag' : flag, 'image' : image},
                                                   function(data, status, xhr) {
                                                     if (status == 'success')
                                                     {
                                                       set_flagged(flag);
                                                       $('#flag_html')[0].innerHTML = '<div id="flagged-msg">Image flagged.</div>'
                                                     }
                                                     else
                                                     {
                                                        $('#flag_html')[0].innerHTML = '<div id="flagged-msg">Could not flag image, try again at a later time.</div>'
                                                     }
                                                   },
                                                   'json'
                                                 );

                                        });

                              });
                          });
                      }, 
                       
                      pointToLayer: function (data, latlng) {
                       var fu_value = Math.round(data.properties.fu_value)
                var LeafIcon = L.Icon.extend({
                options: {
                iconUrl: '/static/img/'+ 'FU' + fu_value + '.png'      
                }
                });  
                var greenIcon = new LeafIcon({iconSize: 22});
                return L.marker(latlng, {icon: greenIcon});
                }
            }).addTo(fuColourClusters);
        }
    });

/* Main map controls */

map = new L.Map('map', { 
    center: new L.LatLng(40.715702, 0.775302), 
    zoom: 11,
    zoomControl: false,
    layers: [bingSatellite, fuColourClusters],
    attributionControl: true,
    transparent: false
});

L.control.zoom({ position: 'bottomright' }).addTo(map);
    
    /* Define the search */
    new L.Control.GeoSearch({
        provider: new L.GeoSearch.Provider.OpenStreetMap(),
        position: 'topleft'
      }).addTo(map);
    
    /* Define the grid */
    L.graticule().addTo(map);

    /* Specify divisions every 10 degrees */
    L.graticule({ interval: 10 }).addTo(map);
    
    /* Personalize the map according to the location of the computer */
    function onLocationFound(e) {
        var radius = e.accuracy / 2;
        L.marker(e.latlng).addTo(map)
        .bindPopup("This is your position").openPopup();
        L.circle(e.latlng, radius).addTo(map);
    }
    function onLocationError(e) {
        alert(e.message);
      }
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    map.locate({setView: true});
        
    /* General help and information button */
    var info = L.control();
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };
    function myPopup2() {
        window.open( "static/html/info.html", "myWindow", "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no, height = 370, width = 430")
    }
    info.update = function (props) {
        this._div.innerHTML = '<form><input type="button" onClick="myPopup2()" value="General help & information"></form>';
    };
   info.addTo(map);


// **** Flagging controls
 function set_flagged(record_id) 
{
   if ('localStorage' in window && window['localStorage'] !== null) {
     if (localStorage.flagged == undefined) {
          localStorage.flagged = '{}';
     }
     var flagged = JSON.parse(localStorage.flagged);
            flagged[record_id] = true;
     localStorage.flagged = JSON.stringify(flagged);
   }
}

  
function is_flagged (record_id) 
{
  var already_flagged = false;
  if ('localStorage' in window && window['localStorage'] !== null) 
  {
    if (localStorage.flagged != undefined) {
         var flagged = JSON.parse(localStorage.flagged);
         if (flagged[record_id] == true) {
           already_flagged = true;
         }
    }
  }
  return already_flagged;
} 

/*
 * posting json
 */

function postJSON(url, data, callback) {
    return jQuery.ajax({
        'type': 'POST',
        'url': url,
        'contentType': 'application/json',
        'data': JSON.stringify(data),
        'dataType': 'json',
        'success': callback
    });
};

   

// ******************************


