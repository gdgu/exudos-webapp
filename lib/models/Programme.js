class Programme {
    static programmeTypes() {
        return ['Bachelor', 'Master', 'Doctor of Philosophy', 'Diploma', 'Post Graduate Diploma'];
    }
    constructor(name, school, type) {
        this.type = type;

        this.name = name;
        this.school = school;
    }
}

module.exports = Programme;
