import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import AssignmentsPage from './pages/assignments/AssignmentsPage';
import CallPage from './pages/CallPage';
import LandingPage from './pages/LandingPage';


export default (
    <Route path="/" component={ App }>
        <IndexRoute component={ LandingPage }/>
        <Route path="/assignments"
            component={ AssignmentsPage }/>
        <Route path="/assignments/:assignmentId/call"
            component={ CallPage }/>
    </Route>
);
