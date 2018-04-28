class Session {
    constructor(code) {
        if(typeof code !== 'string') throw new TypeError(`first argument code must be of type string, ${typeof code} found`);
        
        this.code = code;
    }
}

module.exports = Session;