class Student {
    static genderTypes() {
        return ['female', 'male', 'other'];
    }
    constructor(name, gender, enrolmentNumber, programme, school, phoneNumber, emailId, user) {
        this.name = name;
        this.enrolmentNumber = enrolmentNumber;
        this.programme = programme;
        this.school = school;
        this.phoneNumber = phoneNumber;
        this.emailId = emailId;
        this.user = user;

        this.semesters = [];
        this.currentSemester = null;
    }
}

module.exports = Student;