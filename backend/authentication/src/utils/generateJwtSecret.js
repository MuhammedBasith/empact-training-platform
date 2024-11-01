const crypto = require('crypto');

const jwtSecret = crypto.randomBytes(64).toString('hex'); // Generates a 128-character hex string
console.log(jwtSecret);
