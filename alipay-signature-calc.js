const crypto = require("crypto");
const request = require("./request.json");

/** Function to generate the signature by signing the content using a private key. */
function signContent(content, privateKey, encoding) {
    const sign = crypto.createSign("SHA256");
    sign.write(content, encoding);
    sign.end();
    return sign.sign(privateKey, "base64");
}

/** Function to verify the generated signature using a public key. */
function verifySignature(content, publicKey, signature, encoding) {
    const verify = crypto.createVerify("SHA256");
    verify.write(content, encoding);
    verify.end();
    return verify.verify(publicKey, Buffer.from(signature, "base64"));
}

/** Function to convert the private key to PEM format. */
function base64KeyToPEM(base64Key, keyType) {
    return [`-----BEGIN ${keyType} KEY-----`, ...splitStringIntoChunks(base64Key, 64), `-----END ${keyType} KEY-----`].join("\n");
}

/** Function to split a string into chunks used while creating the PEM format key. */
function splitStringIntoChunks(input, chunkSize) {
    const chunkCount = Math.ceil(input.length / chunkSize)
    return Array.from({ length: chunkCount }).map((v, chunkIndex) => input.substr(chunkIndex * chunkSize, chunkSize));
}

// Alipay Payment Request Payload
const requestString = JSON.stringify(request);
console.log(requestString);

// Generated private & public keys - configured in Alipay Developer Account
const privateKey = "XXXX";  // Replace with your private key
const publicKey = "XXXX";   // Replace with your public key

// Construct Signature Content
const clientID = "XXXX";    // Replace with your Client ID

const content = `POST /ams/sandbox/api/v1/payments/pay?_output_charset=utf-8&_input_charset=utf-8\n${clientID}.${new Date().toISOString()}.${requestString}`;
console.log(content);
console.log();

// Generate signature
const signature = signContent(content, base64KeyToPEM(privateKey, "PRIVATE"), "utf8");
console.log("Signature:", signature);
console.log();

// URL-Encode the signature
// Use the url-encoded signature for the Alipay Payment APIs
const url_encoded = encodeURIComponent(signature);
console.log("URL Encoded Signature:", url_encoded);

// Verify the generated signature
// Use the generated signature without url encoding for verification
console.log("Verify signature:", verifySignature(content, base64KeyToPEM(publicKey, "PUBLIC"), signature, "utf8"));