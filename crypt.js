const EthCrypto = require('eth-crypto');

const generatePrivateKey = () => {
    let identity = EthCrypto.createIdentity();
    return identity.privateKey;
}

const getPublicKey = (privKey) => {
    if (privKey.length !== 66) return '';
    return EthCrypto.publicKeyByPrivateKey(privKey);
}

const sign = (privKey, message) => {
    const messageHash = EthCrypto.hash.keccak256(message);
    return EthCrypto.sign(
        privKey,
        messageHash
    );
}

const verify = (publicKey, message, signature) => {
    const signer = EthCrypto.recoverPublicKey(
        signature,
        EthCrypto.hash.keccak256(message)
    );

    if (publicKey === signer) return true;
    return false;
}

const encrypt = (publicKey, message) => {
    return EthCrypto.encryptWithPublicKey(publicKey, message);
};

const decrypt = (privateKey, encryptedData) => {
    return EthCrypto.decryptWithPrivateKey(privateKey, encryptedData);
};

module.exports.generatePrivateKey = generatePrivateKey;
module.exports.getPublicKey = getPublicKey;
module.exports.sign = sign;
module.exports.verify = verify;
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;