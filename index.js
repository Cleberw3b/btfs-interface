const connector = require('./connector.js');
const ipfs_connector = require('./ipfs-as-connector.js');

(async () => {
    try {
        let response = await ipfs_connector.btfsID();
        console.log(response);
    } catch (error) {
        console.log(error);
    }
})()