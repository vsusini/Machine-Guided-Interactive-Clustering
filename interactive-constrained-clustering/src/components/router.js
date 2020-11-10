import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Landing from "./pages/landingPage/landing"
import { Questions } from "./pages/questions/questions"
import Summary from "./pages/summary/summary"
import { AppContext } from "../App"

export default function Router() {
    let handleRedirect = (c) => {
        c.pythonRestart()
        return <Redirect to="/" />
    }


    return (
        <AppContext.Consumer>
            {context => (
                <BrowserRouter>
                    <div>
                        <Switch>
                            <Route exact path="/" render={() => <Landing />} />
                            <Route exact path="/questions"
                                render={() => {
                                    return (
                                        context.inputVerified && context.pythonPass ?
                                            <Questions /> :
                                            handleRedirect(context)
                                    )
                                }}
                            />
                            <Route exact path="/summary"
                                render={() => {
                                    return (
                                        context.inputVerified ?
                                            <Summary /> :
                                            <Redirect to="/" />
                                    )
                                }}
                            />
                        </Switch>
                    </div>
                </BrowserRouter>
            )}
        </AppContext.Consumer>
    );
}