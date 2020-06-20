import React from "react";
import styled from "styled-components";

import { Route, Switch, withRouter } from "react-router-dom";
import styles from "./Main.module.css";
import _ from "lodash";
import { relativeProvenanceData } from "./common/data/provenanceMocks.js";
import MaterialTableWrapper from "./components/ProvenanceTable";
import { TransitionGroup, CSSTransition } from "react-transition-group";

const Table = ({ location }) => {
  let newData = relativeProvenanceData[0].map((dataArr) => {
    return { provGraph: dataArr };
  });
  for (let i = 0; i < 2; i++) {
    newData = newData.concat(_.cloneDeep(newData));
  }
  return <MaterialTableWrapper provenanceData={newData} />;
};

const Main = ({ location }) => {
  return (
    <Wrapper>
      <TransitionGroup className="transition-group">
        <CSSTransition key={location.key} timeout={500} classNames="fade">
          <section className="route-section">
            <Switch location={location}>
              <Route path="/Table" component={Table}></Route>
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
