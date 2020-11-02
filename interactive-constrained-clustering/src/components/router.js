import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Landing from "./pages/landingPage/landing"
import {Questions} from "./pages/questions/questions"
import Summary from "./pages/summary/summary"

export default function Router() {
    return (
        <BrowserRouter>
            <div>
                <Link to="/">
                    <button>Home</button>
                </Link>
                <Link to="/questions"><button>Questions</button></Link>
                <Link to="/summary"><button>Finish</button></Link>
                <Switch>
                    <Route exact path="/" render={() => <Landing />}>
                    </Route>
                    <Route path="/questions">
                        <Questions />
                    </Route>
                    <Route path="/summary">
                        <Summary />
                    </Route>    
                </Switch>
            </div>
        </BrowserRouter>
    );
}