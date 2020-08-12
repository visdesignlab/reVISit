/*import {
    postData
} from "./fetchingUtilities";*/

let local = true;
let host = local ? "http://127.0.0.1:5000" : "http://18.222.101.54";

export async function performPrefixSpan(data) {
  console.log("postData is ", data);
  console.log("data is ", data);
  let res = await postData(host + "/prefix", data);
  return res;
}

export async function getDataFromServer() {
  let res = await postData(host + "/data");
  return res;
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
  // console.log('postBody is ', postBody)
  let defaultHeaders = {
    url: uri,
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(postBody),
  };
  return await completePromise(uri, defaultHeaders);
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
    // console.log("inpromise", response);
    response.data = await response.json();
    response.success = response.ok;
  } catch (err) {
    throw err;
  }
  return response;
}
//let res = await mockAPICall("www.example.com", { work: "yeah" }); you can mock out api calls using this
