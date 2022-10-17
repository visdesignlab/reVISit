import mockAllData from "./mockData.json";
let local = true;
let host = local ? "http://127.0.0.1:5000" : "https://apps.vdl.sci.utah.edu/revisitServer";

export async function fetchProvenanceDataByNodeId(nodeId) {
  let res = await postData(host + "/actions/" + nodeId);
  return res;
}
let patternCache = {};
export async function getTopPatternsForGroup(groups) {
  let cached = readFromCache(groups);
  if (cached) {
    console.log("[CACHE]: Read from cache!");
    return cached;
  }
  let res = await postData(`${host}/groupPatterns`, {
    groups: [{ id: "group1", participants: groups }],
  });
  storeInCache(groups, res);

  return res;
}
function readFromCache(group) {
  let idsShortened = group.map((group) => group.participantID.substring(0, 3));
  return patternCache[idsShortened];
}
function storeInCache(group, res) {
  let idsShortened = group.map((group) => group.participantID.substring(0, 3));
  patternCache[idsShortened] = res;
  return;
}

export async function performPrefixSpan(data) {
  let res = await postData(host + "/prefix", data);
  return res;
}
function parseActionConfiguration(config) {
  if (config.elements) {
    console.log(config.elements);
    config.elements = config.elements.replace(/FALSE/g, '"false"');
    config.elements = config.elements.replace(/TRUE/g, '"true"');
    config.elements = config.elements.replace(/(\r\n|\n|\r)/gm, " ");

    //config.elements = config.elements.replace(/"/g, "'");

    console.log("past replaces", config.elements, typeof config.elements);
    try {
      config.elements = JSON.parse(config.elements);
    } catch (err) {
      console.log("ERROR", err);
    }
    console.log("past parse", config.elements);
  }

  config.color = config.color.replace("/r", "");
  console.log("past color", config.color);

  return {
    color: config.color,
    name: config.label,
    id: config._id,
    elements: config.elements,
    icon: config.icon,
    hidden: config.hidden,
    type: config.type,
  };
}
function storeActionConfiguration(configList) {
  return configList.map((config) => {
    return {
      _id: config.id,
      label: config.name,
      elements: config.elements ? JSON.stringify(config.elements) : null,
      icon: config.icon,
      type: config.type,
      color: config.color,
      hidden: config.hidden,
    };
  });
}
export async function saveActionConfigurationToDB(updateActionConfigurations) {
  let res = await postData(
    host + "/actionConfigurations",
    storeActionConfiguration(updateActionConfigurations)
  );
  console.log("saved actions", res);

  return res;
}
export async function getActionConfigurations() {
  // TODO hook this up
  let res = await getData(host + "/actionConfigurations");
  console.log("res from action configs", res);
  res.data = res.data.map(parseActionConfiguration);
  console.log("got action configs", res);

  return res;
}
export async function getTaskOverviewFromServer(taskID = undefined) {
  //let res = await postData(host + "/data");
  // console.log("dywootto", mockAllData);
  try {
    // console.log(mockAPICall(host + "/data", mockAllData));
    // let res = await postData(host + `/data`);

    let res = taskID
      ? await postData(host + `/overview/${taskID}`)
      : await postData(host + `/overview/allTasks`);

    // let res = await mockAPICall(host + "/data", mockAllData);
    return res;
  } catch (err) {
    console.log("dywootto res", err);
  }
}
export async function getSchema(tableID) {
  let res = await getData(`${host}/table/${tableID}/schema`);
  return res;
}
export async function getTaskDataFromServer(taskID) {
  let res = await getData(`${host}/data/task/${taskID}`);
  return res;
}

export async function getTimelineFromServer() {
  // return await setTimeout(async () => {
  let res = await getData(`${host}/timeline`);
  //   console.log("World!");
  return res;
  //  }, 5000);
}

export async function getTaskListFromServer() {
  let res = await getData(`${host}/taskList`);
  return res;
}

export async function mysql_api(endpoint, body) {
  let res = await postData(host + endpoint, body);
  return res;
}

export async function postData(uri, postBody, fetchOptions) {
  // console.log("postBody is ", postBody);
  let defaultHeaders = {
    url: uri,
    // mode: "no-cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(postBody),
  };
  // console.log("post headers", defaultHeaders);
  const val = await completePromise(uri, defaultHeaders);
  // console.log("dywootto", val);
  return val;
}

export async function getData(uri, fetchOptions) {
  let defaultHeaders = {
    headers: {
      Accept: "application/json",
    },
  };
  return await completePromise(uri, defaultHeaders);
}

export async function completePromise(uri, requestOptions) {
  let response;
  try {
    response = await fetch(uri, requestOptions);
    // console.log(response.text())
    // console.log("inpromise", response);
    // console.log("fetched", response);
    response.data = await response.json();
    response.success = response.ok;
  } catch (err) {
    // console.log(response.text())

    console.log("error", err);
    throw err;
  }
  return response;
}
//let res = await mockAPICall("www.example.com", { work: "yeah" }); you can mock out api calls using this

export async function mockAPICall(
  url,
  returnData,
  options = {
    shouldError: false,
    timeout: 2000,
  }
) {
  console.log("in mockAPI");

  const { shouldError, timeout } = options;
  console.log("in mockAPI");
  return await new Promise((resolution, rejection) => {
    setTimeout(() => {
      if (shouldError) {
        rejection({
          url,
          success: false,
          error: `mockAPICall error`,
        });
      } else {
        console.log("dywootto in res", returnData, url);
        resolution({
          url,
          success: true,
          data: returnData,
        });
      }
    }, timeout);
  });
}
