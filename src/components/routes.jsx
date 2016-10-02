import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import LandingPage from './pages/LandingPage';
import AssignmentsPage from './pages/assignments/AssignmentsPage';


export default (
    <Route path="/" component={ App }>
        <IndexRoute component={ LandingPage }/>
        <Route path="/assignments"
            component={ AssignmentsPage }/>
    </Route>
);
