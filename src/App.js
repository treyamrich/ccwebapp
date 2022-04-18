import './styles/App.css';
import logo from "./graphics/cc_logo_new.png";
import { Route, Switch } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { createSESObj } from './libs/sesClient.js';

import Landing from './pages/Landing.js';
import Discover from './pages/info/Discover.js';

import Login from './pages/auth/Login.js';
import PrivateRoute from './pages/PrivateRoute.js';
import SessionLogout from './pages/SessionLogout.js';

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

function App() {
  const [formState, setFormState] = useState(initialFormState);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isOrg, setIsOrg] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  async function signOut() {
    try {
        await Auth.signOut();
        window.location.reload();
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
      //Check for authorization
      if(groups) {
        for(var i = 0; i < groups.length; i++) {
          switch(groups[i]) {
            case "organization":
              setIsOrg(true);
              break;
            case "admin":
              setIsAdmin(true);
              break;
          }
        }
      }
    }
    catch(e) {
      if (e !== 'The user is not authenticated') {
        alert(e);
      }
    }
    setIsAuthenticating(false);
  }
  useEffect(() => {
    //Upon sign in, the ses object is created for email capabilities
    if(isAuthenticated)
      setFormState({...formState, sesObj: createSESObj(idToken)});
  }, [isAuthenticated]);
  useEffect(() => {
    onLoad();
  }, []);
  const {sesObj, idToken, name, email} = formState;

  return (
    !isAuthenticating && (
    <div>
      <Navbar className="navbar" fixed="top" expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/"> Compassion Connection </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link href="/schedule"> Volunteer </Nav.Link>
            <Nav.Link href="/discover"> Discover </Nav.Link>
            {isOrg===true ? 
              <Nav.Item>
                <Nav.Link href="/manage_events">
                  Manage Events 
                </Nav.Link>
              </Nav.Item> 
              : null
            }
            {isAuthenticated===true && isOrg===false ?  
              <Nav.Item>
                <Nav.Link href="/dashboard">Dashboard </Nav.Link>
              </Nav.Item>
              : null
            }
            
            {isAuthenticated===true ? 
              <Nav.Item>
                <Nav.Link href="/profile">Profile</Nav.Link>
              </Nav.Item> 
              : null
            }
            {isAuthenticated===true ? 
              <Nav.Item>
                <Nav.Link id="welcome-user"> Welcome {name}. </Nav.Link>
              </Nav.Item> 
              : null
            }
            <Nav.Item> {!isAuthenticated ? 
              <Nav.Link href="/login"> Login </Nav.Link> : 
              <Nav.Link onClick={()=>signOut()}> Sign out </Nav.Link>} 
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {isAuthenticated===true ? <SessionLogout signOut={signOut}/> : null}

      <Switch>
        <Route exact path="/">
          <Landing/>
        </Route>
        <Route exact path="/login">
          <Login formState={formState} setFormState={setFormState} setAuth={userHasAuthenticated} setIsAdmin={setIsAdmin} setIsOrg={setIsOrg}/>
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
        <PrivateRoute exact path="/discover" auth={isAuthenticated}>
          <Discover isAdmin={isAdmin}/>
        </PrivateRoute>

        <Route>
          <h1 style={{marginTop: "100px"}}>This page is not available.</h1>
        </Route>
      </Switch>

    </div>
    )
  );
}

export default App;