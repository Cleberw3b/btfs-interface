const expect = require('chai').expect;
const connector = require('../connector.js');
const fs = require("fs");

const pathToUpload = __dirname + "/../toUpload/";
const pathToDownload = __dirname + "/../download/";

const files = [
  {
    name: "configBTFS.sh",
    hash: "QmSJ39kEutpUcXp87JVcvV6NZgP8h4Xzfun1eQaRHNyZsS",
    size: "1391"
  },
  {
    name: "package.json",
    hash: "QmRZ7fymHUvnDhiBsad3xcdpGeygNPVRd5avuKaLXFwkdN",
    size: "373"
  }
];

const objectsDir = [
  {
    objects: [
      {
        hash: 'QmSJ39kEutpUcXp87JVcvV6NZgP8h4Xzfun1eQaRHNyZsS',
        links: []
      }
    ]
  },
  {
    objects: [
      {
        hash: 'QmSJ39kEutpUcXp87JVcvV6NZgP8h4Xzfun1eQaRHNyZsS',
        links: []
      }
    ]
  }
];

it('get information about node id', async () => {

  let { data } = await connector.btfsID();

  expect(data.ID).to.be.not.empty;
  expect(data.PublicKey).to.be.not.empty;
  expect(data.Addresses).to.be.not.empty;
  expect(data.AgentVersion).to.be.not.empty;
  expect(data.ProtocolVersion).to.be.not.empty;
});



it('adds file on BTFS', async () => {

  let { data } = await connector.addFile(pathToUpload + files[0].name);

  expect(data.Name).to.be.equal(files[0].name);
  expect(data.Hash).to.be.equal(files[0].hash);
  expect(data.Size).to.be.equal(files[0].size);
})


it('lists directory contents for objects', async () => {

  let { data } = await connector.listDir(files[0].hash);

  for (let i = 0; i < data.Objects.length; i++) {
    expect(data.Objects[i].Hash).to.be.equal(objectsDir[0].objects[i].hash);
    for (let z = 0; z < data.Objects[i].Links.length; z++) {
      expect(data.Objects[i].Links[z]).to.be.equal(objectsDir[0].objects[i].links[z]);
    }
  }
})

it('downloads a file', async () => {

  let isDownloaded = await connector.getFile(files[0].hash, pathToDownload + files[0].name);

  expect(isDownloaded).to.be.true;
  expect(fs.existsSync(pathToDownload + files[0].name)).to.be.true;
})