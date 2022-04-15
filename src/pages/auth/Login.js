import React, {useState} from 'react';
import { Auth } from 'aws-amplify';
import {Link, Redirect} from 'react-router-dom';
import {checkEmptyFields} from '../EmptyFields.js';
import { Alert, Form, Button, Container} from 'react-bootstrap';
import "../../styles/login.css";

function Login({formState, setFormState, setAuth, setIsOrg}) {
	
	const {username, password, newPw, confNewPw, name, authCode, formType} = formState;
	const [redirect, setRedirect] = useState(false);
	const [error, setError] = useState("none");

	async function signUp(e) {
		e.preventDefault();
		//Check for empty strings
		if(checkEmptyFields("form_input")) {
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
  		if(checkEmptyFields("form_input")) { //Check for empty strings
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
		if(checkEmptyFields("form_input")) {
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
		<div className="main-wrapper">
			<div className="sub-wrapper d-flex justify-content-center align-items-center">
			{formType === 'signIn' && (
			<Form className="text-center p-4 p-sm-5" onSubmit={signIn}>
				<h1 className="mb-3">Sign In</h1>
					<Form.Group className="mb-3">
						<Form.Label> Email Address </Form.Label>
						<Form.Control onChange={(e)=>setFormState({...formState, username: e.target.value.toLowerCase()})}
							type="email" 
							placeholder="example@email.com"
							value={username}
							className="form_input"
							name="email"
						/>
						<Form.Text className="text-muted">
					      <span id="disclaim"> We'll never share your email with anyone else. </span>
					    </Form.Text>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label> Password </Form.Label>
						<Form.Control onChange={(e)=>setFormState({...formState, password: e.target.value})}
							type="password"
							value={password}
							placeholder="Password"
							className="form_input"
						/>
					</Form.Group>
				<Button variant="dark" className="mb-3" type="submit">Login</Button>
				<p>
					<Link className="link-button" onClick={()=>{setFormState({...formState, username: '', password: '', confNewPw:'', formType: 'signUp'}); setError("none");}}>
						Sign Up
					</Link>
					<Link className="link-button" onClick={()=>setFormState({...formState, formType:'forgotPassword'})}> 
						Forgot Password 
					</Link>
				</p>
			</Form>
			)}
			{formType === 'signUp' && (
			<Form className="text-center p-4 p-sm-5" onSubmit={signUp}>
				<h1 className="mb-3">Sign Up</h1>
					<Form.Group className="mb-3">
						<Form.Label>Name</Form.Label>
						<Form.Control onChange={(e)=>setFormState({...formState, name: e.target.value})}
							placeholder="Name"
							value={name}
							type="text" 
							className="form_input"
							name="signup_name"
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Email</Form.Label> 
						<Form.Control onChange={(e)=>setFormState({...formState, username: e.target.value.toLowerCase()})}
							placeholder="Email"
							value={username}
							type="email"
							className="form_input"
							name="signup_email" 
						/>
					</Form.Group> 
					<Form.Group className="mb-3">
						<Form.Label>Password</Form.Label>
						<Form.Control onChange={(e)=>setFormState({...formState, password: e.target.value})}
							placeholder="Password"
							value={password}
							type="password"
							className="form_input"
							name="signup_pw"
						/>
					</Form.Group> 
					<Form.Group className="mb-3">
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control onChange={(e)=>setFormState({...formState, confNewPw: e.target.value})}
							placeholder="Confirm Password"
							value={confNewPw}
							type="password"
							className="form_input"
							name="signup_confpw" 
						/>
					</Form.Group>
				<Button variant="dark" className="mb-3" type="submit"> Confirm </Button>
				<p> Already have an account? 
					<Link onClick={()=>{setFormState({...formState, password: '', confNewPw:'', username:'', name:'', formType: 'signIn'}); setError("none");}}
						className="link-button"> Login 
					</Link>
				</p>
			</Form>
			)}
			{formType === 'confirmSignUp' && (
				<Container>
					<Alert variant="success">Please check your email for a confirmation link.</Alert>
					<Button variant="dark" className="mb-3" className="login" type="button" onClick={()=>setFormState({...formState, confNewPw:'', username:'', name:'', password:'', authCode:'', formType: 'signIn'})}> 
						Back To Login </Button>
				</Container>
			)}
			{formType === 'forgotPassword' && (
					<Form className="text-center p-4 p-sm-5" onSubmit={sendCode}>
						<h2 className="mb-3">Forgot Password</h2>
						<Form.Group className="mb-3">
							<Form.Label>Email</Form.Label>
							<Form.Control onChange={(e)=>setFormState({...formState, username: e.target.value})}
								placeholder="Email"
								value={username}
								type="email"
								className="form_input"
								name="forgot_password_email" 
								/>
						</Form.Group>
						<Button variant="dark" className="mb-3" type="submit">Send Code</Button>
						<p>
							<Link className="link-button" onClick={()=>{setFormState({...formState, username:'', name:'', password:'', authCode:'', formType: 'signIn'});setError("none")}}> 
								Back to login </Link>
						</p>
					</Form>
			)}
			{formType === 'changePassword' && (
					<Form className="text-center p-4 p-sm-5" onSubmit={changePassword}>
						<h3>Please check your email <br/>for a code.</h3>
							<Form.Group className="mb-3">
								<Form.Label>Enter Code</Form.Label>
								<Form.Control onChange={(e)=>setFormState({...formState, authCode: e.target.value})}
									placeholder="Code"
									value={authCode}
									type="text"
									className="form_input"
									name="forgot_authcode" 
								/>
							</Form.Group>
							<Form.Group className="mb-3">
								<Form.Label>New Password</Form.Label>
								<Form.Control onChange={(e)=>setFormState({...formState, newPw: e.target.value})}
									placeholder="New Password"
									value={newPw}
									type="password"
									className="form_input"
									name="forgot_newpw" 
								/>
							</Form.Group>
							<Form.Group className="mb-3">
								<Form.Label>Confirm New Password</Form.Label>
								<Form.Control onChange={(e)=>setFormState({...formState, confNewPw: e.target.value})}
									placeholder="Confirm New Password"
									value={confNewPw}
									type="password"
									className="form_input"
									name="forgot_confnewpw" 
								/>
							</Form.Group>
						<Button variant="dark" className="mb-3" type="submit">Change Password</Button>
						<p>
							<Link className="link-button" onClick={()=>{setFormState({...formState, username:'', name:'', newPw:'', confNewPw:'', authCode:'', formType: 'signIn'});setError("none")}}>
								Cancel
							</Link>
						</p>
					</Form>
			)}
			{formType === 'pwChangeSuccess' && (
				<Container>
					<Alert variant="success">Password Successfully Changed.</Alert>
						<Button variant="dark" className="mb-3" type="button" onClick={()=>setFormState({...formState, username:'', name:'', password:'', authCode:'', formType: 'signIn'})}> 
									Back To Login </Button>
				</Container>
			)}
			</div>
			{error !== "none" ? <Alert className="error" variant="danger"> {error} </Alert> : null}
		</div>
	);
}

export default Login;