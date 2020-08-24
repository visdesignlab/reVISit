import React, { useContext } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ProvenanceDataContext from "../components/ProvenanceDataContext";
import Grid, { GridSpacing } from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import SortIcon from '@material-ui/icons/Sort';

import MetricMenu from '../components/MetricMenu'



// const useStyles = makeStyles((theme: Theme) =>
//     createStyles({
//         root: {
//             // backgroundColor: theme.palette.background.paper,
//             'padding-top': 0,
//             'padding-bottom': 0
//         },
//     }),
// );

const options = [
    { prompt: 'by task name', key: 'name' },
    { prompt: 'by task accuracy', key: 'accuracy' },
    { prompt: 'by task completion time', key: 'time' },
    { prompt: 'by difference in performance across conditions', key: 'diff' }
];

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        flexGrow: 1,
    },
    table: {
        padding: "10px",
    },
    condition: {
        fontSize: "1em",
        color:"white",
        paddingTop:"10px",
        cursor:'pointer'
    },
    sort:{
        cursor:'pointer',
        marginTop:'16px', 
        marginLeft:'5px'
    },
    bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)",
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function SortMenu() {

    const classes = useStyles();

    const { setTaskSort, metrics } = useContext(ProvenanceDataContext);

    let rowHeight = 50;

    return <>

        <React.Fragment key={'Menu'}>

            <Grid container className={classes.root} spacing={2}>
                <Grid item xs={12}>
                    <Grid container justify="flex-start" spacing={2}>

                        {/* <Grid key={"condition"} item>
                            <Box height={rowHeight} width={572} mt={"5px"} mb={"6px"} mr={'10px'} boxShadow={0} style={{ fontWeight:'bolder' }}>
                                <Typography className={classes.condition} variant="overline">
                                <SortIcon/> Condition
                            </Typography>                            </Box>

                        </Grid> */}

                        <Grid key={"tasks"} item>
                            <Box height={rowHeight} width={572} pt={"5px"} pb={"6px"} pr={'10px'} boxShadow={0} style={{ display:'inline-flex', fontWeight:'bolder'  }}>
                                <Typography
                                    className={classes.condition}
                                    variant="overline">
                                    Task Name
                                 </Typography>
                                 <SortIcon className={classes.sort}></SortIcon>
                                 
                            </Box>
                            </Grid>


                        <Grid key={"actions"} item>
                            <Box height={rowHeight} width={375} pt={"5px"} pb={"6px"} pr={'10px'} boxShadow={0} style={{ display:'inline-flex', fontWeight:'bolder'  }}>
                                <Typography
                                    className={classes.condition}
                                    variant="overline">
                                    Interaction Sequence Length
                                 </Typography>
                                 <SortIcon className={classes.sort}></SortIcon>

                                 
                            </Box>

                            <Box height={rowHeight} width={250} mt={"5px"} mb={"6px"} mr={'10px'} boxShadow={0} style={{display:'inline-flex',  fontWeight:'bolder'  }}>
                                <Typography
                                    className={classes.condition}
                                    variant="overline">
                                     Participant Count
                                 </Typography>
                                 <SortIcon className={classes.sort}></SortIcon>

                                 
                            </Box>

                        </Grid>
                        <Grid key={"metrics"} style={{display:'inline-flex'}} item>

                        {!metrics ? <></> : Object.keys(metrics).map(metric=>{
                        return  <Box height={rowHeight} mt={"5px"} mb={"6px"} mr={'15px'} boxShadow={0} style={{display:'inline-flex',   fontWeight:'bolder'  }}>
                            <Typography
                                className={classes.condition}
                                variant="overline">
                                 {metric}
                                </Typography>
                                <SortIcon  className={classes.sort}></SortIcon>

                        </Box>
                        })
                    }

                        <Box height={rowHeight} mt={"5px"} mb={"6px"} mr={'15px'} boxShadow={0} style={{display:'inline-flex',   fontWeight:'bolder'  }}>
                            <Typography
                                className={classes.condition}
                                variant="overline">
                                 Choose Metrics
                                </Typography>
                                <MetricMenu></MetricMenu>
                        </Box>


                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>

    </>




    // const classes = useStyles();
    // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    // const [selectedIndex, setSelectedIndex] = React.useState(0);

    // const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    //     setAnchorEl(event.currentTarget);
    // };

    // const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    //     setSelectedIndex(index);
    //     setTaskSort(options[index].key)
    //     setAnchorEl(null);

    // };

    // const handleClose = () => {
    //     setAnchorEl(null);
    // };

    // return (
    //     <div className={classes.root} style={{ display: "flex", flexDirection: "row-reverse" }}>
    //         <List component="nav" aria-label="Sort tasks" className={classes.root}>
    //             <ListItem
    //                 button
    //                 aria-haspopup="true"
    //                 aria-controls="lock-menu"
    //                 aria-label="Sort tasks"
    //                 onClick={handleClickListItem}
    //             >
    //                 <ListItemText primary="Sort tasks" secondary={options[selectedIndex].prompt} />
    //             </ListItem>
    //         </List>
    //         <Menu
    //             id="lock-menu"
    //             anchorEl={anchorEl}
    //             keepMounted
    //             open={Boolean(anchorEl)}
    //             onClose={handleClose}
    //         >
    //             {options.map((option, index) => (
    //                 <MenuItem
    //                     key={option.prompt}
    //                     // disabled={index === 0}
    //                     selected={index === selectedIndex}
    //                     onClick={(event) => handleMenuItemClick(event, index)}
    //                 >
    //                     {option.prompt}
    //                 </MenuItem>
    //             ))}
    //         </Menu>
    //     </div>
    // );
}
