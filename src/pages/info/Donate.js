import React from 'react';
import {Helmet} from "react-helmet";
import logo from "../../CompassionConnectionLogo.png";
import "./info.css";

function Donate() {
	return(
		<div style={{textAlign:"center"}}>
			<Helmet>
              <title>CC Oahu - About</title>
              <meta name="description" content="Donations are much welcomed and help us keep the platform running." />
              <meta name="keywords" content="Donate, Compassion, Connection, Oahu, Hawaii" />
        	</Helmet>
			<h1> Donations </h1>
			<div className="info">
				<p className="info">
					THANK YOU FOR DONATING!

					Do you want to know exactly where your money is headed? 
					All of the proceeds donating through this platform will go to the following things: website improvements, 
					registration portal enhancements, application design, facilitation of meetings with different organizations 
					and investing in growing Compassion Connection to an even larger scale. We are so grateful for anything you were able 
					to donate today and we can assure you that this truly is going to an amazing cause for long term change!
				</p>
			</div>
			<ul>
				<li>Link 1</li>
				<li>Link 2</li>
				<li>Link 3</li>
			</ul>
			<img className="logo" src={logo} alt="Logo"/>
		</div>
	);
}

export default Donate;