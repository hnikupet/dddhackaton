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
    this.buildingLayers = null;;
}

static defaultState = {
    year: 2015,
};

risks = {
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

onYearChange() {
  	var tmp = ReactDOM.findDOMNode(this.refs.year).value.trim();
  	this.setState({year:tmp})
  	let that = this;
  	this.buildingLayers.eachLayer(function(layer) {

		let style = that.layerStyle(layer.feature,tmp);
		layer.setStyle(style);
  	})
}

getPopup(feature, riskLevel, risks) {

	let buildingName = 'Building '+feature.properties.Id;
	if (feature.properties.Addr_stree != null) {
		buildingName = feature.properties.Addr_stree;
		if (feature.properties.Addr_house) {
			buildingName = buildingName+' '+feature.properties.Addr_house;
		}
	} 

	var repairYear = this.getRepairYear(feature);

	let txt = '<h2>'+buildingName+'</h2>Build Year: '+feature.properties.Start_date+'<br />Repaired: '+repairYear+'<br />Risk: '+riskLevel.toFixed(2)+' / 10';
	txt = txt + '<h2>Maintenance plan</h2>';
	txt = txt + '<table>';	
	txt = txt + '<tr><th>Facade</th><td>'+(parseInt(repairYear) + parseInt(this.risks.brickFacade.life)+'</td></tr>');
	txt = txt + '<tr><th>Steel Work</th><td>'+(parseInt(repairYear) + parseInt(this.risks.secondaryStructuralSteelwork.life)+'</td></tr>');
	txt = txt + '<tr><th>Door & Window Framing</th><td>'+(parseInt(repairYear) + parseInt(this.risks.doorAndWindowFraming.life)+'</td></tr>');
	txt = txt + '<tr><th>Load Bearing Masorny</th><td>'+(parseInt(repairYear) + parseInt(this.risks.loadBearingMasonry.life)+'</td></tr>');
	txt = txt + '<tr><th>Non Load Bearing Masorny</th><td>'+(parseInt(repairYear) + parseInt(this.risks.nonloadBearingConcreteWalls.life)+'</td></tr>');
	txt = txt + '<tr><th>Fire Insulation</th><td>'+(parseInt(repairYear) + parseInt(this.risks.fireInsulation.life)+'</td></tr>');
	txt = txt + '<tr><th>Tile Roof</th><td>'+(parseInt(repairYear) + parseInt(this.risks.tileRoof.life)+'</td></tr>');
	txt = txt + '<tr><th>Heating Pipes</th><td>'+(parseInt(repairYear) + parseInt(this.risks.heatingPipes.life)+'</td></tr>');
	txt = txt + '<tr><th>Sewer Pipes</th><td>'+(parseInt(repairYear) + parseInt(this.risks.sewerPipes.life)+'</td></tr>');
	txt = txt + '</table>';	
	
	return txt;
}


getRepairYear (feature) {
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
		return repairYear;
}	

getRisk (repairYear,risk,currentYear) {
	if (currentYear == undefined) {
		currentYear = 2015;
	}

    var r = this.risks[risk];
    var lvl = 0;
    if ((currentYear-r.life) > repairYear) {
      lvl = (currentYear-r.life-repairYear) * r.riskLevel;
    } 
    if (lvl < 0)
    	lvl = 0;

    if (lvl > 5)
    	lvl = 5;

    var totalRisk = lvl * r.severity / 4;

    return {riskLevel:lvl,totalRisk:totalRisk};
}

hslToRgb (h, s, l) {
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

numberToColorHsl (risk) {
    // as the function expects a value between 0 and 1, and red = 0° and green = 120°
    // we convert the input to the appropriate hue value
    var i = 100 - (risk * 10);
    var hue = i * 1.2 / 360;
    // we convert hsl to rgb (saturation 100%, lightness 50%)
    var rgb = this.hslToRgb(hue, 1, .5);
    // we format to css value and return
    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'; 
}

calculateRisk (feature,currentYear) {
	var repairYear = this.getRepairYear(feature);
	var risk = this.getRisk(repairYear,'brickFacade',currentYear);
	return risk.totalRisk;
}

layerStyle (feature,currentYear) {
	return {color: this.numberToColorHsl(this.calculateRisk(feature,currentYear))}
}


componentDidMount() {


	var map = this.map = L.map(ReactDOM.findDOMNode(this.refs.map), {
	                     fullscreenControl: false,
	                     fullscreenControlOptions: {
	                       position: 'topleft'
	                     }
	                   }).setView([40.7346945, -74.0044805], 13);


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

 	let that = this;


	let bindLayerPopup = function (feature,layer) {

		var riskLevel = that.calculateRisk(feature);
		var txt = that.getPopup(feature,riskLevel);
	    layer.bindPopup(txt);
	}


	$.getJSON('/buildingData.json', function(data) {
		that.buildingLayers = L.geoJson(data,{onEachFeature:bindLayerPopup, style:that.layerStyle.bind(that)}).addTo(map);
	});  


	let floodStyle = function (feature, layer) {
		return {color: 'blue', fill:'blue'}	
	}
	
	let floodbindLayerPopup = function (feature, layer) {
	    layer.bindPopup('<h2>Flood Risk</h2><b>'+feature.properties.FLD_ZONE+'</b><br /><h3>Description</h3>'+calculateFloodDescription(feature.properties.FLD_ZONE));
	}
	
	let calculateFloodDescription = function(featureName) {
		switch(featureName){
			case "A": return "1 annual % - floodplains";
			case "AE":return "1 annual % - floodplains";
			case "AH":return "1 annual % - shallow flooding (usually areas of ponding) where average depths are between 1 and 3 feet.";
			case "AO":return "1 annual % - shallow flooding (usually sheet flow on sloping terrain) where average depths are between 1 and 3 feet.";
			case "A99":return "1 annual % - floodplain that will be protected by a Federal flood protection system where construction has reached specified statutory milestones.";
			case "V":return "1 annual % - coastal floodplains that have additional hazards associated with storm waves.";
			case "VE":return "1 annual % - coastal floodplains that have additional hazards associated with storm waves.";
			case "X":return "1/0.2 annual % - flooding where average depths are less than 1 foot, the contributing drainage area is less than 1 square mile,";
			case "D":return "1 annual % - flood hazards are undetermined but possible";
			default: return "percentual flooding";
		}
		return "Test";
	}
	
	var geoJsonFlood = {};
	geoJsonFlood.type = 'FeatureCollection';
	geoJsonFlood.features = [];
	var floodLayer;

	//fetch flood data total flood or only the buildings that intersect the floods.
	$.getJSON('http://localhost:8080/hack/flood?pagesize=1000', function(data) {
		data._embedded['rh:doc'].forEach(function(d){
			geoJsonFlood.features.push(d.flood);
		});
		floodLayer = L.geoJson(geoJsonFlood,{onEachFeature:floodbindLayerPopup, style:floodStyle})
		var overlayMaps = {"Flood": floodLayer};
		L.control.layers(null, overlayMaps).addTo(map);	
	});


  }

  render() {
    var method = this.onYearChange.bind(this);
    return (
	    <div className="row">
	        <div className="col-sm-4 mapcontainer" id="map" ref="map"></div>
	        <div>
        		<h1 className="middleDiv" >
        			<span>Year </span>
        			<input type="number" onChange={method} size="4" defaultValue="2015" min="2010" max="2100" value={this.state.year} id="year" ref="year" className="form-control"/>
	    		</h1>
	    	</div>
	    </div>
    );
  }

}

export default MapContainer;
