/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jQuery';
import styles from './MapContainer.css';
import withStyles from '../../decorators/withStyles';

@withStyles(styles)
class MapContainer extends Component {

  componentDidMount() {


	var map = this.map = L.map(ReactDOM.findDOMNode(this.refs.map), {
	                     fullscreenControl: false,
	                     fullscreenControlOptions: {
	                       position: 'topleft'
	                     }
	                   }).setView([40.7146945, -74.0044805], 18);




	// http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
	// http://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png
	L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaG5pa3VwZXQiLCJhIjoiWG1sR0dtcyJ9.mcuSllEC2oyCC49UP6_PgA', {
	  maxZoom: 18,
		attribution: 'Skenario Lab\'s,  Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
					'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
					'Imagery © <a href="http://mapbox.com">Mapbox</a>'
	}).addTo(map); 	

	var geoJsonData = {};
	geoJsonData.type = 'FeatureCollection';
	geoJsonData.features = [];


	let hslToRgb = function (h, s, l) {
	    var r, g, b;

	    if(s == 0){
	        r = g = b = l; // achromatic
	    }else{
	        function hue2rgb(p, q, t){
	            if(t < 0) t += 1;
	            if(t > 1) t -= 1;
	            if(t < 1/6) return p + (q - p) * 6 * t;
	            if(t < 1/2) return q;
	            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	            return p;
	        }

	        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	        var p = 2 * l - q;
	        r = hue2rgb(p, q, h + 1/3);
	        g = hue2rgb(p, q, h);
	        b = hue2rgb(p, q, h - 1/3);
	    }

	    return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
	}

	let numberToColorHsl = function (i) {
	    // as the function expects a value between 0 and 1, and red = 0° and green = 120°
	    // we convert the input to the appropriate hue value
	    var hue = i * 1.2 / 360;
	    // we convert hsl to rgb (saturation 100%, lightness 50%)
	    var rgb = hslToRgb(hue, 1, .5);
	    // we format to css value and return
	    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'; 
	}

	let bindLayerPopup = function (feature, layer) {
	    layer.bindPopup('Build Year:'+feature.properties.start_date+'<br />Risk:'+calculateRisk(feature,layer));
	}

	let calculateRisk = function(feature, layer) {
		let age = 2015 - feature.properties.start_date;
		let risk = 100 - age;

		if (risk > 100)
			risk = 100;

		if (risk < 0)
			risk = 0;

		return risk;
	}

	let layerStyle = function (feature, layer) {
		return {color: numberToColorHsl(calculateRisk(feature, layer))}
	}

	$.getJSON('http://localhost:8080/hack/places?pagesize=1000', function(data) {
		data._embedded['rh:doc'].forEach(function(d){
			geoJsonData.features.push(d.build);
		});
		L.geoJson(geoJsonData,{onEachFeature:bindLayerPopup, style:layerStyle}).addTo(map);

	});  
  }

  render() {
    console.log('map container');
    
    return (
	    <div className="row">
	        <div className="col-sm-4 mapcontainer" id="map" ref="map"></div>
	        <div id="sidebar">
	         
	        </div>
	    </div>
    );
  }

}

export default MapContainer;
