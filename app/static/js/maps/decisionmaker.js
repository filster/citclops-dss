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

// The Decision maker js code

/* Decision maker objects */




	//var nexrad = new L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpeg', {
    //        attribution: 'Tiles by <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a //href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    //        subdomains: '1234'
	//	});
    
	//var nexrad = new L.BingLayer("Anqm0F_JjIZvT0P3abS6KONpaBaKuTnITRrnYuiJCE0WOhH6ZbE4DzeT6brvKVR5");

var nexrad = new L.BingLayer("ApngjAcpeMY0zAp6qJvJJgnmg0xbBBPN3g8CWh4vKVMCALcT-NAn5ON-MnKV2fHE");
//var nexradX = new L.BingLayer("ApngjAcpeMY0zAp6qJvJJgnmg0xbBBPN3g8CWh4vKVMCALcT-NAn5ON-MnKV2fHE", {type: "Aerial", maxZoom: 16, maxNativeZoom: 11, minZoom: 1});


var kmlLayer = new L.KML("/static/kml/aoi.kml", {async: true});
kmlLayer.bringToFront();
                                                           
var colour1=L. polygon([
	[40.618757, 0.611412],
	[40.618701, 0.638350],
	[40.623103, 0.668890],
	[40.621673, 0.669182],
	[40.617092, 0.635532],
	[40.616982, 0.611208]
	],{
	fillOpacity: '0.5',
        fillColor: '#F00',
        color: '#F00'
	}).bindPopup('Mussel farm');
	
var colour1b=L. polygon([
[40.620223, 0.608754],
[40.620614, 0.637747],
[40.624686, 0.670889],
[40.620302, 0.671662],
[40.615412, 0.633460],
[40.615036, 0.609090]
],{
fillOpacity: '0.5',
	fillColor: '#FE9A2E',
	color: '#FE9A2E'
}).bindPopup('Mussel farm');
		
var colour2 = L.circle([40.776111, 0.747778], 500, {
	fillOpacity: '0.5',
	fillColor: '#FF0',
	color: '#FF0'
	});//.bringToBack();

var colour3 = L.circle([40.776111, 0.747778], 500, {
	fillOpacity: '0.5',
	fillColor: '#F00',
	color: '#F00'
	});//.bringToBack();

var colour2b = L.circle([40.60917, 0.65611], 2500, {
	fillOpacity: '0.5',
	fillColor: '#FF0',
	color: '#FF0'
	});//.bringToBack();

