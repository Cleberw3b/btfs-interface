const FormData = require('form-data');
const axios = require("axios");
const fs = require('fs');

const protocol = "http"
const host = "198.46.160.54"
const port = "5001"
const apiPath = "/api/v0"
const btfsNodeURL = protocol + "://" + host + ":" + port + apiPath

/**
 * Displays the BTFS node ID information.
 * 
 * @returns {Promise}
 */
const btfsID = () => {
    return axios({
        url: btfsNodeURL + "/id",
        method: 'get'
    })
}

/**
 * Adds file on BTFS
 * 
 * @param {string} filename The filename is simple the local directory that will add to BTFS.
 * @returns {Promise}
 */
const addFile = async (filename) => {

    let name = filename.substring(filename.lastIndexOf('/') + 1)
    const formData = new FormData()
    formData.append(name, fs.createReadStream(filename))

    return axios({
        url: btfsNodeURL + "/add",
        method: 'post',
        data: formData,
        headers: formData.getHeaders()
    })
}

/**
 * List directory contents for Unix filesystem objects.
 * 
 * @param {string}  arg             The path to the BTFS object(s) to list links from. (Required)
 * @param {boolean} headers         Print table headers. (Hash, Size, Name)
 * @param {boolean} resolve_type    Resolve linked objects to find out their types. Default: "true".
 * @param {boolean} size            Resolve linked objects to find out their file size. Default: "true".
 * @param {boolean} stream          Enable experimental streaming of directory entries as they are traversed.
 * @returns {Promise}
 */
const listDir = (path, headers = false, resolve_type = true, size = true, stream = false) => {
    let params = {
        arg: path,
        headers,
        'resolve-type': resolve_type,
        size,
        stream
    }

    return axios({
        url: btfsNodeURL + "/ls",
        method: 'get',
        params: params
    })
}

/**
 * Download the BTFS objects.
 * 
 * @param {string}  arg                 The path to the BTFS object(s) to be outputted. (Required)
 * @param {string}  output              The path where the output should be stored.
 * @param {boolean} archive             Output a TAR archive.
 * @param {boolean} compress            Compress the output with GZIP compression.
 * @param {integer} compression_level   The level of compression (1-9).
 * @returns {boolean}
 */
const getFile = async (path, output, archive = false, compress = false, compression_level = 1) => {

    const fileName = output.substring(output.lastIndexOf('/') + 1, output.lastIndexOf('.'));
    const format = output.slice(output.lastIndexOf('.'))
    let isDataWriten = false;

    let params = {
        arg: path,
        output: fileName + format,
        archive,
        compress,
        'compression-level': compression_level
    }

    const response = await axios({
        url: btfsNodeURL + "/get",
        method: 'get',
        params: params
    })

    // TODO removal of form-data boundaries
    // Files are stored or retrivied with boundaries
    // QmRZ7fymHUvnDhiBsad3xcdpGeygNPVRd5avuKaLXFwkdN0000644000000000000000000000055213563103024017545 0ustar0000000000000000
    const data = response.data;

    await fs.writeFileSync(output, data, 'UTF8', (err) => {
        if (err) {
            console.log(err);
        }
    });

    if (await fs.existsSync(output))
        isDataWriten = true;

    return isDataWriten;
}

/** TODO
 * Mounts BTFS to the filesystem (read-only).
 * 
 * @param {string} btfs_path The path where BTFS should be mounted.
 * @param {string} btns_path The path where BTNS should be mounted.
 * 
 * @returns {Promise}
 */
const mountDir = (btfs_path, btns_path) => {
    return axios({
        url: btfsNodeURL + "/mount",
        method: 'get'
    })
}

module.exports.btfsID = btfsID;
module.exports.addFile = addFile;
module.exports.listDir = listDir;
module.exports.getFile = getFile;
module.exports.mountDir = mountDir;
