/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Risk from './Risk';
import styles from './MapContainer.css';
import withStyles from '../../decorators/withStyles';

@withStyles(styles)
class MapContainer extends Component {
  

constructor(props) {
    super(props);
    this.state = {year: props.year};
}

static defaultState = {
    year: 2015,
};

onYearChange() {
  	var tmp = ReactDOM.findDOMNode(this.refs.year).value.trim();
  	this.setState({year:tmp})
}

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

	let numberToColorHsl = function (risk) {
	    // as the function expects a value between 0 and 1, and red = 0° and green = 120°
	    // we convert the input to the appropriate hue value
	    var i = 100 - (risk * 10);
	    var hue = i * 1.2 / 360;
	    // we convert hsl to rgb (saturation 100%, lightness 50%)
	    var rgb = hslToRgb(hue, 1, .5);
	    // we format to css value and return
	    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'; 
	}

	var risks = {
      brickFacade:{life:40,riskLevel:0.15,severity:7},
      secondaryStructuralSteelwork:{life:60,riskLevel:0.05,severity:8},
      doorAndWindowFraming:{life:25,riskLevel:0.25,severity:1},
      loadBearingMasonry:{life:60,riskLevel:0.2,severity:8},
      nonloadBearingConcreteWalls:{life:60,riskLevel:0.2,severity:5},
      fireInsulation:{life:60,riskLevel:0.12,severity:8},
      tileRoof:{life:45,riskLevel:0.12,severity:5},
      heatingPipes:{life:50,riskLevel:0.15,severity:5},
      sewerPipes:{life:50,riskLevel:0.2,severity:5},
    };

    var getRisk = function (buildYear,risk) {
	    var r = risks[risk];
	    var lvl = 0;
	    if ((2015-r.life) > buildYear) {
	      lvl = (2015-r.life-buildYear) * r.riskLevel;
	    } 
	    if (lvl < 0)
	    	lvl = 0;

	    if (lvl > 5)
	    	lvl = 5;

	    var totalRisk = lvl * r.severity / 4;

	    return {riskLevel:lvl,totalRisk:totalRisk};
  	}
 


	let bindLayerPopup = function (feature, layer) {
		console.log(feature.properties);
		let buildingName = 'Building '+feature.properties.Id;
		if (feature.properties.Addr_stree != null) {
			buildingName = feature.properties.Addr_stree;
			if (feature.properties.Addr_house) {
				buildingName = buildingName+' '+feature.properties.Addr_house;
			}
		} 
		var repairDate = '';
		if (feature.properties.Job_date != null) {
			repairDate = feature.properties.Job_date.substring(6,10);
		}

	    layer.bindPopup('<h2>'+buildingName+'</h2>Build Year: '+feature.properties.Start_date+'<br />Repaired: '+repairDate+'<br />Risk: '+calculateRisk(feature,layer).toFixed(2)+' / 10');
	}

	let calculateRisk = function(feature, layer) {
		var repairYear = null;
		if (feature.properties.Job_date != null) {
			repairYear = feature.properties.Job_date.substring(6,10);
		} 

		if (repairYear == null && feature.properties.Start_date != null) {
			if (feature.properties.Start_date < 1950) {
				repairYear = 1950;
			} else {
				repairYear = feature.properties.Start_date;
			}
		} else {
			repairYear = 2000;
		}

		var risk = getRisk(repairYear,'brickFacade');
		return risk.totalRisk;
	}

	let layerStyle = function (feature, layer) {
		return {color: numberToColorHsl(calculateRisk(feature, layer))}
	}

	$.getJSON('/buildingData.json', function(data) {
		L.geoJson(data,{onEachFeature:bindLayerPopup, style:layerStyle}).addTo(map);

	});  
  }

  render() {
    console.log('map container',this.state);
    var method = this.onYearChange.bind(this);
    return (
	    <div className="row">
	        <div className="col-sm-4 mapcontainer" id="map" ref="map"></div>
	        <div>
        		<h1 className="middleDiv" >
        			<span>Year </span>
        			<input type="number" onChange={method} size="4" defaultValue="2015" min="2010" max="2050" value={this.state.year} id="year" ref="year" className="form-control"/>
	    		</h1>
	    	</div>
	    </div>
    );
  }

}

export default MapContainer;
