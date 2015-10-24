/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './MapContainer.css';
import withStyles from '../../decorators/withStyles';

@withStyles(styles)
class MapContainer extends Component {

  componentDidMount() {

console.log('Map did mount');


	var map = this.map = L.map(ReactDOM.findDOMNode(this.refs.map), {
	                     fullscreenControl: false,
	                     fullscreenControlOptions: {
	                       position: 'topleft'
	                     }
	                   }).setView([38.736946, -9.142685], 15);

	// http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
	// http://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaG5pa3VwZXQiLCJhIjoiWG1sR0dtcyJ9.mcuSllEC2oyCC49UP6_PgA', {
	  maxZoom: 18,
		attribution: 'Skenario Lab\'s,  Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
					'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
					'Imagery © <a href="http://mapbox.com">Mapbox</a>'
	}).addTo(map); 	
  
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
