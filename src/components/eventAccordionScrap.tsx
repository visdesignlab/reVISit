{
    patterns[d.name] && <ExpansionPanelDetails>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                {Object.keys(patterns[d.name].results).map(cond => {
                    let data = patterns[d.name].results[cond]

                    return <>
                        <Divider />
                        <Grid container justify="flex-start" spacing={2}>
                            <Divider />

                            <Grid item xs={12}>
                                <Typography variant='overline'>
                                    {cond}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <>
                                    <Typography className={classes.pos} variant='overline' color="primary"  >
                                        {data.length > 0 ? '5 Most Frequent Action Sequences' : 'This action was not used in this task for this condition'}
                                    </Typography>
                                    <Box mt={'5px'} mb={'6px'}>
                                        {data.map((s, i) =>
                                            <Box style={{ display: 'flex' }}>
                                                <Grid key={'icons'} item xs={10}>
                                                    <ProvenanceIsolatedNodes key={i} nodes={s.seq}></ProvenanceIsolatedNodes>
                                                </Grid>
                                                <Grid key={'rect'} item>
                                                    {rectangle(s, 'count')}
                                                </Grid>
                                            </Box>
                                        )}
                                    </Box>

                                </>
                            </Grid>




                        </Grid>

                    </>

                })}
            </Grid>
        </Grid>



        {/* <Typography className={classes.secondaryHeading}>Node Link</Typography> */}

        {/* 
<div className={classNames(classes.column, classes.helper)}>
    {data.map((s, i) => <ProvenanceIsolatedNodes key={i} nodes={s.seq}></ProvenanceIsolatedNodes>)
    }
</div>

<div className={classNames(classes.smallColumn, classes.helper)}>
    {data.map((s, i) => rectangle(s, 'count'))}
</div> */}

        {/* <Typography className={classes.secondaryHeading}>Adjacency Matrix</Typography>

<div className={classNames(classes.column, classes.helper)}>
    {patterns[d.name].adjMatrix.map((s, i) => <ProvenanceIsolatedNodes key={i} nodes={s.seq}></ProvenanceIsolatedNodes>)
    }
</div>

<div className={classNames(classes.smallColumn, classes.helper)}>
    {patterns[d.name].adjMatrix.map((s, i) => rectangle(s, 'count'))}
</div> */}


    </ExpansionPanelDetails>
}