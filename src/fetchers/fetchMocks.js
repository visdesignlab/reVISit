import mockAllData from "./mockData.json";
let local = false;
let host = local ? "http://127.0.0.1:5000" : "http://18.222.101.54:5000";

export async function performPrefixSpan(data) {
  console.log("postData is ", data);
  console.log("data is ", data);
  let res = await postData(host + "/prefix", data);
  return res;
}

export async function getTaskOverviewFromServer(taskID=undefined) {
  //let res = await postData(host + "/data");
  // console.log("dywootto", mockAllData);
  try {
    // console.log(mockAPICall(host + "/data", mockAllData));
    // let res = await postData(host + `/data`);

    let res = taskID ? await postData(host + `/overview/${taskID}`) : await postData(host + `/overview/allTasks`);


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
  // console.log('postBody is ', postBody)
  let defaultHeaders = {
    url: uri,
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(postBody),
  };
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
