import React from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from "react-helmet";
import logo from "../CompassionConnectionLogo.png";
import "./landing.css";

function Landing() {
	return(
		<div>
			<Helmet>
              <title>Compassion Connection Oahu</title>
              	<meta name="description" content="Volunteer discovery platform for the island of Oahu. Find volunteer opportunities all over the island for any type of community service. From beach cleanups to animal shelters you can find everything you need here!" />
              	<meta name="keywords" content="Volunteer, Hawaii, Compassion, Connection, Oahu" />
        	</Helmet>
        	<div className="landing_wrapper">
				<div className="landing_links">
					<Link to="/schedule" className = "navs">
			            <h2 className="landing">Find a date/time</h2>
			        </Link>
		        </div>
		        <div className="landing_links">
		        	<Link to="/discover" className = "navs">
			            <h2 className="landing">Discover an organization</h2>
			        </Link>
		        </div>
		        <div className="landing_links">
		          	<Link to="/about" className = "navs">
			            <h2 className="landing">About us!</h2>
			       	</Link>
		        </div>
		        <div className="landing_links">
		          	<Link to="/donate" className = "navs">
			            <h2 className="landing">Donate</h2>
			        </Link>
		        </div>
		    </div>
	        <img className="logo" src={logo} alt="Logo"/>
		</div>
	);
}

export default Landing;