import React from "react";
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from "@material-ui/core/styles";
import clsx from "clsx";

import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";

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
import { Link, LinkProps, useLocation } from "react-router-dom";
import ProvenanceDataContext from "./components/ProvenanceDataContext";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ComputerIcon from "@material-ui/icons/Computer";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import HomeIcon from "@material-ui/icons/Home";
import { ActionLegend } from "./components/ActionLegend";
import SortMenu from "./components/sortMenu";

const drawerWidth = 260;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    typography: {
      // In Chinese and Japanese the characters are usually larger,
      // so a smaller fontsize may be appropriate.
      fontSize: 18,
    },
    appBar: {
      "background-color": "#ababab",
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: "none",
    },

    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

const SidePane = ({}) => {
  const {
    taskList,
    loadingTaskList,
    handleChangeSelectedTaskId,
    selectedTaskId,
  } = React.useContext(ProvenanceDataContext);

  let selectedPrompt =
    taskList && selectedTaskId
      ? taskList.find((p) => p.taskID == selectedTaskId).prompt
      : "";
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const HomeLink = React.forwardRef<
    HTMLAnchorElement,
    Omit<LinkProps, "innerRef" | "to">
  >((props, ref) => <Link innerRef={ref as any} to="/Home" {...props} />);
  const StudyLink = React.forwardRef<
    HTMLAnchorElement,
    Omit<LinkProps, "innerRef" | "to">
  >((props, ref) => <Link innerRef={ref as any} to="/Study" {...props} />);
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
  // console.log(
  //   "task list",
  //   loadingTaskList,
  //   taskList,
  //   "value",
  //   !loadingTaskList && taskList,
  //   "end"
  // );
  //let taskInfo = taskList.find((t) => t.id == selectedTaskIds[0]);

  let location = useLocation();
  function appBarWidget() {
    if (location.pathname.includes("Home")) {
      return <SortMenu></SortMenu>;
    } else {
      return (
        <>
          <FormControl className={styles.SelectedTaskInput}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedTaskId}
              onChange={handleChangeSelectedTaskId}
              label="name">
              {!loadingTaskList &&
                taskList &&
                taskList.map((value) => {
                  return (
                    <MenuItem key={value.taskID} value={value.taskID}>
                      {value.taskID}
                    </MenuItem>
                  );
                })}
              {loadingTaskList && (
                <Skeleton
                  variant="rect"
                  width={"200"}
                  height={50}
                  style={{ margin: "20px", padding: "20px" }}>
                  Loading task selector
                </Skeleton>
              )}
            </Select>
          </FormControl>
          <Box ml={3}>
            <Typography variant="button" noWrap>
              {selectedPrompt}
            </Typography>
          </Box>
        </>
      );
    }
  }

  function makeIcon(item) {
    let isCurrent = location.pathname.includes(item.id);
    const Icon = item.icon;
    return isCurrent ? (
      <Icon style={{ color: "rgb(93, 131, 210)" }}> </Icon>
    ) : (
      <Icon></Icon>
    );
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}>
            <MenuIcon />
          </IconButton>

          {appBarWidget()}
          {/* {taskInfo.prompt} */}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}>
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {[
            {
              text: "Task Overview",
              id: "Home",
              link: HomeLink,
              icon: HomeIcon,
            },
            {
              text: "Participant Timeline",
              id: "Study",
              link: StudyLink,
              icon: ComputerIcon,
            },
            // { text: "Upload", id: "Upload", link: Upload, icon: CloudUpload },
            // {
            //   text: "Provenance Prep ",
            //   id: "Overview",
            //   link: Overview,
            //   icon: BarChart,
            // },
            {
              text: "Task Analysis",
              link: Table,
              id: "Table",
              icon: TableChart,
            },
            // { text: "Export", link: Export, icon: GetApp },
          ].map((item, index) => {
            return (
              //added key={index} to get rid of unique key error
              <React.Fragment key={index}>
                <ListItem button component={item.link}>
                  <ListItemIcon>{makeIcon(item)}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              </React.Fragment>
            );
          })}
        </List>

        <Divider />
        <ActionLegend collapsed={!open}></ActionLegend>
      </Drawer>
    </div>
  );
};

export default SidePane;
