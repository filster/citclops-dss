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
var map;
var layers;
var popup;
var hover_info;
var grfx_directory;
var icon_size;


var style = new ol.style.Style({
	image:  new ol.style.Icon(({}))
});

var geojson_style = function (f, resolution) {

	return styles;
};
var styles = [style];


function append_grfx (grfx, append, icon) {
	return grfx.slice(0,-1) + append + "/" + icon;;
};



function act_layers() {

// base lagen

	layers.l['osm'] 				= new ol.layer.Tile({title: 'OpenStreetMap', 		is_base:true,	visible: false,	source: new ol.source.OSM()});
	layers.l['bing'] 				= new ol.layer.Tile({title: 'Bing', 				is_base:true,	visible: true,	source: new ol.source.BingMaps({ key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',imagerySet: 'Road'})});
//	layers.l['bing_aerial']			= new ol.layer.Tile({title: 'Bing Aerial', 			is_base:true,	visible: false,	source: new ol.source.BingMaps({ key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',imagerySet: 'Aerial'})});
	layers.l['bing_aerial_labels']	= new ol.layer.Tile({title: 'Bing Aerial Labels',	is_base:true,	visible: false,	source: new ol.source.BingMaps({ key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',imagerySet: 'AerialWithLabels'})});

}

 function layersUI () {
		var that = {};
		var layers = {};

		var get_layers = function () {
			return object_to_array(that.l);
		};
		var remove_layer = function (key) {
			if (that.l[key]) {
				map.removeLayer(that.l[key]);
				delete that.l[key];
			}

		};

		var add_layer = function (name, ol_layer) {
			that.l[name] = ol_layer;
			map.addLayer(ol_layer);
		};

		that.l = layers;
		that.get_layers = get_layers;
		that.remove_layer = remove_layer;
		that.add_layer = add_layer;

		return that;

}

function object_to_array (o) {
	var array = [];
	for (var i in o) {
		if (o.hasOwnProperty(i))
		array.push(o[i]);
	}
	return array;
}
function vector_layer_active(cb) {
	$.each(layers.get_layers(), function (index, item) {
		var vector_events = {};
		if (item.get('is_geojson') === true) {
				vector_events[index] = item.getSource().on('change', function(e){
					if (this.getState() == 'ready') {
						var feature_layer = this;
						var count = 0;
						feature_layer.unByKey(vector_events[index]);
						if (cb) {
							feature_layer.forEachFeature(cb);
						}
					}
				});
		}
	});


}



function zoom_in(map) {
	var zoom = ol.animation.zoom({
	  resolution: map.getView().getResolution(),
	  duration: 250,
	  easing: ol.easing.easeOut
	});
	map.beforeRender(zoom);
	map.getView().setResolution(map.getView().constrainResolution(map.getView().getResolution(),1));
}

function zoom_out(map) {
	var zoom = ol.animation.zoom({
	  resolution: map.getView().getResolution(),
	  duration: 250,
	  easing: ol.easing.easeOut
	});
	map.beforeRender(zoom);
	map.getView().setResolution(map.getView().constrainResolution(map.getView().getResolution(),-1));
}


function overlay_window (options) {

// css
// id m_overlay 				id info container
// m_overlay_close_button 		class close button
// m_overlay_title				class
// m_overlay_content			class

	var that = {};
	var defaults = {
	};

	that.visible = false;

	that.options =  $.extend({}, defaults, options || {});
	var parent_container = $('<div id="m_overlay_parent" ><div id="m_overlay_dark"></div><div id="m_overlay_scroller"></div>');
	var container = $('<div id="m_overlay"><div class="m_overlay_close_button"></div></div>');

	parent_container.find('#m_overlay_scroller').append(container);
	$('body').append(parent_container);

	var content = $("<div class='m_overlay_content'>");
	var title = $("<div class='m_overlay_title'>");
	container.addClass('m_overlay_window');

	var set_content = function (o) {
		clear();
		var options = o || {};
		title.html(options.title || "No Title");

		content.html(options.content || "No Content");
		container.append(title).append(content);
	};

	var show = function (options){
		$('.m_overlay_close_button').on('click',function (e) {
			close();
		});

		$('body').addClass('no_scroll');

		container.show();
		parent_container.show();
		that.is_visible = true;

	};
	var close = function () {
		container.hide();
		parent_container.hide();

		$('body').removeClass('no_scroll');

		clear();

		that.is_visible = false;
	};
	var clear = function () {
		content.html('');
		title.html('');
	}
	var is_visible = function () {
		return that.is_visible;
	}

	return {
		is_visible:is_visible,
		show : show,
		close: close,
		set_content: set_content

	};
}

// activate then popup info_window overlay

function act_popup_window() {

	if (!$("#popup" ).length) return;						// indien geen popup nodig dan return

	popup = popup_window({'container': $('#popup')});

	overlay_popup = new ol.Overlay({
	  element: $('#popup'),
	  positioning: 'bottom-center',							// positie tov de mouseclick
	  stopEvent: true
	});

	map.addOverlay(overlay_popup);
}


function show_feature_details(e) {
	var pixel = e.pixel;
	var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
		return feature;
	});
	if ( feature ) {
		$('#popup_content').html(feature.get('content'));
		$('#popup_content').data('extra', feature.get('extra'));
		if (popup) {
			popup.show(e);
		}

	}
}

function popup_window () {
	var that = {};

	var show = function (event){

		overlay_popup.setPosition(event.coordinate);
		$('#popup').show();

		var padding_left 	= 10;
		var padding_top 	= 20;
		var offset_left 	= 0;
		var offset_top 		= 0;
		var duration		= 600;

		var popup_width 	= $('#popup').outerWidth(true);
		var popup_height	= $('#popup').outerHeight(true);
		var map_size		= map.getSize();

// Only for WandelNetwerk
// Responsive design media queries

		var window_width 	= $(window).width();
		if (window_width > 900 && window_width < 1340) {
			//subtract offset
			offset_top 	= $('#top').outerHeight(true);
			offset_left = $('#header').outerWidth(true);
		}
		if (window_width < 900) {
			offset_top 	= $('#top').outerHeight(true) - parseInt($('#map').css('borderTopWidth'),10);

		}

		var left 			= event.pixel[0] - offset_left 		- (popup_width/2) 	- padding_left;
		var right 			= event.pixel[0] + (popup_width/2) 	+ padding_left;
		var top 			= event.pixel[1] - offset_top		- popup_height 		- padding_top;

		var pixel_center = map.getPixelFromCoordinate(map.getView().getCenter());
		var pan = ol.animation.pan({
	   	 	duration: duration,
	   		source: map.getView().getCenter()
	 	 });
	 	var must_pan = false;
	 	var pan_to = pixel_center;
		if (left < 0) {
			must_pan = true;
			pan_to[0] = pan_to[0] + left;
		}

		if (top < 0) {
			must_pan = true;
			pan_to[1] = pan_to[1] + top;
		}

		if (right > map_size[0]) {
			must_pan = true;
			pan_to[0] = pan_to[0] + (right-map_size[0]);
		}

		if (must_pan) {
			 map.beforeRender(pan);
			 map.getView().setCenter(map.getCoordinateFromPixel(pan_to));
		}
	};

	var close = function () {
		$('#popup').html();
		$('#popup').hide();
	};
	that.close = close;
	that.show = show;

	return that;
}


function lightbox_window (options) {

// css
// id m_lightbox 				id info container
// m_lightbox_close_button 		class close button
// m_lightbox_title				class
// m_lightbox_content			class

	var that = {};
	var defaults = {
	};

	that.visible = false;

	that.options =  $.extend({}, defaults, options || {});
	var parent_container = $('<div id="m_lightbox_parent" ><div id="m_lightbox_dark" /><div id="m_lightbox_scroller"></div>');
	var container = $('<div id="m_lightbox"><div class="m_lightbox_close_button"></div></div>');


	parent_container.find('#m_lightbox_scroller').append(container);
	$('body').append(parent_container);

	var init = function (){
		$('body').prepend(parent_container);
	}
	init();


	//container.wrap("<div id='m_lightbox_overlay'>");


	var content = $("<div class='m_lightbox_content'>");
	var title = $("<div class='m_lightbox_title'>");
	container.addClass('m_lightbox_window');

	var set_content = function (o) {
		clear();
		var options = o || {};
		title.html(options.title || "No Title");

		content.html(options.content || "No Content");
		container.append(title).append(content);
	};

	var show = function (options){
		$('.m_lightbox_close_button').on('click',function (e) {
			close();
		});


		$('html').addClass('no_scroll');

		parent_container.show();
		container.show();
		that.is_visible = true;

	};
	var close = function () {
		container.hide();
		$('html').removeClass('no_scroll');
		parent_container.hide();
		clear();
		that.is_visible = false;
	};
	var clear = function () {
		content.html('');
		title.html('');
	}
	var is_visible = function () {
		return that.is_visible;
	}

	return {
		init : init,
		is_visible:is_visible,
		show : show,
		close: close,
		set_content: set_content

	};
}
function show_feature_infowindow(event) {
	var pixel = map.getEventPixel(event);
	var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
		return feature;
	});

	if (feature) {

		$('#map').css('cursor', 'pointer');


		if (feature.get('function') == 2 && feature.get('icon').indexOf('keuzepunt_') == 0) {
			return;
		}

		console.log(selected_feature != feature);
		if (selected_feature != feature ) {
			var naam = feature.get('naam');
			hover_info.setPosition(feature.getGeometry().getCoordinates());
			$('#hover_info').html(naam);
		}

		if ($(hover_info.getElement()).is(':hidden')) {
			if(!$(hover_info.getElement()).is(':animated')) {
				$(hover_info.getElement()).fadeIn();
			}
		}

	} else {
		$('#map').css('cursor', '');
		$(hover_info.getElement()).fadeOut();
	}
	selected_feature = feature;

}

