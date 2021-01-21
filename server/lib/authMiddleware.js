const expressJwt = require('express-jwt');
const fs = require('fs');
const RSA_PUBLIC_KEY = fs.readFileSync('./../jwtRS256.key.pub');

const checkIfAuth = expressJwt({
    algorithms: ['RS256'],
    secret: RSA_PUBLIC_KEY
});

module.exports = checkIfAuth;