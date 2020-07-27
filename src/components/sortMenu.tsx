import React, { useContext } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ProvenanceDataContext from "../components/ProvenanceDataContext";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // backgroundColor: theme.palette.background.paper,
            'padding-top': 0,
            'padding-bottom': 0
        },
    }),
);

const options = [
    { prompt: 'by task name', key: 'name' },
    { prompt: 'by task accuracy', key: 'accuracy' },
    { prompt: 'by task completion time', key: 'time' },
    { prompt: 'by difference in performance across conditions', key: 'diff' }
];

export default function SortMenu() {

    const { setTaskSort } = useContext(ProvenanceDataContext);


    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
        setSelectedIndex(index);
        setTaskSort(options[index].key)
        setAnchorEl(null);

    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
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
                    <MenuItem
                        key={option.prompt}
                        // disabled={index === 0}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                    >
                        {option.prompt}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}
