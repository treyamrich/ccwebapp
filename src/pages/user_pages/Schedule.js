import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { API } from 'aws-amplify';
import { listEvents } from '../../graphql/queries.js';
import { updateEvent } from '../../graphql/mutations.js';
import { formatDate } from './DateTimeFunctions.js';
import { email_register_user } from './AWS_SES_Email_Function.js';

function Schedule({sesObj, email, isOrg}) {
	const [selDate, chDate] = useState(new Date());
	const [events, setEvents] = useState([]);
	const [registerBitMap, setRegisterBitMap] = useState([]);

	//Fetch events
	async function fetchEvents() {
		try {
			var date = formatDate(selDate);
			const apiData = await API.graphql({query: listEvents, variables:{ filter: {date: {eq: date}}}});
			//Traverse and mark all registered events for the current user
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
			<div className="calendar-div">
				<h1 style={{color:"#52B2BF"}}>Select a date </h1>
				<Calendar
					className={["react-calendar", "myCal"]}
	        		onChange={chDate}
	       		 	value={selDate}
	       		 	minDate={new Date()}
	     	 	/>
	     	</div>
	     	<h2 className="section-header">Available slots:</h2>
	     	<div className="events-wrapper">
	     		{events.length === 0 ? <h2 style={{textAlign:"center"}}> No events </h2> : null}
	     		{
	     			events.map((event, index) => (
						<div className={index === 0 ? "first-event": "events"} key={index}>
							<h4> Event Name: {event.event_name} </h4>
							<h5> Host: {event.organization_name}</h5>
							<h5> Description: {event.description} </h5>
							<ul>
								<li>Date: {event.date}</li>
								<li>Time: {event.start_time} - {event.end_time}</li>
								<li>Location: {event.location}</li>
							</ul>
							<div id={"register-button-" + index}>
								{!isOrg ? registerBitMap[index] === 0 ? <button id="register-button" onClick={()=>register(event, index)}> Register </button>: <p style={{color: "green"}}> Registered. </p> : null}
							</div>
						</div>
					))
	     		}
	     	</div>
		</div>
	);
}

export default Schedule;