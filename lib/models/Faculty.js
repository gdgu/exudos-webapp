class Faculty {
    static genderTypes() {
        return ['Female', 'Male', 'Other'];
    }
    constructor(name, gender, employeeId, school, emailId, user) {
        this.name = name;
        this.employeeId = employeeId;
        this.school = school;
        this.emailId = emailId;
        this.user = user;

        this.courses = [];
        this.currentSemester = null;
    }
}

module.exports = Faculty;