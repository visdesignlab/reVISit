/* eslint-disable no-use-before-define */
import React from 'react';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '700px',
        '& > * + *': {
            marginTop: theme.spacing(3),
        },
    },
}));

export default function Tags(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Autocomplete
                multiple
                id="tags-standard"
                options={props.groups}
                getOptionLabel={(option) => option.title}
                // defaultValue={[top100Films[13]]}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Groups"
                        placeholder="Add to Group"
                    />
                )}
            />
        </div>
    );
}
