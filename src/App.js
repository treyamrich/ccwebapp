import './App.css';
import {Route, Switch} from 'react-router-dom';
import { Auth } from 'aws-amplify';
import {Link} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {createSESObj} from './libs/sesClient.js';

import Landing from './pages/Landing.js';
import Discover from './pages/info/Discover.js';
import About from './pages/info/About.js';
import Donate from './pages/info/Donate.js';

import Login from './pages/auth/Login.js';
import PrivateRoute from './pages/PrivateRoute.js';

import Dashboard from './pages/user_pages/Dashboard.js';
import Schedule from './pages/user_pages/Schedule.js';
import ManageEvents from './pages/user_pages/Manage_Events.js';
import Profile from './pages/user_pages/Profile.js';

const initialFormState = {
  username:'',
  password:'',
  newPw:'',
  confNewPw:'',
  email: '', 
  name: '',
  authCode: '',
  formType:'signIn',
  idToken:'',
  sesObj: {} 
};

const homeLinkStyle = {
  textDecoration: "none",
  color: "#808000"
}

function App() {
  const [formState, setFormState] = useState(initialFormState);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isOrg, setIsOrg] = useState(false); //is an organization

  async function signOut() {
    try {
        await Auth.signOut();
        window.location.reload(); //Reloading the page resets the state of the hooks
    } catch (error) {
        console.log('error signing out: ', error);
    }
  }
  async function onLoad() {
    //In the case of a page refresh/load, get the user again and set the state
    try {
      const user = await Auth.currentAuthenticatedUser();
      const groups = user.signInUserSession.accessToken.payload["cognito:groups"]; //Get user group to check if they're an organization
      setFormState({...formState, username: user.username, name: user.attributes.name, email: user.attributes.email, idToken: user.signInUserSession.idToken});
      userHasAuthenticated(true);
      if(groups!== undefined && groups[0] === "organization") setIsOrg(true);
    }
    catch(e) {
      console.log(e);
      if (e !== 'The user is not authenticated') {
        alert(e);
      }
    }
    setIsAuthenticating(false);
  }
  useEffect(() => {
    //Upon sign in, the an ses object is created for email capabilities
    setFormState({...formState, sesObj: createSESObj(idToken)});
  }, [isAuthenticated]);
  useEffect(() => {
    onLoad();
  }, []);
  const {sesObj, idToken, name, email} = formState;
  return (
    !isAuthenticating && ( //Render only when checking auth is done
    <div className="App">
      <header className="App-header">
        <ul className="nav">
          <li className ="landing"> 
            <Link style={homeLinkStyle} to="/"> Home </Link> 
          </li>
          <li className="landing" id="nav-sel">
            <button className="header" onClick={()=>console.log("hi")}>More</button> 
          </li>
          {isOrg===true ? <li className ="landing navs"> 
            <Link style={homeLinkStyle} to="/manage_events"> Manage Events </Link> </li>: null}
          {isAuthenticated===true && isOrg===false ? 
            <li className="landing navs"> 
              <Link style={homeLinkStyle} to="/dashboard"> Dashboard </Link> 
            </li> : null}
          {isAuthenticated===true ? 
            <li className="landing navs"> 
              <Link style={homeLinkStyle} to="/profile"> Profile </Link> 
            </li> : null}
          {isAuthenticated===true ? <li className="landing navs"> Welcome {name}. </li> : null}
          <li className = "landing navs"> {!isAuthenticated ? 
            <Link style={homeLinkStyle} to="/login"> Login </Link> : 
            <button className="header" onClick={()=>signOut()}> Sign out </button>} 
          </li>
        </ul>
      </header>

      <Switch>
        <Route exact path="/">
          <Landing/>
        </Route>
        <Route exact path="/login">
          <Login formState={formState} setFormState={setFormState} setAuth={userHasAuthenticated} setIsOrg={setIsOrg}/>
        </Route>

        <PrivateRoute exact path="/dashboard" auth={isAuthenticated}>
          <Dashboard email={email}/>
        </PrivateRoute>
        <PrivateRoute exact path="/schedule" auth={isAuthenticated}>
          <Schedule sesObj={sesObj} email={email} isOrg={isOrg}/>
        </PrivateRoute>
        <PrivateRoute exact path="/manage_events" auth={isAuthenticated}>
          <ManageEvents sesObj={sesObj} orgName={name} isOrg={isOrg}/>
        </PrivateRoute>
        <PrivateRoute exact path="/profile" auth={isAuthenticated}>
          <Profile email={email} name={name}/>
        </PrivateRoute>

        <Route exact path="/discover">
          <Discover/>
        </Route>
        <Route exact path="/about">
          <About/>
        </Route>
        <Route exact path="/donate">
          <Donate/>
        </Route>
        <Route>
          <h1>This page is not available.</h1>
        </Route>
      </Switch>

    </div>
    )
  );
}

export default App;