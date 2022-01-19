import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import { formatDate, subtractTime } from './DateTimeFunctions.js';
import { eventByCreated } from '../../graphql/queries.js';
import { createEvent, deleteEvent } from '../../graphql/mutations.js';
import { checkEmptyFields } from '../EmptyFields.js';

const initialEventState = {
	event_name: '',
  	desc: '',
	location: '',
}

function ManageEvents({orgName, isOrg}) {

	const [selDate, chDate] = useState(new Date());
	const [selStartTime, chStartTime] = useState('10:00');
	const [selEndTime, chEndTime] = useState('10:30');
	const [event, setEvent] = useState(initialEventState); //Creating events
	const [events, setEvents] = useState([]); //Managing Events
	const [prevEvents, setPrevEvents] = useState([]); //Previous events
	const [makeEventErr, setMakeEventErr] = useState(false);
	const [viewState, setViewState] = useState("current");

	const {event_name, desc, location} = event;

	async function makeEvent() {
		var error = false; //Local flag variable
		//Check if a valid time is chosen
		var timeDiff = subtractTime(selStartTime, selEndTime);
		if (timeDiff < 30) { //If the selected time interval is not 30 min minimum, throw UI error
			error = true;
			setMakeEventErr(true);
		}
		//Check for empty strings
		if(checkEmptyFields("createInput")) error = true;
		
		//If there are any errors, do not proceed
    	if(error) {
    		return; 
    	}

		//Make new event if all checks pass
		try{
			var formatted_date = formatDate(selDate);
			const apiData = await API.graphql({query: createEvent, variables: { input: {
				organization_name: orgName,
				event_name: event_name,
				description: desc,
				location: location,
				date: formatted_date,
				start_time: selStartTime,
				end_time: selEndTime,
				num_volunteers: 0,
				volunteers: [],
				type: 'event'}}});
			//Add event to local array
			var newEvents = [...events];
			newEvents.splice(0, 0, apiData.data.createEvent); //Insert at the first index
			setEvents(newEvents);

			//Update errors
			setMakeEventErr(false);

		} catch (err) {
			alert("Error creating event.");
		}
	}
	async function removeEvent({id}, index) {
		try {
			await API.graphql({query: deleteEvent, variables: { input: {
				id: id
			}}});
			//Remove event from local array
			var newEvents = [...events]; //Copy array
			if (index !== -1) {
			    newEvents.splice(index, 1);
			    setEvents(newEvents);
			}
		} catch(err){
			alert("Error removing event.");
		}
	}
	//Fetch events
	async function fetchEvents() {
		try {
		var today = formatDate(new Date());
		const eventData = await API.graphql({query: eventByCreated, variables:{ type: 'event', sortDirection: 'DESC', filter: {organization_name: {eq: orgName}, date: {ge: today}}}});
		const prevEventData = await API.graphql({query: eventByCreated, variables:{ type: 'event', sortDirection: 'DESC', filter: {organization_name: {eq: orgName}, date: {lt: today}}}});
		setEvents(eventData.data.eventByCreated.items);
		setPrevEvents(prevEventData.data.eventByCreated.items);
		} catch(e) {
			alert("Error fetching events.");
		}
	}
	useEffect(()=>{
		fetchEvents();
	}, []);
	//If not an organization, deny access
	return(
		<div>
			<div className="calendar-div">
				<h1 style={{color:"#52B2BF"}}>Create Event </h1>
				<h2 style={{color:"#808000"}}>Choose a date </h2>
				<Calendar
					className={["react-calendar", "myCal"]}
		        	onChange={chDate}
		       		value={selDate}
		       		minDate={new Date()}
		     	 />
		     	 <h4> Start time </h4>
		     	 <TimePicker placeholder ="Start time"
			        onChange={chStartTime}
			        value={selStartTime}
			      />
			      <h4> End time </h4>
			      <TimePicker
			        onChange={chEndTime}
			        value={selEndTime}
			      />
		     	 <ul style={{listStyleType:"none"}}>
		     	 	<li> Event Name:
		     	 		<input onChange={(e)=>setEvent({...event, event_name: e.target.value})}
							value={event.event_name}
							type="text"
							name="createInput"
							className="text-entry"
							/> 
		     	 	</li>
		     	 	<li> Description:
		     	 		<input onChange={(e)=>setEvent({...event, desc: e.target.value})}
							value={event.desc}
							type="text" 
							name="createInput"
							className="text-entry"
							/> 
		     	 	</li>
		     	 	<li> Location:
		     	 		<input onChange={(e)=>setEvent({...event, location: e.target.value})}
							value={event.location}
							type="text" 
							name="createInput"
							className="text-entry"
							/> 
		     	 	</li>
		     	 </ul>
		     	 {makeEventErr ? <p style={{color: 'red'}}> Please select a valid time interval</p> : null}
		     	 <button className="make-event" onClick={makeEvent}> Create Event</button>
		    </div>


		    <h1 className="section-header">Manage Events</h1>
		    { viewState === "current" ?  
		    	<button onClick={()=>setViewState("previous")} className="manage-view"> View Previous Events </button> : 
		    	<button onClick={()=>setViewState("current")} className="manage-view"> View Current Events </button>
		    }
		    <div className="events-wrapper">
	     	{ viewState === "current" && (
	     		<div>
		     		<h2 className="manage-header">Current Events</h2>
		     		{events.length === 0 ? <h2 style={{textAlign:"center"}}> No events </h2> : null}
		     		{
		     			events.map((eventObj, index) => (
							<div className={index === 0 ? "first-event": "events"} key={index}>
								<h4> Event Name: {eventObj.event_name} </h4>
								<h5> Description: {eventObj.description} </h5>
								<ul>
									<li>Date: {eventObj.date}</li>
									<li>Time: {eventObj.start_time} - {eventObj.end_time}</li>
									<li>Location: {eventObj.location}</li>
									<li> Number Of Volunteers: {eventObj.num_volunteers} </li>
									<li> Volunteers: {eventObj.volunteers.map((volunteer, index)=>{
										if(index < eventObj.volunteers.length - 1) {
											return volunteer + ", ";
										} else {
											return volunteer;
										}
									})} </li>
								</ul>
								<button id="remove-button" onClick={()=>removeEvent(eventObj, index)}> Remove </button>
							</div>
						))
		     		}
	     		</div>
	     	)}
	     	{ viewState === "previous" && (
	     		<div>
	     			<h2 className="manage-header">Previous Events</h2>
		     		{prevEvents.length === 0 ? <h2 style={{textAlign:"center"}}> No previous events </h2> : null}
		     		{
		     			prevEvents.map((eventObj, index) => (
							<div className={index === 0 ? "first-event": "events"} key={index}>
								<h4> Event Name: {eventObj.event_name} </h4>
								<h5> Description: {eventObj.description} </h5>
								<ul>
									<li>Date: {eventObj.date}</li>
									<li>Time: {eventObj.start_time} - {eventObj.end_time}</li>
									<li>Location: {eventObj.location}</li>
									<li> Number Of Volunteers: {eventObj.num_volunteers} </li>
									<li> Volunteers: {eventObj.volunteers.map((volunteer, index)=>{
										if(index < eventObj.volunteers.length - 1) {
											return volunteer + ", ";
										} else {
											return volunteer;
										}
									})} </li>
								</ul>
							</div>
						))
		     		}
	     		</div>
	     	)}
		    </div>
		</div>
	);
}

export default ManageEvents;