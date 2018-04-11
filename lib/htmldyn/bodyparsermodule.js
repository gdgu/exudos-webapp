// parses an HTTP body raw string to produce POST parameters and values as an object
exports.parseHttpBody = function(httpBody) {
    var paramsAndData = {};
    // parameters are splitted by &
    httpBody = httpBody.split('&');
    // each arg has a key value pair seperated by =
    httpBody.forEach((arg) => {
        var key, value;
        [key, value] = arg.split('=');
        // some http body strings use + for spaces
        value = decodeURIComponent(value).split('+').join(' ');
        // update the object
        paramsAndData[key] = value;
    });
    // return the object containing keys and values
    return paramsAndData;
}