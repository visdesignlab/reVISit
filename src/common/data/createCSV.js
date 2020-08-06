





// console.log("relative", allProvenanceData);

// code to create actionTable
// useEffect(() => {
//   console.log('running ', allProvenanceData)
//   // participantID	taskID	condition	eventID	time	target
//   // create action table
//   let headers = ["participantID", "taskID", "condition", "actionID", "time", "target"]
//   let rows = [headers]
//   allProvenanceData.map(p => {
//     let tasks = Object.keys(p.data).filter(t => t.includes('task'));

//     tasks.map(task => {
//       let taskInfo = p.data[task]
//       let actions = taskInfo.provenance;
//       actions.map(a => {
//         let time = new Date(a.time)
//         rows.push([p.id, taskInfo.taskID, taskInfo.visType, a.id, time.toString(), 'none'])
//       })
//     })
//   })

//   let csvContent = rows.map(e => e.join(",")).join("\n");

//   let data = URL.createObjectURL(new Blob([csvContent], { type: 'text/plain' }));

//   let link = document.createElement("a");
//   var url = data;
//   link.setAttribute("href", url);
//   link.setAttribute("download", 'actions.csv');
//   link.style.visibility = 'hidden';
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);

// }, [])

//code to create participant table
// useEffect(() => {
//   // participantID	taskID	condition	eventID	time	target
//   // create action table
//   console.log(allProvenanceData)
//   let headers = ["participantID", "averageAccuracy", "degree", "sex", "age", "visExperience", "minutesToComplete", "trainingFeedbackScore"]
//   let rows = [headers]
//   allProvenanceData.map(p => {
//     let data = p.data;

//     rows.push([p.id, data.averageAccuracy, data.demographics.degree, data.demographics.sex, data.demographics.age, data.demographics.vis_experience, data.overallMinutesToComplete, data.overallFeedback.training.helpful])

//   })

//   let csvContent = rows.map(e => e.join(",")).join("\n");

//   let data = URL.createObjectURL(new Blob([csvContent], { type: 'text/plain' }));

//   let link = document.createElement("a");
//   var url = data;
//   link.setAttribute("href", url);
//   link.setAttribute("download", 'participants.csv');
//   link.style.visibility = 'hidden';
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);

// }, [])

//code to create performanceTable
// useEffect(() => {
//   // participantID	taskID	condition	eventID	time	target
//   // create action table
//   let headers = ["participantID", "taskID", "Condition", "Accuracy", "Time", "Order", "Confidence", "Difficulty", "Answer"]
//   let rows = [headers]
//   allProvenanceData.map(p => {
//     let tasks = Object.keys(p.data).filter(t => t.includes('task'));

//     tasks.map(task => {
//       let taskInfo = p.data[task]
//       rows.push([p.id, taskInfo.taskID, taskInfo.visType, taskInfo.answer.accuracy, taskInfo.minutesOnTask, taskInfo.order, taskInfo.feedback.confidence, taskInfo.feedback.difficulty, taskInfo.answer.value.replace(/,/g, '').replace(/\r?\n|\r/g, '')])
//     })
//   })

//   let csvContent = rows.map(e => e.join(",")).join("\n");

//   let data = URL.createObjectURL(new Blob([csvContent], { type: 'text/plain' }));

//   let link = document.createElement("a");
//   var url = data;
//   link.setAttribute("href", url);
//   link.setAttribute("download", 'performance.csv');
//   link.style.visibility = 'hidden';
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);

// }, [])



// code to create eventTable
useEffect(() => {
    console.log('running ', eventData)
    // participantID	taskID	condition	eventID	time	target
    // create action table
    let actionHeaders = ["participantID", "eventID", "time", "level"]
    let actionRows = [actionHeaders];
    let eventHeaders = ["participantID", "eventID", "startTime", "endTime", "taskID", "condition", "level"]
    let eventRows = [eventHeaders];

    let eventLabels = [];
    eventData.map(p => {
        //find condition for this participant: 
        let d = allProvenanceData.find(d => d.id == p.id);

        if (!d) {
            console.log('could not find data for participant', p)
        } else {
            // console.log('found', d, ' for ', p)
            p.provEvents.map(event => {
                if (event.type == 'longAction') {
                    let startTime = (new Date(event.startTime));

                    let endTime = (new Date(event.endTime))

                    if (!endTime.toString().includes('Invalid')) {
                        let end = endTime.toISOString().slice(0, 19).replace("T", ' ')
                        let start = startTime.toISOString().slice(0, 19).replace("T", ' ')
                        eventLabels.push(event.label)
                        eventRows.push([p.id, event.label, start, end, event.task, d.data['S-task01'].visType, event.level])
                    }
                } else {
                    let timeDAte = new Date(event.time)
                    let time = timeDAte.toISOString().slice(0, 19).replace("T", ' ')
                    actionRows.push([p.id, event.label, time, event.level])
                }

            })
        }

    })

    console.log([... new Set(eventLabels)])

    let csvContent = eventRows.map(e => e.join(",")).join("\n");
    let data = URL.createObjectURL(new Blob([csvContent], { type: 'text/plain' }));

    let link = document.createElement("a");
    var url = data;
    link.setAttribute("href", url);
    link.setAttribute("download", 'events.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);


    // csvContent = actionRows.map(e => e.join(",")).join("\n");
    // data = URL.createObjectURL(new Blob([csvContent], { type: 'text/plain' }));

    // link = document.createElement("a");
    // url = data;
    // link.setAttribute("href", url);
    // link.setAttribute("download", 'studyActions.csv');
    // link.style.visibility = 'hidden';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

}, [])

// code to create actionTable
useEffect(() => {
    console.log('running ', allProvenanceData)
    // participantID	taskID	condition	eventID	time	target
    // create action table
    let headers = ["participantID", "taskID", "condition", "actionID", "time", "target"]
    let rows = [headers]
    allProvenanceData.map(p => {
        let tasks = Object.keys(p.data).filter(t => t.includes('task'));

        tasks.map(task => {
            let taskInfo = p.data[task]
            let actions = taskInfo.provenance;
            actions.map(action => {
                let timeDate = new Date(action.time)
                let time = timeDate.toISOString().slice(0, 19).replace("T", ' ')

                rows.push([p.id, taskInfo.taskID, taskInfo.visType, action.id, time, 'none'])
            })
        })
    })

    let csvContent = rows.map(e => e.join(",")).join("\n");

    let data = URL.createObjectURL(new Blob([csvContent], { type: 'text/plain' }));

    let link = document.createElement("a");
    var url = data;
    link.setAttribute("href", url);
    link.setAttribute("download", 'actions.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

}, [])
