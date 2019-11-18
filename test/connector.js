const expect = require('chai').expect;
const connector = require('../connector.js');
const fs = require("fs");

const pathToUpload = __dirname + "/../to-upload/";
const pathToDownload = __dirname + "/../download/";

const file = {
  name: "configBTFS.sh",
  hash: "QmSJ39kEutpUcXp87JVcvV6NZgP8h4Xzfun1eQaRHNyZsS",
  size: "1391"
}

const objectsDir = {
  objects: [
    {
      hash: 'QmSJ39kEutpUcXp87JVcvV6NZgP8h4Xzfun1eQaRHNyZsS',
      links: []
    }
  ]
};

describe('Connects to BTFS node using axios', () => {

  it('get information about node id', async () => {

    let { data } = await connector.btfsID();
    expect(data.ID).to.be.not.empty;
    expect(data.PublicKey).to.be.not.empty;
    expect(data.Addresses).to.be.not.empty;
    expect(data.AgentVersion).to.be.not.empty;
    expect(data.ProtocolVersion).to.be.not.empty;
  });

  it('adds file on BTFS', async () => {

    let { data } = await connector.addFile(pathToUpload + file.name);
    expect(data.Name).to.be.equal(file.name);
    expect(data.Hash).to.be.equal(file.hash);
    expect(data.Size).to.be.equal(file.size);
  });


  it('lists directory contents for objects', async () => {

    let { data } = await connector.listDir(file.hash);
    for (let i = 0; i < data.Objects.length; i++) {
      expect(data.Objects[i].Hash).to.be.equal(objectsDir.objects[i].hash);
      for (let z = 0; z < data.Objects[i].Links.length; z++) {
        expect(data.Objects[i].Links[z]).to.be.equal(objectsDir.objects[i].links[z]);
      }
    }
  });

  it('downloads a file', async () => {

    let isDownloaded = await connector.getFile(file.hash, pathToDownload + file.name);
    expect(isDownloaded).to.be.true;
    expect(fs.existsSync(pathToDownload + file.name)).to.be.true;
  });
});