var colour3b = L.circle([40.60971, 0.65611], 2500, {
	fillOpacity: '0.5',
	fillColor: '#F00',
	color: '#F00'
	});//.bringToBack();

	 var zone1=L. polygon([
[40.611900,0.590773],
[40.612095,0.590429],
[40.612356,0.590215],
[40.612519,0.590086],
[40.612763,0.590236],
[40.612926,0.590386],
[40.613073,0.590665],
[40.613333,0.591309],
[40.613464,0.591760],
[40.613643,0.592682],
[40.613741,0.593219],
[40.613822,0.593991],
[40.613904,0.594549],
[40.613871,0.594893],
[40.613871,0.595493],
[40.613806,0.595901],
[40.612910,0.597038],
[40.612503,0.597510],
[40.611574,0.598712],
[40.610939,0.600107],
[40.610401,0.601330],
[40.610092,0.602102],
[40.609619,0.603046],
[40.609033,0.604506],
[40.609196,0.604634],
[40.609294,0.604398],
[40.609668,0.603561],
[40.609945,0.603755],
[40.610304,0.602918],
[40.610629,0.602252],
[40.610939,0.601459],
[40.611086,0.601416],
[40.611265,0.601137],
[40.611542,0.600557],
[40.611476,0.600450],
[40.611525,0.600235],
[40.611656,0.600042],
[40.611737,0.600064],
[40.611884,0.599592],
[40.611884,0.599442],
[40.612079,0.599012],
[40.611981,0.598798],
[40.612112,0.598562],
[40.612095,0.598454],
[40.612877,0.597446],
[40.613040,0.597639],
[40.613822,0.596781],
[40.613724,0.596523],
[40.614588,0.595407],
[40.614946,0.595794],
[40.614946,0.595944],
[40.614848,0.596116],
[40.614930,0.596094],
[40.615060,0.595965],
[40.615272,0.596094],
[40.615304,0.596180],
[40.615321,0.596352],
[40.615484,0.596588],
[40.615516,0.596673],
[40.615646,0.596663],
[40.615565,0.596781],
[40.615565,0.596824],
[40.615679,0.596738],
[40.615695,0.596781],
[40.615679,0.596845],
[40.615834,0.597038],
[40.616225,0.596555],
[40.616103,0.596094],
[40.615972,0.596116],
[40.615817,0.595568],
[40.615671,0.595075],
[40.615549,0.594667],
[40.615614,0.594077],
[40.616314,0.593197],
[40.616428,0.593348],
[40.615785,0.594174],
[40.615826,0.594206],
[40.616493,0.593390],
[40.616616,0.593573],
[40.615907,0.594485],
[40.615940,0.594528],
[40.616673,0.593659],
[40.616819,0.593809],
[40.616046,0.594839],
[40.616062,0.594850],
[40.616868,0.593916],
[40.617080,0.594163],
[40.616241,0.595300],
[40.616282,0.595354],
[40.616575,0.594978],
[40.616713,0.595204],
[40.616363,0.595676],
[40.616396,0.595719],
[40.616778,0.595268],
[40.616884,0.595429],
[40.616477,0.596040],
[40.616493,0.596083],
[40.616933,0.595622],
[40.617039,0.595762],
[40.617129,0.595998],
[40.616591,0.596652],
[40.616607,0.596706],
[40.617178,0.596073],
[40.617316,0.596255],
[40.616526,0.597221],
[40.616559,0.597253],
[40.617365,0.596287],
[40.617446,0.596459],
[40.616664,0.597457],
[40.616697,0.597478],
[40.617568,0.596448],
[40.618016,0.597060],
[40.617422,0.597811],
[40.617438,0.597886],
[40.618090,0.597146],
[40.618375,0.597500],
[40.618106,0.597854],
[40.618139,0.597939],
[40.618432,0.597618],
[40.618497,0.597682],
[40.618244,0.598090],
[40.618269,0.598143],
[40.618538,0.597779],
[40.618652,0.597897],
[40.618358,0.598272],
[40.618391,0.598315],
[40.618700,0.597972],
[40.618790,0.598090],
[40.618481,0.598454],
[40.618505,0.598508],
[40.618839,0.598186],
[40.619067,0.598497],
[40.618415,0.599302],
[40.617845,0.598454],
[40.617764,0.598497],
[40.618407,0.599356],
[40.617845,0.600053],
[40.616436,0.598047],
[40.615223,0.598551],
[40.615264,0.598723],
[40.616388,0.598251],
[40.617577,0.599881],
[40.616078,0.601802],
[40.614221,0.599163],
[40.614295,0.599034],
[40.614140,0.598787],
[40.613879,0.599055],
[40.616233,0.602424],
[40.617031,0.602446],
[40.618367,0.600761],
[40.618757,0.599978],
[40.618766,0.599924],
[40.619140,0.599442],
[40.619026,0.599259],
[40.619124,0.599098],
[40.619539,0.599720],
[40.619580,0.599678],
[40.619189,0.599055],
[40.619311,0.598862],
[40.619710,0.599538],
[40.619775,0.599474],
[40.619368,0.598851],
[40.619482,0.598637],
[40.619832,0.599195],
[40.619881,0.599152],
[40.619556,0.598626],
[40.619898,0.598154],
[40.619971,0.598186],
[40.619955,0.598261],
[40.620060,0.598615],
[40.620117,0.598712],
[40.620117,0.598776],
[40.620468,0.599860],
[40.620500,0.600858],
[40.619792,0.599903],
[40.619767,0.599924],
[40.620484,0.600911],
[40.620451,0.601190],
[40.620231,0.601416],
[40.619466,0.600332],
[40.619425,0.600353],
[40.620223,0.601448],
[40.619824,0.601920],
[40.619059,0.600847],
[40.619026,0.600879],
[40.619800,0.601974],
[40.619295,0.602585],
[40.618562,0.601566],
[40.618505,0.601598],
[40.619246,0.602639],
[40.619205,0.603197],
[40.618253,0.603293],
[40.617756,0.602607],
[40.617699,0.602639],
[40.618204,0.603347],
[40.619238,0.603293],
[40.619262,0.603883],
[40.618367,0.603991],
[40.618358,0.604023],
[40.619279,0.603937],
[40.619279,0.604570],
[40.618448,0.604656],
[40.618432,0.604709],
[40.619303,0.604666],
[40.619303,0.604870],
[40.619360,0.604903],
[40.619319,0.603572],
[40.619727,0.603722],
[40.620044,0.603679],
[40.620435,0.603755],
[40.620647,0.603765],
[40.620647,0.603862],
[40.619784,0.603980],
[40.619784,0.604012],
[40.620655,0.603926],
[40.620696,0.604398],
[40.619832,0.604506],
[40.619832,0.604548],
[40.620696,0.604495],
[40.620712,0.604774],
[40.620769,0.604774],
[40.620777,0.604355],
[40.621526,0.604291],
[40.621518,0.604205],
[40.620785,0.604248],
[40.621437,0.603722],
[40.620720,0.603733],
[40.621453,0.603637],
[40.620704,0.603669],
[40.620679,0.603261],
[40.621339,0.603154],
[40.621339,0.603089],
[40.620696,0.603164],
[40.620647,0.602682],
[40.621241,0.602660],
[40.621241,0.602574],
[40.620769,0.602585],
[40.620736,0.602081],
[40.621795,0.601770],
[40.621942,0.601834],
[40.621999,0.602016],
[40.621445,0.602317],
[40.621445,0.602371],
[40.622039,0.602092],
[40.622104,0.602306],
[40.621502,0.602714],
[40.621502,0.602746],
[40.622117,0.602435],
[40.622218,0.602730],
[40.621583,0.603079],
[40.621587,0.603105],
[40.622243,0.602810],
[40.622328,0.603073],
[40.621657,0.603411],
[40.621665,0.603454],
[40.622341,0.603143],
[40.622459,0.603486],
[40.621779,0.603840],
[40.621787,0.603878],
[40.622459,0.603529],
[40.622556,0.603921],
[40.621917,0.604253],
[40.621913,0.604291],
[40.622569,0.603980],
[40.622622,0.604388],
[40.622015,0.604709],
[40.622019,0.604736],
[40.622634,0.604436],
[40.622683,0.604430],
[40.621990,0.601823],
[40.621819,0.601684],
[40.621746,0.601641],
[40.621624,0.601673],
[40.621543,0.601716],
[40.621429,0.601737],
[40.621323,0.601662],
[40.621453,0.601566],
[40.621510,0.601373],
[40.621461,0.601308],
[40.621355,0.601265],
[40.621233,0.601351],
[40.621119,0.601330],
[40.621046,0.601265],
[40.621249,0.601137],
[40.621339,0.601051],
[40.621331,0.600858],
[40.621201,0.600804],
[40.621087,0.600793],
[40.620948,0.600783],
[40.620826,0.600708],
[40.620761,0.600504],
[40.620834,0.600375],
[40.620981,0.600418],
[40.621225,0.600278],
[40.621404,0.600246],
[40.621518,0.600321],
[40.621600,0.600514],
[40.621697,0.600740],
[40.621697,0.600879],
[40.621762,0.601072],
[40.621860,0.601158],
[40.621933,0.601233],
[40.622015,0.601480],
[40.622031,0.601705],
[40.622178,0.601952],
[40.622235,0.601995],
[40.622332,0.602274],
[40.622365,0.602553],
[40.622438,0.602789],
[40.622512,0.602961],
[40.622552,0.603132],
[40.622618,0.603304],
[40.622675,0.603465],
[40.622707,0.603679],
[40.622707,0.603905],
[40.622789,0.604066],
[40.622846,0.604076],
[40.622821,0.604194],
[40.622878,0.604280],
[40.623033,0.604388],
[40.623147,0.604548],
[40.623204,0.605042],
[40.623131,0.605353],
[40.623114,0.605750],
[40.623098,0.606018],
[40.623098,0.606351],
[40.623106,0.606490],
[40.623098,0.606705],
[40.623114,0.607145],
[40.623131,0.607424],
[40.623131,0.607585],
[40.623041,0.607638],
[40.622943,0.607595],
[40.622927,0.607005],
[40.622878,0.606447],
[40.622821,0.606050],
[40.622748,0.605192],
[40.622772,0.604699],
[40.622740,0.604452],
[40.622658,0.604484],
[40.622658,0.604666],
[40.622618,0.604763],
[40.622064,0.605096],
[40.622064,0.605149],
[40.622666,0.604870],
[40.622707,0.605139],
[40.622153,0.605385],
[40.622137,0.605503],
[40.622699,0.605257],
[40.622756,0.606512],
[40.622251,0.606544],
[40.622080,0.606598],
[40.621917,0.606641],
[40.621901,0.606877],
[40.621795,0.606630],
[40.621689,0.606630],
[40.621648,0.606802],
[40.621575,0.606662],
[40.621477,0.606823],
[40.621021,0.606973],
[40.620663,0.606962],
[40.618041,0.607252],
[40.617943,0.607145],
[40.617682,0.603905],
[40.616347,0.604076],
[40.615907,0.603948],
[40.615598,0.603411],
[40.615451,0.603518],
[40.615549,0.603776],
[40.615940,0.604033],
[40.616265,0.604227],
[40.616624,0.608432],
[40.623432,0.607831],
[40.623122,0.608647],
[40.623204,0.609140],
[40.623220,0.609334],
[40.623188,0.609698],
[40.623285,0.610085],
[40.623334,0.610342],
[40.623367,0.610750],
[40.623350,0.611308],
[40.623399,0.611866],
[40.623220,0.612724],
[40.623204,0.613239],
[40.623204,0.614419],
[40.623171,0.614955],
[40.623057,0.616179],
[40.622829,0.617466],
[40.622748,0.618217],
[40.622666,0.619526],
[40.622471,0.620706],
[40.622390,0.621650],
[40.622341,0.622509],
[40.622520,0.622659],
[40.622438,0.623109],
[40.622455,0.624118],
[40.622324,0.625856],
[40.622357,0.626822],
[40.622618,0.627122],
[40.622552,0.627551],
[40.622813,0.628538],
[40.623074,0.630941],
[40.623139,0.632615],
[40.623074,0.635061],
[40.623139,0.636177],
[40.623595,0.638366],
[40.623920,0.640512],
[40.623725,0.642614],
[40.623497,0.643816],
[40.623986,0.644932],
[40.624311,0.646777],
[40.624832,0.648150],
[40.625060,0.648794],
[40.625093,0.649824],
[40.624995,0.650554],
[40.624670,0.651069],
[40.624311,0.651455],
[40.624148,0.651755],
[40.624898,0.651155],
[40.625158,0.651155],
[40.624963,0.651455],
[40.625158,0.651670],
[40.624898,0.652099],
[40.625842,0.652270],
[40.626591,0.653729],
[40.626722,0.654931],
[40.626494,0.656219],
[40.626852,0.658236],
[40.626754,0.660295],
[40.626689,0.662098],
[40.626526,0.663128],
[40.626722,0.663342],
[40.627536,0.665145],
[40.625321,0.667892],
[40.625354,0.668020],
[40.627796,0.665789],
[40.628415,0.667076],
[40.628806,0.667291],
[40.628513,0.668750],
[40.628904,0.669994],
[40.629360,0.671067],
[40.629686,0.671840],
[40.630435,0.673084],
[40.630695,0.674071],
[40.631314,0.675101],
[40.631672,0.676517],
[40.632747,0.677934],
[40.633040,0.679092],
[40.633789,0.680809],
[40.633985,0.682912],
[40.634245,0.683599],
[40.634929,0.682740],
[40.636134,0.683169],
[40.636102,0.683599],
[40.636329,0.684242],
[40.634701,0.685015],
[40.634897,0.686688],
[40.635874,0.688105],
[40.635874,0.689392],
[40.636167,0.690336],
[40.636362,0.691667],
[40.636557,0.693040],
[40.638218,0.692267],
[40.639456,0.692739],
[40.638251,0.694113],
[40.636395,0.694242],
[40.636362,0.694671],
[40.636851,0.694971],
[40.637241,0.697203],
[40.637176,0.698404],
[40.637437,0.699477],
[40.637925,0.700336],
[40.637534,0.701194],
[40.637469,0.701666],
[40.637828,0.702481],
[40.637567,0.703897],
[40.637860,0.704455],
[40.637730,0.705657],
[40.637437,0.706387],
[40.637111,0.706987],
[40.636720,0.707631],
[40.636264,0.707889],
[40.636492,0.708790],
[40.636981,0.709476],
[40.637437,0.710034],
[40.637762,0.710721],
[40.637990,0.711322],
[40.637828,0.712438],
[40.638056,0.712438],
[40.638414,0.712652],
[40.638642,0.713296],
[40.638967,0.713768],
[40.638772,0.715098],
[40.638870,0.716171],
[40.639032,0.717287],
[40.638870,0.717545],
[40.638739,0.718231],
[40.638739,0.718231],
[40.638967,0.719261],
[40.638577,0.720806],
[40.639098,0.722523],
[40.639879,0.725613],
[40.639098,0.727673],
[40.638837,0.730247],
[40.638577,0.732136],
[40.638577,0.732994],
[40.640140,0.732994],
[40.639423,0.734711],
[40.638381,0.735054],
[40.637795,0.735998],
[40.637665,0.736771],
[40.637665,0.737715],
[40.637795,0.737972],
[40.639326,0.734882],
[40.639098,0.735912],
[40.638805,0.736856],
[40.638544,0.737286],
[40.638316,0.738487],
[40.638316,0.738616],
[40.637925,0.738659],
[40.637306,0.738616],
[40.636948,0.738573],
[40.636981,0.738788],
[40.637372,0.738916],
[40.637632,0.738916],
[40.637274,0.740032],
[40.637469,0.740118],
[40.638023,0.739603],
[40.637860,0.740848],
[40.637404,0.741749],
[40.637241,0.742607],
[40.636851,0.742865],
[40.636069,0.745182],
[40.635678,0.744624],
[40.635027,0.744324],
[40.634115,0.743723],
[40.633724,0.743294],
[40.633366,0.742736],
[40.633105,0.742178],
[40.632454,0.741878],
[40.631835,0.741534],
[40.631314,0.741405],
[40.630923,0.741663],
[40.630467,0.740891],
[40.630304,0.740848],
[40.630011,0.741363],
[40.629067,0.741191],
[40.628057,0.740633],
[40.626754,0.739732],
[40.625907,0.739002],
[40.624898,0.738530],
[40.622357,0.736341],
[40.620859,0.734668],
[40.619165,0.733080],
[40.617243,0.731449],
[40.615842,0.730205],
[40.614474,0.728703],
[40.612030,0.726514],
[40.609457,0.724497],
[40.607762,0.723081],
[40.605319,0.720849],
[40.603592,0.719218],
[40.602028,0.717931],
[40.599780,0.716085],
[40.598900,0.715356],
[40.597694,0.714540],
[40.596652,0.713897],
[40.599324,0.715699],
[40.596000,0.713425],
[40.592089,0.710249],
[40.591959,0.709348],
[40.591829,0.708919],
[40.591600,0.708704],
[40.591275,0.708704],
[40.590981,0.708661],
[40.591405,0.708447],
[40.591470,0.708060],
[40.591307,0.707932],
[40.591079,0.707760],
[40.590884,0.707545],
[40.590949,0.707288],
[40.591144,0.707288],
[40.591275,0.707545],
[40.591438,0.707674],
[40.591438,0.707030],
[40.591470,0.706558],
[40.591470,0.706429],
[40.590965,0.705528],
[40.590395,0.704584],
[40.589808,0.703769],
[40.589727,0.702524],
[40.589955,0.701773],
[40.589857,0.701087],
[40.589808,0.700529],
[40.589824,0.699627],
[40.589857,0.698833],
[40.589727,0.698726],
[40.589303,0.698597],
[40.589091,0.698190],
[40.588928,0.697503],
[40.589221,0.697052],
[40.589417,0.696795],
[40.589547,0.696194],
[40.589466,0.695786],
[40.589401,0.695443],
[40.589401,0.695164],
[40.589515,0.694842],
[40.589498,0.694499],
[40.589417,0.694263],
[40.589287,0.693598],
[40.589156,0.693040],
[40.589075,0.692482],
[40.589026,0.692010],
[40.588944,0.691774],
[40.589026,0.691044],
[40.589173,0.690529],
[40.589287,0.689907],
[40.589319,0.689564],
[40.589466,0.688984],
[40.589564,0.688405],
[40.589710,0.687804],
[40.589482,0.687139],
[40.589450,0.686860],
[40.589336,0.686088],
[40.589221,0.685444],
[40.589221,0.685208],
[40.589238,0.684907],
[40.589156,0.684328],
[40.589107,0.683749],
[40.589075,0.683427],
[40.589205,0.683427],
[40.589450,0.683448],
[40.589629,0.683491],
[40.589890,0.683148],
[40.589971,0.682397],
[40.590101,0.681560],
[40.590232,0.680981],
[40.590427,0.680616],
[40.590851,0.680230],
[40.590949,0.679801],
[40.591226,0.679307],
[40.591275,0.678685],
[40.591323,0.678062],
[40.591372,0.677462],
[40.591421,0.676453],
[40.591568,0.675659],
[40.591812,0.674973],
[40.592187,0.674243],
[40.592350,0.674071],
[40.593100,0.673857],
[40.593197,0.673792],
[40.592904,0.673277],
[40.593067,0.672784],
[40.593051,0.672505],
[40.592937,0.672140],
[40.592725,0.671690],
[40.592546,0.670938],
[40.592383,0.670059],
[40.592252,0.669565],
[40.592057,0.669029],
[40.591943,0.668600],
[40.591877,0.668128],
[40.591877,0.667312],
[40.591829,0.666347],
[40.591812,0.665810],
[40.591715,0.665553],
[40.591486,0.665359],
[40.591389,0.664973],
[40.591438,0.664372],
[40.591503,0.663900],
[40.591503,0.663300],
[40.591519,0.662506],
[40.591470,0.662034],
[40.591454,0.661540],
[40.591454,0.660918],
[40.591486,0.660381],
[40.591405,0.660038],
[40.590753,0.658579],
[40.590101,0.657721],
[40.589254,0.656605],
[40.588211,0.655575],
[40.587559,0.655146],
[40.586451,0.654373],
[40.585669,0.654202],
[40.585017,0.654459],
[40.584040,0.655146],
[40.583388,0.655231],
[40.582540,0.656004],
[40.581823,0.656090],
[40.581041,0.656176],
[40.580324,0.656691],
[40.579216,0.656862],
[40.578433,0.656862],
[40.578433,0.655918],
[40.578825,0.655489],
[40.579216,0.655661],
[40.579607,0.656004],
[40.580128,0.655575],
[40.580845,0.654802],
[40.581106,0.654030],
[40.581367,0.653086],
[40.580194,0.653858],
[40.579216,0.654373],
[40.578433,0.654287],
[40.578042,0.654030],
[40.578238,0.653257],
[40.579802,0.653086],
[40.580454,0.652142],
[40.580780,0.651026],
[40.581171,0.649910],
[40.581041,0.649481],
[40.579998,0.650082],
[40.579216,0.650425],
[40.578303,0.650597],
[40.577847,0.651112],
[40.577390,0.651798],
[40.576413,0.652399],
[40.575761,0.652571],
[40.575369,0.651970],
[40.575500,0.650940],
[40.575630,0.650253],
[40.575109,0.650167],
[40.574196,0.650167],
[40.573479,0.650082],
[40.573153,0.649309],
[40.573218,0.647764],
[40.574000,0.646219],
[40.574000,0.644588],
[40.574000,0.643902],
[40.574522,0.642099],
[40.575109,0.640125],
[40.575369,0.638580],
[40.575826,0.636692],
[40.576347,0.634890],
[40.577064,0.633345],
[40.577912,0.632229],
[40.577847,0.631714],
[40.578107,0.631027],
[40.578825,0.630598],
[40.578825,0.631027],
[40.579151,0.631199],
[40.579868,0.631199],
[40.580259,0.630856],
[40.580389,0.630598],
[40.580585,0.630856],
[40.580911,0.631628],
[40.581367,0.632315],
[40.581823,0.632744],
[40.582084,0.631971],
[40.582214,0.631285],
[40.582084,0.631199],
[40.581954,0.630255],
[40.581954,0.629568],
[40.582149,0.628538],
[40.582475,0.627251],
[40.582866,0.625534],
[40.583518,0.623474],
[40.584105,0.622015],
[40.584365,0.620728],
[40.585278,0.619440],
[40.585669,0.617895],
[40.585799,0.617123],
[40.585734,0.616608],
[40.585213,0.616693],
[40.584757,0.616865],
[40.583909,0.616951],
[40.582410,0.616693],
[40.581693,0.616865],
[40.580976,0.616865],
[40.580585,0.616179],
[40.580324,0.615749],
[40.579933,0.615492],
[40.579151,0.615320],
[40.578303,0.615578],
[40.577716,0.615921],
[40.576934,0.616693],
[40.576282,0.617208],
[40.575500,0.616951],
[40.574718,0.616693],
[40.574066,0.617037],
[40.573414,0.617552],
[40.572566,0.618153],
[40.572175,0.618496],
[40.572762,0.617294],
[40.573153,0.616865],
[40.573870,0.616179],
[40.574848,0.615921],
[40.575369,0.615921],
[40.575761,0.616093],
[40.576087,0.615578],
[40.576413,0.614548],
[40.576543,0.614033],
[40.576217,0.613260],
[40.575956,0.613089],
[40.575695,0.613003],
[40.575761,0.612488],
[40.575435,0.612144],
[40.575956,0.612059],
[40.576738,0.611887],
[40.577716,0.611973],
[40.578107,0.611029],
[40.578107,0.610342],
[40.577847,0.609398],
[40.577390,0.608454],
[40.576999,0.607853],
[40.576478,0.607853],
[40.576217,0.607767],
[40.576804,0.606995],
[40.577456,0.607080],
[40.577716,0.607080],
[40.577716,0.606737],
[40.577586,0.606308],
[40.577586,0.605793],
[40.577325,0.605106],
[40.576934,0.604677],
[40.576413,0.603991],
[40.576087,0.603304],
[40.575695,0.602274],
[40.575500,0.601931],
[40.575435,0.601330],
[40.575761,0.600643],
[40.575891,0.599957],
[40.576087,0.599098],
[40.576282,0.598583],
[40.576543,0.598068],
[40.576804,0.597382],
[40.577260,0.596695],
[40.577651,0.596094],
[40.577847,0.595665],
[40.577912,0.595322],
[40.578107,0.595322],
[40.578303,0.595322],
[40.578303,0.595064]
],{
	fillOpacity: '0.2',
        fillColor: '#B404AE',
        color: '#B404AE'
	}).bindPopup('Zone 1');	

	var zone2=L. polygon([
	[40.614018,0.595150],
[40.613822,0.594635],
[40.613822,0.593863],
[40.613627,0.592747],
[40.613366,0.591717],
[40.612975,0.590858],
[40.612845,0.590429],
[40.612584,0.590258],
[40.612128,0.590429],
[40.611867,0.590687],
[40.611998,0.589743],
[40.611802,0.589056],
[40.611542,0.588799],
[40.611086,0.588713],
[40.610695,0.588455],
[40.610173,0.588026],
[40.609978,0.587940],
[40.609587,0.588369],
[40.609522,0.587597],
[40.609196,0.587082],
[40.608870,0.586739],
[40.608610,0.586395],
[40.608023,0.585880],
[40.607567,0.585709],
[40.607241,0.586052],
[40.607176,0.585194],
[40.606915,0.584850],
[40.606394,0.584507],
[40.606264,0.584507],
[40.606133,0.584464],
[40.606361,0.584121],
[40.606329,0.583606],
[40.606133,0.583134],
[40.605938,0.582747],
[40.605417,0.582404],
[40.605026,0.582833],
[40.605091,0.582447],
[40.604830,0.582104],
[40.604537,0.581846],
[40.604374,0.581417],
[40.604146,0.580602],
[40.603885,0.580258],
[40.603592,0.580173],
[40.603331,0.580173],
[40.602940,0.580130],
[40.602647,0.579615],
[40.602321,0.579400],
[40.601963,0.578971],
[40.601441,0.578499],
[40.601116,0.578284],
[40.600725,0.577984],
[40.600464,0.577683],
[40.600008,0.577426],
[40.599747,0.576739],
[40.599519,0.576181],
[40.599226,0.576010],
[40.598672,0.576181],
[40.598313,0.575666],
[40.597988,0.574551],
[40.597303,0.574079],
[40.597303,0.573649],
[40.596782,0.572877],
[40.596326,0.571890],
[40.595902,0.571675],
[40.595511,0.571675],
[40.595250,0.571289],
[40.594664,0.570903],
[40.594338,0.570216],
[40.593849,0.569057],
[40.593295,0.568714],
[40.592969,0.568070],
[40.592448,0.567856],
[40.592057,0.567856],
[40.591861,0.567513],
[40.591144,0.566912],
[40.590818,0.566568],
[40.590558,0.566139],
[40.590297,0.566182],
[40.590264,0.565925],
[40.590264,0.565495],
[40.589678,0.564723],
[40.589254,0.564251],
[40.588472,0.563092],
[40.587788,0.563135],
[40.587233,0.562620],
[40.586940,0.562491],
[40.586712,0.562449],
[40.586419,0.561891],
[40.585962,0.561419],
[40.585506,0.560989],
[40.584854,0.560689],
[40.584496,0.560517],
[40.584137,0.559831],
[40.583714,0.559573],
[40.583388,0.559187],
[40.582931,0.558629],
[40.582540,0.557814],
[40.582182,0.557427],
[40.581921,0.556440],
[40.581171,0.555882],
[40.580519,0.554681],
[40.579900,0.554123],
[40.579053,0.553179],
[40.578466,0.552621],
[40.577619,0.551634],
[40.576804,0.550904],
[40.576445,0.550432],
[40.575956,0.550132],
[40.574946,0.549188],
[40.574783,0.548630],
[40.574522,0.547986],
[40.574033,0.547814],
[40.572045,0.549488],
[40.572338,0.550303],
[40.572436,0.550261],
[40.572599,0.550690],
[40.572566,0.550947],
[40.572794,0.551848],
[40.572892,0.551848],
[40.572859,0.552063],
[40.572664,0.551891],
[40.572566,0.551848],
[40.572403,0.551977],
[40.571947,0.550733],
[40.572077,0.550561],
[40.571882,0.549831],
[40.569991,0.551162],
[40.570252,0.551977],
[40.570447,0.551891],
[40.571653,0.555325],
[40.571490,0.555410],
[40.571686,0.556183],
[40.571523,0.556483],
[40.571295,0.556140],
[40.569763,0.551376],
[40.569893,0.551033],
[40.573022,0.548415],
[40.572859,0.547042],
[40.572599,0.545926],
[40.572338,0.545154],
[40.572142,0.544724],
[40.571719,0.544167],
[40.571588,0.543995],
[40.571197,0.543952],
[40.570936,0.543737],
[40.570708,0.543137],
[40.570741,0.542707],
[40.569926,0.541763],
[40.568459,0.543094],
[40.568393,0.543051],
[40.569600,0.541592],
[40.568980,0.540133],
[40.568165,0.539060],
[40.567578,0.538287],
[40.567187,0.537944],
[40.566666,0.537815],
[40.566111,0.537386],
[40.565720,0.537515],
[40.565622,0.537300],
[40.565199,0.537000],
[40.564775,0.537000],
[40.564318,0.536656],
[40.563960,0.536656],
[40.563340,0.536485],
[40.562982,0.536056],
[40.562362,0.535498],
[40.561743,0.535197],
[40.560895,0.535369],
[40.560471,0.535069],
[40.560145,0.534940],
[40.559526,0.534768],
[40.559004,0.534339],
[40.558091,0.533867],
[40.557374,0.533953],
[40.556754,0.533996],
[40.556200,0.533781],
[40.555157,0.533137],
[40.554765,0.532880],
[40.554244,0.532794],
[40.553787,0.532365],
[40.553363,0.532064],
[40.552548,0.532751],
[40.551765,0.532408],
[40.551798,0.532236],
[40.552613,0.532451],
[40.553005,0.531936],
[40.552352,0.530992],
[40.551635,0.530434],
[40.551081,0.531464],
[40.552026,0.533910],
[40.551929,0.534167],
[40.550820,0.531721],
[40.551244,0.530434],
[40.550037,0.529103],
[40.549189,0.528288],
[40.548505,0.527387],
[40.547559,0.526485],
[40.546222,0.525155],
[40.545178,0.524297],
[40.544200,0.523438],
[40.543059,0.522623],
[40.542341,0.522065],
[40.541200,0.521851],
[40.540906,0.521851],
[40.540547,0.522237],
[40.539699,0.522237],
[40.538949,0.522151],
[40.538591,0.521851],
[40.538004,0.521293],
[40.537416,0.520864],
[40.536699,0.520263],
[40.535818,0.519834],
[40.534775,0.519233],
[40.533927,0.518932],
[40.533274,0.518374],
[40.531937,0.517559],
[40.531382,0.517559],
[40.530926,0.517473],
[40.530502,0.517130],
[40.529980,0.517087],
[40.529164,0.516744],
[40.528610,0.516400],
[40.527827,0.516486],
[40.527142,0.516443],
[40.526848,0.516100],
[40.526261,0.515456],
[40.525674,0.515199],
[40.525283,0.515027],
[40.524761,0.515027],
[40.524239,0.514812],
[40.523488,0.514770],
[40.522673,0.514727],
[40.522151,0.514212],
[40.521694,0.514040],
[40.520813,0.514469],
[40.520422,0.514340],
[40.520259,0.513911],
[40.519835,0.513868],
[40.519150,0.514340],
[40.518889,0.513568],
[40.518562,0.513654],
[40.518334,0.513783],
[40.518236,0.513139],
[40.517812,0.512753],
[40.517127,0.512581],
[40.516638,0.513268],
[40.516409,0.512924],
[40.516148,0.513010],
[40.515985,0.513096],
[40.515300,0.511723],
[40.514778,0.511336],
[40.513930,0.511336],
[40.513506,0.510907],
[40.513473,0.509834],
[40.512983,0.509105],
[40.512690,0.508676],
[40.512200,0.508375],
[40.510275,0.507088],
[40.509819,0.507088],
[40.509492,0.507088],
[40.508448,0.505714],
[40.507143,0.505285],
[40.506360,0.505714],
[40.505838,0.505714],
[40.505251,0.505371],
[40.504598,0.505800],
[40.504533,0.504770],
[40.503945,0.504341],
[40.503358,0.504427],
[40.502836,0.503483],
[40.502053,0.502625],
[40.500943,0.502625],
[40.500486,0.501938],
[40.499573,0.501509],
[40.499116,0.500822],
[40.498463,0.499191],
[40.497549,0.498676],
[40.496766,0.499363],
[40.496179,0.498333],
[40.496048,0.497904],
[40.494938,0.498247],
[40.494677,0.497303],
[40.492915,0.495930],
[40.492262,0.496101],
[40.491871,0.495157],
[40.491022,0.494471],
[40.490271,0.494642],
[40.489455,0.493913],
[40.489390,0.493183],
[40.488966,0.492668],
[40.488705,0.491552],
[40.487791,0.490522],
[40.487367,0.490522],
[40.486975,0.490136],
[40.486485,0.490222],
[40.486094,0.490136],
[40.485539,0.489750],
[40.485473,0.489192],
[40.483711,0.488033],
[40.482830,0.487647],
[40.482340,0.487647],
[40.481622,0.486832],
[40.481263,0.486703],
[40.480740,0.486875],
[40.479631,0.485373],
[40.479174,0.485072],
[40.478717,0.485158],
[40.478162,0.485501],
[40.477541,0.485673],
[40.476921,0.485544],
[40.476660,0.485458],
[40.476725,0.484986],
[40.475452,0.484042],
[40.475387,0.483098],
[40.475942,0.482154],
[40.476497,0.480995],
[40.476921,0.480094],
[40.476595,0.480094],
[40.474669,0.483227],
[40.473853,0.483956],
[40.473265,0.483785],
[40.473330,0.483613],
[40.473853,0.483742],
[40.473820,0.482883],
[40.473591,0.482197],
[40.473036,0.481553],
[40.472645,0.481553],
[40.472351,0.481811],
[40.472514,0.482025],
[40.472318,0.482154],
[40.471339,0.481339],
[40.471469,0.481167],
[40.471763,0.481253],
[40.471829,0.480609],
[40.471339,0.479751],
[40.470621,0.479407],
[40.470098,0.479794],
[40.470131,0.479279],
[40.469674,0.478635],
[40.468760,0.478206],
[40.468401,0.478163],
[40.467552,0.477304],
[40.466931,0.476875],
[40.466180,0.476747],
[40.466050,0.477004],
[40.465691,0.477519],
[40.465136,0.478163],
[40.464352,0.478249],
[40.463601,0.478334],
[40.462752,0.478635],
[40.461805,0.478635],
[40.461022,0.478292],
[40.460401,0.478163],
[40.459487,0.477948],
[40.458964,0.477905],
[40.458213,0.477390],
[40.457136,0.476317],
[40.457397,0.475802],
[40.457756,0.476360],
[40.458409,0.477004],
[40.458997,0.477390],
[40.460956,0.477819],
[40.461217,0.477562],
[40.461544,0.477991],
[40.462393,0.478163],
[40.463568,0.477819],
[40.463275,0.476017],
[40.463601,0.475845],
[40.464025,0.477562],
[40.465103,0.477133],
[40.465919,0.475888],
[40.466409,0.475159],
[40.465103,0.473399],
[40.464776,0.473056],
[40.464091,0.472755],
[40.463601,0.471940],
[40.462948,0.471940],
[40.462524,0.472584],
[40.461838,0.473871],
[40.461740,0.474687],
[40.461871,0.474901],
[40.461675,0.475116],
[40.461544,0.475588],
[40.461315,0.475545],
[40.461446,0.474215],
[40.461707,0.473399],
[40.462230,0.472369],
[40.462621,0.471683],
[40.463405,0.470867],
[40.462883,0.470052],
[40.462360,0.470266],
[40.462001,0.470095],
[40.461838,0.469794],
[40.461903,0.469236],
[40.461609,0.468764],
[40.461217,0.468550],
[40.460956,0.468078],
[40.460662,0.467992],
[40.464687,0.488563],
[40.479585,0.498373],
[40.491511,0.508769],
[40.513662,0.524408],
[40.539426,0.533427],
[40.554726,0.545810],
[40.565780,0.555356],
[40.579209,0.569849],
[40.594246,0.586507],
[40.607862,0.601475]
],{
	fillOpacity: '0.2',
        fillColor: '#A4A4A4',
        color: '#A4A4A4'
	}).bindPopup('Zone 2');

