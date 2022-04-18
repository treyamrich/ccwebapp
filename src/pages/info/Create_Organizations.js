import React, { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import { createOrganization, createCategory, deleteCategory } from '../../graphql/mutations.js';
import { checkEmptyFields } from '../../utility/EmptyFields.js';
import { Button, Alert, Form, Container, Row, Col} from 'react-bootstrap';
import "../../styles/events.css";

function CreateOrganizations({orgs, setOrgs, cats, setCats, fetchOrgs}) {

	const initialOrgState = {
		org_name: '',
	  	desc: '',
	  	catIndex: 0,
		img_file: null
	};
	const [org, setOrg] = useState(initialOrgState); //Creating orgs
	const [catName, setCatName] = useState(""); //Creating categories
	const [remCatIndex, setRemCatIndex] = useState(0); //Selecting categories for removal
	const [catErr, setCatErr] = useState(false);
	const [success, setSuccess] = useState("none");
	const {org_name, desc, category, img_file} = org;

	async function makeCategory() {

		//Check for empty strings
		if(checkEmptyFields("createCatInput")) {
			setSuccess("none");
			return;
		}

		try {
			//Create category in database
			const apiData = await API.graphql({query: createCategory, variables: { input: {
				name: catName
			}}});
			const data = apiData.data.createCategory;

			//Add category to local parent array
			var newCats = [...cats];
			newCats.splice(0, 0, data);
			setCats(newCats);

			setCatErr(false);
			setSuccess("Category successfully created.");
			setCatName("");
		} catch(err) {
			console.log(err);
			alert("Error creating category.");
		}
	}
	async function removeCategory() {

		if(!cats[remCatIndex]) {
			setCatErr(true);
			setSuccess("none");
			return;
		}

		try {

			//Create category in database
			const apiData = await API.graphql({query: deleteCategory, variables: { input: {
				id: cats[remCatIndex].id
			}}});

			//Remove category from local parent array
			var newCats = [...cats];
			if (remCatIndex >= 0) {
			    newCats.splice(remCatIndex, 1);
			    setCats(newCats);
			}

			//Reset errors
			setCatErr(false);
			setSuccess("Category successfully removed.");
		} catch(err) {
			console.log(err);
			alert("Error removing category.");
		}
	}
	async function makeOrg(e) {
		e.preventDefault();

		//Check for empty strings
		if(checkEmptyFields("createInput")) {
			setSuccess("none");
			return;
		}

		if(!cats[org.catIndex]) {
			setCatErr(true);
			setSuccess("none");
			return;
		}

		try{

			//Create org in database
			const apiData = await API.graphql({query: createOrganization, variables: { input: {
				name: org_name,
				description: desc,
				category: cats[org.catIndex].name,
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

			setCatErr(false);
			setSuccess("Organization successfully created.");
			//Fetch orgs again
			fetchOrgs();
		} catch (err) {
			console.log(err);
			alert("Error creating organization.");
		}
	}

	return (
		<div>
		<Container className="main-container mb-5">
			<Row className="header-container mb-4">
				<h1>Manage Organizations and Categories </h1>
			</Row>
			{catErr ? <Alert variant="danger" onClose={() => setCatErr(false)} dismissible> Please select a category or create one first</Alert> : null}
			{success !== "none" ? <Alert variant="success" onClose={() => setSuccess("none")} dismissible>{success}</Alert> : null}
			<Row xxl={2} xl={2} lg={2} md={2} sm={2} xs={2} className="justify-content-center">
				<Col>
					<Form className="p-4 p-sm-5" onSubmit={makeOrg}>
						<h3>Create Organizations</h3>
						<Form.Group className="mb-3"> 
			     	 		<Form.Label> Organization Name: </Form.Label>
			     	 		<Form.Control onChange={(e)=>setOrg({...org, org_name: e.target.value})}
								value={org.org_name}
								type="text"
								name="name"
								className="createInput"/> 
			     	 	</Form.Group>
			     	 	<Form.Group className="mb-3"> 
			     	 		<Form.Label> Description: </Form.Label>
			     	 		<Form.Control onChange={(e)=>setOrg({...org, desc: e.target.value})}
								value={org.desc}
								type="text" 
								name="description"
								className="createInput"/> 
			     	 	</Form.Group>
			     	 	<Form.Group className="mb-3">
							<Form.Label>Category</Form.Label>
							<Form.Select onChange={(e)=>setOrg({...org, catIndex: e.target.value})}>
								{
									cats.map((cat, index) => (
										<option value={index} key={index}> {cat.name}</option>
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
						<Button variant="dark" type="submit">Submit</Button>
					</Form>
				</Col>
				<Col>
					<Row className="mb-3">
						<Form className="p-4 p-sm-5">
							<h3 style={{textAlign:"center"}}>Create Category</h3>
							<Form.Group className="mb-3">
								<Form.Label> Category Name </Form.Label>
								<Form.Control onChange={(e)=>setCatName(e.target.value)}
									value={catName}
									type="text"
									name="category_name"
									className="createCatInput"/>
							</Form.Group>
							<Button className="mb-5" variant="dark" type="button" onClick={makeCategory}>Create</Button>
							<h3 style={{textAlign:"center"}}>Delete Category</h3>
							<Form.Group className="mb-3">
								<Form.Label>Category</Form.Label>
								<Form.Select onChange={(e)=>setRemCatIndex(e.target.value)}>
									{
										cats.map((cat, index) => (
											<option value={index} key={index}> {cat.name}</option>
										))
									}
								</Form.Select>
							</Form.Group>
							<Button variant="danger" type="button" onClick={removeCategory}>Remove</Button>
						</Form>
					</Row>
				</Col>
			</Row>
		</Container>
		</div>
	);
}

export default CreateOrganizations;