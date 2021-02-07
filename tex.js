const ed = require('noble-ed25519');

const privateKey = ed.utils.randomPrivateKey(); // 32-byte Uint8Array or string.
const msgHash = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
(async () => {
  const publicKey = await ed.getPublicKey(privateKey);
  console.log("private key original:")
  console.log(privateKey)
  console.log("private key encrypted:")
  console.log(btoa(privateKey))
  console.log(atob(privateKey))
  console.log("public key original:")
  console.log(publicKey)
  console.log("msg original:")
  console.log(msgHash)
  const signature = await ed.sign(msgHash, privateKey);
  console.log("signature original:")
  console.log(signature)
  const isSigned = await ed.verify(signature, msgHash, publicKey);
  console.log("is Signed: " + isSigned)
  console.log("--------------")
  

})();