class Student {
    static genderTypes() {
        return ['female', 'male', 'other'];
    }
    constructor(name, gender, enrolmentNumber, programme, school, phoneNumber, emailId, user) {
        if(typeof name !== 'string') throw new TypeError(`first argument name must be of type string, ${typeof name} found`);
        if(!Student.genderTypes().includes(gender)) throw new TypeError(`cannot find specified gender ${gender} in second argument. Must be ${Student.genderTypes().join(' or ')}.`);                
        if(typeof enrolmentNumber !== 'number') throw new TypeError(`third argument enrolmentNumber must be of type number, ${typeof enrolmentNumber} found`);
        if(typeof phoneNumber !== 'number') throw new TypeError(`sixth argument phoneNumber must be of type number, ${typeof phoneNumber} found`);
        if(typeof emailId !== 'string') throw new TypeError(`seventh argument emailId must be of type string, ${typeof emailId} found`);
        
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