console.log("running node script");
("use strict");

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
let studyParticipants = require(`./study_participants`);

const fs = require("fs");

// require("../libs/firebase-app.js");
let firestore = require("./firebaseApi.js");
let db = firestore.connect();
// export const fireFetch = async (mode) => {
//   let mode = process.argv[2];
//   console.log("mode is ", mode);
//   switch (mode) {
//     case "results":
//       await fetchResults();
//       break;
//     case "provenance":
//       return await fetchProvenance();
//       break;
//     case "updateResults": //uploads graded results to firebase.
//       await writeResults();
//       break;
//     case "test": //uploads graded results to firebase.
//       await writeSkinnyProvenance('545d6768fdf99b7f9fca24e3');
//       break;
//   }
// };
// (async function () { })();

(async function () {
  //get all participants;
  // studyParticipants.map(async (participant, i) => {
  //   // if (i < 10) {
  //   await writeSkinnyProvenance(participant)
  //   // }
  // })
  // fetchSkinnyProvenance();
  let NL_example = "545d6768fdf99b7f9fca24e3_S-task01";
  let AM_example = "546e3c21fdf99b2b8df983fd_S-task01";
  // getRawProvenance(NL_example);
  // getRawProvenance(AM_example);
  getRawProvenance();
  // fetchProvenance();
  console.log("done");
})();

async function fetchSkinnyProvenance() {
  let querySnapshot = await db.collection("provenance_summary").get();

  let provenance_summary = [];
  querySnapshot.forEach(function (doc) {
    let data = doc.data();
    provenance_summary.push({
      id: doc.id,
      data,
    });
  });

  //array of ids for valid participants;

  fs.writeFileSync(
    "./provenance_summary.json",
    JSON.stringify(provenance_summary),
    { flag: "w" }
  );

  console.log("exported provenance_summary.json");
}

async function getRawProvenance(key) {
  const provenanceCollection = db.collection("provenance");

  if (key) {
    console.log("getting ", key);
    let provenanceRef = db.collection("provenance").doc(key);
    let doc = await provenanceRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      let data = doc.data();

      fs.writeFileSync("./" + key + ".json", JSON.stringify(data), {
        flag: "w",
      });
    }
  } else {
    console.log("getting all docs in provenance collection");
    const snapshot = await db
      .collection("provenance")
      .where("id", "==", "546e3c21fdf99b2b8df983fd")
      .get();

    // .where('mode', '==', 'study').get();

    if (snapshot.empty) {
      console.log("No matching documents.");
      return;
    }

    snapshot.forEach((doc) => {
      let data = doc.data();
      if (doc.id.includes("S-")) {
        console.log("writing", doc.id);

        fs.writeFileSync("./" + doc.id + ".json", JSON.stringify(data), {
          flag: "w",
        });
      } else {
        console.log("skipping", doc.id);
      }
    });
  }
}
async function writeSkinnyProvenance(participant) {
  let participantID = participant.id;
  // Create a reference to the results_graded collection
  const resultsCollection = db.collection("results_graded");

  const resultsRef = resultsCollection.where("workerID", "==", participantID);

  let snapshot = await resultsRef.get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  } else {
    snapshot.forEach(async (doc) => {
      let result = doc.data();
      result.participant = participant;
      // Create a reference to the provenance collection
      const provenanceCollection = db.collection("provenance");

      // Find a ref for all provenance documents for this participant;
      const provenanceRef = provenanceCollection.where(
        "id",
        "==",
        participantID
      );

      snapshot = await provenanceRef.get();
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      } else {
        // console.log('there are ', snapshot, 'docs')
        snapshot.forEach((doc, i) => {
          let provData = doc.data();
          //insert skinny provenance into results
          //find out what task this prov graph is for:
          if (provData.provGraphs) {
            let taskKey = provData.provGraphs[0].taskID;
            // (if taskId is an Object, grab taskID from that object)
            if (typeof taskKey !== "string") {
              taskKey = taskKey.taskID;
            }

            let trimmedProv = provData.provGraphs.map((p) => ({
              event: p.event || "startedProvenance",
              time: p.time,
            }));
            // console.log('taskKey is ', taskKey)
            trimmedProv.map((p) => {
              if (!p.event || !p.time) {
                console.log(p);
              }
            });
            result[taskKey].provenance = trimmedProv;
          } else {
            console.log("no prov data for", participantID);
          }
        });
      }

      db.collection("provenance_summary").doc(participantID).set(result);
    });
  }
}

