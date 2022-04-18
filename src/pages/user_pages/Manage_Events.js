import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import Calendar from 'react-calendar';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import { formatDate, subtractTime } from '../../utility/DateTimeFunctions.js';
import { eventByCreated } from '../../graphql/queries.js';
import { createEvent, deleteEvent } from '../../graphql/mutations.js';
import { checkEmptyFields } from '../../utility/EmptyFields.js';
import { email_removed_event } from '../../utility/AWS_SES_Email_Function.js';
import { Form, Alert, Button, Container, Row } from 'react-bootstrap';
import '../../styles/Calendar.css';
import "../../styles/events.css";

const initialEventState = {
	event_name: '',
  	desc: '',
	location: '',
}

function ManageEvents({sesObj, orgName, isOrg}) {

	const [selDate, chDate] = useState(new Date());
	const [selStartTime, chStartTime] = useState('10:00');
	const [selEndTime, chEndTime] = useState('10:30');
	const [event, setEvent] = useState(initialEventState); //Creating events
	const [events, setEvents] = useState([]); //Managing Events
	const [prevEvents, setPrevEvents] = useState([]); //Previous events
	const [makeEventErr, setMakeEventErr] = useState(false);
	const [viewState, setViewState] = useState("current");

	const {event_name, desc, location} = event;

	async function makeEvent(e) {
		e.preventDefault();
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
			//Create event in database
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
				type: 'event'
			}}});

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
	async function removeEvent(event, index) {
		const {id, volunteers} = event; 
		try {
			//Remove event from database
			await API.graphql({query: deleteEvent, variables: { input: {
				id: id
			}}});
			//Remove event from local array
			var newEvents = [...events];
			if (index >= 0) {
			    newEvents.splice(index, 1);
			    setEvents(newEvents);
			}
			//Email all volunteers if there are any
			if(volunteers.length > 0) {
				//Split the volunteers list because the max amount of recipients per SendEmailCommand for AWS SES is 50
				var volunteerBatch; //Temp array for each batch of volunteers
				for(let i = 0; i < volunteers.length; i+=50) {
					if(i/50 === volunteers.length - 1) { //If last iteration, batch = remainder so slice from i to length of array
						volunteerBatch = volunteers.slice(i, volunteers.length);
					} else { //Else, slice from i to i+50
						volunteerBatch = volunteers.slice(i, i+50);
					}
					await email_removed_event(sesObj, volunteerBatch, event);
				}
			}
		} catch(err){
			alert("Error removing event.");
		}
	}
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
	if(!isOrg) {
		return <h1>This page is not available.</h1>;
	}
	return(
		<div>
		<Container className="main-container">
			<Container className="mb-5">
				<Row className="header-container mb-3">
					<h1>Create Event </h1>
				</Row>
				<Row xxl={2} xl={2} lg={2} md={2} sm={2} xs={2} className="justify-content-center">
					<Form className="text-center p-4 p-sm-5" onSubmit={makeEvent}>
						<Form.Group className="mb-3">
							<Form.Label className="mb-3"><h2>Choose a date </h2></Form.Label>
							<Calendar
								className={["react-calendar", "myCal"]}
					        	onChange={chDate}
					       		value={selDate}
					       		minDate={new Date()}
					     	 />
					    </Form.Group>
				   		<Form.Group className="mb-3">
				   			<Form.Label> Start time </Form.Label> <br/>
					     	<TimePicker placeholder ="Start time"
						        onChange={chStartTime}
						        value={selStartTime}/>
					    </Form.Group>
						<Form.Group className="mb-3">
							<Form.Label> End time </Form.Label> <br/>
					      	<TimePicker
					        onChange={chEndTime}
					        value={selEndTime}/>
				    	</Form.Group>
				    	{makeEventErr ? <Alert variant="danger" onClose={() => setMakeEventErr(false)} dismissible> Please select a valid time interval</Alert> : null}
			     	 	<Form.Group className="mb-3"> 
			     	 		<Form.Label> Event Name: </Form.Label>
			     	 		<Form.Control onChange={(e)=>setEvent({...event, event_name: e.target.value})}
								value={event.event_name}
								type="text"
								name="createInput"
								className="createInput"/> 
			     	 	</Form.Group>
			     	 	<Form.Group className="mb-3"> 
			     	 		<Form.Label> Description: </Form.Label>
			     	 		<Form.Control onChange={(e)=>setEvent({...event, desc: e.target.value})}
								value={event.desc}
								type="text" 
								name="createInput"
								className="createInput"/> 
			     	 	</Form.Group>
			     	 	<Form.Group className="mb-3"> 
			     	 		<Form.Label> Location: </Form.Label>
			     	 		<Form.Control onChange={(e)=>setEvent({...event, location: e.target.value})}
								value={event.location}
								type="text" 
								name="createInput"
								className="createInput"/> 
			     	 	</Form.Group>
			     		<Button variant="dark" type="submit"> Create Event</Button>
			    	</Form>
			    </Row>
		    </Container>

		    <h1 className="section-header">Manage Events</h1>
		    { viewState === "current" ?  
		    	<button onClick={()=>setViewState("previous")} className="manage-view"> View Previous Events </button> : 
		    	<button onClick={()=>setViewState("current")} className="manage-view"> View Current Events </button>
		    }
		    <Container className="events-wrapper">
	     	{ viewState === "current" && (
	     		<Container>
		     		<h2 id="manage-header">Current Events</h2>
		     		{events.length === 0 ? <h2 style={{padding: "10px", textAlign:"center"}}> No events </h2> : null}
		     		{
		     			events.map((eventObj, index) => (
							<Row className={index === 0 ? "first-event": "events"} key={index}>
								<h4> Event Name: {eventObj.event_name} </h4>
								<h5><em>Description: {eventObj.description}</em></h5>
								<ul className="events mb-3">
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
								<Button className="mb-3" variant="danger" onClick={()=>removeEvent(eventObj, index)}> Remove </Button>
							</Row>
						))
		     		}
	     		</Container>
	     	)}
	     	{ viewState === "previous" && (
	     		<Container>
	     			<h2 className="event-header" id="manage-header">Previous Events</h2>
		     		{prevEvents.length === 0 ? <h2 style={{padding: "10px", textAlign:"center"}}> No previous events </h2> : null}
		     		{
		     			prevEvents.map((eventObj, index) => (
							<Row className={index === 0 ? "first-event": "events"} key={index}>
								<h4> Event Name: {eventObj.event_name} </h4>
								<h5><em>Description: {eventObj.description}</em></h5>
								<ul className="events mb-3">
									<li>Date: {eventObj.date}</li>
									<li>Time: {eventObj.start_time} - {eventObj.end_time}</li>
									<li>Location: {eventObj.location}</li>
									<li> Number of Volunteers: {eventObj.num_volunteers} </li>
									<li> Volunteers: {eventObj.volunteers.map((volunteer, index)=>{
										if(index < eventObj.volunteers.length - 1) {
											return volunteer + ", ";
										} else {
											return volunteer;
										}
									})} </li>
								</ul>
							</Row>
						))
		     		}
	     		</Container>
	     	)}
		    </Container>
		</Container>
		</div>
	);
}

export default ManageEvents;