import React, {useState} from 'react';
import { Auth } from 'aws-amplify';
import {checkEmptyFields} from '../../utility/EmptyFields.js';
import { Alert, Form, Button} from 'react-bootstrap';

const initialResetState = {
	oldPass: "",
	newPass: "",
	confNewPass: ""
}

function Profile({email, name}) {
	const [changePw, setChangePw] = useState(false);
	const [resetState, setResetState] = useState(initialResetState);
	const [error, setError] = useState("none");
	const [success, setSuccess] = useState(false);

	async function changePassword(e) {
		e.preventDefault();
		if(checkEmptyFields("form_input")) return; //If fields are empty return
		if(resetState.newPass !== resetState.confNewPass) {
			setError("New passwords don't match.");
			return;
		}
		await Auth.currentAuthenticatedUser()
	    .then(user => {
	        return Auth.changePassword(user, resetState.oldPass, resetState.newPass);
	    })
	    .then(() => {
	    	setError("none");
	    	setSuccess(true);
	    	setChangePw(false);
	    	setResetState(initialResetState);
	    })
	    .catch(err => {
	    	console.log(err);
	    	if(err.message === "Incorrect username or password.") {
	    		setError("Incorrect Password");
	    	} else {
	    		setError(err.message);
	    	}
	    });
	}
	const {oldPass, newPass, confNewPass} = resetState;
	return(
		<div className="main_wrapper">
			<div className="sub-wrapper d-flex justify-content-center align-items-center">
				{!changePw && (
					<Form className="text-center p-4 p-sm-5">
						<h1 className="mb-4">User Profile</h1>
						<Form.Group className="mb-4">
							<ul>
								<li className="mb-3">Name: {name}</li>
								<li className="mb-3">Email: {email}</li>
							</ul>
						</Form.Group>
						<Form.Group className="mb-2">
							<Button variant="dark" onClick={()=>{setChangePw(true); setSuccess(false);}}>Change Password</Button>
						</Form.Group>
					</Form>
				)}
				{changePw && (
					<Form className="text-center p-4 p-sm-5" onSubmit={changePassword}>
						<h1 className="mb-4">Password Reset</h1>
						<Form.Group className="mb-3"> 
							<Form.Label>Old Password:</Form.Label>
							<Form.Control onChange={(e)=>setResetState({...resetState, oldPass: e.target.value})}
								value={oldPass}
								type="password"
								placeholder="Old Password"
								className="form_input"
								/> 
						</Form.Group>
						<Form.Group className="mb-3"> 
							<Form.Label>New Password:</Form.Label>
							<Form.Control onChange={(e)=>setResetState({...resetState, newPass: e.target.value})}
								value={newPass}
								type="password"
								placeholder="New Password"
								className="form_input" 
								/> 
						</Form.Group>
						<Form.Group className="mb-3"> 
							<Form.Label>Confirm New Password:</Form.Label>
							<Form.Control onChange={(e)=>setResetState({...resetState, confNewPass: e.target.value})}
								value={confNewPass}
								type="password"
								placeholder="Confirm New Password"
								className="form_input"
								/> 
						</Form.Group>
						<Button variant="dark" className="mb-3" type="submit"> Confirm </Button>
						<p>
							<a className="link-button" onClick={()=>setChangePw(false)}> Cancel </a>
						</p>
					</Form>
				)}
			</div>
			{error !== "none" ? <Alert className="error" variant="danger" onClose={() => setError("none")} dismissible> {error} </Alert> : null}
			{success === true ? <Alert className="error" variant="success"> Password Changed. </Alert> : null}
		</div>
	);
}

export default Profile;