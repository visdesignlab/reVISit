import React, { useState, useContext } from 'react';
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

import CheckBox from '../components/CheckBox'



// const useStyles = makeStyles((theme: Theme) =>
//     createStyles({
//         root: {
//             // backgroundColor: theme.palette.background.paper,
//             'padding-top': 0,
//             'padding-bottom': 0
//         },
//     }),
// );



const useStyles = makeStyles({
    root: {
        minWidth: 275,
        flexGrow: 1,
        padding:'0px'
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

function MenuWrapper({option,index,handleMenuItemClickCallback,setHoveredRowCallback,hoveredRow,selectedIndex,conditions}){

    let initialState = {}
    conditions.map(c=>initialState[c] = true)
    const [filterConditions,setConditions] = useState(initialState)

    function checkBoxCallback(condition,checked){
        let currentState = {... filterConditions}
        currentState[condition]=checked;
        setConditions(currentState)
        
    }

    let checkboxes = conditions.map(c=><CheckBox key = {c} visible = {(index == hoveredRow || index == selectedIndex ) && option.type !== 'global'} condition ={c} checkBoxCallback={checkBoxCallback}></CheckBox>) 

    return (<MenuItem
    key={option.prompt}
    // disabled={index === 0}
    selected={index === selectedIndex}
    onClick={(event) => handleMenuItemClickCallback(event, index,{desc:true, metric:option['key'],conditions:filterConditions})}
    onMouseEnter={()=>setHoveredRowCallback(index)}
    onMouseLeave={()=>setHoveredRowCallback(selectedIndex)}
>
    {<div style={{ 'width': '150px' }} > <Typography
        // style={{ display: "block" }}
        color="primary"
        variant="overline">
        {option.prompt}
    </Typography></div>} 
    <div onClick={(evt)=>evt.stopPropagation()}>
    {checkboxes}
        </div> 
    
</MenuItem>)
}


export default function SortMenu() {

    
    const { metrics, conditions,setHomeTaskSort } = useContext(ProvenanceDataContext);


    let options = [{ prompt: 'by Task Name', key: 'name' , type:'global'}]; 

    if (metrics){
        Object.keys(metrics).map(m=>options.push({ prompt: 'by ' + m, key: m , type:'metric'}))
    }
        
        // { prompt: 'by Task ', key: 'accuracy' },
        // { prompt: 'by task completion time', key: 'time' },
        // { prompt: 'by difference in performance across conditions', key: 'diff' }


    // console.log('metrics are ', metrics)

    // console.log('conditions', conditions)



    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);


    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        // console.log('handleClickListItem')
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number, sortObj) => {
        setSelectedIndex(index);
        setHomeTaskSort(sortObj)
        // console.log('handleMenuItemClick')

        // setTaskSort(options[index].key)
        setAnchorEl(null);

    };

    let [hoveredRow,setHoveredRow] = useState(selectedIndex)

    let setHoveredRowCallback = (value)=>{
        setHoveredRow (value)
    }

    const handleClose = () => {
        setAnchorEl(null);
    };


    return ( !conditions ? <></> : 
        <div className={classes.root} style={{ display: "flex", flexDirection: "row-reverse" }}>
            <List component="nav" aria-label="Sort tasks" className={classes.root}>
                <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="Sort tasks"
                    onClick={handleClickListItem}
                >
                    <ListItemText primary="Sort tasks" secondary={options[selectedIndex].prompt} />
                </ListItem>
            </List>
            <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {options.map((option, index) => (
                  <MenuWrapper key={option.prompt} hoveredRow={hoveredRow} selectedIndex= {selectedIndex} conditions= {conditions} setHoveredRowCallback={setHoveredRowCallback} handleMenuItemClickCallback = {handleMenuItemClick} option={option} index={index}></MenuWrapper>  
                ))}
            </Menu>
        </div>
    );
}

    // <>

       // const classes = useStyles();

    // function MetricAxis({ data, axisLength }) {
    //     let padding = 20
    //     let width  = axisLength + 2*padding
    //     let height = 50
    //     return typeof(data.range[0]) == 'string' ? null : <svg height={height} width={width}>
    //         <line
    //             x1={padding}
    //             y1={height/2}
    //             x2={axisLength+padding}
    //             y2={height/2}
    //             style={{ stroke: "white", strokeWidth: 1 }}></line>
    //             <text
    //             style={{
    //               fontSize: "1em",
    //               textAnchor: "middle",
    //               fill:"white" ,
    //                 fontWeight:'400'               }}
               
    //             x={padding+axisLength/2}
    //             y={height/2-5}>
    //             {" "}
    //             {data.metric.toUpperCase()}{" "}
    //           </text>


    //             <text
    //             style={{
    //               fontSize: "1em",
    //               textAnchor: "end",
    //               fill:"white" ,
    //               alignmentBaseline:'middle'                 }}
                 
    //             x={padding - 3}
    //             y={height/2}>
    //             {" "}
    //             {data.range[0]}{" "}
    //           </text>
    //           <text
    //             style={{
    //               fontSize: "1em",
    //               textAnchor: "start",
    //               fill:"white" ,
    //             alignmentBaseline:'middle'               }}
               
    //             x={axisLength+padding}
    //             y={height/2}>
    //             {" "}
    //             {data.range[1]}{" "}
    //           </text>
    //           <g style={{transform:"translate(" + (padding + axisLength/2) + 'px,' + (height/2 + 5) + 'px)'}}>   
    //           <SortIcon  width={'16px'} height={'16px'} className={classes.sort}></SortIcon>

    //           </g>
              


    //     </svg>
    // }

    //     <React.Fragment key={'Menu'}>

    //         <Grid container className={classes.root} spacing={2}>
    //             <Grid item xs={12}>
    //                 <Grid container justify="flex-start" spacing={2}>

    //                     {/* <Grid key={"condition"} item>
    //                         <Box height={rowHeight} width={572} mt={"5px"} mb={"6px"} mr={'10px'} boxShadow={0} style={{ fontWeight:'bolder' }}>
    //                             <Typography className={classes.condition} variant="overline">
    //                             <SortIcon/> Condition
    //                         </Typography>                            </Box>

    //                     </Grid> */}

    //                     <Grid key={"tasks"} item>
    //                         <Box height={rowHeight} width={572} pt={"5px"} pb={"6px"} pr={'10px'} boxShadow={0} style={{ display:'inline-flex', fontWeight:'bolder'  }}>
    //                             <Typography
    //                                 className={classes.condition}
    //                                 variant="overline">
    //                                 Task Name
    //                              </Typography>
    //                              <SortIcon className={classes.sort}></SortIcon>
                                 
    //                         </Box>
    //                         </Grid>


    //                     <Grid key={"actions"} item>
    //                         <Box height={rowHeight} width={375} pt={"5px"} pb={"6px"} pr={'10px'} boxShadow={0} style={{ display:'inline-flex', fontWeight:'bolder'  }}>
    //                             <Typography
    //                                 className={classes.condition}
    //                                 variant="overline">
    //                                 Interaction Sequence Length
    //                              </Typography>
    //                              <SortIcon className={classes.sort}></SortIcon>

                                 
    //                         </Box>

    //                         <Box height={rowHeight} width={250} mt={"5px"} mb={"6px"} mr={'10px'} boxShadow={0} style={{display:'inline-flex',  fontWeight:'bolder'  }}>
    //                             <Typography
    //                                 className={classes.condition}
    //                                 variant="overline">
    //                                  Participant Count
    //                              </Typography>
    //                              <SortIcon className={classes.sort}></SortIcon>

                                 
    //                         </Box>

    //                     </Grid>
    //                     <Grid key={"metrics"} style={{display:'inline-flex'}} item>

    //                     {!metrics ? <></> : Object.keys(metrics).map(metric=>{
    //                         let range = metrics[metric];
    //                         let labelLength = metric.length * 10;
    //                     return  <Box height={rowHeight} mt={"5px"} mb={"6px"} mr={'15px'} boxShadow={0} style={{display:'inline-flex',   fontWeight:'bolder'  }}>
    //                         {/* <Typography
    //                             className={classes.condition}
    //                             variant="overline">
    //                              {metric}
    //                             </Typography> */}
    //                             <MetricAxis data={{metric,range}} axisLength={labelLength}></MetricAxis>

    //                     </Box>
    //                     })
    //                 }

    //                     {/* <Box height={rowHeight} mt={"5px"} mb={"6px"} mr={'15px'} boxShadow={0} style={{display:'inline-flex',   fontWeight:'bolder'  }}>
    //                         <Typography
    //                             className={classes.condition}
    //                             variant="overline">
    //                              Choose Metrics
    //                             </Typography>
    //                     </Box> */}


    //                     </Grid>

    //                 </Grid>
    //             </Grid>
    //         </Grid>
    //     </React.Fragment>

    // </>



