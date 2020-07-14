export async function mockAPICall(
    url,
    returnData,
    options = {
        shouldError: false,
        timeout: 2000
    }
) {
    const {
        shouldError,
        timeout
    } = options;

    return await new Promise((resolution, rejection) => {
        setTimeout(() => {
            if (shouldError) {
                rejection({
                    url,
                    success: false,
                    error: `mockAPICall error`,
                });
            } else {
                resolution({
                    url,
                    success: true,
                    data: returnData,
                });
            }
        }, timeout);
    });
}

export async function fetchData(uri, fetchOptions) {
    let defaultHeaders = {
        headers: {
            Accept: "application/json",
        },
    };
    return await completePromise(uri, defaultHeaders);
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