var station1 = L.marker([40.776111, 0.747778]).bindPopup('Station 1');
var station2 = L.marker([40.60917, 0.65611]).bindPopup('Station 2');
var FUicon9 = L.icon({iconUrl: 'http://82.223.73.191:8080/FU9.png'});
var FUicon13 = L.icon({iconUrl: 'http://82.223.73.191:8080/FU13.png'});
var FUicon5 = L.icon({iconUrl: 'http://82.223.73.191:8080/FU5.png'});
var FUicon6 = L.icon({iconUrl: 'http://82.223.73.191:8080/FU6.png'});
var FUicon11 = L.icon({iconUrl: 'http://82.223.73.191:8080/FU11.png'});
var FUicon8 = L.icon({iconUrl: 'http://82.223.73.191:8080/FU8.png'});
var sample1= L.marker([40.618309999999994,0.6179083333333334],{icon: FUicon9}).bindPopup('Citclops app<br> FU colour: 9<br><img src=\"http://82.223.73.191:8080/samples/CE8F98591A6D5C24D.1411805191726.jpg\" width=\"60\"/><br><a href=\"http://82.223.73.191:8080/samples/CE8F98591A6D5C24D.1411805191726.jpg\" target=\"_blank\" />Enlarge image</a><br><a href=\"http://82.223.73.191:8080/samples/CE8F98591A6D5C24D.1411805191726.xml\" target=\"_blank\"/>Metadata</a>');
var sample2= L.marker([40.633677, 0.721877],{icon: FUicon13}).bindPopup('Citclops app<br> FU colour: 13<br><img src=\"http://82.223.73.191:8080/samples/C88944C5B7DEECF90.1403526748848.jpg\" width=\"60\"/><br><a href=\"http://82.223.73.191:8080/samples/C88944C5B7DEECF90.1403526748848.jpg\" target=\"_blank\" />Enlarge image</a><br><a href=\"http://82.223.73.191:8080/samples/C88944C5B7DEECF90.1403526748848.xml\" target=\"_blank\"/>Metadata</a>');	
var sample3= L.marker([40.633221, 0.691836],{icon: FUicon5}).bindPopup('Citclops app<br> FU colour: 5<br><img src=\"http://82.223.73.191:8080/samples/CEF0DB06B7597C71F.1405708101153.jpg\" width=\"60\"/><br><a href=\"http://82.223.73.191:8080/samples/CEF0DB06B7597C71F.1405708101153.jpg\" target=\"_blank\" />Enlarge image</a><br><a href=\"http://82.223.73.191:8080/samples/CEF0DB06B7597C71F.1405708101153.xml\" target=\"_blank\"/>Metadata</a>');
var sample4= L.marker([40.619476, 0.654500],{icon: FUicon6}).bindPopup('Citclops app<br> FU colour: 6<br><img src=\"http://82.223.73.191:8080/samples/CD4C08E3873F153AD.1402044303159.jpg\" width=\"60\"/><br><a href=\"http://82.223.73.191:8080/samples/CD4C08E3873F153AD.1402044303159.jpg\" target=\"_blank\" />Enlarge image</a><br><a href=\"http://82.223.73.191:8080/samples/CD4C08E3873F153AD.1402044303159.xml\" target=\"_blank\"/>Metadata</a>');
var sample5= L.marker([40.622733, 0.612872],{icon: FUicon9}).bindPopup('Citclops app<br> FU colour: 9<br><img src=\"http://82.223.73.191:8080/samples/CAE619A365EEC53BC.1397998789398.jpg\" width=\"60\"/><br><a href=\"http://82.223.73.191:8080/samples/CAE619A365EEC53BC.1397998789398.jpg\" target=\"_blank\" />Enlarge image</a><br><a href=\"http://82.223.73.191:8080/samples/CAE619A365EEC53BC.1397998789398.xml\" target=\"_blank\"/>Metadata</a>');
var sample6= L.marker([40.635240, 0.683596],{icon: FUicon11}).bindPopup('Citclops app<br> FU colour: 11<br><img src=\"http://82.223.73.191:8080/samples/C85725CB430C2378B.1409210785008.jpg\" width=\"60\"/><br><a href=\"http://82.223.73.191:8080/samples/C85725CB430C2378B.1409210785008.jpg\" target=\"_blank\" />Enlarge image</a><br><a href=\"http://82.223.73.191:8080/samples/C85725CB430C2378B.1409210785008.xml\" target=\"_blank\"/>Metadata</a>');
var sample7= L.marker([40.602396, 0.609374],{icon: FUicon5}).bindPopup('Citclops app<br> FU colour: 5<br><img src=\"http://82.223.73.191:8080/samples/CB97753B376F8ED9F.1404900577002.jpg\" width=\"60\"/><br><a href=\"http://82.223.73.191:8080/samples/CB97753B376F8ED9F.1404900577002.jpg\" target=\"_blank\" />Enlarge image</a><br><a href=\"http://82.223.73.191:8080/samples/CB97753B376F8ED9F.1404900577002.xml\" target=\"_blank\"/>Metadata</a>');
var sample8= L.marker([40.600032, 0.636489],{icon: FUicon8}).bindPopup('Citclops app<br> FU colour: 8<br><img src=\"http://82.223.73.191:8080/samples/CB97753B376F8ED9F.1400149761297.jpg\" width=\"60\"/><br><a href=\"http://82.223.73.191:8080/samples/CB97753B376F8ED9F.1400149761297.jpg\" target=\"_blank\" />Enlarge image</a><br><a href=\"http://82.223.73.191:8080/samples/CB97753B376F8ED9F.1400149761297.xml\" target=\"_blank\"/>Metadata</a>');

