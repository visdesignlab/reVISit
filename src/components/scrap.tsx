scrap

let provDict = {};

currentTaskData.map((data) => {
    let lastAction;

    data.provenance.map((event, i) => {
        let eventName = event.event;
        let instance = {
            event: eventName,
            taskID: data.taskID,
            participantID: data.workerID,
            condition: data.visType,
            time: event.time,
            target: [],
            actionBefore: i > 0 ? lastAction : undefined,
            actionAfter: undefined,
            taskAccuracy: data.answer.accuracy,
            taskMinutes: data.minutesToComplete,
        };

        if (lastAction) {
            lastAction.actionAfter = instance;
        }
        lastAction = instance;

        if (!provDict[eventName]) {
            provDict[eventName] = { sequences: [], instances: [] }
        }

        provDict[eventName].instances.push(instance)

    })
});

console.log(provDict)

//map each event to a numeric index for sequence matching
let eventNames = Object.keys(provDict).map((k, i) => ({
    name: k, index: i
}))

console.log(eventNames)


let sequences = [];
//create sequence arrays
currentTaskData.map(data => {
    let user_task_seq = [];

    data.provenance.map((event, i) => {
        let eventName = event.event
        let eventNumber = eventNames.find(e => e.name == eventName).index;
        user_task_seq.push(eventNumber)
    })

    //remove duplicates
    let nodups = removeDuplicates(user_task_seq);
    let seqObj = { visType: data.visType, task: data.taskID, seq: user_task_seq, sum_seq: nodups }
    sequences.push(seqObj);

    //remove duplicates to iterate through unique provenance events
    let uniqueProvenance = removeDuplicates(data.provenance.map(p => p.event));
    uniqueProvenance.map(eventName => {
        provDict[eventName].sequences.push(seqObj)
    })


})

//double check provDict.sequences;
Object.keys(provDict).map(key => {
    provDict[key].sequences.map(s => {
        let eventIndex = eventNames.find(e => e.name == key).index
        if (!s.seq.includes(eventIndex)) {
            console.log('we have a problem')
        }
    })
})

let seq = sequences;
let allEvents = Object.keys(provDict).map((k) => {
    return {
        // title: () => (
        //   <ItemNameWrapper
        //     itemName={d}
        //     itemIcon={<EcoIcon />}
        //     onItemNameChange={(name) => console.log("to change", name)}
        //   />
        // ),
        event: k,
        key: k,
        type: "nativeEvent",
        instances: provDict[k].instances,
        sequences: provDict[k].sequences,
        count: provDict[k].instances.length,
        children: [],
        patterns: {}
    };
});

console.log('seq', seq)

let data = allEvents.sort((a, b) => (a.count > b.count ? -1 : 1));
// const [data, setData] = React.useState(
//   allEvents.sort((a, b) => (a.count > b.count ? -1 : 1))
// );

const [patterns, setPatterns] = React.useState({})


async function getPatterns(seq) {

    let array = await d3.json('http://127.0.0.1:5000/prefix', {
        // d3.json('http://18.222.101.54/prefix', {
        method: "POST",
        body: JSON.stringify(seq.map(s => s['seq'])),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    let results = array.sort((a, b) => a[0] > b[0] ? 1 : -1).map(arr => {
        return ({
            count: arr[0], seq: arr[1].map(e => ({ event: eventNames.find(ev => ev.index == e).name }))
        })
    })
    return results
}

//fetch the pattern data once the component has mounted
React.useEffect(() => {
    async function fetchData() {

        let patternObj = {};

        Object.keys(allEvents).map(k => {
            patternObj[k] = { nlPatterns: [], amPatterns: [] }
        });



        Promise.all(allEvents.map(async (ev) => {
            let nodeLink = ev.sequences.filter(s => s.visType == 'nodeLink');
            let adjMatrix = ev.sequences.filter(s => s.visType == 'adjMatrix');

            // You can await here
            const nlPatterns = await getPatterns(nodeLink);
            const amPatterns = await getPatterns(adjMatrix);

            patternObj[ev.event] = { nlPatterns, amPatterns }

        }))

            .then(() => {
                // patternObj['all'] = sequences;
                setPatterns(patternObj);
                console.log('patternObj', patternObj)

            })
        // ...
    }
    fetchData();


    console.log('useEffect')

}, currentTaskData);



let patternComponent
if (Object.keys(patterns).length > 0) {
    console.log('patterns are ', patterns)
    // patternComponent = 'loading'

    patternComponent = <EventAccordion data={data} patterns={patterns} />
    // patternComponent = <EventAccordion data={data} patterns={patterns} onChange={setData} />

} else {
    patternComponent = 'loading'
}

function createEvent(value) {
    {
        setSearch("");
        console.log("new Event is", value);
        newEvent(value);
        let newEvent = {
            event: value,
            instances: [],
            count: 0,
            type: "customEvent",
            key: value,
            // heatMap: [...Array(30).keys()].map(d => ({ freq: Math.round(Math.random() * 50) })),
            children: [],
        };
        const newData = [newEvent, ...data];
        newEvent(newData);
    }
}


// console.log(d.type)

switch (d.type) {
    case 'nativeEvent':

        icon = <Tooltip title="Copy Event to Custom Group">
            {/* <Action /> */}
        </Tooltip>
    case 'nativeEvent_filtered':
        icon = <Tooltip title="Copy Event to Custom Group">
            {/* <ActionFilter /> */}
        </Tooltip>

    case 'customEvent':
        icon = <Tooltip title="Copy Event to Custom Group">
            <HomeIcon />
        </Tooltip>
        break;

}


// let seq = props.patterns; //.filter(p => p.seq.filter(e => e.event == d.event).length > 0)
// console.log('d.key is ', d.key)

<ExpansionPanelDetails className={classes.details}>
    {/* <div className={classes.column} /> */}
    {/* <div className={classNames(classes.helper)}>
                    <Tags groups={props.data.filter(f => f.type == 'customEvent').map(d => ({ title: d.label }))} />
                </div> */}

    <div className={classNames(classes.column, classes.helper)}>
        {seq[d.key].nlPatterns.map((s, i) => <ProvenanceIsolatedNodes key={i} nodes={s.seq}></ProvenanceIsolatedNodes>)
        }
    </div>

    <div className={classNames(classes.smallColumn, classes.helper)}>
        {seq[d.key].nlPatterns.map((s, i) => rectangle(s, 'count'))}
    </div>

    <div className={classNames(classes.column, classes.helper)}>
        {seq[d.key].amPatterns.map((s, i) => <ProvenanceIsolatedNodes key={i} nodes={s.seq}></ProvenanceIsolatedNodes>)
        }
    </div>

    <div className={classNames(classes.smallColumn, classes.helper)}>
        {seq[d.key].amPatterns.map((s, i) => rectangle(s, 'count'))}
    </div>


</ExpansionPanelDetails>
    <Divider />
    <ExpansionPanelDetails>
        <div>
            <Tags groups={props.data.filter(f => f.type == 'customEvent').map(d => ({ title: d.label }))} />
        </div>
    </ExpansionPanelDetails>