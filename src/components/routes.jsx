import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import AssignmentsPage from './pages/assignments/AssignmentsPage';
import CallPage from './pages/CallPage';
import EndPage from './pages/EndPage';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';


export default (
    <Route path="/" component={ App }>
        <IndexRoute component={ LandingPage }/>
        <Route path="/assignments"
            component={ AssignmentsPage }/>
        <Route path="/assignments/:assignmentId/call"
            component={ CallPage }/>
        <Route path="/end"
            component={ EndPage }/>
        <Route id="404" path="*"
            component={ NotFoundPage }/>
    </Route>
);
