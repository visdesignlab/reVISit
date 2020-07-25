import React from "react";
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';

import Box from '@material-ui/core/Box';

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
import ProvenanceDataContext from "./components/ProvenanceDataContext";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';


const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    typography: {
      // In Chinese and Japanese the characters are usually larger,
      // so a smaller fontsize may be appropriate.
      fontSize: 18,
    },
    appBar: {
      "background-color": '#ababab',
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },

    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);


const SidePane = ({ }) => {
  const {
    taskStructure,
    handleChangeSelectedTaskId,
    selectedTaskId,
  } = React.useContext(ProvenanceDataContext);

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


  let taskInfo = taskStructure.find(t => t.key == selectedTaskId);

  return (<div className={classes.root}>
    <CssBaseline />
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, {
            [classes.hide]: open,
          })}
        >
          <MenuIcon />
        </IconButton>
        <FormControl className={styles.SelectedTaskInput}>
          {/* <InputLabel id="demo-simple-select-label">Task</InputLabel> */}
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedTaskId}
            onChange={handleChangeSelectedTaskId}
            label="name">
            {taskStructure.map((value) => {
              return (
                <MenuItem key={value.key} value={value.key}>
                  {value.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        {/* {taskInfo.prompt} */}
        <Box ml={3} >
          <Typography variant="button" noWrap dangerouslySetInnerHTML={{ __html: taskInfo.prompt }} >
          </Typography>
        </Box>


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
      }}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </div>
      <Divider />
      <List>
        {/* <ListItem component={HomeLink}>
          <img className={styles.logo} src={"./Experi.png"}></img>
        </ListItem> */}
        {[
          { text: "Upload", link: Upload, icon: <CloudUpload></CloudUpload> },
          { text: "Provenance Prep ", link: Overview, icon: <BarChart></BarChart> },
          {
            text: "Provenance Analysis",
            link: Table,
            icon: <TableChart></TableChart>,
          },
          { text: "Export", link: Export, icon: <GetApp></GetApp> },
        ].map((item, index) => {
          return (
            //added key={index} to get rid of unique key error
            <React.Fragment key={index}>
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
    <main
      className={clsx(classes.content, {
        [classes.contentShift]: open,
      })}
    >
      <div className={classes.drawerHeader} />
      <Typography paragraph>
        Main Content Goes here
        </Typography>
    </main>
  </div>)
  // return (
  //   <Drawer variant="permanent" anchor="left">
  //     <Divider />
  //     <List>
  //       <ListItem component={HomeLink}>
  //         <img className={styles.logo} src={"./Experi.png"}></img>
  //       </ListItem>
  //       {[
  //         { text: "Upload", link: Upload, icon: <CloudUpload></CloudUpload> },
  //         { text: "Provenance Prep ", link: Overview, icon: <BarChart></BarChart> },
  //         {
  //           text: "Provenance Analysis",
  //           link: Table,
  //           icon: <TableChart></TableChart>,
  //         },
  //         { text: "Export", link: Export, icon: <GetApp></GetApp> },
  //       ].map((item, index) => {
  //         return (
  //           //added key={index} to get rid of unique key error
  //           <React.Fragment key={index}>
  //             <ListItem button component={item.link}>
  //               <ListItemIcon>{item.icon}</ListItemIcon>
  //               <ListItemText primary={item.text} />
  //             </ListItem>
  //           </React.Fragment>
  //         );
  //       })}
  //     </List>
  //     <Divider />
  //     <FormControl variant="outlined" className={styles.SelectedTaskInput}>
  //       <InputLabel id="demo-simple-select-outlined-label">Task</InputLabel>
  //       <Select
  //         labelId="demo-simple-select-outlined-label"
  //         id="demo-simple-select-outlined"
  //         value={selectedTaskId}
  //         onChange={handleChangeSelectedTaskId}
  //         label="name">
  //         {taskStructure.map((value) => {
  //           return (
  //             <MenuItem key={value.key} value={value.key}>
  //               {value.name}
  //             </MenuItem>
  //           );
  //         })}
  //       </Select>
  //     </FormControl>
  //   </Drawer>
  // );
};

export default SidePane;
