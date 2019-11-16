const isMethodValid = method => {
    if (   method === 'GET'
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
    if (withdetail){
        console.log("Headers: ", response.headers)
        console.log("Config: ", response.config)
        console.log("Request: ", response.request)
    }
    
}

module.exports.isMethodValid = isMethodValid;
module.exports.printAxiosResponse = printAxiosResponse;