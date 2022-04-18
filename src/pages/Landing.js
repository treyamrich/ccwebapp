import React from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from "react-helmet";
import banner from "../graphics/cc_banner.png";
import oahu from "../graphics/oahu.jpg";
import garbage from "../graphics/garbage1.jpg";
import hand_connect from "../graphics/hand_connection.jpg";
import { Image, Carousel, Button, Container, Row, Col } from 'react-bootstrap';
import "../styles/landing.css";

function Landing() {
	return(
		<div>
			<Helmet>
              <title>Compassion Connection Oahu</title>
              	<meta name="description" content="Volunteer discovery platform for the island of Oahu. Find volunteer opportunities all over the island for any type of community service. From beach cleanups to animal shelters you can find everything you need here!" />
              	<meta name="keywords" content="Volunteer, Hawaii, Compassion, Connection, Oahu" />
        	</Helmet>

        	<Carousel style={{marginTop:"56px"}} fade>
        		<Carousel.Item>
        			<img className="d-block w-100" src={banner} alt="Banner"/>
			  </Carousel.Item>
			  <Carousel.Item id="oahu" className="slideshow-container">
        			<img className="d-block w-100" src={oahu} alt="Banner2"/>
			  </Carousel.Item>
			  <Carousel.Item id="garbage" className="slideshow-container">
        			<img className="d-block w-100" src={garbage} alt="Banner2"/>
			  </Carousel.Item>
        	</Carousel>
        	<Container style={{paddingBottom:"50px", borderBottom:"1px solid #EFEFEF"}} className="container-spacing">
        		<Row>
        			<Col md={4}>
        				<h3>Our Founder</h3>
        				<p className="info">Welcome to Compassion Connection and thank you for taking the time out of your day to check us out. 
							My name is Timothy Newton and I am the founder of this organization. 
							For so long I wanted to make a difference in my community but getting in touch with places to volunteer can be very difficult. 
							I created this platform to solve the very same issue for myself that you're probably having right now. 
							I want to do good, I want to make a difference but how? Well that is where this idea for a solution came into play.
						</p>
        			</Col>
        			<Col md={4}>
        				<h3>The Platform</h3>
        				<p className="info">
							Compassion Connection is a one stop shop when you want to become involved in chairty work of almost any kind. 
							I have tried my hardest to make it as easy as possible to connect people with what they are passionate about, 
							and hand out opportunities on a silver platter for making real change on this beautiful island of O’ahu. 
							I give to you the gift of simplicity in navigating  philanthropy and what ever it is you desire to align yourself with it is probably here!
						</p>
        			</Col>
        			<Col md={4}>
        				<h3> Mission </h3>
        				<p className="info">
							This is only the beginning though of a much larger project to connect the entire world. 
							Our earth is broken in so many ways and the only logical answer is to get everyone on board with doing their part. 
							If we can make volunteering a regular and habitual thing for everyone who knows the limits of success we can having 
							in solving any of the worlds issues. Everyone says money is the only way but I truly believe that people are the only way 
							and it is going to be by each and every single one of our own wills that significant change will happen in this world for the better. 
							I ask you to take a look and to try different options out too see what works best for you! 
							Tell your friends and family and be your own butterfly effect for helping humanity and this planet.
						</p>
        			</Col>
        		</Row>
			</Container>
			<Container className="container-spacing">
				<Row>
					<Col className="col" md={8}>
				        <h3>Volunteer Today</h3>
				        <p> I don't know about you guys but our beaches here are getting dirty!
				        	Are you tired our island's beautiful beaches from being ruined? 
				        	From beach cleanups to food drives, the opportunities on this platform
				        	are limitless. Find volunteer opportunities and events that
				        	are currently being hosted by your local organizations.</p>
				        <Link to="/schedule"> <Button className ="schedule mb-5">Find a Date/Time </Button></Link>

				        <h3>Discover</h3>
        				<p> 
        					Find more information on your local organizations today!
        				</p>
				        <Link to="/discover"> <Button className ="schedule">Discover Organizations</Button></Link>
			        </Col>
			        <Col md={4}>
			        	<Image src={hand_connect} style={{width: 300}} rounded/>
        				
        			</Col>
        		</Row>
			</Container>
			<footer>
				<Container>
					<Row lg={6} md={4} xs={2} className="row-footer">
						<Col>
							<div className="footer">Social Media</div>
							<ul>
								<li><Link to="/" className = "footer-link"> Instagram </Link></li>
								<li><Link to="/" className = "footer-link"> Twitter </Link></li>
								<li><Link to="/" className = "footer-link"> Tiktok </Link></li>
							</ul>
						</Col>
	        			<Col>
					        <div className="footer">Donate</div>
					        <ul>
								<li><Link to="/" className = "footer-link"> Cash app </Link></li>
								<li><Link to="/" className = "footer-link"> Venmo </Link></li>
								<li><Link to="/" className = "footer-link"> Patreon </Link></li>
							</ul>
	        			</Col>       		
	        		</Row>
	        	</Container>
			</footer>
		</div>
	);
}
 
export default Landing;