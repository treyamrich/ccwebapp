import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { API } from 'aws-amplify';
import { listEvents } from '../../graphql/queries.js';
import { updateEvent } from '../../graphql/mutations.js';
import { formatDate } from '../../utility/DateTimeFunctions.js';
import { email_register_user } from '../../utility/AWS_SES_Email_Function.js';
import { Alert, Button, Container, Row } from 'react-bootstrap';
import '../../styles/Calendar.css';
import "../../styles/events.css";

function Schedule({sesObj, email, isOrg}) {
	const [selDate, chDate] = useState(new Date());
	const [events, setEvents] = useState([]);
	const [registerBitMap, setRegisterBitMap] = useState([]);

	async function fetchEvents() {
		try {
			var date = formatDate(selDate);
			const apiData = await API.graphql({query: listEvents, variables:{ filter: {date: {eq: date}}}});
			//Mark all registered events for the current user
			var arr = apiData.data.listEvents.items;
			var bitMap = [];
			for(var i = 0; i < arr.length; i++) {
				var pushed = false;
				for(var j = 0; j < arr[i].volunteers.length; j++) {
					if(arr[i].volunteers[j] === email) {
						bitMap.push(1);
						pushed = true;
					}
				}
				if(!pushed) bitMap.push(0);
			}
			setEvents(arr);
			setRegisterBitMap(bitMap);
		} catch(err){
			console.log(err);
			alert("Error fetching events.");
		}
	}
	useEffect(()=>{
		fetchEvents();
	}, [selDate]);

	async function register(event, index) {
		const {id, volunteers, num_volunteers} = event;
		try {
			await API.graphql({query: updateEvent, variables:{ input: {id: id, num_volunteers: (num_volunteers + 1), volunteers: [...volunteers, email]}}});
			//Show register success by updating state
			var prevBitMap = [...registerBitMap];
			prevBitMap.splice(index, 1, 1); //Flip the bit
			setRegisterBitMap(prevBitMap);
			//Email the user the information about the event
			await email_register_user(sesObj, email, event);
		} catch(err){ 
			console.log(err);
			alert("Error registering event");
		}
	}
	return(
		<div>
			<Container className="main-container">
				<Row className="header-container mb-3"><h1>Select a date </h1></Row>
				<Row className="calendar-div mb-5">
					<Calendar
						className={["react-calendar", "myCal"]}
		        		onChange={chDate}
		       		 	value={selDate}
		       		 	minDate={new Date()}
		     	 	/>
		     	</Row>
		     	
		     	<Row><h2 className="section-header" style={{textDecoration:"underline"}}>Available slots:</h2></Row>
		     	<Row className="events-wrapper">
		     		{events.length === 0 ? <h2 style={{padding: "10px", textAlign:"center"}}> No events </h2> : null}
		     		{
		     			events.map((event, index) => (
							<Container className={index === 0 ? "first-event": "events"} key={index}>
								<Row>
									<h4> Event Name: {event.event_name} </h4>
									<h5><em>Host: {event.organization_name}</em></h5>
									<h5><em>Description: {event.description}</em></h5>
									<ul className="events mb-3">
										<li>Date: {event.date}</li>
										<li>Time: {event.start_time} - {event.end_time}</li>
										<li>Location: {event.location}</li>
									</ul>
								</Row>
								<Row id={"register-button-" + index}>
									{!isOrg ? registerBitMap[index] === 0 ? 
										<Button variant="dark" className="mb-3" onClick={()=>register(event, index)}> Register </Button> : 
										<Alert variant="success"> Registered. </Alert> : null}
								</Row>
							</Container>
						))
		     		}
		     	</Row>
	     	</Container>
		</div>
	);
}

export default Schedule;