// Temperorary have removed station one station1
var stations = L.layerGroup([station2,sample1,sample2,sample3,sample4,sample5,sample6,sample7,sample8]);



var risk = L.featureGroup([colour2,colour2b]);
//risk.bringToBack();
var risk2 = L.featureGroup([colour3,colour3b]);
//.bringToBack();

                                                
         

      

var beachIcon = L.icon({
      iconUrl: '/static/img/beach.png',
	iconSize: [30, 30], // size of the icon
	});
	
var fishingIcon = L.icon({
iconUrl: '/static/img/pesca.png',
iconSize: [30, 30], // size of the icon
});
	
var portIcon = L.icon({
iconUrl: '/static/img/port.png',
iconSize: [30, 30], // size of the icon
});
	
var stationIcon = L.icon({
iconUrl: '/static/img/station.png',
iconSize: [30, 30], // size of the icon
});
	
var parkIcon = L.icon({
iconUrl: '/static/img/park.png',
iconSize: [30, 30], // size of the icon
});



var tourism1 = L.marker([40.617690, 0.730522], {icon: beachIcon}).bindPopup('Beach');
var tourism2 = L.marker([40.614433, 0.593536], {icon: beachIcon}).bindPopup('Beach');
var tourism3 = L.marker([40.611761, 0.589245], {icon: beachIcon}).bindPopup('Beach');
var tourism4 = L.marker([40.606614, 0.584181], {icon: beachIcon}).bindPopup('Beach');
var tourism5 = L.marker([40.605571, 0.582293], {icon: beachIcon}).bindPopup('Beach');
var tourism6 = L.marker([40.609546, 0.587185], {icon: beachIcon}).bindPopup('Beach');
var pesca1 = L.marker([40.637559, 0.741723], {icon: fishingIcon}).bindPopup('Fisheries');
var pesca2 = L.marker([40.637037, 0.693658], {icon: fishingIcon}).bindPopup('Fisheries');
var pesca3 = L.marker([40.622186, 0.629457], {icon: fishingIcon}).bindPopup('Fisheries');
var pesca4 = L.marker([40.577610, 0.595124], {icon: fishingIcon}).bindPopup('Fisheries');
var pesca5 = L.marker([40.586475, 0.643876], {icon: fishingIcon}).bindPopup('Fisheries');
var port = L.marker([40.618179, 0.597184], {icon: portIcon}).bindPopup('Nautical port');
var station = L.marker([40.616485, 0.593966], {icon: stationIcon}).bindPopup('Nautical station');
var environment1 = L.marker([40.616485, 0.593966], {icon: parkIcon}).bindPopup('National park');

var artisan = L.featureGroup([pesca3,zone1]);
var environment = L.layerGroup([environment1]);
var industry = L.layerGroup([port,station,pesca1,pesca2,pesca4,pesca5,colour1,colour1b,zone1]);
var tourism = L.layerGroup([tourism1,tourism2,tourism3,tourism4,tourism5,tourism6,zone2]);
var health = L.featureGroup([tourism1,tourism2,tourism3,tourism4,tourism5,tourism6,colour1,colour1b,zone1]);

kmlLayer.bringToFront();
