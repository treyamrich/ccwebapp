import React, { useState, useEffect } from 'react';
import {Helmet} from "react-helmet";
import { API, Storage } from 'aws-amplify';
import { listOrganizations, listCategories } from '../../graphql/queries.js';
import { deleteOrganization } from '../../graphql/mutations.js';
import { Accordion, Button, Form, Container, Row, Col} from 'react-bootstrap';
import CreateOrganizations from './Create_Organizations.js';

import "../../styles/events.css";

const cats = [
	{
		name: "beach",
		label: "Beach Clean Up"
	},
	{
		name: "food",
		label: "Food Drive"
	}
];

function Discover({isAdmin}) {

	const [orgs, setOrgs] = useState([]);
	const [selCat, setSelCategory] = useState("all");
	const [cats, setCats] = useState([]);

	async function removeOrg(org, index) {
		const {id} = org;
		try {
			//Remove org from database
			await API.graphql({query: deleteOrganization, variables: { input: {
				id: id
			}}});
			//Remove org from local array
			var newOrgs = [...orgs]; //Copy array
			if (index >= 0) {
			    newOrgs.splice(index, 1);
			    setOrgs(newOrgs);
			}
		} catch(err){
			alert("Error removing organization.");
		}
	}
	async function fetchCategories() {
		try {
			const apiData = await API.graphql({query: listCategories});
			const catList = apiData.data.listCategories.items;
			setCats(catList);
		} catch(err) {
			alert("Error fetching categories");
		}
	}
	async function fetchOrgs(category) {
		try {
			const apiData = category === "all" ? 
				await API.graphql({query: listOrganizations}) :
				await API.graphql({query: listOrganizations, variables:{ filter: {category: {eq: category}}}});

			const orgList = apiData.data.listOrganizations.items;
			await Promise.all(orgList.map(async org => {
				if(org.image) {
					const image = await Storage.get(org.image);
					org.image = image;
				}
				return org;
			}))
			setOrgs(orgList);
		} catch(err){
			console.log(err);
			alert("Error fetching organizations.");
		}
	}

	useEffect(()=>{
		fetchCategories();
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
				{isAdmin && (
					<CreateOrganizations orgs={orgs} setOrgs={setOrgs} cats={cats} setCats={setCats} fetchOrgs={fetchOrgs}/>
				)}
				<Row className="header-container"><h1>Discover</h1></Row>
				<Row className="p-4 p-sm-5" xxl={2} xl={2} lg={2} md={2} sm={2} xs={2} style={{borderBottom:"1px solid #EFEFEF"}}>
					<Form.Group>
						<Form.Label>Select Category</Form.Label>
						<Form.Select onChange={(e)=>fetchOrgs(e.target.value)}>
							<option value="all">Default-All</option>
							{
								cats.map((cat, index) => (
									<option value={cat.name} key={index}> {cat.name}</option>
								))
							}
						</Form.Select>
					</Form.Group>
				</Row>
		     	<Row>
		     		{orgs.length === 0 ? <h2 className="p-4 sm-5" style={{padding: "10px", textAlign:"center"}}> No organizations </h2> : null}
	     			<Accordion className="p-4 p-sm-5">
	     			{
	     				orgs.map((org, index) => (
	     					<Accordion.Item key={index} eventKey={index}>
								<Accordion.Header> Organization: {org.name}</Accordion.Header>
								<Accordion.Body>
									<Row>
										{org.image && <Col><img className="mb-3" alt={org.name + "-logo"} src={org.image} style={{width: 400}} /></Col>}
										<Col><h5 className="mb-3"><em>Description: {org.description}</em></h5></Col>
										{isAdmin && (
											<Button className="mb-3" variant="danger" onClick={()=>removeOrg(org, index)}> Remove </Button>
										)}
									</Row>
								</Accordion.Body>
							</Accordion.Item>
     					))
	     			}
     				</Accordion>
		     	</Row>
	     	</Container>
		</div>
	);
}

export default Discover;

