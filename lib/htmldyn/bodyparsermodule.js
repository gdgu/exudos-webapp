var querystring = require('querystring')
// parses an HTTP body raw string to produce POST parameters and values as an object
exports.parseHttpBody = function(httpBody) {
    return querystring.parse(httpBody)
}