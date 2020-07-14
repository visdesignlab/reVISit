/*import {
    postData
} from "./fetchingUtilities";*/

export async function performPrefixSpan(data) {
    let res = await postData(
        "http://18.222.101.54//prefix", data
    );
    console.log("dywootto", res);
    return res;
}

export async function postData(uri, postBody, fetchOptions) {
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
export async function completePromise(uri, requestOptions) {
    let response;
    try {
        response = await fetch(uri, requestOptions);
        console.log("inpromise", response);
        response.data = await response.json();
        response.success = response.ok;
    } catch (err) {
        throw err;
    }
    return response;
}
//let res = await mockAPICall("www.example.com", { work: "yeah" }); you can mock out api calls using this