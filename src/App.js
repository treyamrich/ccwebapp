import './App.css';
import {Route, Switch} from 'react-router-dom';
import { Auth } from 'aws-amplify';
import {Link} from 'react-router-dom';
import React, { useState, useEffect } from 'react';

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
  idToken: ''
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
        setFormState({...formState, formType: 'signIn'});
        console.log("loggingoutb4");
        window.location.reload();
        console.log("loggingoutaft");
    } catch (error) {
        console.log('error signing out: ', error);
    }
  }
  useEffect(() => {
    onLoad();
  }, []);
  async function onLoad() {
    //In the case of a page refresh, get the user again and set the state
    try {
      const user = await Auth.currentAuthenticatedUser();
      const groups = user.signInUserSession.accessToken.payload["cognito:groups"]; //Get user group to check if they're an organization
      setFormState({...formState, username: user.username, name: user.attributes.name, email: user.attributes.email, idToken: user.signInUserSession.idToken});
      userHasAuthenticated(true);
      if(groups!== undefined && groups[0] === "organization") setIsOrg(true);
    }
    catch(e) {
      if (e !== 'The user is not authenticated') {
        alert(e);
      }
    }
    setIsAuthenticating(false);
  }

  const {idToken, name, email} = formState;
  return (
    !isAuthenticating && ( //Render only when checking auth is done
    <div className="App">
      <header className="App-header">
        <ul className="nav">
          <li className ="landing"> <Link style={homeLinkStyle} to="/"> Home </Link> </li>
          {isOrg===true ? <li className ="landing"> <Link style={homeLinkStyle} to="/manage_events"> Manage Events </Link> </li>: null}
          {isAuthenticated===true && isOrg===false ? <li className="landing"> <Link style={homeLinkStyle} to="/dashboard"> Dashboard </Link> </li> : null}
          {isAuthenticated===true ? <li className="landing"> Welcome {name}. </li> : null}
          {isAuthenticated===true ? <li className="landing"> <Link style={homeLinkStyle} to="/profile"> Profile </Link> </li> : null}
          <li className = "landing"> {!isAuthenticated ? <Link style={homeLinkStyle} to="/login"> Login </Link> : <button className="header" onClick={()=>signOut()}> Sign out </button>} </li>
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
          <Schedule token={idToken} email={email} isOrg={isOrg}/>
        </PrivateRoute>
        <PrivateRoute exact path="/manage_events" auth={isAuthenticated}>
          <ManageEvents orgName={name} isOrg={isOrg}/>
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