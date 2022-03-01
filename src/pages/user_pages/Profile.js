import React, {useState} from 'react';
import { Auth } from 'aws-amplify';
import {checkEmptyFields} from '../EmptyFields.js';

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

	async function changePassword() {
		if(checkEmptyFields("resetPassword")) return; //If fields are empty return
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
			<div className="login">
				{error !== "none" ? <p style={{color: "red"}}> {error} </p> : null}
				{success === true ? <p style={{color: "green"}}> Password Changed. </p> : null}
				{!changePw && (
					<div>
						<h1 className="login_header"> User Profile</h1>
						<ul>
							<li className="login">Name: {name}</li>
							<li className="login">Email: {email}</li>
							<li className="log_alt"><button className="log_alt" onClick={()=>{setChangePw(true); setSuccess(false);}}>Change Password</button></li>
						</ul>
					</div>
				)}
				{changePw && (
					<ul>
						<li className="login"> Old Password:
							<input onChange={(e)=>setResetState({...resetState, oldPass: e.target.value})}
								value={oldPass}
								type="password"
								className="login" 
								name="resetPassword"
								/> 
						</li>
						<li className="login"> New Password:
							<input onChange={(e)=>setResetState({...resetState, newPass: e.target.value})}
								value={newPass}
								type="password"
								className="login"
								name="resetPassword" 
								/> 
						</li>
						<li className="login"> Confirm New Password:
							<input onChange={(e)=>setResetState({...resetState, confNewPass: e.target.value})}
								value={confNewPass}
								type="password"
								className="login"
								name="resetPassword" 
								/> 
						</li>
						<li className="login">
							<button className="login" onClick={changePassword}> Confirm </button> 
						</li>
						<li className="login">
							<button className="log_alt" onClick={()=>setChangePw(false)}> Cancel </button>
						</li>
					</ul>
				)}
			</div>
		</div>
	);
}

export default Profile;