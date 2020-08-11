import React from "react";
import styled from "styled-components";

import { Route, Switch, withRouter } from "react-router-dom";
import styles from "./Main.module.css";
import _ from "lodash";
import { relativeProvenanceData } from "./common/data/provenanceMocks.js";
import MaterialTableWrapper from "./components/ProvenanceTable";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Home from "./pages/Home";
import Study from "./pages/Study";
import Upload from "./pages/Upload";
import Overview from "./pages/Overview";
import Export from "./pages/Export";
import Table from "./pages/Table";

const Main = ({ location }) => {
  return (
    <Wrapper>
      <TransitionGroup className="transition-group">
        <CSSTransition key={location.key} timeout={500} classNames="fade">
          <section className="route-section">
            <Switch location={location}>
              <Route path="/Home" component={Home}></Route>
              <Route path="/Study" component={Study}></Route>
              <Route path="/Upload" component={Upload}></Route>
              <Route path="/Overview" component={Overview}></Route>
              <Route path="/Table" component={Table}></Route>
              <Route path="/Export" component={Export}></Route>
            </Switch>
          </section>
        </CSSTransition>
      </TransitionGroup>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .fade-enter {
    opacity: 0.01;
  }

  .fade-enter.fade-enter-active {
    opacity: 1;
    transition: opacity 300ms ease-in;
  }

  .fade-exit {
    opacity: 1;
  }

  .fade-exit.fade-exit-active {
    opacity: 0.01;
    transition: opacity 300ms ease-in;
  }

  div.transition-group {
    position: relative;
  }

  section.route-section {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
  }
`;
export default withRouter(Main);
