import React, { useState, useEffect } from 'react';
import {Helmet} from "react-helmet";
import { listEvents } from '../../graphql/queries.js';
import { updateEvent } from '../../graphql/mutations.js';
import { Form, Container, Row, Col } from 'react-bootstrap';

import "../../styles/events.css";

/*const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
					"L", "M", "O", "P", "Q", "R", "S", "T", "U", "V",
					"W", "X", "Y", "Z", "#"];*/
const options = [
  {
    label: "Default-All",
    value: "all",
  },
  {
    label: "Beach",
    value: "beach",
  },
  {
    label: "Food drive",
    value: "food-drive",
  }
];

function Discover() {
	const [orgs, setOrgs] = useState([]);
	const [category, setCategory] = useState("")

	async function fetchOrgs() {
		try {
			//const apiData = await API.graphql({query: listEvents, variables:{ filter: {date: {eq: date}}}});
			//var arr = apiData.data.listEvents.items;
			//setOrgs(arr);
		} catch(err){
			console.log(err);
			alert("Error fetching organizations.");
		}
	}
	useEffect(()=>{
		fetchOrgs();
	}, [category]);

	return(
		<div>
			<Helmet>
              <title>CC Oahu - Discover</title>
              <meta name="description" content="Discover and learn more about the organizations on our platform." />
              <meta name="keywords" content="Discover, Compassion, Connection, Oahu, Hawaii" />
        	</Helmet>
			<Container className="main-container">
				<Row className="header-container mb-3"><h1>Discover</h1></Row>
				<Row className="mb-3">
					<Form.Group>
						<Form.Label>Select Category</Form.Label>
						<Form.Select onChange={(e)=>setCategory(e.target.value)}>
							{
								options.map((option) => (
									<option value={option.value}>{option.label}</option>
								))
							}
						</Form.Select>
					</Form.Group>
				</Row>
		     	<Row className="events-wrapper">
		     		{orgs.length === 0 ? <h2 style={{padding: "10px", textAlign:"center"}}> No organizations </h2> : null}
		     		{
		     			orgs.map((event, index) => (
							<Container className={index === 0 ? "first-event": "events"} key={index}>
								<Row>
									<h4> Organization:  </h4>
									<h5><em>Description: </em></h5>
								</Row>
							</Container>
						))
		     		}
		     	</Row>
	     	</Container>
		</div>
	);
}

export default Discover;