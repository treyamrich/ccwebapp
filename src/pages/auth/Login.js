import React, {useState} from 'react';
import { Auth } from 'aws-amplify';
import {Redirect} from 'react-router-dom';
import {checkEmptyFields} from '../EmptyFields.js';

function Login({formState, setFormState, setAuth, setIsOrg}) {
	
	const {username, password, newPw, confNewPw, name, authCode, formType} = formState;
	const [redirect, setRedirect] = useState(false);
	const [error, setError] = useState("none");

	async function signUp(e) {
		e.preventDefault();
		//Check for empty strings
		if(checkEmptyFields("signUpInput")) {
			return;
		}
		if(password !== confNewPw) { //Check if passwords match. *Note confNewPw is just confirm password*
			setError("Passwords do not match!");
			return;
		}
    	//If all checks pass try signing up
	    try {
	        await Auth.signUp({
	            username,
	            password,
	            attributes: {
	            	name
	            }
	        });
	       	setFormState({...formState, formType: 'confirmSignUp'});
	       	setError("none");
	    } catch (e) {
	        setError(e.message);
	    }
  	}
  	async function changePassword(e) {
  		e.preventDefault();
  		if(checkEmptyFields("signUpInput")) { //Check for empty strings
			return;
		}
		if(newPw !== confNewPw) { //Check if passwords match
			setError("Passwords do not match!");
			return;
		}
		try {
			await Auth.forgotPasswordSubmit(username, authCode, newPw);
			setError("none");
			setFormState({...formState, newPw:'', confNewPw:'', authCode:'', formType:'pwChangeSuccess'});
		} catch(e){
			setError(e.message);
		}
  	}
  	async function sendCode(e) {
  		e.preventDefault();
  		//Check for empty strings
		if(checkEmptyFields("signUpInput")) {
			return;
		}
  		// Send confirmation code to user's email
  		try {
  			await Auth.forgotPassword(username);
			setFormState({...formState, formType:'changePassword'});
			setError("none");
  		} catch(e) {
  			if(e.message === "Username/client id combination not found.") {
  				setError("Account with corresponding email does not exist.");
  			} else {
  				setError(e.message);
  			}
  		}
  	}
  	async function signIn(e) {
  		e.preventDefault();
	    try {
	        const user = await Auth.signIn(username, password);
	        const groups = user.signInUserSession.accessToken.payload["cognito:groups"];
	        setFormState({...formState, formType: 'signnedIn', email: username, name: user.attributes.name, idToken: user.signInUserSession.idToken}); //Parent component doesn't rerender, so pass info
	        setAuth(true);
	        if(groups!== undefined && groups[0] === "organization") setIsOrg(true);
	        setRedirect(true); //rerender this component to redirect
	    } catch (e) {
	        setError("Invalid Credentials!");
	    }
  	}
  	if(redirect) {
  		return <Redirect to="/"/>;
  	}
	return(
		<div className ="login"> 
			{error !== "none" ? <p style={{color: "red"}}> {error} </p> : null}
			{formType === 'signIn' && (
				<div>
					<form onSubmit ={signIn}>
						<h1 style={{color:"#808000", width: "100%", marginBottom: "50px"}}>Compassion Connection</h1>
						<ul className="login">
							<li className="login">
								<input onChange={(e)=>setFormState({...formState, username: e.target.value.toLowerCase()})}
														placeholder="Email"
														value={username}
														type="text" 
														className="login"
														/> 
							</li>
							<li className="login">
							<input onChange={(e)=>setFormState({...formState, password: e.target.value})}
													placeholder="Password"
													value={password}
													type="password"
													className="login" 
													/> 
							</li>
							<li className="login">
								<button className="login" type="submit"> Login </button>
							</li>
							<li className="login">
								<button className="login" onClick={()=>{setFormState({...formState, username: '', password: '', confNewPw:'', formType: 'signUp'}); setError("none");}}>Sign Up</button>
							</li>
							<li className="login">
								<button className="login" onClick={()=>setFormState({...formState, formType:'forgotPassword'})}> Forgot Password </button>
							</li>
						</ul>
					</form>
				</div>
			)}
			{formType === 'signUp' && (
				<div>
					<form onSubmit ={signUp}>
						<h1 style={{color:"#808000", width: "100%", marginBottom: "50px"}}>Sign Up</h1>
						<ul className="login">
							<li className="login">
								<input onChange={(e)=>setFormState({...formState, name: e.target.value})}
													placeholder="Name"
													value={name}
													type="text" 
													className="login"
													name="signUpInput"
													/>
							</li>
							<li className="login"> 
								<input onChange={(e)=>setFormState({...formState, username: e.target.value.toLowerCase()})}
													placeholder="Email"
													value={username}
													type="text"
													className="login"
													name="signUpInput" 
													/>
							</li> 
							<li className="login">
								<input onChange={(e)=>setFormState({...formState, password: e.target.value})}
													placeholder="Password"
													value={password}
													type="password"
													className="login"
													name="signUpInput" 
													/>
							</li> 
							<li className="login">
								<input onChange={(e)=>setFormState({...formState, confNewPw: e.target.value})}
													placeholder="Confirm Password"
													value={confNewPw}
													type="password"
													className="login"
													name="signUpInput" 
													/>
							</li>
							<li className="login">
								<button className="login" type="submit"> Confirm </button>
							</li>
							<li className="login">
								<button className="login" onClick={()=>{setFormState({...formState, password: '', confNewPw:'', username:'', name:'', formType: 'signIn'}); setError("none");}}>I already have an account. </button>
							</li>
						</ul>
					</form>
				</div>
			)}
			{formType === 'confirmSignUp' && (
				<div>
					<h3 style={{color:"#808000", width: "100%", marginBottom: "50px"}}>Please check your email for a confirmation link.</h3>
					<ul className="login">
						<li className="login">
							<button className="login" onClick={()=>setFormState({...formState, confNewPw:'', username:'', name:'', password:'', authCode:'', formType: 'signIn'})}> Back To Login </button>
						</li>
					</ul>
				</div>
			)}
			{formType === 'forgotPassword' && (
				<div>
					<form onSubmit={sendCode}>
						<h3 style={{color:"#808000", width: "100%", marginBottom: "50px"}}>Forgot Password</h3>
						<ul className="login">
							<li className="login">
								<input onChange={(e)=>setFormState({...formState, username: e.target.value})}
													placeholder="Email"
													value={username}
													type="text"
													className="login"
													name="signUpInput" 
													/>
							</li>
							<li className="login">
								<button className="login" type="submit">Send Code</button>
							</li>
							<li className="login">
								<button className="login" onClick={()=>{setFormState({...formState, username:'', name:'', password:'', authCode:'', formType: 'signIn'});setError("none")}}> Cancel </button>
							</li>
						</ul>
					</form>
				</div>
			)}
			{formType === 'changePassword' && (
				<div>
					<form onSubmit={changePassword}>
						<h3 style={{color:"#808000", width: "100%", marginBottom: "50px"}}>Please check your email. Enter code and new password.</h3>
						<ul className="login">
							<li className="login">
								<input onChange={(e)=>setFormState({...formState, authCode: e.target.value})}
													placeholder="Enter Code"
													value={authCode}
													type="text"
													className="login"
													name="signUpInput" 
													/>
							</li>
							<li className="login">
								<input onChange={(e)=>setFormState({...formState, newPw: e.target.value})}
													placeholder="New Password"
													value={newPw}
													type="password"
													className="login"
													name="signUpInput" 
													/>
							</li>
							<li className="login">
								<input onChange={(e)=>setFormState({...formState, confNewPw: e.target.value})}
													placeholder="Confirm New Password"
													value={confNewPw}
													type="password"
													className="login"
													name="signUpInput" 
													/>
							</li>
							<li className="login">
								<button className="login" type="submit">Change Password</button>
							</li>
							<li className="login">
								<button className="login" onClick={()=>{setFormState({...formState, username:'', name:'', newPw:'', confNewPw:'', authCode:'', formType: 'signIn'});setError("none")}}> Cancel </button>
							</li>
						</ul>
					</form>
				</div>
			)}
			{formType === 'pwChangeSuccess' && (
				<div>
					<h3 style={{color:"#808000", width: "100%", marginBottom: "50px"}}>Password Successfully Changed.</h3>
					<ul className="login">
						<li className="login">
							<button className="login" onClick={()=>setFormState({...formState, username:'', name:'', password:'', authCode:'', formType: 'signIn'})}> Back To Login </button>
						</li>
					</ul>
				</div>
			)}
		</div>
	);
}

export default Login;