const expect = require('chai').expect;
const crypt = require('../crypt.js');

const privKey = "0x107be946709e41b7895eea9f2dacf998a0a9124acbb786f0fd1a826101581a07"
const pubKey = "bf1cc3154424dc22191941d9f4f50b063a2b663a2337e5548abea633c1d06eceacf2b81dd326d278cd992d5e03b0df140f2df389ac9a1c2415a220a4a9e8c046"
const message = "Crypt Lib Working"
const signature = "0xdc88457cb1b27d1f846130dca2508a746540002a4c88b6530e5ccefca97262ca76d93774ed500359a5bbbe23ffd110ea112f664f13987db07e16d372e7e04a2f1c"
const encrypted =
{
    iv: 'aa64eba502c8840159464100ccfaa8fa',
    ephemPublicKey: '04dfbb5470903a1cde573fc1b65002368078041750f01a0de8ae93a5fa6aa48b78f4cf91bf90edd4a666efccae72d1b30bcd17a43fc3ac66df354b4c2b946d8968',
    ciphertext: 'b937b762a4fbcd9c7b968484d741f476224bc20d6ac1f4a71ba76ef4206ba32e',
    mac: '5b4afd2059267a7e4950455c97b2b9953ccfd57f3dc722b3c35159a503098ed4'
}


describe('Test cryptography module', () => {

    it('generates public key', (done) => {

        let publicKey = crypt.getPublicKey(privKey);
        expect(publicKey).to.be.equal(pubKey);
        done();
    });

    it('signs a message', (done) => {

        let sig = crypt.sign(privKey, message);
        expect(sig).to.be.equal(signature);
        done();
    });

    it('verifies a signature given a pubkey and message', (done) => {

        expect(crypt.verify(pubKey, message, signature)).to.be.true;
        done();
    });

    it('encrypts a message', async () => {

        let encryptedMessage = await crypt.encrypt(pubKey, message);
        expect(encryptedMessage.iv).to.be.not.empty;
        expect(encryptedMessage.ephemPublicKey).to.be.not.empty;
        expect(encryptedMessage.ciphertext).to.be.not.empty;
        expect(encryptedMessage.mac).to.be.not.empty;
    });

    it('decrypts a encrypted message', async () => {

        let msg = await crypt.decrypt(privKey, encrypted);
        expect(msg).to.be.equal(message);
    });
});