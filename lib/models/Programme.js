class Programme {
    static programmeTypes() {
        return ['Bachelor', 'Master', 'Doctor of Philosophy', 'Diploma', 'Post Graduate Diploma'];
    }
    constructor(name, school, type) {
        if(typeof name !== 'string') throw new TypeError(`first argument name must be of type string, ${typeof name} found`);
        if(!Programme.programmeTypes().includes(type)) throw new TypeError(`cannot find specified user type ${type} in third argument. Must be ${Programme.programmeTypes().join(' or ')}.`);        

        this.type = type;

        this.name = name;
        this.school = school;
    }
}

module.exports = Programme;
