const expect = require('chai').expect;
const connector = require('../ipfs-as-connector.js');
const fs = require("fs");

const pathToUpload = __dirname + "/../to-upload/";
const pathToDownload = __dirname + "/../download/";

const file = {
  path: "configBTFS.sh",
  hash: "QmSJ39kEutpUcXp87JVcvV6NZgP8h4Xzfun1eQaRHNyZsS",
  size: 1391
};

const directory = {
  hash: "QmZn6VMdjL89F8qEU9o1seNngmTeGHB9fuQ35vwD6kBVYd",
  path: "de",
  size: 1451
}

const dirLs = {
  depth: 1,
  hash: "QmSJ39kEutpUcXp87JVcvV6NZgP8h4Xzfun1eQaRHNyZsS",
  name: "configBTFS.sh",
  path: "QmZn6VMdjL89F8qEU9o1seNngmTeGHB9fuQ35vwD6kBVYd/configBTFS.sh",
  size: 1380,
  type: "file"
}

describe('Connects to BTFS node using ipfs-api-interface', () => {

  it('get information about node id', async () => {

    let { id, publicKey, addresses, agentVersion, protocolVersion } = await connector.btfsID();
    expect(id).to.be.not.empty;
    expect(publicKey).to.be.not.empty;
    expect(addresses).to.be.not.empty;
    expect(addresses).to.be.a("Array");
    expect(agentVersion).to.be.not.empty;
    expect(protocolVersion).to.be.not.empty;
  });

  it('adds a single file on BTFS', async () => {

    let resp = await connector.addFile(pathToUpload + file.path);
    let { path, hash, size } = resp[0];
    expect(path).to.be.equal(file.path);
    expect(hash).to.be.equal(file.hash);
    expect(size).to.be.equal(file.size);
  });


  it('verifies if object exists', async () => {

    let resp = await connector.listDir(file.hash);
    expect(resp).to.be.a("Array");
    expect(resp).to.be.empty;
  });

  it('lists objects on folder', async () => {

    let resp = await connector.listDir(directory.hash);
    expect(resp[0].depth).to.be.equal(dirLs.depth)
    expect(resp[0].hash).to.be.equal(dirLs.hash)
    expect(resp[0].name).to.be.equal(dirLs.name)
    expect(resp[0].path).to.be.equal(dirLs.path)
    expect(resp[0].type).to.be.equal(dirLs.type)
    expect(resp[0].size).to.be.equal(dirLs.size)
  });

  it('downloads a file', async () => {

    let isDownloaded = await connector.getFile(file.hash);
    expect(isDownloaded).to.be.true;
    expect(fs.existsSync(pathToDownload + file.hash)).to.be.true;
  });
});