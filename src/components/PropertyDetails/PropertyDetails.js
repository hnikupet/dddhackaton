/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './PropertyDetails.css';
import withStyles from '../../decorators/withStyles';

@withStyles(styles)
class PropertyDetails extends Component {

  render() {    
    return (
    	<div className="ContentPage-container">
		    <div className="row">
		    	<h2>Results</h2>
		        <div className="col-sm-4" id="propertyDetails">
		        	<table className="table table-bordered">
			        	<tbody>
			        		<tr>
			        			<th>
			        				Address
			        			</th>
			        			<td>
			        				Wall Street 1
			        			</td>
			        		</tr>
			        		<tr>
			        			<th>
			        				Floors
			        			</th>
			        			<td>
			        				67
			        			</td>
			        		</tr>
			        		<tr>
			        			<th>
			        				Build Year
			        			</th>
			        			<td>
			        				2008
			        			</td>
			        		</tr>
			        		<tr>
			        			<th>
			        				Risk Level
			        			</th>
			        			<td>
			        				Not so much...
			        			</td>
			        		</tr>
		        		</tbody>	
		        	</table>

		        </div>
		    </div>
	    </div>
    );
  }

}

export default PropertyDetails;
