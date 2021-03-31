import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LandingPage from './landingPage';
import LoggedInPage from './loggedInPage';


// main is stateless - dont need component
const Main = () => (
    <Switch>
        <Route exact path='/' component={LandingPage}/>
        <Route path='/logged-in-page' component={LoggedInPage}/>
    </Switch>
)

export default Main;