function writeResults() {
  let rawdata = fs.readFileSync("firebase/data/processed_results.json");
  let data = JSON.parse(rawdata);

  data.map((d) => {
    if (d.data["S-task01"]) {
      let participantID = d.data["S-task01"].workerID;
      db.collection("results_graded").doc(participantID).set(d.data);
    } else {
      console.log("could not upload data for ", d);
    }
  });
}
//function to filter out only valid participants;
function isValidParticipant(d) {
  let rejected = [
    {
      id: "5d00163d9f497e00191a609c",
      reason: "NOCODE",
      vis: "nodeLink",
    },
    {
      id: "5d49f4637df55600014dda45",
      reason: "NOCODE",
      vis: "nodeLink",
    },
    {
      id: "5c12d0d303f44c00017441e3",
      reason: "NOCODE",
      vis: "nodeLink",
    },
    {
      id: "5c5629c79fcbc40001dc55cc",
      reason: "NOCODE",
      vis: "nodeLink",
    },
    {
      id: "5d37d2861566530016a061de",
      reason: "LowEffort",
      vis: "nodeLink",
    },
    {
      id: "5d017f2466581d001a9059dc",
      reason: "NOCODE",
      vis: "nodeLink",
    },
    {
      id: "5d30e6ef53416100199ad7bf",
      reason: "NOCODE",
      vis: "nodeLink",
    },
    {
      id: "5d4c50d3ff031f001883cf4f",
      reason: "NOCODE",
      vis: "nodeLink",
    },
    {
      id: "5b74656b9750540001f26fde",
      reason: "NOCODE",
      vis: "nodeLink",
    },

    {
      id: "5d63dc6c163b260001acc8e6",
      reason: "NOCODE",
      vis: "adjMatrix",
    },
    {
      id: "5b2486c6007d870001c795a4",
      reason: "LowEffort",
      vis: "adjMatrix",
    },
    {
      id: "5c582efbe66e510001eedfa8",
      reason: "NOCODE",
      vis: "adjMatrix",
    },
    {
      id: "5c5043028003d4000107b97a",
      reason: "NOCODE",
      vis: "adjMatrix",
    },
    {
      id: "5d017f2466581d001a9059dc",
      reason: "NOCODE",
      vis: "adjMatrix",
    },
    {
      id: "5d36060877dd7c00197477e7",
      reason: "NOCODE",
      vis: "adjMatrix",
    },
    {
      id: "5d641c307c4e9c0019d604d8",
      reason: "LowEffort",
      vis: "adjMatrix",
    },
    {
      id: "5c1d19c810677f0001d9d56c",
      reason: "NOCODE",
      vis: "adjMatrix",
    },
    {
      id: "5ac393cf0527ba0001c2043c",
      reason: "LowEffort",
      vis: "adjMatrix",
    },
    {
      id: "5c6cf98a34d8f80001ddf31d",
      reason: "NOCODE",
      vis: "adjMatrix",
    },
  ];

  let invalid = [
    {
      id: "5d54d0b14a1521001850610a",
      reason: "TIMED OUT",
      vis: "nodeLink",
    },
    {
      id: "5caa534a19731a00190bb935",
      reason: "TIMED OUT",
      vis: "adjMatrix",
    },
    {
      id: "5d5c49acdd90af0001f13f7d",
      reason: "TIMED OUT",
      vis: "adjMatrix",
    },
    {
      id: "5b3d79ec4915d00001828240",
      reason: "RETURNED",
      vis: "adjMatrix",
    },
    {
      id: "5bfaed16e2562a0001ce0ff4",
      reason: "TIMED OUT",
      vis: "nodeLink",
    },
    {
      id: "5d645bf6912c630018e269e3",
      reason: "TIMED OUT",
      vis: "nodeLink",
    },
  ];

  let wasRejected = rejected.find((r) => r.id === d.id);

  let invalidParticipant = invalid.find((r) => r.id === d.id);

  return (
    d.data.mode === "study" &&
    d.id[0] === "5" &&
    d.data.demographics &&
    !wasRejected &&
    !invalidParticipant
  );
}

async function fetchProvenance() {
  console.log("in fetch@");
  paginate(0);
}
fetchProvenance();

async function fetchResults() {
  let querySnapshot = await db.collection("study_participants").get();

  let studyParticipants = [];
  querySnapshot.forEach(function (doc) {
    let data = doc.data();
    studyParticipants.push({
      id: doc.id,
      data,
    });
  });

  studyParticipants = studyParticipants.filter(isValidParticipant);

  console.log("fetched", studyParticipants.length, "valid participants");

  //array of ids for valid participants;
  let participantIDs = studyParticipants.map((p) => p.id);

  fs.writeFileSync(
    "firebase/data/study_participants.json",
    JSON.stringify(studyParticipants)
  );

  console.log("exported study_participants.json");

  let collectionNames = ["results_graded"];

  await collectionNames.map(async (collectionName) => {
    let collectionRef, queryRef;
    collectionRef = db.collection(collectionName);
    queryRef = collectionRef;

    let querySnapshot = await queryRef.get();

    let allData = [];
    querySnapshot.forEach(function (doc) {
      let data = doc.data();
      if (participantIDs.includes(doc.id)) {
        allData.push({
          id: doc.id,
          data,
        });
      }
    });

    let data = JSON.stringify(allData);
    fs.writeFileSync("firebase/data/" + collectionName + ".json", data);

    console.log("saved", collectionName);
  });
}

async function paginate(i, lastDoc) {
  let ref;

  if (lastDoc) {
    ref = db
      .collection("provenance")
      .orderBy("initialSetup")
      .startAfter(lastDoc.data().initialSetup)
      .limit(10);
  } else {
    ref = db.collection("provenance").orderBy("initialSetup").limit(10);
  }

  ref.get().then((snapshot) => {
    // ...
    let numDocs = snapshot.docs.length;
    console.log("numDocs", numDocs);

    let data = JSON.stringify(
      snapshot.docs.map((d) => {
        return {
          id: d.id,
          data: d.data(),
        };
      })
    );
    console.log("writing", d.id + ".json");
    fs.writeFileSync(d.id + ".json", data);

    // Get the last document
    let last = snapshot.docs[snapshot.docs.length - 1];

    if (numDocs === 1000) {
      paginate(i + 1, last);
    }
  });
}
