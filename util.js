require('dotenv').config()

const isMethodValid = method => {
    if (method === 'GET'
        || method === 'POST'
        || method === 'PUT'
        || method === 'DELETE')
        return true;
    return false;
}

const printAxiosResponse = (response, withdetail = false) => {
    console.log("Status: ", response.status)
    console.log("Message: ", response.statusText)
    console.log("Data: ", response.data)
    if (withdetail) {
        console.log("Headers: ", response.headers)
        console.log("Config: ", response.config)
        console.log("Request: ", response.request)
    }
}

const expireOnTimeOut = async (func, timeout = 5000, delayCheck = 500) => {
    let startTime = Date.now();
    let endTime = startTime + timeout;
    let timer = 0;
    let result = makeQuerablePromise(func());
    while (result.isPending()) {
        await sleep(delayCheck)
        timer += delayCheck;
        if (startTime + timer > endTime) {
            return new Error("Function has taken more than " + timeout + " seconds.");
        }
    }
    return result;
}

/**
 * This function allow you to modify a JS Promise by adding some status properties.
 * Based on: http://stackoverflow.com/questions/21485545/is-there-a-way-to-tell-if-an-es6-promise-is-fulfilled-rejected-resolved
 * But modified according to the specs of promises : https://promisesaplus.com/
 */
const makeQuerablePromise = (promise) => {
    // Don't modify any promise that has been already modified.
    if (promise.isResolved) return promise;

    // Set initial state
    var isPending = true;
    var isRejected = false;
    var isFulfilled = false;

    // Observe the promise, saving the fulfillment in a closure scope.
    var result = promise.then(
        function (v) {
            isFulfilled = true;
            isPending = false;
            return v;
        },
        function (e) {
            isRejected = true;
            isPending = false;
            throw e;
        }
    );

    result.isFulfilled = function () { return isFulfilled; };
    result.isPending = function () { return isPending; };
    result.isRejected = function () { return isRejected; };
    return result;
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

const getBtfsOptions = () => {
    return {
        protocol: process.env.BTFS_PROTOCOL,
        host: process.env.BTFS_HOST,
        port: process.env.BTFS_PORT,
        apiPath: process.env.BTFS_API_PATH
    }
}

module.exports.isMethodValid = isMethodValid;
module.exports.printAxiosResponse = printAxiosResponse;
module.exports.expireOnTimeOut = expireOnTimeOut;
module.exports.getBtfsOptions = getBtfsOptions;