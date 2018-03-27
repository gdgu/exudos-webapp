class Programme {
    static programmeTypes() {
        return ['Bachelor', 'Master', 'Doctor of Philosophy', 'Diploma', 'Post Graduate Diploma'];
    }
    constructor(name, school, type) {
        if(!Programme.programmeTypes().includes(type)) throw new TypeError(`Cannot find specified user type ${type}. Must be ${Programme.programmeTypes().join(' or ')}.`);

        this.type = type;

        this.name = name;
        this.school = school;
    }
}

module.exports = Programme;
