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
import { Link, LinkProps } from "react-router-dom";
const SidePane = ({}) => {
  const HomeLink = React.forwardRef<
    HTMLAnchorElement,
    Omit<LinkProps, "innerRef" | "to">
  >((props, ref) => <Link innerRef={ref as any} to="/Home" {...props} />);
  const Upload = React.forwardRef<
    HTMLAnchorElement,
    Omit<LinkProps, "innerRef" | "to">
  >((props, ref) => <Link innerRef={ref as any} to="/Upload" {...props} />);
  const Overview = React.forwardRef<
    HTMLAnchorElement,
    Omit<LinkProps, "innerRef" | "to">
  >((props, ref) => <Link innerRef={ref as any} to="/Overview" {...props} />);
  const Table = React.forwardRef<
    HTMLAnchorElement,
    Omit<LinkProps, "innerRef" | "to">
  >((props, ref) => <Link innerRef={ref as any} to="/Table" {...props} />);
  const Export = React.forwardRef<
    HTMLAnchorElement,
    Omit<LinkProps, "innerRef" | "to">
  >((props, ref) => <Link innerRef={ref as any} to="/Export" {...props} />);
  return (
    <Drawer variant="permanent" anchor="left">
      <Divider />
      <List>
        <ListItem component={HomeLink}>
          <img className={styles.logo} src={"./Experi.png"}></img>
        </ListItem>
        {[
          { text: "Upload", link: Upload, icon: <CloudUpload></CloudUpload> },
          { text: "Overview", link: Overview, icon: <BarChart></BarChart> },
          {
            text: "Participant Table",
            link: Table,
            icon: <TableChart></TableChart>,
          },
          { text: "Export", link: Export, icon: <GetApp></GetApp> },
        ].map((item, index) => {
          return (
            <React.Fragment>
              <ListItem button component={item.link}>
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
