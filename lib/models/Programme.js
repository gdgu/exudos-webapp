var School = require(__dirname + '/' + 'School.js');

const ProgrammeTypes = ['Bachelor', 'Master', 'Doctor of Philosophy', 'Diploma', 'Post Graduate Diploma'];

class Programme {
    constructor(name, school, type) {
        if(typeof name !== 'string') throw new TypeError("first argument name must be of type string, " + typeof name + "given.");
        if(!(school instanceof School)) throw new TypeError("second argument school must be instanceof School.");
        if(typeof type !== 'string') throw new TypeError("third argument name must be of type string, " + typeof type + "given.");
        if(ProgrammeTypes.indexOf(type) !== -1) throw new TypeError("third argument must be any of the defined ProgrammeTypes.");
    }
}

module.exports = Programme;
