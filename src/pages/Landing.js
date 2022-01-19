import React from 'react';
import {Link} from 'react-router-dom';
import logo from "../CompassionConnectionLogo.png";

function Landing() {
	return(
		<div>
			<div className="landing_links">
				<Link to="/schedule" className = "navs">
		            <h2>Find a date/time</h2>
		        </Link>
	        </div>
	        <div className="landing_links">
	        	<Link to="/discover" className = "navs">
		            <h2>Discover an organization</h2>
		        </Link>
	        </div>
	        <div className="landing_links">
	          	<Link to="/about" className = "navs">
		            <h2>About us!</h2>
		       	</Link>
	        </div>
	        <div className="landing_links">
	          	<Link to="/donate" className = "navs">
		            <h2>Donate</h2>
		        </Link>
	        </div>
	        <img className="logo" src={logo} alt="Logo"/>
		</div>
	);
}

export default Landing;