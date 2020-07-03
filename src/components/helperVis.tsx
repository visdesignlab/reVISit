function heatMap(d) {


    let eventTypes = [... new Set(props.data.map(d => d.label))];

    let data = [];

    ['before', 'after'].map(t => {
        eventTypes.map(e => {
            data.push({ x: t, y: e, color: Math.random() * 50 })
        })
    })

    return (
        <XYPlot width={150} height={200}
            xType="ordinal"
            xDomain={[... new Set(data.map(d => d.x))]}
            yType="ordinal"
            yDomain={[... new Set(data.map(d => d.y))]}
            margin={50}
        >
            <XAxis orientation="top" />
            <YAxis />
            <HeatmapSeries
                colorRange={["white", "#345d85"]}

                className="heatmap-series-example"
                data={data}
            />
            <LabelSeries
                style={{ pointerEvents: 'none' }}
                data={data}
                labelAnchorX="middle"
                labelAnchorY="baseline"
            // getLabel={d => `${d.label}`}
            />
        </XYPlot>)
}


function timeHeatMap(d) {


    let data = d.heatMap
    let newData = data.map((a, i) => { return { x: i, y: 0, color: a.freq } })
    return (
        <XYPlot width={150} height={20} >
            {/* <XAxis orientation="top" /> */}
            {/* <YAxis /> */}
            <HeatmapSeries
                colorRange={["white", "#1b423c"]}
                className="heatmap-series-example"
                data={newData}
            />
        </XYPlot>)
}

function targets(d, attr, label) {

    let ctrans = 'translate(80px, 0px)';
    var css = {
        transform: ctrans
    }

    ctrans = 'translate(-80px, 0px)';
    let css2 = {
        transform: ctrans
    }
    return (
        <div>{d.children.map(c => (
            (<Tooltip title="Click to create Base Event">
                <svg width={200} height={20} >
                    <g style={css} onClick={() => newEvent(c, d)}>
                        <text x={-10} y={20} style={{ 'text-anchor': "end" }} > {c[label]}</text>
                        <rect className='count' style={{ fill: "#345d85" }}
                            x={0}
                            width={scale(c[attr])}
                            height={20}></rect>
                        {/* <menuButton width={scale(c[attr])} />)} */}
                        <text x={scale(c[attr]) + 10} y={20}> {Math.round(c[attr] * 100)}</text>
                    </g>
                </svg>
            </Tooltip>)))
        }</div >
    )

}

function time() {

    return (
        <XYPlot
            xDomain={[timestamp - 2 * ONE_DAY, timestamp + 30 * ONE_DAY]}
            yDomain={[0.1, 2.1]}
            xType="time"
            width={300}
            height={300}
        >
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            <VerticalRectSeries data={DATA} style={{ stroke: '#fff' }} />
        </XYPlot>
    );

}