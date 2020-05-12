import React from "react";
import { withRouter } from "react-router-dom";
import styles from "./Main.module.css";

const Main = ({ location }) => {
  return <div className={styles.main}></div>;
};

export default withRouter(Main);
