class Programme {
    static programmeTypes() {
        return ['Bachelor', 'Master', 'Doctor of Philosophy', 'Diploma', 'Post Graduate Diploma'];
    }
    constructor(name, school, type) {
        this.name = name;
        this.school = school;
        this.type = type;
    }
}

module.exports = Programme;
