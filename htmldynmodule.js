// function to return a modified html string containing identifiers enclosed in $$ and replace them with provided values for corresponding keys
exports.getHtmlStringWithIdValues = function(html, values) {
    // error handling relating to mismatch in type of arguments
    if(typeof html !== 'string') throw new TypeError("Argument html must be of type string. Found " + typeof html + ".");
    if(typeof values !== 'object') throw new TypeError("Argument values must be of type object. Found " + typeof values + ".");

    // grab all identifiers enclosed in $$ that are present in the html string
    var identifiers = html.split('$$').filter((value, index) => index % 2 !== 0).map((value) => value.trim());
    // traverse through each identifier
    identifiers.forEach((identifier) => {
        // in case the value of the certain identifier is not present in values
        if(values[identifier] === undefined) {
            values[identifier] = '(undefined value)';
        }
        // modify the identifier enclosed in $$ in the html string with corresponding value
        html = html.replace('$$ ' + identifier + ' $$', values[identifier]); 
    });

    // return the modified html string
    return html;
};

// function to get a html string by specifying the tagname, content text, class, id and attributes
exports.getHtmlTagString = function(tagname, text, classname, id, attributes) {
    // error handling relating to mismatch in type of arguments
    if(typeof tagname !== 'string') throw new TypeError("Argument tagname must be of type string. Found " + typeof tagname + ".");
    if(text !== undefined && typeof text !== 'string') throw new TypeError("Argument text must be of type string. Found " + typeof text + ".");
    if(classname !== undefined && typeof classname !== 'string') throw new TypeError("Argument classname must be of type string. Found " + typeof classname + ".");
    if(id !== undefined && typeof id !== 'string') throw new TypeError("Argument id must be of type string. Found " + typeof id + ".");
    if(attributes !== undefined && typeof attributes !== 'object') new TypeError("Argument attributes must be of type object. Found " + typeof attributes + ".");

    // check if tag will be an empty tag or not
    const emptyTag = (text === undefined) || (text.length === 0);
    // check if tag will have no class
    const noClass = (classname === undefined) || (classname.length === 0);
    // check if tag will have no id
    const noId = (id === undefined) || (id.length === 0);
    // check if tag will have no extra attributes
    var noAttributes = (attributes === undefined);
    
    // variables to store html string and tag attributes string
    var html;
    var attrib;

    // in case tag has no extra attributes
    if(noAttributes) attributes = {};

    // cases tag will have class and or id
    if(!noClass) attributes['class'] = classname;
    if(!noId) attributes['id'] = id;

    noAttributes = Object.keys(attributes).length === 0;
    
    // the tag attribute string will store all attributes and values
    if(!noAttributes) attrib = ' ' + Object.keys(attributes).map((key) => `${key}="${attributes[key]}"`).join(' ');
    else attrib = '';

    // in case tag is not empty generate html string
    if(!emptyTag) html = `<${tagname}${attrib}>${text}</${tagname}>`;
    // in case tag is empty generate html string
    else html = `<${tagname}${attrib} />`;

    // return the html string
    return html;
};