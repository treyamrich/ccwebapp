import React, { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import { createOrganization } from '../../graphql/mutations.js';
import { checkEmptyFields } from '../../utility/EmptyFields.js';
import { Button, Form, Container, Row } from 'react-bootstrap';
import "../../styles/events.css";

function CreateOrganizations({orgs, setOrgs, cats}) {

	const initialOrgState = {
		org_name: '',
	  	desc: '',
	  	category: cats[0],
		img_file: null
	}
	const [org, setOrg] = useState(initialOrgState); //Creating orgs

	const {org_name, desc, category, img_file} = org;

	async function makeOrg(e) {
		e.preventDefault();

		//Check for empty strings
		if(checkEmptyFields("createInput")) return;

		try{

			//Create org in database
			const apiData = await API.graphql({query: createOrganization, variables: { input: {
				name: org_name,
				description: desc,
				category: category.name,
				image: img_file.name
			}}});

			//Add org image to storage
			await Storage.put(img_file.name, img_file);

			//Add org to local array
			const orgData = apiData.data.createOrganization;
			orgData.image = img_file;
			var newOrgs = [...orgs];
			newOrgs.splice(0, 0, orgData); //Insert at the first index
			setOrgs(newOrgs);

		} catch (err) {
			console.log(err);
			console.log(org);
			alert("Error creating organization.");
		}
	}

	return (
		<div>
		<Container className="main-container mb-5">
			<Row className="header-container mb-3">
				<h1>Create Organization </h1>
			</Row>
			<Row xxl={2} xl={2} lg={2} md={2} sm={2} xs={2} className="justify-content-center">
				<Form className="p-4 p-sm-5" onSubmit={makeOrg}>
					<Form.Group className="mb-3"> 
		     	 		<Form.Label> Organization Name: </Form.Label>
		     	 		<Form.Control onChange={(e)=>setOrg({...org, org_name: e.target.value})}
							value={org.org_name}
							type="text"
							name="createInput"
							className="createInput"/> 
		     	 	</Form.Group>
		     	 	<Form.Group className="mb-3"> 
		     	 		<Form.Label> Description: </Form.Label>
		     	 		<Form.Control onChange={(e)=>setOrg({...org, desc: e.target.value})}
							value={org.desc}
							type="text" 
							name="createInput"
							className="createInput"/> 
		     	 	</Form.Group>
		     	 	<Form.Group className="mb-3">
						<Form.Label>Category</Form.Label>
						<Form.Select onChange={(e)=>setOrg({...org, category: e.target.value})}>
							{
								cats.map((cat, index) => (
									<option value={cat.name} key={index}> {cat.label}</option>
								))
							}
						</Form.Select>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Image</Form.Label>
						<Form.Control onChange={(e)=>{if(e.target.files[0]) setOrg({...org, img_file: e.target.files[0]})}} 
							type="file"
							name="image"
							className="createInput"
							value={org.image}
							/>
					</Form.Group>
					<Button variant="dark" type="submit"> Create Organization</Button>
				</Form>
			</Row>
		</Container>
		</div>
	);
}

export default CreateOrganizations;