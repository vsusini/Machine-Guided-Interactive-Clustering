import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Landing from "./pages/landingPage/landing"
import {Questions} from "./pages/questions/questions"
import Summary from "./pages/summary/summary"

export default function Router() {
    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route exact path="/" render={() => <Landing />}/>
                    <Route path="/questions" render={() => <Questions />}/>
                    <Route path="/summary" render={() => <Summary/>}/>
                </Switch>
            </div>
        </BrowserRouter>
    );
}