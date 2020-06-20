import React from "react";
import styles from "./SidePane.module.css";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CloudUpload from "@material-ui/icons/CloudUpload";
import TableChart from "@material-ui/icons/TableChart";
import GetApp from "@material-ui/icons/GetApp";
import BarChart from "@material-ui/icons/BarChart";
import { Link as RouterLink } from "react-router-dom";
const SidePane = ({}) => {
  return (
    <Drawer variant="permanent" anchor="left">
      <Divider />
      <List>
        <ListItem>
          <img className={styles.logo} src={"/Experi.png"}></img>
        </ListItem>
        {[
          { text: "Upload", to: "Upload", icon: <CloudUpload></CloudUpload> },
          { text: "Overview", to: "Overview", icon: <BarChart></BarChart> },
          {
            text: "Participant Table",
            to: "Table",
            icon: <TableChart></TableChart>,
          },
          { text: "Export", to: "Export", icon: <GetApp></GetApp> },
        ].map((item, index) => {
          return (
            <React.Fragment>
              {/*
            //@ts-ignore*/}
              <ListItem
                button
                ContainerComponent={() => (
                  <RouterLink to={item.to}></RouterLink>
                )}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            </React.Fragment>
          );
        })}
      </List>
      <Divider />
    </Drawer>
  );
};

export default SidePane;
