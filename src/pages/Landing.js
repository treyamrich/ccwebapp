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
			  <Carousel.Item>
        			<img className="d-block w-100" src={oahu} alt="Banner2"/>
			  </Carousel.Item>
			  <Carousel.Item>
        			<img className="d-block w-100" src={garbage} alt="Banner2"/>
			  </Carousel.Item>
        	</Carousel>
        	<Container style={{paddingBottom:"50px", borderBottom:"1px solid #EFEFEF"}} className="container-spacing">
        		<Row>
        			<Col md={4}>
        				<h3>Our Founder</h3>
        				<p className="info">
        					Welcome to Compassion Connection, and thank you for taking the time out of your day to check us out! My name is Timothy Newton, 
        					and I am the founder of this organization. For so long, I wanted to make a difference in my community, but I found getting in touch 
        					with places to volunteer can be very difficult. I created this platform to solve issues I was presented with and became familiar with 
        					in my own process of attempting to get involved helping my community. I want to do good; I want to make a difference, but how? I was 
							inspired to bring a platform into fruition that is both pragmatic and accessible, but most importantly simple. If we can increase the 
							direct communication between organization leaders and potential volunteers, as well as provide a list of local organizations and their 
							mission statements and a calendar with dated volunteer opportunities to get involved with, collectively we will all be able to make a 
							larger impact in our community.
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
							This is only the beginning of a much larger project to connect the entire world. Our earth is broken in so many ways and the only logical 
							answer is to get everyone on board with doing their part! If we can make volunteering a regular and habitual thing for everyone, who knows 
							the limits of success we can having in solving any of the worlds issues. Everyone says money is the only way but I truly believe that people 
							are the only way, and it is going to be by each and every single one of our own wills that significant change can happen in this world. 
							I ask you to take a look and to try different options out too see what works best for you! Tell your friends and family! Be your own butterfly 
							effect for helping humanity and this planet.
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
				        <Link to="/discover"> <Button className ="schedule mb-5">Discover Organizations</Button></Link>
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
								<li><a href="/" className = "footer-link"> Instagram </a></li>
								<li><a href="/" className = "footer-link"> Twitter </a></li>
								<li><a href="/" className = "footer-link"> Tiktok </a></li>
							</ul>
						</Col>
	        			<Col>
					        <div className="footer">Donate</div>
					        <ul>
								<li><a href="https://cash.app/$compassionconnect" target="_blank" className = "footer-link"> Cash app </a></li>
								<li><a href="/" className = "footer-link"> Patreon </a></li>
							</ul>
	        			</Col>       		
	        		</Row>
	        	</Container>
			</footer>
		</div>
	);
}
 
export default Landing;