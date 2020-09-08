import mockAllData from "./mockData.json";
let local = true;
let host = local ? "http://127.0.0.1:5000" : "http://18.222.101.54:5000";

export async function performPrefixSpan(data) {
  console.log("postData is ", data);
  console.log("data is ", data);
  let res = await postData(host + "/prefix", data);
  return res;
}
function parseActionConfiguration(config) {
  console.log(config);
  if (config.elements) {
    config.elements = config.elements.replace(/FALSE/g, '"false"');
    config.elements = config.elements.replace(/TRUE/g, '"true"');

    config.elements = JSON.parse(config.elements);
  }
  config.color = config.color.replace("/r", "");

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
  console.log("in update", updateActionConfigurations);
  console.log(storeActionConfiguration(updateActionConfigurations));
  let res = await postData(
    host + "/actionConfigurations",
    storeActionConfiguration(updateActionConfigurations)
  );
  console.log("save result", res);

  return res;
}
export async function getActionConfigurations() {
  // TODO hook this up
  console.log("in res data");
  let res = await getData(host + "/actionConfigurations");
  console.log(res);
  res.data = res.data.map(parseActionConfiguration);
  console.log("after processing", res);

  return res;
}
export async function getDataFromServer() {
  //let res = await postData(host + "/data");
  console.log("dywootto", mockAllData);
  try {
    // console.log(mockAPICall(host + "/data", mockAllData));
    let res = await getData(host + "/data");

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

export async function mysql_api(endpoint, body) {
  let res = await postData(host + endpoint, body);
  return res;
}

export async function postData(uri, postBody, fetchOptions) {
  console.log("postBody is ", postBody);
  let defaultHeaders = {
    url: uri,
    // mode: "no-cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(postBody),
  };
  console.log("post headers", defaultHeaders);
  const val = await completePromise(uri, defaultHeaders);
  console.log("dywootto", val);
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
    console.log("fetched", response);
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
    console.log("dywootto in promiser");
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
