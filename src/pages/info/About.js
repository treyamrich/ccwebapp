import React from 'react';
import logo from "../../CompassionConnectionLogo.png";
import {Helmet} from "react-helmet";

function About() {
	return(
		<div style={{textAlign:"center"}}>
			<Helmet>
              <title>CC Oahu - About</title>
              <meta name="description" content="Learn about our mission at Compassion Connection Oahu." />
              <meta name="keywords" content="About, Compassion, Connection, Oahu, Hawaii" />
        	</Helmet>
			<h1 style={{color: "#808000"}}>Compassion Connection</h1>
			<p style={{width:"50%", margin:"auto", marginBottom:"20px"}}>
				Welcome to compassion connection and thank you for taking the time out of your day to check us out. 
				My name is Timothy Newton and I am the founder of this organization. 
				For so long I wanted to make a difference in my community but getting in touch with places to volunteer can be very difficult. 
				I created this platform to solve the very same issue for myself that you're probably having right now. 
				I want to do good, I want to make a difference but how? Well that is where this idea for a solution came into play. 
				Compassion connection is a one stop shop when you want to become involved in chairty work of almost any kind. 
				I have tried my hardest to make it as easy as possible to connect people with what they are passionate about, 
				and hand out opportunities on a silver platter for making real change on this beautiful island of O’ahu. 
				I give to you the gift of simplicity in navigating  philanthropy and what ever it is you desire to align yourself with it is probably here! 
				This is only the beginning though of a much larger project to connect the entire world. 
				Our earth is broken in so many ways and the only logical answer is to get everyone on board with doing their part. 
				If we can make volunteering a regular and habitual thing for everyone who knows the limits of success we can having 
				in solving any of the worlds issues. Everyone says money is the only way but I truly believe that people are the only way 
				and it is going to be by each and every single one of our own wills that significant change will happen in this world for the better. 
				I ask you to take a look and to try different options out too see what works best for you! 
				Tell your friends and family and be your own butterfly effect for helping humanity and this planet.
			</p>
			<img className="logo" src={logo} alt="Logo"/>
		</div>
	);
}

export default About;