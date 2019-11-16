const connector = require('./connector.js');
const util = require('./util.js');

(async () => {
    try {
        let response = await connector.btfsID();
        util.printAxiosResponse(response);
    } catch (error) {
        console.log(error);
    }
})()
