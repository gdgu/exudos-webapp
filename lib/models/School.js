class School {
    constructor(name, programmes) {
        const Programme = require(__dirname + '/' + 'Programme.js');

        if(typeof name !== 'string') throw new TypeError("first argument name must be of type string, " + typeof name + "given.");
        if(!(programmes instanceof Array)) throw new TypeError("second argument programmes must be instanceof Array.");
        if(!programmes.map((program) => program instanceof Programme).reduce((prevVal, currVal) => prevVal && currVal, true)) throw new TypeError("each object in programmes array must be instanceof Programme.");

        this.name = name;
        this.programmes = programmes;
    }
}

module.exports = School;
