import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { listEvents } from '../../graphql/queries.js';
import { formatDate } from './DateTimeFunctions.js';

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
			<h1 className="manage-header">Enrolled events</h1>
			<div className="events-wrapper">
			{events.length === 0 ? <h2 style={{textAlign:"center"}}> No events </h2> : null}
			{
				events.map((event, index) => (
					<div className={index === 0 ? "first-event": "events"} key={index}>
						<h4> Event Name: {event.event_name} </h4>
						<h5> Description: {event.description} </h5>
						<ul>
							<li>Date: {event.date}</li>
							<li>Time: {event.start_time} - {event.end_time}</li>
							<li>Location: {event.location}</li>
						</ul>
					</div>
				))
			}
			</div>
			<h1 className="manage-header">Attended Events </h1>
			<div className="events-wrapper">
			{prevEvents.length === 0 ? <h2 style={{textAlign:"center"}}> No attended events </h2> : null}
			{
				prevEvents.map((event, index) => (
					<div className={index === 0 ? "first-event": "events"} key={index}>
						<h4> Event Name: {event.event_name} </h4>
						<h5> Description: {event.description} </h5>
						<ul>
							<li>Date: {event.date}</li>
							<li>Time: {event.start_time} - {event.end_time}</li>
							<li>Location: {event.location}</li>
						</ul>
					</div>
				))
			}
			</div>
		</div>
	);
}

export default Dashboard;