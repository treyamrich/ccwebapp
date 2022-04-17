import React, { useState, useEffect } from 'react';
import {Helmet} from "react-helmet";
import { API, Storage } from 'aws-amplify';
import { listOrganizations } from '../../graphql/queries.js';
import { updateEvent } from '../../graphql/mutations.js';
import { Form, Container, Row, Col } from 'react-bootstrap';

import "../../styles/events.css";

const categories = {
	"beach": {
		label: "Beach",
		list: []
	},
	"food": {
		label: "Food Drive",
		list: []
	}
};

function Discover() {
	const [orgs, setOrgs] = useState(categories);
	const [allOrgLen, setOrgLen] = useState(0)
	const [category, setCategory] = useState("all")

	async function fetchOrgs() {
		try {
			await Promise.all(Object.keys(orgs).map(async key => {
				const apiData = await API.graphql({query: listOrganizations, variables:{ filter: {category: {eq: key}}}});
				const orgList = apiData.data.listOrganizations.items;
				await Promise.all(orgList.map(async org => {
					if(org.image) {
						const image = await Storage.get(org.image);
						org.image = image;
					}
					return org;
				}))
				orgs[key].list = orgList;
				setOrgLen(()=> allOrgLen + orgs[key].list.length);
			}));
		} catch(err){
			console.log(err);
			alert("Error fetching organizations.");
		}
	}
	useEffect(()=>{
		fetchOrgs();
	}, []);

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
							<option value="all">Default-All</option>
							{
								Object.keys(orgs).map((key) => (
									<option value={key}> {orgs[key].label}</option>
								))
							}
						</Form.Select>
					</Form.Group>
					<input type="file" onChange={()=>console.log("hello")}/>
				</Row>
		     	<Row className="events-wrapper">
		     		{category === "all" && allOrgLen === 0  ? <h2 style={{padding: "10px", textAlign:"center"}}> No organizations </h2> : null}
		     		{category === "all" && (
		     			<div>
		     				{
				     			Object.keys(orgs).map((key) => {
				     				orgs[key].list.map((org, index) => (
				     					<Container className={index === 0 ? "first-event": "events"} key={index}>
											<Row>
												<h4> Organization: {org.name}</h4>
												<h5><em>Description: {org.description}</em></h5>
												{org.image && <img src={org.image} style={{width: 400}} />}
											</Row>
										</Container>
								))})
		     				}
		     			</div>
		     		)}
		     		{category !== "all" && orgs[category].list.length === 0 ? <h2 style={{padding: "10px", textAlign:"center"}}> No organizations </h2> : null}
		     		{category !== "all" && (
		     			<div>
			     			{
			     				orgs[category].list.map((org, index) => (
			     					<Container className={index === 0 ? "first-event": "events"} key={index}>
										<Row>
											<h4> Organization: {org.name}</h4>
											<h5><em>Description: {org.description}</em></h5>
											<h5>Image: {org.image}</h5>
										</Row>
									</Container>
		     					))
			     			}
	     				</div>
		     		)}
		     	</Row>
	     	</Container>
		</div>
	);
}

export default Discover;

