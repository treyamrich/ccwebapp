import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { listEvents } from '../../graphql/queries.js';
import { formatDate } from '../../utility/DateTimeFunctions.js';
import { Container, Row, Col } from 'react-bootstrap';
import "../../styles/events.css";

function Dashboard({email}) {

	const [events, setEvents] = useState([]);
	const [prevEvents, setPrevEvents] = useState([]);

	//Fetch events
	async function fetchEvents() {
		try {
			var today = formatDate(new Date());
			const eventData = await API.graphql({query: listEvents, variables:{ filter: {volunteers: {contains: email}, date: {ge: today}}}});
			const prevEventData = await API.graphql({query: listEvents, variables:{ filter: {volunteers: {contains: email}, date: {lt: today}}}});
			setEvents(eventData.data.listEvents.items);
			setPrevEvents(prevEventData.data.listEvents.items);
		} catch(err) {
			alert("Error fetching events.");
		}
	}

	useEffect(()=>{
		fetchEvents();
	}, []);
	
	return(
		<div>
			<Container className="main-container">
				<Row className="mb-4">
					<Row className="section-header"><h1>Enrolled events</h1></Row>
					<Container className="events-wrapper">
					{events.length === 0 ? <h2 style={{padding: "10px", textAlign:"center"}}> No events </h2> : null}
					{
						events.map((event, index) => (
							<Row className={index === 0 ? "first-event": "events"} key={index}>
								<h4> Event Name: {event.event_name} </h4>
								<h5> <em>Host: {event.organization_name}</em></h5>
								<h5><em>Description: {event.description}</em></h5>
								<ul className="events mb-3">
									<li>Date: {event.date}</li>
									<li>Time: {event.start_time} - {event.end_time}</li>
									<li>Location: {event.location}</li>
								</ul>
							</Row>
						))
					}
					</Container>
				</Row>
				<Row>
					<Row className="section-header"><h1>Attended Events </h1></Row>
					<Container className="events-wrapper">
					{prevEvents.length === 0 ? <h2 style={{padding: "10px", textAlign:"center"}}> No attended events </h2> : null}
					{
						prevEvents.map((event, index) => (
							<Row className={index === 0 ? "first-event": "events"} key={index}>
								<h4> Event Name: {event.event_name} </h4>
								<h5><em>Host: {event.organization_name}</em></h5>
								<h5><em>Description: {event.description}</em></h5>
								<ul className="events mb-3">
									<li>Date: {event.date}</li>
									<li>Time: {event.start_time} - {event.end_time}</li>
									<li>Location: {event.location}</li>
								</ul>
							</Row>
						))
					}
					</Container>
				</Row>
			</Container>
		</div>
	);
}

export default Dashboard;